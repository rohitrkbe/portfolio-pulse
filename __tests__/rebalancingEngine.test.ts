import { describe, it, expect } from 'vitest';
import {
  computeDrifts,
  requiresRebalancing,
  generateRebalancingRecommendations,
  validateAllocation,
} from '@/lib/rebalancingEngine';
import type { AssetAllocation, MockPortfolioData } from '@/types';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const balanced: AssetAllocation[] = [
  { assetClass: 'Equities', currentPct: 60, targetPct: 60 },
  { assetClass: 'Debt',     currentPct: 30, targetPct: 30 },
  { assetClass: 'Gold',     currentPct: 10, targetPct: 10 },
];

const overweightEquities: AssetAllocation[] = [
  { assetClass: 'Equities', currentPct: 67, targetPct: 60 }, // +7pp — exceeds threshold
  { assetClass: 'Debt',     currentPct: 27, targetPct: 30 }, // -3pp — within threshold
  { assetClass: 'Gold',     currentPct: 6,  targetPct: 10 }, // -4pp — within threshold
];

const atThreshold: AssetAllocation[] = [
  { assetClass: 'Equities', currentPct: 65, targetPct: 60 }, // exactly 5pp — NOT over threshold (> not >=)
  { assetClass: 'Debt',     currentPct: 35, targetPct: 40 },
];

const multipleBreaches: AssetAllocation[] = [
  { assetClass: 'Equities',    currentPct: 72, targetPct: 65 }, // +7pp overweight
  { assetClass: 'Debt',        currentPct: 18, targetPct: 25 }, // -7pp underweight
  { assetClass: 'Gold',        currentPct: 5,  targetPct: 5  }, // balanced
  { assetClass: 'Real Estate', currentPct: 5,  targetPct: 5  }, // balanced
];

// ─── computeDrifts ───────────────────────────────────────────────────────────

describe('computeDrifts', () => {
  it('returns drift of 0 and direction "balanced" when current equals target', () => {
    const results = computeDrifts(balanced);
    for (const r of results) {
      expect(r.drift).toBe(0);
      expect(r.driftDirection).toBe('balanced');
      expect(r.requiresAction).toBe(false);
    }
  });

  it('marks overweight class correctly', () => {
    const results = computeDrifts(overweightEquities);
    const equities = results.find((r) => r.assetClass === 'Equities')!;
    expect(equities.drift).toBe(7);
    expect(equities.driftDirection).toBe('overweight');
    expect(equities.requiresAction).toBe(true);
  });

  it('marks underweight class correctly', () => {
    const results = computeDrifts(overweightEquities);
    const gold = results.find((r) => r.assetClass === 'Gold')!;
    expect(gold.drift).toBe(-4);
    expect(gold.driftDirection).toBe('underweight');
    expect(gold.requiresAction).toBe(false); // 4pp is within 5pp threshold
  });

  it('does NOT require action at exactly the threshold (strict >)', () => {
    const results = computeDrifts(atThreshold);
    expect(results[0].requiresAction).toBe(false); // 5pp is not > 5
  });

  it('rounds drift to 2 decimal places', () => {
    const allocation: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 60.123, targetPct: 54.456 },
    ];
    const [result] = computeDrifts(allocation);
    expect(result.drift).toBe(5.67);
  });

  it('preserves all original AssetAllocation fields', () => {
    const [result] = computeDrifts(balanced);
    expect(result.assetClass).toBe('Equities');
    expect(result.currentPct).toBe(60);
    expect(result.targetPct).toBe(60);
  });
});

// ─── requiresRebalancing ─────────────────────────────────────────────────────

