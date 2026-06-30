import L, { type DivIcon } from "leaflet";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import { getVesselTheme } from "../constants/vessel-theme";
import type { VesselColorTheme } from "../types";
import VesselSVG from "./vessel-svg";

function resolveVesselTheme(
  vesselType: string,
  isSelected: boolean,
): VesselColorTheme {
  const key = vesselType?.toLowerCase() ?? "unknown";
  const theme = getVesselTheme(Number(key), isSelected);
  return isSelected ? { ...theme, stroke: "#ffffff" } : theme;
}

const BASE_ICON_SIZE = 38;
const SELECTED_ICON_SCALE = 1.45;

export function createVesselIcon(
  vessel: VesselSummary,
  isSelected: boolean,
): DivIcon {
  const theme = resolveVesselTheme(String(vessel.vesselType), isSelected);
  const rotation = vessel.heading ?? vessel.cog ?? 0;
  const size = Math.round(
    BASE_ICON_SIZE * (isSelected ? SELECTED_ICON_SCALE : 1),
  );
  const isMoving = (vessel.sog ?? 0) > 0.5;

  return L.divIcon({
    html: VesselSVG(theme, isMoving, isSelected, rotation, size),
    className: "vessel-icon-wrapper",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
