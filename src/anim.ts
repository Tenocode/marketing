import { Easing, interpolate, spring } from "remotion";

export const smooth = Easing.bezier(0.22, 1, 0.36, 1);

/** Goes from `from` to `to` between frames `a` and `b`, clamped at both ends. */
export const between = (
  frame: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = smooth,
) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const SOFT_SPRING = { damping: 20, mass: 0.9, stiffness: 110 };

/** Spring from 0 to 1 that starts at frame `delay`. */
export const springIn = (
  frame: number,
  fps: number,
  delay = 0,
  config = SOFT_SPRING,
) => spring({ frame: frame - delay, fps, config });

/** Counts from `from` to `to` between frames `a` and `b`, slowing down at the end. */
export const countUp = (
  frame: number,
  a: number,
  b: number,
  from: number,
  to: number,
) => between(frame, a, b, from, to, Easing.out(Easing.cubic));

/** Spanish number format: dot for thousands, comma for decimals. */
export const formatNumber = (n: number, decimals = 0) => {
  const [whole, dec] = n.toFixed(decimals).split(".");
  const withDots = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? `${withDots},${dec}` : withDots;
};
