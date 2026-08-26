export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

export const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)]!;
