import type { VesselSummary, VesselWsEvent } from "../types/vessel.types";

export function applyWsEvent(
  vessels: VesselSummary[],
  event: VesselWsEvent,
): VesselSummary[] {
  if (event.event === "vessel:snapshot") return event.data;

  if (event.event === "vessel:created") {
    const exists = vessels.some((v) => v.mmsi === event.data.mmsi);
    return exists ? vessels : [event.data, ...vessels];
  }

  if (event.event === "vessel:updated") {
    return vessels.map((v) => (v.mmsi === event.data.mmsi ? event.data : v));
  }

  return vessels;
}
