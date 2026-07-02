import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { BoundsOptions, VesselSummary } from "../types/vessel.types";
import { boundsToQueryKey, roundBounds } from "../utils/bounds";
import { getVesselsInBounds } from "../api/get-vessels-in-bounds";
import { ApiError } from "@/shared/api/api-error";

const toBoundsQueryKey = (bounds: BoundsOptions | null) =>
  ["vessels", "bounds", bounds ? boundsToQueryKey(bounds) : "none"] as const;

export function useVesselsInBounds(
  bounds: BoundsOptions | null,
  enabled: boolean,
): UseQueryResult<VesselSummary[], ApiError> {
  const rounded = bounds ? roundBounds(bounds) : null;

  return useQuery<VesselSummary[], ApiError>({
    queryKey: toBoundsQueryKey(rounded),
    queryFn: () => getVesselsInBounds(rounded as BoundsOptions),
    enabled: enabled && rounded !== null,
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
}