describe('requiresRebalancing', () => {
  it('returns false when all classes are within tolerance', () => {
    expect(requiresRebalancing(balanced)).toBe(false);
  });

  it('returns true when any class exceeds 5pp drift', () => {
    expect(requiresRebalancing(overweightEquities)).toBe(true);
  });

  it('returns false when drift equals exactly the threshold', () => {
    expect(requiresRebalancing(atThreshold)).toBe(false);
  });

  it('returns true when an underweight class exceeds 5pp', () => {
    const underweight: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 54, targetPct: 60 }, // -6pp
      { assetClass: 'Debt',     currentPct: 46, targetPct: 40 }, // +6pp
    ];
    expect(requiresRebalancing(underweight)).toBe(true);
  });

  it('returns false for an empty allocation array', () => {
    expect(requiresRebalancing([])).toBe(false);
  });
});

// ─── validateAllocation ──────────────────────────────────────────────────────

describe('validateAllocation', () => {
  it('is valid when both current and target sum to 100', () => {
    const { isValid, totalCurrent, totalTarget } = validateAllocation(balanced);
    expect(isValid).toBe(true);
    expect(totalCurrent).toBe(100);
    expect(totalTarget).toBe(100);
  });

  it('is invalid when current percentages do not sum to 100', () => {
    const bad: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 50, targetPct: 60 },
      { assetClass: 'Debt',     currentPct: 30, targetPct: 40 },
    ];
    const { isValid, totalCurrent } = validateAllocation(bad);
    expect(isValid).toBe(false);
    expect(totalCurrent).toBe(80);
  });

  it('is invalid when target percentages do not sum to 100', () => {
    const bad: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 60, targetPct: 50 },
      { assetClass: 'Debt',     currentPct: 40, targetPct: 40 },
    ];
    const { isValid, totalTarget } = validateAllocation(bad);
    expect(isValid).toBe(false);
    expect(totalTarget).toBe(90);
  });

  it('rounds totals before comparing (e.g. floating-point sums)', () => {
    const floaty: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 33.33, targetPct: 33.33 },
      { assetClass: 'Debt',     currentPct: 33.33, targetPct: 33.33 },
      { assetClass: 'Gold',     currentPct: 33.34, targetPct: 33.34 },
    ];
    const { isValid } = validateAllocation(floaty);
    expect(isValid).toBe(true);
  });
});

// ─── generateRebalancingRecommendations ──────────────────────────────────────

