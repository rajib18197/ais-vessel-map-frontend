import type {
  VesselDetail,
  GetVesselDetailResponse,
} from "../types/vessel.types";
import { ApiError } from "@/shared/api/api-error";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function getVesselDetail(mmsi: string): Promise<VesselDetail> {
  const res = await fetch(`${API_BASE}/api/vessels/${mmsi}`);

  if (!res.ok) {
    throw new ApiError(
      res.status === 404
        ? `Vessel ${mmsi} not found`
        : `Failed to fetch vessel ${mmsi} (${res.status})`,
      res.status,
    );
  }

  const json = (await res.json()) as GetVesselDetailResponse;
  return json.data.vessel;
}
