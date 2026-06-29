import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { VesselDetail } from "@/entities/vessel/types/vessel.types";
import { getVesselDetail } from "@/entities/vessel/api/get-vessel-details";
import { ApiError } from "@/shared/api/api-error";

export const vesselDetailQueryKey = (
  mmsi: string,
): readonly ["vessel", string] => ["vessel", mmsi] as const;

/**
 * Fetches full detail for a single vessel. Disabled while `mmsi` is null.
 * 404s are terminal — retrying a missing vessel wastes round trips.
 */
export function useVesselDetail(
  mmsi: string | null,
): UseQueryResult<VesselDetail, ApiError> {
  return useQuery<VesselDetail, ApiError>({
    queryKey:
      mmsi !== null ? vesselDetailQueryKey(mmsi) : ["vessel", "__none__"],
    queryFn: () => getVesselDetail(mmsi as string),
    enabled: mmsi !== null,
    staleTime: 10_000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.isNotFound) return false;
      return failureCount < 2;
    },
  });
}
