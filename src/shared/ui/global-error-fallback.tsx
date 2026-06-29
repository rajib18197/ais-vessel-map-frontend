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
  height: 100vh;
  width: 100vw;
  background-color: #0e1117;
  color: #e2e8f0;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 48rem;
  padding: 3rem;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(74, 101, 128, 0.2);
  border-radius: 1rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.5),
    0 8px 10px -6px rgba(0, 0, 0, 0.5);
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.7rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #f87171;
`;

const Description = styled.p`
  font-size: 1.3rem;
  color: #94a3b8;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  font-style: italic;
`;

const ErrorCard = styled.div`
  background: rgba(15, 23, 42, 0.6);
  padding: 1rem;

  border-radius: 0.1rem;
  width: 100%;
  margin-bottom: 2rem;
  border-left: 4px solid #f87171;
  text-align: left;
`;

const ErrorText = styled.code`
  font-size: 1.1rem;
  color: #cbd5e1;
  word-break: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;
