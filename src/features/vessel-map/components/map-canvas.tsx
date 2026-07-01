import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import type {
  VesselSummary,
  BoundsOptions,
} from "@/entities/vessel/types/vessel.types";
import { MapWrapper } from "./map-wrapper";
import { MapAutoPan } from "./map-auto-pan";
import VesselMarker from "./vessel-marker";
import { VesselTooltipOverlay } from "./vessel-tooltip-overlay";
import { MapBoundsTracker } from "./map-bounds-tracker";
import { MapRestoreBounds } from "./map-restore-bounds";
import { MapInitialView } from "./map-initial-view";
import {
  FALLBACK_CENTER,
  FALLBACK_ZOOM,
  TILE_LAYER_ATTRIBUTION,
  TILE_LAYER_URL,
} from "../constants/vessel-theme";
import { useMarkerRegistry } from "../hooks/use-marker-registry";
import { useState } from "react";

type MapCanvasProps = {
  readonly vessels: VesselSummary[];
  readonly selectedMmsi: string | null;
  readonly onVesselSelect: (mmsi: string) => void;
  readonly onBoundsChange?: (bounds: BoundsOptions) => void;
  readonly isBoundsMode?: boolean;
  readonly bounds?: BoundsOptions | null;
};

export default function MapCanvas({
  vessels,
  selectedMmsi,
  onVesselSelect,
  onBoundsChange,
  isBoundsMode = false,
  bounds = null,
}: MapCanvasProps) {
  // Only use saved bounds in bounds mode. Otherwise, always show all vessels.
  const activeBounds = isBoundsMode ? bounds : null;

  const [hoveredMmsi, setHoveredMmsi] = useState<string | null>(null);

  const hoveredVessel =
    hoveredMmsi !== null
      ? (vessels.find((v) => v.mmsi === hoveredMmsi) ?? null)
      : null;

  // Stores active Leaflet marker instances by MMSI. so the tooltip can position itself correctly.
  const { markersRef, registerMarker } = useMarkerRegistry();

  // Keep track of the previously hovered vessel. If it disappears from the feed, clear the hover state.
  const [prevHoveredVessel, setPrevHoveredVessel] = useState(hoveredVessel);

  if (hoveredVessel !== prevHoveredVessel) {
    setPrevHoveredVessel(hoveredVessel);
    if (hoveredVessel === null && hoveredMmsi !== null) {
      setHoveredMmsi(null);
    }
  }

  return (
    <MapWrapper>
      <MapContainer
        center={FALLBACK_CENTER}
        zoom={FALLBACK_ZOOM}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url={TILE_LAYER_URL}
          attribution={TILE_LAYER_ATTRIBUTION}
          maxZoom={19}
        />

        {vessels.map((vessel) => (
          <VesselMarker
            key={vessel.mmsi}
            vessel={vessel}
            isSelected={vessel.mmsi === selectedMmsi}
            onSelect={onVesselSelect}
            onHoverStart={setHoveredMmsi}
            onHoverEnd={() =>
              setHoveredMmsi((current) =>
                current === vessel.mmsi ? null : current,
              )
            }
            registerMarker={registerMarker}
          />
        ))}

        {/* Restore saved bounds before tracking changes. This prevents URL bounds from being overwritten on page refresh. Must come before `MapBoundsTracker` so URL bounds are restored first. */}
        <MapRestoreBounds bounds={activeBounds} />
        <MapInitialView vessels={vessels} skip={activeBounds !== null} />
        <MapAutoPan selectedMmsi={selectedMmsi} vessels={vessels} />
        {onBoundsChange && <MapBoundsTracker onBoundsChange={onBoundsChange} />}
      </MapContainer>

      <VesselTooltipOverlay vessel={hoveredVessel} markersRef={markersRef} />
    </MapWrapper>
  );
}
