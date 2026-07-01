import { useMemo } from "react";
import { Marker } from "react-leaflet";
import type L from "leaflet";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import { getLatLon } from "@/entities/vessel/types/vessel.types";
import { createVesselIcon } from "./vessel-icon";

// Group nearby heading values together so tiny changes do not recreate the vessel icon every update.
const HEADING_BUCKET_DEGREES = 10;
const MOVING_SOG_THRESHOLD_KN = 0.5;

function bucketHeading(heading: number): number {
  return Math.round(heading / HEADING_BUCKET_DEGREES) * HEADING_BUCKET_DEGREES;
}

type VesselMarkerProps = {
  readonly vessel: VesselSummary;
  readonly isSelected: boolean;
  readonly onSelect: (mmsi: string) => void;
  readonly onHoverStart: (mmsi: string) => void;
  readonly onHoverEnd: (mmsi: string) => void;
  readonly registerMarker: (mmsi: string, marker: L.Marker | null) => void;
};

function VesselMarker({
  vessel,
  isSelected,
  onSelect,
  onHoverStart,
  onHoverEnd,
  registerMarker,
}: VesselMarkerProps) {
  const position = getLatLon(vessel);
  const isMoving = (vessel.sog ?? 0) > MOVING_SOG_THRESHOLD_KN;
  const bucketedRotation = bucketHeading(vessel.heading ?? vessel.cog ?? 0);

  // Only create a new icon when its appearance actually changes. This keeps the marker DOM stable and prevents tooltip issues.
  const icon = useMemo(
    () =>
      createVesselIcon(
        vessel.vesselType,
        isSelected,
        bucketedRotation,
        isMoving,
      ),
    [vessel.vesselType, isSelected, bucketedRotation, isMoving],
  );

  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      ref={(instance) => registerMarker(vessel.mmsi, instance)}
      eventHandlers={{
        click: () => onSelect(vessel.mmsi),
        mouseover: () => onHoverStart(vessel.mmsi),
        mouseout: () => onHoverEnd(vessel.mmsi),
      }}
    />
  );
}

export default VesselMarker;
