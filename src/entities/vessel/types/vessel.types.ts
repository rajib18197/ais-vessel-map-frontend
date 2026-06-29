export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lon, lat] — GeoJSON order
}

export interface VesselSummary {
  mmsi: string;
  name?: string | null;
  vesselType?: number | null;
  location?: GeoPoint;
  sog?: number | null;
  cog?: number | null;
  heading?: number | null;
  lastSeen: string; // ISO string — Date on backend, string after JSON parse
}

// API response shapes
export interface GetAllVesselsResponse {
  status: "success";
  results: number;
  data: {
    vessels: VesselSummary[];
  };
}

// WebSocket event shapes
export interface VesselSnapshotEvent {
  event: "vessel:snapshot";
  data: VesselSummary[];
}

export interface VesselUpdatedEvent {
  event: "vessel:updated";
  data: VesselSummary;
}

export interface VesselCreatedEvent {
  event: "vessel:created";
  data: VesselSummary;
}

export type VesselWsEvent =
  | VesselSnapshotEvent
  | VesselUpdatedEvent
  | VesselCreatedEvent;

// Runtime narrowing
export function parseVesselWsEvent(raw: unknown): VesselWsEvent | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const event = obj["event"];
  if (
    event === "vessel:snapshot" ||
    event === "vessel:updated" ||
    event === "vessel:created"
  ) {
    return raw as VesselWsEvent;
  }
  return null;
}

export interface VesselDetail {
  mmsi: string;
  name: string | null;
  location?: GeoPoint;
  sog: number | null;
  cog: number | null;
  heading: number | null;
  vesselType: number | null;

  navStatus: number | null;
  rot: number | null;
  callsign: string | null;
  imo: number | null;
  destination: string | null;
  etaMonth: number | null;
  etaDay: number | null;
  etaHour: number | null;
  etaMinute: number | null;
  draught: number | null;
  dimA: number | null;
  dimB: number | null;
  dimC: number | null;
  dimD: number | null;
  classB: boolean;

  lastSeen: string; // ISO string after JSON parse
  createdAt?: string;
  updatedAt?: string;
}

export interface GetVesselDetailResponse {
  status: "success";
  data: { vessel: VesselDetail };
}

export interface BoundsOptions {
  swLng: number;
  swLat: number;
  neLng: number;
  neLat: number;
}

export interface GetVesselsInBoundsResponse {
  status: "success";
  results: number;
  data: { vessels: VesselSummary[] };
}

// ****** helpers ********

/** Returns [lat, lon] for Leaflet, or null if vessel has no position */
export function getLatLon(vessel: VesselSummary): [number, number] | null {
  if (!vessel.location) return null;
  const [lon, lat] = vessel.location.coordinates;
  return [lat, lon];
}
