import { ApiError } from "@/shared/api/api-error";
import {
  getAllVesselsResponseSchema,
  type VesselSummary,
} from "../types/vessel.types";
import { API_BASE } from "@/shared/api/api-base";

/**
 * Fetches the full vessel list.
 * Three distinct failure classes are handled:
 *   1. The request never reached the server (offline, DNS, CORS) → status 0
 *   2. The server responded with a non-2xx status → that HTTP status
 *   3. The server responded 2xx but the body isn't the shape we expect,
 *      whether due to malformed JSON or a schema mismatch → the HTTP
 *      status is preserved, since the response did arrive
 */
export async function getAllVessels(): Promise<VesselSummary[]> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/vessels`);
  } catch (cause) {
    throw new ApiError("Network request failed", 0, { cause });
  }

  if (!res.ok) {
    throw new ApiError(
      `Failed to fetch vessels: ${res.status} ${res.statusText}`,
      res.status,
    );
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch (cause) {
    throw new ApiError("Failed to parse vessel response as JSON", res.status, {
      cause,
    });
  }

  const parsed = getAllVesselsResponseSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(
      `Vessel response did not match expected shape: ${parsed.error.message}`,
      res.status,
      { cause: parsed.error },
    );
  }

  return parsed.data.data.vessels;
}
