import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import { VESSEL_TYPE_LABELS } from "../constants/vessel-theme";

interface VesselTooltipProps {
  vessel: VesselSummary;
}

function formatSpeed(sog: number | null | undefined): string {
  return sog != null ? `${sog.toFixed(1)} kn` : "—";
}

function formatLastSeen(lastSeen: string): string {
  return new Date(lastSeen).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function resolveTypeName(vesselType: number | null | undefined): string {
  if (vesselType == null) return "Unknown";
  return VESSEL_TYPE_LABELS[vesselType] ?? `Type ${vesselType}`;
}

interface TooltipRowProps {
  label: string;
  value: string;
  withBorder?: boolean;
}

function TooltipRow({ label, value, withBorder = true }: TooltipRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "2rem",
        ...(withBorder && {
          borderBottom: "1px solid #334155",
          paddingBottom: "4px",
        }),
      }}
    >
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ color: "#f8fafc", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export function VesselTooltip({ vessel }: VesselTooltipProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span
        style={{
          color: "#ec4899",
          fontWeight: 700,
          fontSize: "1.1rem",
          textTransform: "uppercase",
        }}
      >
        {vessel.name || "UNKNOWN VESSEL"}
      </span>

      <TooltipRow label="MMSI" value={vessel.mmsi} />
      <TooltipRow label="TYPE" value={resolveTypeName(vessel.vesselType)} />
      <TooltipRow label="SPEED" value={formatSpeed(vessel.sog)} />
      <TooltipRow
        label="UPDATED"
        value={formatLastSeen(vessel.lastSeen)}
        withBorder={false}
      />
    </div>
  );
}
