export const WeakRateType = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
} as const;

export type WeakRateType = typeof WeakRateType[keyof typeof WeakRateType];

export const allWeakRateTypes: WeakRateType[] = [
  WeakRateType.A,
  WeakRateType.B,
  WeakRateType.C,
  WeakRateType.D,
  WeakRateType.E,
  WeakRateType.F,
];
