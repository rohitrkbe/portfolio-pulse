// ─── particle canvas tuning values ────────────────────────────────────────────
export const PARTICLE_CONFIG = {
  COUNT:               55,
  CONNECTION_DISTANCE: 120,
  MOUSE_RADIUS:        140,
  MOUSE_FORCE:        0.06,
  BASE_SPEED:         0.45,
  RADIUS_MIN:          1.5,
  RADIUS_MAX:          3.2,
  OPACITY_MIN:        0.35,
  OPACITY_MAX:        0.75,
  MAX_SPEED_MULTIPLIER: 2.5,
  LINE_OPACITY:         0.3,
  GLOW_RADIUS_FACTOR:   0.6,
  OFF_SCREEN:         -9999,
  GLOW_COLOR_INNER:   'rgba(255,255,255,0.08)',
  GLOW_COLOR_OUTER:   'rgba(255,255,255,0)',
} as const;
