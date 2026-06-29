import { getErrorMessage, type FallbackProps } from "react-error-boundary";
import styled from "styled-components";
import Button from "./button";

export default function GlobalErrorFallback({ error }: FallbackProps) {
  const handleReload = () => {
    window.location.replace("/");
  };

  return (
    <Container>
      <ContentBox>
        <IconWrapper>⚠️</IconWrapper>
        <Title>System Offline</Title>
        <Description>
          A critical error occurred while loading the application.
        </Description>
        <ErrorCard>
          <ErrorText>{getErrorMessage(error)}</ErrorText>
        </ErrorCard>
        <ButtonGroup>
          <Button variation="primary" onClick={handleReload}>
            Reload Application
          </Button>
        </ButtonGroup>
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-family-body);
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: min(100%, 48rem);
  padding: var(--space-xl);
  background: rgba(16, 25, 40, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-sm);
`;

const Title = styled.h1`
  font-size: 1.7rem;
  font-weight: 600;
  margin: 0 0 0.6rem 0;
  color: var(--color-error);
`;

const Description = styled.p`
  font-size: 1.3rem;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-lg) 0;
  line-height: 1.5;
  font-style: italic;
`;

const ErrorCard = styled.div`
  background: rgba(12, 20, 34, 0.85);
  padding: 1rem;
  border-radius: var(--radius-sm);
  width: 100%;
  margin-bottom: var(--space-lg);
  border-left: 4px solid var(--color-error);
  text-align: left;
`;

const ErrorText = styled.code`
  font-size: 1.1rem;
  color: var(--color-text-subtle);
  word-break: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-sm);
`;
