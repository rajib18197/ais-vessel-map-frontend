import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import type { BoundsOptions } from "@/entities/vessel/types/vessel.types";

const BOUNDS_CHANGE_DEBOUNCE_MS = 400;

type MapBoundsTrackerProps = {
  onBoundsChange: (bounds: BoundsOptions) => void;
};

function leafletBoundsToOptions(map: ReturnType<typeof useMap>): BoundsOptions {
  const b = map.getBounds();
  return {
    swLng: b.getWest(),
    swLat: b.getSouth(),
    neLng: b.getEast(),
    neLat: b.getNorth(),
  };
}
/**
 * Reports the map's current viewport to the parent, debounced so a
 * drag/zoom gesture doesn't fire a bounds update per animation frame.
 * Fires once on mount too, so the parent has an initial viewport
 * before the user has interacted with the map at all.
 */
export function MapBoundsTracker({ onBoundsChange }: MapBoundsTrackerProps) {
  const map = useMap();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onBoundsChange(leafletBoundsToOptions(map));
    // Mount-only: subsequent changes are handled by the event hooks below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMapEvents({
    moveend: () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onBoundsChange(leafletBoundsToOptions(map));
      }, BOUNDS_CHANGE_DEBOUNCE_MS);
    },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