describe('generateRebalancingRecommendations', () => {
  const basePortfolio: MockPortfolioData = {
    clientId: 'c001',
    totalValue: 10_000_000,
    rebalancingStatus: 'pending',
    lastRebalancedAt: '2026-01-01',
    assetAllocation: overweightEquities,
    holdings: [
      { id: 'h001', instrumentName: 'Reliance Industries', ticker: 'RELIANCE', assetClass: 'Equities', currentValue: 4_200_000, gainLoss: 0, gainLossPct: 0, weightPct: 42 },
      { id: 'h002', instrumentName: 'TCS',                 ticker: 'TCS',      assetClass: 'Equities', currentValue: 2_500_000, gainLoss: 0, gainLossPct: 0, weightPct: 25 },
    ],
  };

  it('returns an empty array when no class exceeds the threshold', () => {
    const portfolio: MockPortfolioData = { ...basePortfolio, assetAllocation: balanced };
    expect(generateRebalancingRecommendations(portfolio)).toHaveLength(0);
  });

  it('generates SELL recommendations for overweight classes', () => {
    const recs = generateRebalancingRecommendations(basePortfolio);
    const sells = recs.filter((r) => r.action === 'SELL');
    expect(sells.length).toBeGreaterThan(0);
    for (const rec of sells) {
      expect(rec.assetClass).toBe('Equities');
    }
  });

  it('generates one SELL rec per holding in the overweight class', () => {
    const recs = generateRebalancingRecommendations(basePortfolio);
    // 2 equity holdings → 2 SELL recs
    expect(recs.filter((r) => r.action === 'SELL')).toHaveLength(2);
  });

  it('sell amounts sum to the total delta for the overweight class', () => {
    const recs = generateRebalancingRecommendations(basePortfolio);
    const totalSell = recs
      .filter((r) => r.action === 'SELL')
      .reduce((sum, r) => sum + r.amount, 0);
    // delta = (60% - 67%) * 10_000_000 = -700_000 → need to sell 700_000
    // allow ±1 for rounding
    expect(totalSell).toBeCloseTo(700_000, -1);
  });

  it('proportionally splits sells by holding value', () => {
    const recs = generateRebalancingRecommendations(basePortfolio);
    const reliance = recs.find((r) => r.ticker === 'RELIANCE')!;
    const tcs      = recs.find((r) => r.ticker === 'TCS')!;
    // Reliance is 4.2M / 6.7M ≈ 62.7% of class → should get ~62.7% of the sell
    const ratio = reliance.amount / (reliance.amount + tcs.amount);
    expect(ratio).toBeCloseTo(4_200_000 / 6_700_000, 1);
  });

  it('generates BUY recommendations for underweight classes with existing holdings', () => {
    const portfolio: MockPortfolioData = {
      ...basePortfolio,
      assetAllocation: multipleBreaches,
      holdings: [
        { id: 'h001', instrumentName: 'GOI Bond', ticker: 'GOIBOND', assetClass: 'Debt', currentValue: 1_800_000, gainLoss: 0, gainLossPct: 0, weightPct: 18 },
        { id: 'h002', instrumentName: 'Reliance', ticker: 'RELIANCE', assetClass: 'Equities', currentValue: 7_200_000, gainLoss: 0, gainLossPct: 0, weightPct: 72 },
      ],
    };
    const recs = generateRebalancingRecommendations(portfolio);
    const buys = recs.filter((r) => r.action === 'BUY');
    expect(buys.length).toBeGreaterThan(0);
    expect(buys[0].assetClass).toBe('Debt');
  });

  it('generates a fallback index fund BUY when class has no holdings', () => {
    const portfolio: MockPortfolioData = {
      ...basePortfolio,
      assetAllocation: [
        { assetClass: 'Equities',    currentPct: 80, targetPct: 65 },
        { assetClass: 'Real Estate', currentPct: 20, targetPct: 35 }, // underweight, no holdings
      ],
      holdings: [
        { id: 'h001', instrumentName: 'Reliance', ticker: 'RELIANCE', assetClass: 'Equities', currentValue: 8_000_000, gainLoss: 0, gainLossPct: 0, weightPct: 80 },
      ],
    };
    const recs = generateRebalancingRecommendations(portfolio);
    const fallback = recs.find((r) => r.assetClass === 'Real Estate');
    expect(fallback).toBeDefined();
    expect(fallback!.action).toBe('BUY');
    expect(fallback!.instrumentName).toBe('Real Estate Index Fund');
  });

  it('assigns correct rec IDs (rec-<holdingId> for existing, rec-new-<class> for fallback)', () => {
    const recs = generateRebalancingRecommendations(basePortfolio);
    expect(recs.find((r) => r.id === 'rec-h001')).toBeDefined();
    expect(recs.find((r) => r.id === 'rec-h002')).toBeDefined();
  });

  it('includes a human-readable reason on every recommendation', () => {
    const recs = generateRebalancingRecommendations(basePortfolio);
    for (const rec of recs) {
      expect(rec.reason).toBeTruthy();
      expect(typeof rec.reason).toBe('string');
    }
  });

  it('handles a portfolio with zero totalValue without crashing', () => {
    const portfolio: MockPortfolioData = {
      ...basePortfolio,
      totalValue: 0,
      assetAllocation: overweightEquities,
    };
    expect(() => generateRebalancingRecommendations(portfolio)).not.toThrow();
  });

  it('splits evenly across equal-valued holdings', () => {
    const portfolio: MockPortfolioData = {
      ...basePortfolio,
      holdings: [
        { id: 'h001', instrumentName: 'Stock A', ticker: 'A', assetClass: 'Equities', currentValue: 3_350_000, gainLoss: 0, gainLossPct: 0, weightPct: 33.5 },
        { id: 'h002', instrumentName: 'Stock B', ticker: 'B', assetClass: 'Equities', currentValue: 3_350_000, gainLoss: 0, gainLossPct: 0, weightPct: 33.5 },
      ],
    };
    const recs = generateRebalancingRecommendations(portfolio);
    const [a, b] = recs.filter((r) => r.action === 'SELL');
    expect(a.amount).toBe(b.amount);
  });
});

