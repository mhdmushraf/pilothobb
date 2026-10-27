import React from "react";

/* ===== PilotHobb brand mark — a Hobbs-meter dial =====
   A circular instrument face with 12 tick marks (the 12 o'clock tick in amber),
   an amber pointer triangle and an amber-on-navy digital readout window.
   Drawn as SVG so it stays crisp at every size and reads on dark surfaces. */

export const DIAL_COLORS = {
  bg: "#0A0E17",
  panel: "#141B2B",
  panelLight: "#1A2336",
  border: "#243049",
  amber: "#FF9D2E",
  cream: "#F3ECDD",
  muted: "#8893A8",
};

const { bg, panel, border, amber, cream, muted } = DIAL_COLORS;

const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";

// 12 tick marks around the face; 0deg is 12 o'clock, running clockwise.
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  const px = (r) => +(32 + Math.sin(a) * r).toFixed(2);
  const py = (r) => +(32 - Math.cos(a) * r).toFixed(2);
  const top = i === 0;
  return `<line x1="${px(20.5)}" y1="${py(20.5)}" x2="${px(25)}" y2="${py(25)}" stroke="${top ? amber : cream}" stroke-width="${top ? 2.6 : 2}" stroke-linecap="round" opacity="${top ? 1 : 0.8}" />`;
}).join("");

// Dial artwork as raw markup: one source of truth for the <WingMark /> component,
// the <img>-ready data URIs below, and the pre-React boot splash in index.html.
export const DIAL_SVG = `<circle cx="32" cy="32" r="30" fill="${panel}" stroke="${border}" stroke-width="2" />
  <circle cx="32" cy="32" r="26" fill="none" stroke="${border}" stroke-width="0.75" opacity="0.75" />
  ${TICKS}
  <polygon points="32,13.8 28.5,19.2 35.5,19.2" fill="${amber}" />
  <rect x="14" y="25" width="36" height="13.5" rx="3" fill="${bg}" stroke="${border}" stroke-width="1" />
  <text x="32" y="35.4" text-anchor="middle" font-family="${MONO}" font-size="9" font-weight="600" fill="${amber}">159.3</text>`;

const asImageUri = (inner, width) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 64" width="${width}" height="64">${inner}</svg>`
  )}`;

// Square icon/mark slots — dial only.
export const MARK_IMAGE = asImageUri(DIAL_SVG, 64);

// Header/footer lockup (dial + wordmark) for <img> slots.
export const LOGO_IMAGE = asImageUri(
  `${DIAL_SVG}<text x="76" y="41" font-family="Inter,system-ui,-apple-system,'Segoe UI',sans-serif" font-size="27" font-weight="700" letter-spacing="-0.6" fill="${muted}">Pilot<tspan fill="${cream}">Hobb</tspan></text>`,
  208
);

export default function WingMark({ className = "", style }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      role="img"
      aria-label="PilotHobb"
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: DIAL_SVG }}
    />
  );
}