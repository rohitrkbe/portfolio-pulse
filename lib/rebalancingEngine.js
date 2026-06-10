import { DRIFT_THRESHOLD } from './constants';

/**
 * Compute drift for each asset class.
 * Returns enriched allocation with drift, direction, and action flag.
 */
export function computeDrifts(assetAllocation) {
  return assetAllocation.map((item) => {
    const drift = parseFloat((item.currentPct - item.targetPct).toFixed(2));
    return {
      ...item,
      drift,
      driftDirection: drift > 0 ? 'overweight' : drift < 0 ? 'underweight' : 'balanced',
      requiresAction: Math.abs(drift) > DRIFT_THRESHOLD,
    };
  });
}

/**
 * Returns true if any asset class has drifted beyond the threshold.
 */
export function requiresRebalancing(assetAllocation) {
  return assetAllocation.some(
    (item) => Math.abs(item.currentPct - item.targetPct) > DRIFT_THRESHOLD
  );
}

/**
 * Generate buy/sell recommendations to bring each drifted asset class back to target.
 * Sell proportionally across holdings within overweight classes.
 * Buy proportionally across existing holdings in underweight classes.
 */
export function generateRebalancingRecommendations(portfolio) {
  const { assetAllocation, holdings, totalValue } = portfolio;
  const drifts = computeDrifts(assetAllocation);
  const recommendations = [];

  for (const drift of drifts) {
    if (!drift.requiresAction) continue;

    const targetValue = (drift.targetPct / 100) * totalValue;
    const currentValue = (drift.currentPct / 100) * totalValue;
    const deltaValue = targetValue - currentValue; // negative = need to sell, positive = need to buy

    const classHoldings = holdings.filter((h) => h.assetClass === drift.assetClass);
    const totalClassValue = classHoldings.reduce((sum, h) => sum + h.currentValue, 0);

    if (drift.driftDirection === 'overweight') {
      // Distribute sells proportionally across holdings in this class
      for (const holding of classHoldings) {
        const proportion = totalClassValue > 0 ? holding.currentValue / totalClassValue : 1 / classHoldings.length;
        const sellAmount = Math.round(Math.abs(deltaValue) * proportion);

        recommendations.push({
          id: `rec-${holding.id}`,
          action: 'SELL',
          instrumentName: holding.instrumentName,
          ticker: holding.ticker,
          assetClass: drift.assetClass,
          amount: sellAmount,
          drift: drift.drift,
          reason: `${drift.assetClass} overweight by ${drift.drift.toFixed(1)}pp (target ${drift.targetPct}%, current ${drift.currentPct}%)`,
        });
      }
    } else {
      // Distribute buys proportionally across existing holdings in this class
      if (classHoldings.length > 0) {
        for (const holding of classHoldings) {
          const proportion = totalClassValue > 0 ? holding.currentValue / totalClassValue : 1 / classHoldings.length;
          const buyAmount = Math.round(deltaValue * proportion);

          recommendations.push({
            id: `rec-${holding.id}`,
            action: 'BUY',
            instrumentName: holding.instrumentName,
            ticker: holding.ticker,
            assetClass: drift.assetClass,
            amount: buyAmount,
            drift: drift.drift,
            reason: `${drift.assetClass} underweight by ${Math.abs(drift.drift).toFixed(1)}pp (target ${drift.targetPct}%, current ${drift.currentPct}%)`,
          });
        }
      } else {
        // No existing holdings — suggest a representative index fund
        recommendations.push({
          id: `rec-new-${drift.assetClass.toLowerCase().replace(/\s+/g, '-')}`,
          action: 'BUY',
          instrumentName: `${drift.assetClass} Index Fund`,
          ticker: `${drift.assetClass.replace(/\s+/g, '').toUpperCase().slice(0, 6)}_IDX`,
          assetClass: drift.assetClass,
          amount: Math.round(deltaValue),
          drift: drift.drift,
          reason: `${drift.assetClass} underweight by ${Math.abs(drift.drift).toFixed(1)}pp — no existing holdings`,
        });
      }
    }
  }

  return recommendations;
}

/**
 * Validate that total allocations (current and target) sum to 100.
 */
export function validateAllocation(assetAllocation) {
  const totalCurrent = assetAllocation.reduce((sum, a) => sum + a.currentPct, 0);
  const totalTarget = assetAllocation.reduce((sum, a) => sum + a.targetPct, 0);
  return {
    isValid: Math.round(totalCurrent) === 100 && Math.round(totalTarget) === 100,
    totalCurrent,
    totalTarget,
  };
}
