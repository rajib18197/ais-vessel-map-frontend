import { z } from "zod";

// GeoJSON uses [longitude, latitude] order.
// Zod enforces exactly two numbers so invalid payloads fail at runtime.
export const geoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [lon, lat] — GeoJSON order
});

export type GeoPoint = z.infer<typeof geoPointSchema>;

// Shared shape used by REST responses, WebSocket events, and list views. The TypeScript type is derived from this schema to keep runtime and compile-time definitions in sync.
export const vesselSummarySchema = z.object({
  mmsi: z.string(),
  name: z.string().nullable(),
  vesselType: z.number().nullable(),
  location: geoPointSchema.optional(),
  sog: z.number().nullable(),
  cog: z.number().nullable(),
  heading: z.number().nullable(),
  lastSeen: z.string(), // ISO string on the client — z.date() on the backend;
});

export type VesselSummary = z.infer<typeof vesselSummarySchema>;

// REST: GET /api/vessels
export const getAllVesselsResponseSchema = z.object({
  status: z.literal("success"),
  results: z.number(),
  data: z.object({
    vessels: z.array(vesselSummarySchema),
  }),
});

export type GetAllVesselsResponse = z.infer<typeof getAllVesselsResponseSchema>;

// Validate both the event type and its payload shape in one place. Invalid messages are ignored instead of corrupting application state.
export const vesselWsEventSchema = z.discriminatedUnion("event", [
  z.object({
    event: z.literal("vessel:snapshot"),
    data: z.array(vesselSummarySchema),
  }),
  z.object({
    event: z.literal("vessel:updated"),
    data: vesselSummarySchema,
  }),
  z.object({
    event: z.literal("vessel:created"),
    data: vesselSummarySchema,
  }),
]);

export type VesselWsEvent = z.infer<typeof vesselWsEventSchema>;
export type VesselSnapshotEvent = Extract<
  VesselWsEvent,
  { event: "vessel:snapshot" }
>;
export type VesselUpdatedEvent = Extract<
  VesselWsEvent,
  { event: "vessel:updated" }
>;
export type VesselCreatedEvent = Extract<
  VesselWsEvent,
  { event: "vessel:created" }
>;

/**
 * Runtime narrowing for inbound WebSocket frames. Returns `null` for
 * anything that isn't a fully valid `VesselWsEvent` — including a
 * recognized `event` discriminant paired with a malformed `data` payload.
 * Callers should treat `null` as "drop this frame," not as an exception
 * worth surfacing; a single malformed frame from a noisy feed shouldn't
 * tear down the connection.
 */
export function parseVesselWsEvent(raw: unknown): VesselWsEvent | null {
  const result = vesselWsEventSchema.safeParse(raw);
  return result.success ? result.data : null;
}

// VesselDetail (detail view — superset of fields beyond VesselSummary)
export const vesselDetailSchema = z.object({
  mmsi: z.string(),
  name: z.string().nullable(),
  location: geoPointSchema.optional(),
  sog: z.number().nullable(),
  cog: z.number().nullable(),
  heading: z.number().nullable(),
  vesselType: z.number().nullable(),

  navStatus: z.number().nullable(),
  rot: z.number().nullable(),
  callsign: z.string().nullable(),
  imo: z.number().nullable(),
  destination: z.string().nullable(),
  etaMonth: z.number().nullable(),
  etaDay: z.number().nullable(),
  etaHour: z.number().nullable(),
  etaMinute: z.number().nullable(),
  draught: z.number().nullable(),
  dimA: z.number().nullable(),
  dimB: z.number().nullable(),
  dimC: z.number().nullable(),
  dimD: z.number().nullable(),
  classB: z.boolean(),

  lastSeen: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type VesselDetail = z.infer<typeof vesselDetailSchema>;

export const getVesselDetailResponseSchema = z.object({
  status: z.literal("success"),
  data: z.object({ vessel: vesselDetailSchema }),
});

export type GetVesselDetailResponse = z.infer<
  typeof getVesselDetailResponseSchema
>;

// Bounds query (map viewport fetch)
export type BoundsOptions = {
  swLng: number;
  swLat: number;
  neLng: number;
  neLat: number;
};

export const getVesselsInBoundsResponseSchema = z.object({
  status: z.literal("success"),
  results: z.number(),
  data: z.object({ vessels: z.array(vesselSummarySchema) }),
});

export type GetVesselsInBoundsResponse = z.infer<
  typeof getVesselsInBoundsResponseSchema
>;

// Helpers

// Convert GeoJSON coordinates to Leaflet coordinates. GeoJSON uses [lon, lat], while Leaflet expects [lat, lon].
export function getLatLon(vessel: VesselSummary): [number, number] | null {
  if (!vessel.location) return null;
  const [lon, lat] = vessel.location.coordinates;
  return [lat, lon];
}
