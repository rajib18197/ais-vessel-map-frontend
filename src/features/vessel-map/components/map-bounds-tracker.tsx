import { useMap } from "react-leaflet";
import type { BoundsOptions } from "@/entities/vessel/types/vessel.types";
import { useMapBoundsTracker } from "../hooks/use-map-bounds-tracker";

type MapBoundsTrackerProps = {
  onBoundsChange: (bounds: BoundsOptions) => void;
};

// Runs bounds tracking inside Leaflet's map context.
export function MapBoundsTracker({ onBoundsChange }: MapBoundsTrackerProps) {
  const map = useMap();
  useMapBoundsTracker(map, onBoundsChange);
  return null;
}
