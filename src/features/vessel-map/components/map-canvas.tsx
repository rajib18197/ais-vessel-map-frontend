import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import type {
  VesselSummary,
  BoundsOptions,
} from "@/entities/vessel/types/vessel.types";
import { getLatLon } from "@/entities/vessel/types/vessel.types";
import { MapWrapper } from "./map-wrapper";
import { MapAutoPan } from "./map-auto-pan";
import { VesselTooltip } from "./vessel-tooltip";
import { createVesselIcon } from "./vessel-icon";
import { MapBoundsTracker } from "./map-bounds-tracker";
import {
  FALLBACK_CENTER,
  FALLBACK_ZOOM,
  TILE_LAYER_ATTRIBUTION,
  TILE_LAYER_URL,
} from "../constants/vessel-theme";
// import { MapInitialView } from "./map-initial-view";

type MapCanvasProps = {
  readonly vessels: VesselSummary[];
  readonly selectedMmsi: string | null;
  readonly onVesselSelect: (mmsi: string) => void;
  readonly onBoundsChange?: (bounds: BoundsOptions) => void;
};

export default function MapCanvas({
  vessels,
  selectedMmsi,
  onVesselSelect,
  onBoundsChange,
}: MapCanvasProps) {
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

        {vessels.map((vessel) => {
          const position = getLatLon(vessel);
          if (!position) return null;

          const isSelected = vessel.mmsi === selectedMmsi;

          return (
            <Marker
              key={vessel.mmsi}
              position={position}
              icon={createVesselIcon(vessel, isSelected)}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{ click: () => onVesselSelect(vessel.mmsi) }}
            >
              <Tooltip direction="top" offset={[0, -25]} opacity={1}>
                <VesselTooltip vessel={vessel} />
              </Tooltip>
            </Marker>
          );
        })}

        {/* <MapInitialView vessels={vessels} /> */}
        <MapAutoPan selectedMmsi={selectedMmsi} vessels={vessels} />
        {onBoundsChange && <MapBoundsTracker onBoundsChange={onBoundsChange} />}
      </MapContainer>
    </MapWrapper>
  );
}
