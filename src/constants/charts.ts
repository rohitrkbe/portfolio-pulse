// ─── shared chart defaults ────────────────────────────────────────────────────
export const CHART_DEFAULTS = {
  FALLBACK_COLOR: '#94a3b8',
  TICK_FONT_SIZE: 11,
  TICK_FILL:      '#94a3b8',
} as const;

// ─── donut / pie chart (AllocationChart) ──────────────────────────────────────
export const ALLOCATION_CHART = {
  HEIGHT:        220,
  INNER_RADIUS:   60,
  OUTER_RADIUS:   90,
  PADDING_ANGLE:   2,
  BAR_OPACITY:  0.85,
} as const;

// ─── line chart (PerformanceChart) ────────────────────────────────────────────
export const PERFORMANCE_CHART = {
  HEIGHT:                     240,
  MARGIN:                     { top: 5, right: 10, left: 0, bottom: 5 },
  Y_AXIS_WIDTH:                52,
  X_AXIS_DY:                    6,
  GRID_COLOR:      'rgba(148,163,184,0.2)',
  GRID_DASH:       '3 3',
  REFERENCE_COLOR: 'rgba(148,163,184,0.4)',
  REFERENCE_DASH:  '4 2',
  PORTFOLIO_COLOR:             '#3b82f6',
  PORTFOLIO_STROKE_WIDTH:       2.5,
  PORTFOLIO_DOT_RADIUS:           3,
  PORTFOLIO_ACTIVE_DOT_RADIUS:    5,
  BENCHMARK_COLOR:             '#f59e0b',
  BENCHMARK_STROKE_WIDTH:         2,
  BENCHMARK_DASH:              '5 3',
  BENCHMARK_DOT_RADIUS:           4,
} as const;
