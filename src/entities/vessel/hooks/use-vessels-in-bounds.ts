import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { BoundsOptions, VesselSummary } from "../types/vessel.types";
import { boundsToQueryKey, roundBounds } from "../utils/bounds";
import { getVesselsInBounds } from "../api/get-vessels-in-bounds";
import { ApiError } from "@/shared/api/api-error";

const toBoundsQueryKey = (bounds: BoundsOptions | null) =>
  ["vessels", "bounds", bounds ? boundsToQueryKey(bounds) : "none"] as const;

/**
 * Seeds bounds-mode with a real geospatial query. Intentionally NOT the
 * live steady-state source — once the WS-driven snapshot (useVessels) loads,
 * the UI filters that live list client-side via filterToBounds so panning
 * never triggers a network round trip. This query covers the gap before that
 * snapshot arrives: initial page load or a deep link into bounds mode.
 */
export function useVesselsInBounds(
  bounds: BoundsOptions | null,
  enabled: boolean,
): UseQueryResult<VesselSummary[], ApiError> {
  const rounded = bounds ? roundBounds(bounds) : null;

  return useQuery<VesselSummary[], ApiError>({
    queryKey: toBoundsQueryKey(rounded),
    queryFn: () => getVesselsInBounds(rounded as BoundsOptions),
    enabled: enabled && rounded !== null,
    staleTime: 30_000,
  });
}
