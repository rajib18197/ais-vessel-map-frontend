import { z } from "zod";

// ---------------------------------------------------------------------------
// GeoPoint
//
// Mongoose's `InferSchemaType` widens GeoJSON coordinate tuples to
// `number[]`, which is why the backend enforces the tuple shape locally via
// `satisfies GeoPoint` at construction time. On the frontend we receive this
// purely as parsed JSON over HTTP/WS, so Zod is the only thing standing
// between "the server sent valid GeoJSON" and a runtime crash. The schema
// enforces exactly two numbers — not `number[]` — so a malformed payload
// fails parsing instead of silently becoming a 3-element array later.
// ---------------------------------------------------------------------------

export const geoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [lon, lat] — GeoJSON order
});

export type GeoPoint = z.infer<typeof geoPointSchema>;

// ---------------------------------------------------------------------------
// VesselSummary
//
// This is the single source of truth for the summary shape used in the list
// view, the REST snapshot, and every WebSocket event payload. Deriving the
// TypeScript type via `z.infer` means the compile-time type and the runtime
// validator can never silently drift from each other — the failure mode
// where `VesselSummary` says one thing and the server actually sends
// another is closed off at the type level, not just by convention.
//
// This mirrors the backend's `vesselSummarySchema` (get-all-vessels.types.ts)
// field-for-field, with one deliberate divergence: `lastSeen` is `z.string()`
// here but `z.date()` on the backend. The backend schema validates Mongoose's
// `.lean()` output, where `lastSeen` is still a real `Date` instance.
// `JSON.stringify` always serializes `Date` to an ISO string before it ever
// reaches the wire, so by the time this schema sees the payload — over HTTP
// or WebSocket — it has already become a string. Same field, same schema
// name, different runtime type at different stages of the pipeline; this is
// intentional, not a drift bug.
//
// `name`, `vesselType`, `sog`, `cog`, and `heading` are `.nullable()` only —
// NOT `.optional()`. The Mongoose schema sets `default: null` on every one
// of these fields, so they are always present on every document, never
// `undefined`. Marking them optional here would silently accept a payload
// that's missing a field your backend can never actually produce, masking
// a real bug if that ever changed. `location`, by contrast, IS `.optional()`
// and NOT `.nullable()` — its Mongoose default is `undefined`, not `null`,
// and lean output omits the key entirely rather than sending it as null.
// ---------------------------------------------------------------------------

export const vesselSummarySchema = z.object({
  mmsi: z.string(),
  name: z.string().nullable(),
  vesselType: z.number().nullable(),
  location: geoPointSchema.optional(),
  sog: z.number().nullable(),
  cog: z.number().nullable(),
  heading: z.number().nullable(),
  lastSeen: z.string(), // ISO string — z.date() on the backend; see note above
});

export type VesselSummary = z.infer<typeof vesselSummarySchema>;

// ---------------------------------------------------------------------------
// REST: GET /api/vessels
// ---------------------------------------------------------------------------

export const getAllVesselsResponseSchema = z.object({
  status: z.literal("success"),
  results: z.number(),
  data: z.object({
    vessels: z.array(vesselSummarySchema),
  }),
});

export type GetAllVesselsResponse = z.infer<typeof getAllVesselsResponseSchema>;

// ---------------------------------------------------------------------------
// WebSocket events
//
// `z.discriminatedUnion` validates BOTH the `event` discriminant AND the
// shape of `data` for that variant in a single pass. This closes the gap in
// the previous hand-rolled `parseVesselWsEvent`, which checked only that
// `event` was one of the three known strings and then cast `data` straight
// through unchecked. A malformed `data` payload (wrong field types, missing
// required fields, or — for `vessel:snapshot` specifically — a non-array)
// now fails parsing and returns `null` instead of corrupting the React
// Query cache with an object that *claims* to be a `VesselSummary[]` but
// isn't.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// VesselDetail (detail view — superset of fields beyond VesselSummary)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Bounds query (map viewport fetch)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns `[lat, lon]` for Leaflet (which expects lat first), or `null` if
 * the vessel currently has no position. GeoJSON stores `[lon, lat]`; this
 * is the one deliberate axis swap in the codebase and it happens in exactly
 * one place so it can't be duplicated-and-forgotten elsewhere.
 */
export function getLatLon(vessel: VesselSummary): [number, number] | null {
  if (!vessel.location) return null;
  const [lon, lat] = vessel.location.coordinates;
  return [lat, lon];
}
