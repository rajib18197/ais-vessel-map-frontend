import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const MapWrapper = styled.div`
  height: 100vh;
  position: relative;
  background-color: #f8f9fa;

  .leaflet-tooltip {
    background: rgba(14, 17, 23, 0.95);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(0, 180, 216, 0.4);
    border-radius: 8px;
    color: #e2e8f0;
    font-size: 0.95rem;
    padding: 0.8rem 1.2rem;
    box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.3);
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
    color: #1e293b !important;
    transition: all 0.2s ease;
  }

  .leaflet-control-zoom a:hover {
    background: #00b4d8 !important;
    color: #fff !important;
  }
`;
