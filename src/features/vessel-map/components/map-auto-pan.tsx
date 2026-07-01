import { useMap } from "react-leaflet";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import { useMapAutoPan } from "../hooks/use-map-auto-pan";

type MapAutoPanProps = {
  selectedMmsi: string | null;
  vessels: VesselSummary[];
};

// Runs auto-pan logic inside Leaflet's map context.
export function MapAutoPan({ selectedMmsi, vessels }: MapAutoPanProps) {
  const map = useMap();
  useMapAutoPan(map, selectedMmsi, vessels);
  return null;
}
