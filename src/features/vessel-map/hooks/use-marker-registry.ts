import { useCallback, useRef } from "react";
import type L from "leaflet";

export function useMarkerRegistry() {
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const registerMarker = useCallback(
    (mmsi: string, marker: L.Marker | null) => {
      if (marker) {
        markersRef.current.set(mmsi, marker);
      } else {
        markersRef.current.delete(mmsi);
      }
    },
    [],
  );

  return {
    markersRef,
    registerMarker,
  };
}
