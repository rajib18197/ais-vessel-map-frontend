import { useEffect, useRef } from "react";
import { useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import type { BoundsOptions } from "@/entities/vessel/types/vessel.types";

const BOUNDS_CHANGE_DEBOUNCE_MS = 400;

function leafletBoundsToOptions(map: LeafletMap): BoundsOptions {
  const b = map.getBounds();
  return {
    swLng: b.getWest(),
    swLat: b.getSouth(),
    neLng: b.getEast(),
    neLat: b.getNorth(),
  };
}

export function useMapBoundsTracker(
  map: LeafletMap,
  onBoundsChange: (bounds: BoundsOptions) => void,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onBoundsChange(leafletBoundsToOptions(map));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [map, onBoundsChange]);

  useMapEvents({
    moveend: () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onBoundsChange(leafletBoundsToOptions(map));
      }, BOUNDS_CHANGE_DEBOUNCE_MS);
    },
  });
}
