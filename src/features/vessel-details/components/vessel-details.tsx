import styled from "styled-components";
import {
  fmt,
  fmtCoord,
  fmtSog,
  fmtTime,
} from "@/entities/vessel/utils/helpers";
import { resolveTypeName } from "@/entities/vessel/lib/vessel-theme";
import {
  fmtNavStatus,
  fmtCallsign,
  fmtImo,
  fmtDestination,
  fmtDraught,
  fmtEta,
  fmtDimensions,
  fmtClassB,
  hasNoStaticData,
} from "@/entities/vessel/utils/vessel-display";
import { useVesselDetail } from "../hooks/use-vessel-details";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";

type VesselDetailsProps = {
  summary: VesselSummary;
};

export default function VesselDetails({ summary }: VesselDetailsProps) {
  const { data: detail, isError, error } = useVesselDetail(summary.mmsi);

  const lat = summary.location?.coordinates[1];
  const lon = summary.location?.coordinates[0];

  return (
    <DetailSection>
      <DetailVesselName>{summary.name ?? "Unknown vessel"}</DetailVesselName>

      <DetailGrid>
        <Dt>MMSI</Dt>
        <Dd>{summary.mmsi}</Dd>

        <Dt>Type</Dt>
        <Dd>{resolveTypeName(summary.vesselType)}</Dd>

        <Dt>Lat</Dt>
        <Dd>{fmtCoord(lat)}</Dd>

        <Dt>Lon</Dt>
        <Dd>{fmtCoord(lon)}</Dd>

        <Dt>SOG</Dt>
        <Dd>{fmtSog(summary.sog)}</Dd>

        <Dt>COG</Dt>
        <Dd>{fmt(summary.cog, 1, "°")}</Dd>

        <Dt>HDG</Dt>
        <Dd>{fmt(summary.heading, 0, "°")}</Dd>

        <Dt>Seen</Dt>
        <Dd>{fmtTime(summary.lastSeen)}</Dd>

        <SectionDivider>Voyage &amp; Static Data</SectionDivider>

        {isError ? (
          <ErrorRow>
            {error?.isNotFound
              ? "This vessel is no longer being tracked."
              : "Couldn't load extended details. Showing summary data only."}
          </ErrorRow>
        ) : !detail ? (
          <LoadingRow>Loading voyage data…</LoadingRow>
        ) : (
          <>
            <Dt>Nav status</Dt>
            <Dd>{fmtNavStatus(detail.navStatus)}</Dd>

            <Dt>Callsign</Dt>
            <Dd>{fmtCallsign(detail.callsign)}</Dd>

            <Dt>IMO</Dt>
            <Dd>{fmtImo(detail.imo)}</Dd>

            <Dt>Destination</Dt>
            <Dd>{fmtDestination(detail.destination)}</Dd>

            <Dt>ETA</Dt>
            <Dd>
              {fmtEta(
                detail.etaMonth,
                detail.etaDay,
                detail.etaHour,
                detail.etaMinute,
              )}
            </Dd>

            <Dt>Draught</Dt>
            <Dd>{fmtDraught(detail.draught)}</Dd>

            <Dt>Dimensions</Dt>
            <Dd>
              {fmtDimensions(
                detail.dimA,
                detail.dimB,
                detail.dimC,
                detail.dimD,
              )}
            </Dd>

            <Dt>AIS class</Dt>
            <Dd>{fmtClassB(detail.classB)}</Dd>

            {hasNoStaticData(detail) && (
              <EmptyNotice>
                This vessel hasn't transmitted a voyage/static report yet —
                fields above are pending live data.
              </EmptyNotice>
            )}
          </>
        )}
      </DetailGrid>
    </DetailSection>
  );
}

const DetailSection = styled.div`
  --blue-darker: hsl(230deg 40% 24%);
  --blue-dark: hsl(230deg 40% 28%);

  flex: 1;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  background:
    linear-gradient(
      calc(180deg - 20deg),
      transparent 0%,
      transparent 50%,
      hsl(210deg 20% 14% / 0.7) 50%
    ),
    linear-gradient(
      calc(180deg + 20deg),
      transparent 0%,
      transparent 50%,
      hsl(210deg 20% 5% / 0.7) 50%
    ),
    var(--color-surface);
  padding-bottom: var(--space-lg);
`;

const DetailVesselName = styled.div`
  padding: var(--space-sm) var(--space-lg) 0.6rem;
  font-size: 1.7rem;
  color: var(--color-accent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  padding-bottom: 1.2rem;
  margin-bottom: 0.4rem;
`;

const DetailGrid = styled.dl`
  display: grid;
  width: min(100%, 80rem);
  grid-template-columns: 9rem 1fr;
  row-gap: 0;
  overflow-y: auto;
  flex: 1;
  padding: 0.8rem var(--space-lg) 1.6rem;
  margin: 0 auto;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const Dt = styled.dt`
  font-size: 1.1rem;
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.55rem 0;
  display: flex;
  align-items: center;
`;

const Dd = styled.dd`
  font-size: 1.25rem;
  color: var(--color-text);
  padding: 0.55rem 0 0.55rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: end;
  word-break: break-word;
`;

const SectionDivider = styled.div`
  grid-column: 1 / -1;
  margin-top: 1rem;
  padding: 0.6rem 0 0.4rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
`;

const LoadingRow = styled.div`
  grid-column: 1 / -1;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  color: var(--color-text-muted);
  font-style: italic;
`;

const ErrorRow = styled.div`
  grid-column: 1 / -1;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  color: var(--color-error);
`;

const EmptyNotice = styled.p`
  grid-column: 1 / -1;
  margin-top: 0.6rem;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  background: rgba(148, 163, 184, 0.08);
  border-left: 2px solid var(--color-text-muted);
  border-radius: var(--radius-tiny);
`;
