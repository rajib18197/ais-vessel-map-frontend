import L, { type DivIcon } from "leaflet";
import { getVesselTheme } from "@/entities/vessel/lib/vessel-theme";
import type { VesselColorTheme } from "../types";
import VesselSVG from "./vessel-svg";

// AIS "Type of ship" field: 0 means "not available" per the AIS spec,
// which is also our own "unknown" sentinel — so a missing vesselType
// (null) and an explicit 0 both resolve to the same theme bucket.
const UNKNOWN_VESSEL_TYPE = 0;

function resolveVesselTheme(
  vesselType: number | null,
  isSelected: boolean,
): VesselColorTheme {
  const theme = getVesselTheme(vesselType ?? UNKNOWN_VESSEL_TYPE, isSelected);
  return isSelected ? { ...theme, stroke: "#ffffff" } : theme;
}

const BASE_ICON_SIZE = 38;
const SELECTED_ICON_SCALE = 1.45;

export function createVesselIcon(
  vesselType: number | null,
  isSelected: boolean,
  rotation: number,
  isMoving: boolean,
): DivIcon {
  const theme = resolveVesselTheme(vesselType, isSelected);
  const size = Math.round(
    BASE_ICON_SIZE * (isSelected ? SELECTED_ICON_SCALE : 1),
  );

  return L.divIcon({
    html: VesselSVG(theme, isMoving, isSelected, rotation, size),
    className: "vessel-icon-wrapper",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
