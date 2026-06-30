import { useMap } from "react-leaflet";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import { useMapAutoPan } from "../hooks/use-map-auto-pan";

type MapAutoPanProps = {
  selectedMmsi: string | null;
  vessels: VesselSummary[];
};

/**
 * No visual output. Exists only so the auto-pan effect runs inside
 * MapContainer's Leaflet context — useMap() is unavailable outside it,
 * so this can't be hoisted into MapCanvas's own render body.
 */
export function MapAutoPan({ selectedMmsi, vessels }: MapAutoPanProps) {
  const map = useMap();
  useMapAutoPan(map, selectedMmsi, vessels);
  return null;
}
