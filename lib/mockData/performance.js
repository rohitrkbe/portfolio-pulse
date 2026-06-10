// 6-month performance data: Dec 2025 → May 2026
// Values are indexed returns (% change from Dec 2025 baseline)
// portfolioReturn and benchmarkReturn represent cumulative % return from start

const NIFTY_RETURNS = [0.0, -2.5, -0.2, 3.2, 6.4, 8.1];

const CLIENT_RETURNS = {
  c001: [0.0, -3.5, 0.3, 5.8, 11.2, 14.8],   // Aggressive  +14.8% YTD
  c002: [0.0, -2.2, 1.2, 4.5, 7.8,  9.4],    // Moderate    +9.4% YTD
  c003: [0.0, -1.5, 0.8, 3.2, 5.4,  7.2],    // Conservative+7.2% YTD
  c004: [0.0, -3.8, -0.5,4.1, 8.7, 12.3],    // Moderate    +12.3% YTD
  c005: [0.0, -4.2, 1.4, 7.2, 15.6, 21.5],   // Aggressive  +21.5% YTD
  c006: [0.0, -0.8, 1.5, 3.8, 5.9,  7.8],    // Conservative+7.8% YTD
};

const MONTHS = [
  { label: "Dec '25", date: '2025-12-01' },
  { label: "Jan '26", date: '2026-01-01' },
  { label: "Feb '26", date: '2026-02-01' },
  { label: "Mar '26", date: '2026-03-01' },
  { label: "Apr '26", date: '2026-04-01' },
  { label: "May '26", date: '2026-05-01' },
];

const BASE_VALUES = {
  c001: 125_000_000,
  c002:  82_000_000,
  c003: 220_000_000,
  c004: 157_000_000,
  c005: 310_000_000,
  c006:  65_000_000,
};

function buildPerformance(clientId) {
  const clientReturns = CLIENT_RETURNS[clientId];
  const baseValue = BASE_VALUES[clientId];

  return {
    clientId,
    benchmark: 'Nifty 50',
    period: '6M',
    dataPoints: MONTHS.map((month, i) => ({
      label: month.label,
      date: month.date,
      portfolioReturn: parseFloat(clientReturns[i].toFixed(2)),
      benchmarkReturn: parseFloat(NIFTY_RETURNS[i].toFixed(2)),
      portfolioValue: Math.round(baseValue * (1 + clientReturns[i] / 100)),
    })),
  };
}

export const MOCK_PERFORMANCE = {
  c001: buildPerformance('c001'),
  c002: buildPerformance('c002'),
  c003: buildPerformance('c003'),
  c004: buildPerformance('c004'),
  c005: buildPerformance('c005'),
  c006: buildPerformance('c006'),
};
