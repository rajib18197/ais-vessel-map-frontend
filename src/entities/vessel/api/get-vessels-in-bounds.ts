import { ApiError } from "@/shared/api/api-error";
import {
  getVesselsInBoundsResponseSchema,
  type BoundsOptions,
  type VesselSummary,
} from "../types/vessel.types";
import { API_BASE } from "@/shared/api/api-base";

/**
 * Fetches vessels within a geographic bounding box. Failure semantics
 * mirror `getAllVessels`:
 *   1. The request never reached the server (offline, DNS, CORS) → status 0
 *   2. The server responded with a non-2xx status → that HTTP status
 *   3. The server responded 2xx but the body is malformed or schema-
 *      mismatched → the HTTP status is preserved
 */
export async function getVesselsInBounds(
  bounds: BoundsOptions,
): Promise<VesselSummary[]> {
  const params = new URLSearchParams({
    swLng: String(bounds.swLng),
    swLat: String(bounds.swLat),
    neLng: String(bounds.neLng),
    neLat: String(bounds.neLat),
  });

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/vessels/in-bounds?${params.toString()}`);
  } catch (cause) {
    throw new ApiError("Network request failed", 0, { cause });
  }

  if (!res.ok) {
    throw new ApiError(
      `Failed to fetch vessels in bounds: ${res.status} ${res.statusText}`,
      res.status,
    );
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch (cause) {
    throw new ApiError(
      "Failed to parse vessels-in-bounds response as JSON",
      res.status,
      { cause },
    );
  }

  const parsed = getVesselsInBoundsResponseSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(
      `Vessels-in-bounds response did not match expected shape: ${parsed.error.message}`,
      res.status,
      { cause: parsed.error },
    );
  }

  return parsed.data.data.vessels;
}