// ─── computeDrifts — edge cases ──────────────────────────────────────────────

describe('computeDrifts — edge cases', () => {
  it('returns empty array for empty input', () => {
    expect(computeDrifts([])).toEqual([]);
  });

  it('output length always matches input length', () => {
    expect(computeDrifts(balanced)).toHaveLength(3);
    expect(computeDrifts(overweightEquities)).toHaveLength(3);
  });

  it('does not mutate the original input objects', () => {
    const input: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 70, targetPct: 60 },
    ];
    computeDrifts(input);
    expect(input[0]).not.toHaveProperty('drift');
    expect(input[0]).not.toHaveProperty('driftDirection');
    expect(input[0]).not.toHaveProperty('requiresAction');
  });

  it('flags a very large drift (60pp) as requiresAction', () => {
    const extreme: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 100, targetPct: 40 },
    ];
    const [result] = computeDrifts(extreme);
    expect(result.drift).toBe(60);
    expect(result.driftDirection).toBe('overweight');
    expect(result.requiresAction).toBe(true);
  });

  it('flags drift of 5.01pp as requiresAction (just over the strict threshold)', () => {
    const borderline: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 65.01, targetPct: 60 },
    ];
    const [result] = computeDrifts(borderline);
    expect(result.requiresAction).toBe(true);
  });

  it('drift is positive for overweight and negative for underweight', () => {
    const mix: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 70, targetPct: 60 },
      { assetClass: 'Debt',     currentPct: 30, targetPct: 40 },
    ];
    const [eq, dt] = computeDrifts(mix);
    expect(eq.drift).toBeGreaterThan(0);
    expect(dt.drift).toBeLessThan(0);
  });

  it('preserves optional currentValue from AssetAllocation when present', () => {
    const withValue: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 60, targetPct: 60, currentValue: 600_000 },
    ];
    const [result] = computeDrifts(withValue);
    expect(result.currentValue).toBe(600_000);
  });
});

// ─── requiresRebalancing — edge cases ────────────────────────────────────────

describe('requiresRebalancing — edge cases', () => {
  it('returns true for a single-item portfolio exceeding the threshold', () => {
    const single: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 66, targetPct: 60 }, // 6pp > 5
    ];
    expect(requiresRebalancing(single)).toBe(true);
  });

  it('returns false for a single-item portfolio within the threshold', () => {
    const single: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 64, targetPct: 60 }, // 4pp < 5
    ];
    expect(requiresRebalancing(single)).toBe(false);
  });

  it('returns true when all items exceed the threshold', () => {
    const allBreaching: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 72, targetPct: 65 }, // +7pp
      { assetClass: 'Debt',     currentPct: 18, targetPct: 25 }, // -7pp
    ];
    expect(requiresRebalancing(allBreaching)).toBe(true);
  });

  it('returns true at 5.01pp (just over the strict threshold)', () => {
    const justOver: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 65.01, targetPct: 60 },
    ];
    expect(requiresRebalancing(justOver)).toBe(true);
  });
});

// ─── validateAllocation — edge cases ─────────────────────────────────────────

