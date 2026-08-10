import React from "react";

export const BRAND_ASSETS = {
  // Wing-only mark (square icon slots)
  mark: "/pilothobb-wing.png",
  // Full "PilotHobb" lockup (wing + wordmark) — for headers/footers
  logo: "https://media.base44.com/images/public/6a455fc5475b58bb52305622/db3ef0bfb_generated_image.png",
  icon: "/pilothobb-wing.png",
  iconPng: "/pilothobb-wing.png",
};

// `size` is the rendered HEIGHT in px. The full lockup keeps its aspect ratio.
export default function Logo({ size = 32, showWordmark = true }) {
  return (
    <img
      src={showWordmark ? BRAND_ASSETS.logo : BRAND_ASSETS.mark}
      alt="PilotHobb"
      style={{ height: size, width: "auto" }}
      className="shrink-0 select-none"
      draggable={false}
    />
  );
}