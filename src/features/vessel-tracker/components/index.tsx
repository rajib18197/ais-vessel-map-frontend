import VesselDetails from "@/features/vessel-details/components/vessel-details";
import FeedHeader from "@/features/vessel-feed/components/feed-header";
import VesselList from "@/features/vessel-feed/components/vessel-list";
import { MapCanvas } from "@/features/vessel-map";
import Sidebar from "@/shared/ui/side-bar";
import styled from "styled-components";
import { useVesselTracker } from "../hooks/use-vessel-tracker";

export default function VesselTracker() {
  const {
    vessels,
    selected,
    selectedMmsi,
    recentlyUpdated,
    isLoading,
    isError,
    errorMessage,
    isBoundsMode,
    onVesselSelect,
    onBoundsChange,
  } = useVesselTracker();

  if (isLoading && !isBoundsMode) {
    return <CenteredMessage>Connecting to AIS feed…</CenteredMessage>;
  }

  if (isError) {
    return (
      <ErrorMessage>
        <span>Failed to load vessels</span>
        <ErrorDetail>{errorMessage ?? "Unknown error"}</ErrorDetail>
      </ErrorMessage>
    );
  }

  return (
    <Wrapper>
      <Sidebar>
        <FeedHeader itemCount={vessels.length} />
        <VesselList
          vessels={vessels}
          onVesselSelect={onVesselSelect}
          recentlyUpdated={recentlyUpdated}
          selectedMmsi={selectedMmsi}
        />
        {selected && <VesselDetails summary={selected} />}
      </Sidebar>

      <MapCanvas
        vessels={vessels}
        selectedMmsi={selectedMmsi}
        onVesselSelect={onVesselSelect}
        onBoundsChange={onBoundsChange}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 35rem 1fr;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--color-bg);
`;

const CenteredMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 1.4rem;
  letter-spacing: 0.06em;
`;

const ErrorMessage = styled(CenteredMessage)`
  flex-direction: column;
  gap: 0.8rem;
  color: var(--color-error);
`;

const ErrorDetail = styled.span`
  font-size: 1.1rem;
  color: var(--color-text-muted);
`;
