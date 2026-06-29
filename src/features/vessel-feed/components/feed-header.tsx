import styled from "styled-components";
import ModeToggle from "@/features/vessel-view-mode/components/mode-toggle";

type FeedHeaderProps = {
  itemCount: number;
};

export default function FeedHeader({ itemCount }: FeedHeaderProps) {
  return (
    <Wrapper>
      <TopRow>
        <AppTitle>AIS Vessel Tracker</AppTitle>
        <ModeToggle />
      </TopRow>
      <LiveBadge>{itemCount} vessels · live feed</LiveBadge>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  padding: var(--space-xl) var(--space-lg) var(--space-md);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  background: var(--color-surface);
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AppTitle = styled.h2`
  display: block;
  font-size: 1.2rem;
  color: var(--color-text-muted);
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const LiveBadge = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.6rem;
  color: var(--color-text);
  font-weight: 600;
`;
