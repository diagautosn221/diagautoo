export const easings = {
  signature: [0.16, 1, 0.3, 1] as const,
  outExpo: [0.19, 1, 0.22, 1] as const,
  inOutQuart: [0.76, 0, 0.24, 1] as const,
  outBack: [0.34, 1.56, 0.64, 1] as const,
} as const;

export const durations = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  cinematic: 1.2,
} as const;
