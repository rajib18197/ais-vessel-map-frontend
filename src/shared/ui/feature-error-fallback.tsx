import styled from "styled-components";
import { getErrorMessage, type FallbackProps } from "react-error-boundary";
import Heading from "./Heading";
import GlobalStyles from "@/styles/global-styles";
import Button from "./button";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <>
      <GlobalStyles />
      <StyledErrorFallback>
        <Box>
          <Heading as="h1">Something went wrong 🧐</Heading>
          <p>{getErrorMessage(error)}</p>
          <Button size="large" onClick={resetErrorBoundary}>
            Try again
          </Button>
        </Box>
      </StyledErrorFallback>
    </>
  );
}

const StyledErrorFallback = styled.main`
  min-height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xxl);
`;

const Box = styled.div`
  background-color: var(--color-surface);
  border: 1px dashed var(--color-border);
  outline: 3px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius-md);
  padding: var(--space-xxl);
  flex: 0 1 96rem;
  text-align: center;

  & h1 {
    margin-bottom: var(--space-lg);
  }

  & p {
    margin-bottom: var(--space-xl);
    color: var(--color-text-muted);
  }
`;
