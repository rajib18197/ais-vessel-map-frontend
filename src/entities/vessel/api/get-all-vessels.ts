import type {
  VesselSummary,
  GetAllVesselsResponse,
} from "../types/vessel.types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function getAllVessels(): Promise<VesselSummary[]> {
  const res = await fetch(`${API_BASE}/api/vessels`);
  if (!res.ok) {
    throw new Error(`Failed to fetch vessels: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as GetAllVesselsResponse;
  return json.data.vessels;
}
