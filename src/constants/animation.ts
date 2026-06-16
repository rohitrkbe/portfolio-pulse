// ─── ambient blob pulse durations / delays ────────────────────────────────────
// Used in login panel and auth loading screen
export const ANIMATION = {
  BLOB_1_DURATION:      '6s',
  BLOB_2_DURATION:      '8s',
  BLOB_2_DELAY:         '2s',
  BLOB_3_DURATION:      '5s',
  BLOB_3_DELAY:         '1s',
  LOADER_RING_DURATION: '1.4s',
  LOADER_RING_DELAY:    '0.3s',
  BOUNCE_DURATION:      '0.9s',
  BOUNCE_DELAYS:        [0, 150, 300] as const,
} as const;
