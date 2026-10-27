import React from "react";
import WingMark, { DIAL_COLORS, MARK_IMAGE, LOGO_IMAGE } from "@/components/WingMark";

const { cream, muted } = DIAL_COLORS;

// Image slots (login/register headers, phone preview) get the same dial mark as a
// data-URI SVG, so those plain <img> usages keep working with no code change.
export const BRAND_ASSETS = {
  mark: MARK_IMAGE,
  logo: LOGO_IMAGE,
  icon: MARK_IMAGE,
  iconPng: MARK_IMAGE,
};

// `size` is the rendered HEIGHT in px — dial and wordmark scale together.
export default function Logo({ size = 32, showWordmark = true }) {
  return (
    <span
      className="inline-flex items-center shrink-0 select-none align-middle"
      style={{ height: size, gap: Math.round(size * 0.3) }}
    >
      <WingMark style={{ height: size, width: size, flex: "none" }} />
      {showWordmark && (
        <span
          className="font-heading font-bold"
          style={{
            fontSize: Math.round(size * 0.68),
            lineHeight: 1,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: muted }}>Pilot</span>
          <span style={{ color: cream }}>Hobb</span>
        </span>
      )}
    </span>
  );
}