import type { BoundsOptions, VesselSummary } from "../types/vessel.types";
import { getLatLon } from "../types/vessel.types";

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

/** Client-side viewport filter — used once the live WS-driven list is
 *  the source of truth, so bounds mode never depends on a second
 *  network round trip to reflect a vessel that just moved into view. */
export function filterToBounds(
  vessels: VesselSummary[],
  bounds: BoundsOptions,
): VesselSummary[] {
  return vessels.filter((vessel) => {
    const position = getLatLon(vessel);
    if (!position) return false;
    const [lat, lon] = position;
    return (
      lat >= bounds.swLat &&
      lat <= bounds.neLat &&
      lon >= bounds.swLng &&
      lon <= bounds.neLng
    );
  });
}
