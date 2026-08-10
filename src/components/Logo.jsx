import React from "react";

export const BRAND_ASSETS = {
  // New "wing" mark (indigo, transparent PNG served from /public)
  mark: "/pilothobb-wing.png",
  logo: "/pilothobb-wing.png",
  icon: "/pilothobb-wing.png",
  iconPng: "/pilothobb-wing.png",
};

export default function Logo({ size = 36, showWordmark = true }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <img
        src={BRAND_ASSETS.mark}
        alt="PilotHobb"
        style={{ height: size, width: "auto" }}
        className="shrink-0"
        draggable={false}
      />
      {showWordmark && (
        <span
          className="font-heading font-bold tracking-tight leading-none"
          style={{ fontSize: Math.round(size * 0.62) }}
        >
          <span style={{ color: "#4f46e5" }}>Pilot</span>
          <span style={{ color: "#0f172a" }}>Hobb</span>
        </span>
      )}
    </div>
  );
}
