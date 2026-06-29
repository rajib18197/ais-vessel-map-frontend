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
  padding: 2.4rem 2.8rem 1.6rem;
  border-bottom: 1px solid #1c2d42;
  flex-shrink: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AppTitle = styled.h2`
  display: block;
  font-size: 1.2rem;
  color: hsl(210deg 14% 66%/1);
  font-weight: 400;
  margin-bottom: 0.6rem;
`;

const LiveBadge = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.7rem;

  font-size: 1.6rem;
  color: hsl(210deg 10% 90%/1);
  font-weight: 500;
`;
