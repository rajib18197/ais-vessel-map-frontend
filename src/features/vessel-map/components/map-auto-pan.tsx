import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import { getLatLon } from "@/entities/vessel/types/vessel.types";

const MIN_FLY_ZOOM = 14;

type MapAutoPanProps = {
  selectedMmsi: string | null;
  vessels: VesselSummary[];
};

export function MapAutoPan({ selectedMmsi, vessels }: MapAutoPanProps) {
  const map = useMap();
  const vesselsRef = useRef(vessels);
  const lastFlownMmsiRef = useRef<string | null>(null);

  useEffect(() => {
    vesselsRef.current = vessels;
  }, [vessels]);

  useEffect(() => {
    if (!selectedMmsi) {
      lastFlownMmsiRef.current = null;
      return;
    }
    if (selectedMmsi === lastFlownMmsiRef.current) return;
    lastFlownMmsiRef.current = selectedMmsi;

    const vessel = vesselsRef.current.find((v) => v.mmsi === selectedMmsi);
    const position = vessel ? getLatLon(vessel) : null;
    if (!position) return;

    const frameId = requestAnimationFrame(() => {
      map.invalidateSize({ animate: false });
      const targetZoom = Math.max(map.getZoom(), MIN_FLY_ZOOM);
      map.setView(position, targetZoom, { animate: true, duration: 0.8 });
    });

    return () => cancelAnimationFrame(frameId);
  }, [selectedMmsi, map]);

  return null;
}
