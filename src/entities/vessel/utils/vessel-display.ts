import type { VesselDetail } from "../types/vessel.types";

/** AIS navigational status codes (ITU-R M.1371). Exhaustive over 0-15;
 *  anything outside that range is provider noise, not a real status. */
const NAV_STATUS_LABELS: Readonly<Record<number, string>> = {
  0: "Under way using engine",
  1: "At anchor",
  2: "Not under command",
  3: "Restricted manoeuvrability",
  4: "Constrained by draught",
  5: "Moored",
  6: "Aground",
  7: "Engaged in fishing",
  8: "Under way sailing",
  9: "Reserved (HSC)",
  10: "Reserved (WIG)",
  11: "Power-driven, towing astern",
  12: "Power-driven, pushing ahead",
  13: "Reserved",
  14: "AIS-SART / AIS-MOB / AIS-EPIRB",
  15: "Not defined",
};

export function fmtNavStatus(code: number | null): string {
  if (code === null) return "Not reported";
  return NAV_STATUS_LABELS[code] ?? `Unknown (${code})`;
}

export function fmtCallsign(callsign: string | null): string {
  return callsign?.trim() ? callsign : "Not reported";
}

export function fmtImo(imo: number | null): string {
  return imo !== null ? String(imo) : "Not reported";
}

export function fmtDestination(destination: string | null): string {
  return destination?.trim() ? destination : "Not reported";
}

export function fmtDraught(draught: number | null): string {
  return draught !== null ? `${draught.toFixed(1)} m` : "Not reported";
}

/**
 * ETA fields arrive as four independent nullable numbers (per AIS spec —
 * month/day/hour/minute are transmitted separately, no combined field
 * exists on the wire). All four must be present to render a real ETA;
 * a partial set means the static report hasn't fully landed yet, and
 * showing a half-built date would misrepresent the data.
 */
export function fmtEta(
  etaMonth: number | null,
  etaDay: number | null,
  etaHour: number | null,
  etaMinute: number | null,
): string {
  if (
    etaMonth === null ||
    etaDay === null ||
    etaHour === null ||
    etaMinute === null
  ) {
    return "Not reported";
  }
  // AIS uses month=0/day=0 as "no ETA available" sentinel values.
  if (etaMonth === 0 || etaDay === 0) return "Not reported";

  const mm = String(etaMonth).padStart(2, "0");
  const dd = String(etaDay).padStart(2, "0");
  const hh = String(etaHour).padStart(2, "0");
  const min = String(etaMinute).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${min} UTC`;
}

/**
 * dimA/B/C/D map to bow/stern/port/starboard distances from the AIS
 * antenna, not length/width directly. Overall length = dimA + dimB,
 * overall beam = dimC + dimD — but only if every component is present;
 * partial dimension data can't be safely combined into a total.
 */
export function fmtDimensions(
  dimA: number | null,
  dimB: number | null,
  dimC: number | null,
  dimD: number | null,
): string {
  if (dimA === null || dimB === null || dimC === null || dimD === null) {
    return "Not reported";
  }
  const length = dimA + dimB;
  const beam = dimC + dimD;
  return `${length} m × ${beam} m`;
}

export function fmtClassB(classB: boolean): string {
  return classB ? "Class B" : "Class A";
}

/** True once every extended (detail-only) field is null — i.e. this
 *  vessel has never transmitted a static/voyage report, only position
 *  reports. Distinguishing "no data yet" from "fetch failed" matters
 *  for what the UI tells the user. */
export function hasNoStaticData(detail: VesselDetail): boolean {
  return (
    detail.callsign === null &&
    detail.imo === null &&
    detail.destination === null &&
    detail.dimA === null
  );
}
