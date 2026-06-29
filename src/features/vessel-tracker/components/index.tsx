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
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const CenteredMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: #0e1117;
  font-family: "Share Tech Mono", "JetBrains Mono", monospace;
  font-size: 1.4rem;
  color: #4a6580;
  letter-spacing: 0.06em;
`;

const ErrorMessage = styled(CenteredMessage)`
  flex-direction: column;
  gap: 0.8rem;
  color: #f87171;
`;

const ErrorDetail = styled.span`
  font-size: 1.1rem;
  color: #4a6580;
`;
