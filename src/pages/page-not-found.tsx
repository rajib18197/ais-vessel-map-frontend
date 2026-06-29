import styled from "styled-components";

import Heading from "@/shared/ui/Heading";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/button";

const StyledPageNotFound = styled.main`
  min-height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xxl);
`;

const Box = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--space-xxl);
  flex: 0 1 96rem;
  text-align: center;

  & h1 {
    margin-bottom: var(--space-xl);
  }
`;

export default function PageNotFound() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/");
  }
  return (
    <StyledPageNotFound>
      <Box>
        <Heading as="h1">
          The page you are looking for could not be found 😢
        </Heading>
        <Button onClick={handleClick}>
          &larr; Go back to the vessels tracking page
        </Button>
      </Box>
    </StyledPageNotFound>
  );
}
