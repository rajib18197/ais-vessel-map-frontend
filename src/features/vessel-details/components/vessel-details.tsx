import styled from "styled-components";
import {
  fmt,
  fmtCoord,
  fmtSog,
  fmtTime,
  fmtType,
} from "@/entities/vessel/utils/helpers";
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
        <Dd>{fmtType(summary.vesselType)}</Dd>

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
  flex: 1;
  border-top: 1px solid #1c2d42;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  --blue-darker: hsl(230deg 40% 24%);
  --blue-dark: hsl(230deg 40% 28%);
  background:
    linear-gradient(
      calc(180deg - 20deg),
      transparent 0%,
      transparent 49.99%,
      var(--blue-dark) 50%,
      var(--blue-dark) 100%
    ),
    linear-gradient(
      calc(180deg + 20deg),
      transparent 0%,
      transparent 49.99%,
      var(--blue-darker) 50%,
      var(--blue-darker) 100%
    );
  padding-bottom: 1.4rem;
`;

const DetailVesselName = styled.div`
  padding: 0.9rem 2.8rem 0.6rem;
  font-size: 1.7rem;
  color: #00b4d8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  padding-bottom: 1.2rem;
  margin-bottom: 0.4rem;
`;

const DetailGrid = styled.dl`
  display: grid;
  width: 80%;
  grid-template-columns: 9rem 1fr;
  row-gap: 0;
  overflow-y: auto;
  flex: 1;
  padding: 0.8rem 2.8rem 1.6rem;
  margin-left: auto;
  margin-right: auto;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const Dt = styled.dt`
  font-size: 1.1rem;
  color: hsl(210deg, 14%, 66%);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.55rem 0;
  display: flex;
  align-items: center;
`;

const Dd = styled.dd`
  font-size: 1.25rem;
  color: #e2e8f0;
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
  color: #4a6580;
  border-top: 1px solid #1c2d42;
`;

const LoadingRow = styled.div`
  grid-column: 1 / -1;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  color: #4a6580;
  font-style: italic;
`;

const ErrorRow = styled.div`
  grid-column: 1 / -1;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  color: #f87171;
`;

const EmptyNotice = styled.p`
  grid-column: 1 / -1;
  margin-top: 0.6rem;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #94a3b8;
  background: rgba(148, 163, 184, 0.08);
  border-left: 2px solid #4a6580;
  border-radius: 2px;
`;
