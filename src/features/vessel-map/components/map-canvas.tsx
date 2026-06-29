import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
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

const MAP_CENTER = [32.72, -117.23] as LatLngTuple;
const MAP_DEFAULT_ZOOM = 11 as const;
const TILE_LAYER_URL =
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" as const;
const TILE_LAYER_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' as const;

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
        center={MAP_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
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

        <MapAutoPan selectedMmsi={selectedMmsi} vessels={vessels} />
        {onBoundsChange && <MapBoundsTracker onBoundsChange={onBoundsChange} />}
      </MapContainer>
    </MapWrapper>
  );
}
