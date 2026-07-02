import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import {
  fmtCoord,
  formatLastSeen,
  formatSpeed,
} from "@/entities/vessel/utils/helpers";
import { resolveTypeName } from "@/entities/vessel/lib/vessel-theme";
import TooltipRow from "./tooltip-row";

type TooltipField = {
  readonly id: string;
  readonly label: string;
  readonly format: (vessel: VesselSummary) => string | null;
};

const TOOLTIP_FIELDS = [
  {
    id: "mmsi",
    label: "MMSI",
    format: (v) => v.mmsi,
  },
  {
    id: "type",
    label: "TYPE",
    format: (v) => resolveTypeName(v.vesselType),
  },
  {
    id: "speed",
    label: "SPEED",
    format: (v) => formatSpeed(v.sog),
  },
  {
    id: "lat",
    label: "LAT",
    format: (v) => (v.location ? fmtCoord(v.location.coordinates[1]) : null),
  },
  {
    id: "lon",
    label: "LON",
    format: (v) => (v.location ? fmtCoord(v.location.coordinates[0]) : null),
  },
  {
    id: "updated",
    label: "UPDATED",
    format: (v) => formatLastSeen(v.lastSeen),
  },
] satisfies readonly TooltipField[];

type VesselTooltipProps = {
  vessel: VesselSummary;
};

export function VesselTooltip({ vessel }: VesselTooltipProps) {
  const rows = TOOLTIP_FIELDS.map((field) => ({
    id: field.id,
    label: field.label,
    value: field.format(vessel),
  })).filter(
    (row): row is { id: string; label: string; value: string } =>
      row.value !== null,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <span
        style={{
          color: "var(--color-accent)",
          fontWeight: 700,
          fontSize: "1.1rem",
          textTransform: "uppercase",
        }}
      >
        {vessel.name || "UNKNOWN VESSEL"}
      </span>

      {rows.map((row, i) => (
        <TooltipRow
          key={row.id}
          label={row.label}
          value={row.value}
          withBorder={i !== rows.length - 1}
        />
      ))}
    </div>
  );
}