describe('validateAllocation — edge cases', () => {
  it('returns isValid: false with totals of 0/0 for an empty array', () => {
    const { isValid, totalCurrent, totalTarget } = validateAllocation([]);
    expect(isValid).toBe(false);
    expect(totalCurrent).toBe(0);
    expect(totalTarget).toBe(0);
  });

  it('is valid for a single item at 100% current and 100% target', () => {
    const single: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 100, targetPct: 100 },
    ];
    expect(validateAllocation(single).isValid).toBe(true);
  });

  it('is invalid when both current and target exceed 100', () => {
    const over: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 60, targetPct: 60 },
      { assetClass: 'Debt',     currentPct: 50, targetPct: 50 },
    ];
    const { isValid, totalCurrent, totalTarget } = validateAllocation(over);
    expect(isValid).toBe(false);
    expect(totalCurrent).toBe(110);
    expect(totalTarget).toBe(110);
  });

  it('returns exact (unrounded) totalCurrent and totalTarget values', () => {
    const precise: AssetAllocation[] = [
      { assetClass: 'Equities', currentPct: 33.3, targetPct: 33.3 },
      { assetClass: 'Debt',     currentPct: 33.3, targetPct: 33.3 },
    ];
    const { totalCurrent, totalTarget } = validateAllocation(precise);
    expect(totalCurrent).toBeCloseTo(66.6, 5);
    expect(totalTarget).toBeCloseTo(66.6, 5);
  });
});

// ─── generateRebalancingRecommendations — edge cases ─────────────────────────

