import { ApiError } from "@/shared/api/api-error";
import {
  getVesselDetailResponseSchema,
  type VesselDetail,
} from "../types/vessel.types";
import { API_BASE } from "@/shared/api/api-base";

/**
 * Fetches a single vessel by MMSI. Failure semantics mirror `getAllVessels`:
 *   1. The request never reached the server (offline, DNS, CORS) → status 0
 *   2. The server responded with a non-2xx status → that HTTP status,
 *      with a 404-specific message when the vessel simply doesn't exist
 *   3. The server responded 2xx but the body is malformed or schema-
 *      mismatched → the HTTP status is preserved
 */
export async function getVesselDetail(mmsi: string): Promise<VesselDetail> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/vessels/${mmsi}`);
  } catch (cause) {
    throw new ApiError("Network request failed", 0, { cause });
  }

  if (!res.ok) {
    throw new ApiError(
      res.status === 404
        ? `Vessel ${mmsi} not found`
        : `Failed to fetch vessel ${mmsi}: ${res.status} ${res.statusText}`,
      res.status,
    );
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch (cause) {
    throw new ApiError(
      `Failed to parse vessel ${mmsi} response as JSON`,
      res.status,
      { cause },
    );
  }

  const parsed = getVesselDetailResponseSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(
      `Vessel ${mmsi} response did not match expected shape: ${parsed.error.message}`,
      res.status,
      { cause: parsed.error },
    );
  }

  return parsed.data.data.vessel;
}
