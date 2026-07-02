import { memo, useCallback, useMemo } from "react";
import { Marker } from "react-leaflet";
import type L from "leaflet";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import { getLatLon } from "@/entities/vessel/types/vessel.types";
import { createVesselIcon } from "./vessel-icon";

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

  // Stable per-marker ref callback: identity only changes if the mmsi
  // itself changes (it never does — mmsi is also this component's React
  // `key`), so Leaflet's marker element is never spuriously
  // detached/reattached on unrelated re-renders.
  const setMarkerRef = useCallback(
    (instance: L.Marker | null) => {
      registerMarker(vessel.mmsi, instance);
    },
    [registerMarker, vessel.mmsi],
  );

  // Stable per-marker click/hover handlers, for the same reason —
  // avoids passing new closures into eventHandlers on every render.
  const handleClick = useCallback(() => {
    onSelect(vessel.mmsi);
  }, [onSelect, vessel.mmsi]);

  const handleMouseOver = useCallback(() => {
    onHoverStart(vessel.mmsi);
  }, [onHoverStart, vessel.mmsi]);

  const handleMouseOut = useCallback(() => {
    onHoverEnd(vessel.mmsi);
  }, [onHoverEnd, vessel.mmsi]);

  if (!position) return null;

  return (
    <Marker
      position={position}
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      ref={setMarkerRef}
      eventHandlers={{
        click: handleClick,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
      }}
    />
  );
}

// Custom comparison isn't needed — all props are now stable references
// (registerMarker, onSelect, onHoverStart/End are useCallback'd upstream;
// vessel keeps its identity across ws updates unless it actually changed,
// per applyWsEvent), so React.memo's default shallow comparison correctly
// skips re-rendering markers that weren't touched by a given WS event.
export default memo(VesselMarker);
