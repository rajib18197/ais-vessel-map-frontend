import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { BoundsOptions } from "@/entities/vessel/types/vessel.types";
import L from "leaflet";

type MapRestoreBoundsProps = {
  readonly bounds: BoundsOptions | null;
};

// Restore URL bounds once on mount before bounds tracking starts.
export function MapRestoreBounds({ bounds }: MapRestoreBoundsProps) {
  const map = useMap();
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (hasRestoredRef.current || !bounds) return;
    hasRestoredRef.current = true;

    map.fitBounds(
      L.latLngBounds(
        [bounds.swLat, bounds.swLng],
        [bounds.neLat, bounds.neLng],
      ),
    );
  }, [bounds, map]);

  return null;
}
