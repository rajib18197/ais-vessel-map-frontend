import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import { getLatLon } from "@/entities/vessel/types/vessel.types";
import L from "leaflet";
import { FALLBACK_ZOOM, FIT_BOUNDS_PADDING } from "../constants/vessel-theme";

interface MapInitialViewProps {
  vessels: VesselSummary[];
}

/**
 * Fits the map to wherever the vessel data actually is, the first time
 * vessels arrive. This replaces a hardcoded center: the AIS feed's
 * coverage region is an external dependency we don't control, so the
 * "reasonable default view" the requirement asks for has to be derived
 * from data, not guessed at build time.
 *
 * Runs exactly once — on the first non-empty vessel list. Subsequent
 * updates don't refit the view, since that would yank the map out from
 * under a user who has since panned or zoomed manually.
 */
export function MapInitialView({ vessels }: MapInitialViewProps) {
  const map = useMap();
  const hasFitRef = useRef(false);

  useEffect(() => {
    if (hasFitRef.current || vessels.length === 0) return;

    const positions = vessels
      .map(getLatLon)
      .filter((p): p is [number, number] => p !== null);

    if (positions.length === 0) return;

    hasFitRef.current = true;

    if (positions.length === 1) {
      map.setView(positions[0], FALLBACK_ZOOM);
    } else {
      map.fitBounds(L.latLngBounds(positions), { padding: FIT_BOUNDS_PADDING });
    }
  }, [vessels, map]);

  return null;
}
