import type { BoundsOptions } from "../types/vessel.types";

/**
 * Rounds bounds to a coarse grid before they become a query key/param.
 * Without this, every pixel of drag produces a "new" bounds object and
 * spams refetches; rounding to ~3 decimal places (~100m) collapses
 * insignificant jitter into the same cache entry.
 */
export function roundBounds(bounds: BoundsOptions): BoundsOptions {
  const round = (n: number): number => Math.round(n * 1000) / 1000;
  return {
    swLng: round(bounds.swLng),
    swLat: round(bounds.swLat),
    neLng: round(bounds.neLng),
    neLat: round(bounds.neLat),
  };
}
export function boundsToQueryKey(bounds: BoundsOptions): string {
  return `${bounds.swLng},${bounds.swLat},${bounds.neLng},${bounds.neLat}`;
}
