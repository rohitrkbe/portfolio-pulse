import { DRIFT_THRESHOLD } from '@/constants/domain';
import type { AssetAllocation, DriftResult, Recommendation, MockPortfolioData } from '@/types';

export function computeDrifts(assetAllocation: AssetAllocation[]): DriftResult[] {
  return assetAllocation.map((item) => {
    const drift = parseFloat((item.currentPct - item.targetPct).toFixed(2));
    return {
      ...item,
      drift,
      driftDirection: drift > 0 ? 'overweight' : drift < 0 ? 'underweight' : 'balanced',
      requiresAction: Math.abs(drift) > DRIFT_THRESHOLD,
    } as DriftResult;
  });
}

export function requiresRebalancing(assetAllocation: AssetAllocation[]): boolean {
  return assetAllocation.some(
    (item) => Math.abs(item.currentPct - item.targetPct) > DRIFT_THRESHOLD
  );
}

export function generateRebalancingRecommendations(
  portfolio: MockPortfolioData
): Recommendation[] {
  const { assetAllocation, holdings, totalValue } = portfolio;
  const drifts = computeDrifts(assetAllocation);
  const recommendations: Recommendation[] = [];

  for (const drift of drifts) {
    if (!drift.requiresAction) continue;

    const targetValue = (drift.targetPct / 100) * totalValue;
    const currentValue = (drift.currentPct / 100) * totalValue;
    const deltaValue = targetValue - currentValue;

    const classHoldings = holdings.filter((h) => h.assetClass === drift.assetClass);
    const totalClassValue = classHoldings.reduce((sum, h) => sum + h.currentValue, 0);

    if (drift.driftDirection === 'overweight') {
      for (const holding of classHoldings) {
        const proportion =
          totalClassValue > 0
            ? holding.currentValue / totalClassValue
            : 1 / classHoldings.length;
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
      if (classHoldings.length > 0) {
        for (const holding of classHoldings) {
          const proportion =
            totalClassValue > 0
              ? holding.currentValue / totalClassValue
              : 1 / classHoldings.length;
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

export function validateAllocation(
  assetAllocation: AssetAllocation[]
): { isValid: boolean; totalCurrent: number; totalTarget: number } {
  const totalCurrent = assetAllocation.reduce((sum, a) => sum + a.currentPct, 0);
  const totalTarget = assetAllocation.reduce((sum, a) => sum + a.targetPct, 0);
  return {
    isValid: Math.round(totalCurrent) === 100 && Math.round(totalTarget) === 100,
    totalCurrent,
    totalTarget,
  };
}