describe('generateRebalancingRecommendations — edge cases', () => {
  const h = (id: string, name: string, ticker: string, assetClass: string, value: number) => ({
    id,
    instrumentName: name,
    ticker,
    assetClass,
    currentValue: value,
    gainLossAbs: 0,
    gainLossPct: 0,
    weightPct: 0,
  });

  it('all recommendation amounts are non-negative integers', () => {
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: overweightEquities,
      holdings: [
        h('h001', 'Reliance', 'RELIANCE', 'Equities', 4_200_000),
        h('h002', 'TCS',      'TCS',      'Equities', 2_500_000),
      ],
    };
    for (const rec of generateRebalancingRecommendations(portfolio)) {
      expect(rec.amount).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(rec.amount)).toBe(true);
    }
  });

  it('balanced classes alongside breaching classes produce no recommendations', () => {
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: multipleBreaches, // Gold and Real Estate have 0pp drift
      holdings: [
        h('h001', 'Reliance', 'RELIANCE',  'Equities',    7_200_000),
        h('h002', 'GOI Bond', 'GOIBOND',   'Debt',        1_800_000),
        h('h003', 'Gold ETF', 'GOLDETF',   'Gold',          500_000),
        h('h004', 'REIT',     'REIT',      'Real Estate',   500_000),
      ],
    };
    const recs = generateRebalancingRecommendations(portfolio);
    expect(recs.filter((r) => r.assetClass === 'Gold')).toHaveLength(0);
    expect(recs.filter((r) => r.assetClass === 'Real Estate')).toHaveLength(0);
  });

  it('all recommendation IDs are unique within the result', () => {
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: multipleBreaches,
      holdings: [
        h('h001', 'Reliance', 'RELIANCE', 'Equities', 7_200_000),
        h('h002', 'TCS',      'TCS',      'Equities',         0),
        h('h003', 'GOI Bond', 'GOIBOND',  'Debt',     1_800_000),
      ],
    };
    const recs = generateRebalancingRecommendations(portfolio);
    const ids = recs.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('drift field on each recommendation matches the engine-computed class drift', () => {
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: overweightEquities, // Equities drift = 67 - 60 = 7
      holdings: [h('h001', 'Reliance', 'RELIANCE', 'Equities', 6_700_000)],
    };
    const [rec] = generateRebalancingRecommendations(portfolio);
    expect(rec.drift).toBe(7);
  });

  it('fallback ticker is class name uppercased, spaces removed, sliced to 6 chars + _IDX', () => {
    // "Real Estate" → remove spaces → "REALESTATE" → slice(0,6) → "REALES" → "REALES_IDX"
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: [
        { assetClass: 'Equities',    currentPct: 80, targetPct: 65 },
        { assetClass: 'Real Estate', currentPct: 20, targetPct: 35 }, // UW, no holdings
      ],
      holdings: [h('h001', 'Reliance', 'RELIANCE', 'Equities', 8_000_000)],
    };
    const fallback = generateRebalancingRecommendations(portfolio)
      .find((r) => r.assetClass === 'Real Estate')!;
    expect(fallback.ticker).toBe('REALES_IDX');
  });

  it('fallback rec ID is rec-new- followed by kebab-cased class name', () => {
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: [
        { assetClass: 'Equities',    currentPct: 80, targetPct: 65 },
        { assetClass: 'Real Estate', currentPct: 20, targetPct: 35 },
      ],
      holdings: [h('h001', 'Reliance', 'RELIANCE', 'Equities', 8_000_000)],
    };
    const fallback = generateRebalancingRecommendations(portfolio)
      .find((r) => r.assetClass === 'Real Estate')!;
    expect(fallback.id).toBe('rec-new-real-estate');
  });

  it('single holding in overweight class receives the full sell delta', () => {
    // 1 holding → proportion = 1 → sellAmount = full delta
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: [
        { assetClass: 'Equities', currentPct: 67, targetPct: 60 }, // delta = 700_000
      ],
      holdings: [h('h001', 'Reliance', 'RELIANCE', 'Equities', 6_700_000)],
    };
    const [rec] = generateRebalancingRecommendations(portfolio);
    expect(rec.amount).toBe(700_000);
  });

  it('uses equal split when totalClassValue is 0 (all holdings carry currentValue: 0)', () => {
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: [
        { assetClass: 'Equities', currentPct: 67, targetPct: 60 }, // sell 700_000
      ],
      holdings: [
        h('h001', 'Stock A', 'A', 'Equities', 0),
        h('h002', 'Stock B', 'B', 'Equities', 0),
      ],
    };
    const recs = generateRebalancingRecommendations(portfolio);
    expect(recs).toHaveLength(2);
    expect(recs[0].amount).toBe(recs[1].amount); // 50/50 equal split
  });

  it('overweight and underweight classes each generate recs in the same portfolio', () => {
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: multipleBreaches, // Equities +7 OW, Debt -7 UW
      holdings: [
        h('h001', 'Reliance', 'RELIANCE', 'Equities', 7_200_000),
        h('h002', 'GOI Bond', 'GOIBOND',  'Debt',     1_800_000),
      ],
    };
    const recs = generateRebalancingRecommendations(portfolio);
    expect(recs.filter((r) => r.action === 'SELL').length).toBeGreaterThan(0);
    expect(recs.filter((r) => r.action === 'BUY').length).toBeGreaterThan(0);
  });

  it('every action value is strictly "BUY" or "SELL"', () => {
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: multipleBreaches,
      holdings: [
        h('h001', 'Reliance', 'RELIANCE', 'Equities', 7_200_000),
        h('h002', 'GOI Bond', 'GOIBOND',  'Debt',     1_800_000),
      ],
    };
    for (const rec of generateRebalancingRecommendations(portfolio)) {
      expect(['BUY', 'SELL']).toContain(rec.action);
    }
  });

  it('overweight class with no matching holdings produces no recommendations', () => {
    // Engine iterates classHoldings for overweight — empty array → zero iterations
    const portfolio: MockPortfolioData = {
      clientId: 'c001',
      totalValue: 10_000_000,
      rebalancingStatus: 'pending',
      lastRebalancedAt: '2026-01-01',
      assetAllocation: [
        { assetClass: 'Equities', currentPct: 67, targetPct: 60 }, // OW but no holdings
      ],
      holdings: [],
    };
    expect(generateRebalancingRecommendations(portfolio)).toHaveLength(0);
  });
});
