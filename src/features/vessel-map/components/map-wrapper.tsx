import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const MapWrapper = styled.div`
  height: 100vh;
  position: relative;
  background: var(--color-bg);

  .leaflet-tooltip {
    background: rgba(15, 23, 42, 0.96);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(0, 180, 216, 0.35);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-size: 0.95rem;
    padding: 0.9rem 1.2rem;
    box-shadow: var(--shadow-md);
    white-space: nowrap;
    transition: opacity 0.2s ease-in-out;
  }

  .leaflet-tooltip::before {
    display: none;
  }

  .radar-ring {
    transform-origin: center;
    animation: ${spin} 6s linear infinite;
  }

  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2) !important;
  }

  .leaflet-control-zoom a {
    background: rgba(255, 255, 255, 0.95) !important;
    color: var(--color-surface-muted) !important;
    transition: all 0.2s ease;
  }

  .leaflet-control-zoom a:hover {
    background: var(--color-accent) !important;
    color: var(--color-surface) !important;
  }
`;
