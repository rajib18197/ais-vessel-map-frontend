import type { VesselColorTheme } from "../types";

export default function VesselSVG(
  color: VesselColorTheme,
  isMoving: boolean,
  isSelected: boolean,
  rotation: number,
  size: number,
): string {
  const glowOpacity = isSelected ? "0.45" : "0.22";

  const selectionRing = isSelected
    ? `<circle cx="12" cy="12" r="14.5" fill="none" stroke="${color.stroke}" stroke-width="0.8" stroke-dasharray="4 2.5" opacity="0.8"/>
       <circle cx="12" cy="12" r="17" fill="none" stroke="${color.stroke}" stroke-width="0.4" opacity="0.35"/>`
    : "";

  const speedTrail = isMoving
    ? `<line x1="12" y1="1.5" x2="12" y2="-10" stroke="${color.stroke}" stroke-width="1.5" stroke-dasharray="2.5 3" stroke-linecap="round" opacity="0.65"/>`
    : "";

  const hull = `
    <path
      d="M12 1.5 C9.8 5.5 8.5 9 8.5 13 L8.5 20.5 C8.5 21.8 10 22.8 12 22.8 C14 22.8 15.5 21.8 15.5 20.5 L15.5 13 C15.5 9 14.2 5.5 12 1.5 Z"
      fill="${color.fill}" stroke="${color.stroke}" stroke-width="1.1" stroke-linejoin="round"
    />`;

  const deck = `
    <rect x="9.8" y="12.5" width="4.4" height="3.5" rx="0.6" fill="${color.deck}" opacity="0.8"/>
    <rect x="10.8" y="16.2" width="2.4" height="2.2" rx="0.4" fill="${color.deck}" opacity="0.55"/>`;

  const navLights = `
    <circle cx="16.5" cy="11" r="1.4" fill="#63C05A" opacity="0.95"/>
    <circle cx="7.5"  cy="11" r="1.4" fill="#E24B4A" opacity="0.95"/>`;

  const radialGlow = `
    <defs>
      <radialGradient id="ig" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stop-color="${color.fill}" stop-opacity="${glowOpacity}"/>
        <stop offset="100%" stop-color="${color.fill}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="12" cy="12" rx="11" ry="11" fill="url(#ig)"/>`;

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      style="transform: rotate(${rotation}deg); overflow: visible; display: block;"
    >
      ${radialGlow}
      ${selectionRing}
      ${speedTrail}
      ${hull}
      ${deck}
      ${navLights}
    </svg>`;
}
