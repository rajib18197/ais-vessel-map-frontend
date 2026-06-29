import type {
  BoundsOptions,
  GetVesselsInBoundsResponse,
  VesselSummary,
} from "../types/vessel.types";
import { ApiError } from "@/shared/api/api-error";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function getVesselsInBounds(
  bounds: BoundsOptions,
): Promise<VesselSummary[]> {
  const params = new URLSearchParams({
    swLng: String(bounds.swLng),
    swLat: String(bounds.swLat),
    neLng: String(bounds.neLng),
    neLat: String(bounds.neLat),
  });

  const res = await fetch(
    `${API_BASE}/api/vessels/in-bounds?${params.toString()}`,
  );
  if (!res.ok) {
    throw new ApiError(
      `Failed to fetch vessels in bounds (${res.status})`,
      res.status,
    );
  }

  const json = (await res.json()) as GetVesselsInBoundsResponse;
  return json.data.vessels;
}
