import React from "react";

/**
 * Cockpit "cruise view" backdrop illustration for the hero section.
 * Decorative marketing artwork — HUD-style readout over a sky/horizon gradient.
 */
export default function CruiseViewCard({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-cockpit-border/60 ${className}`}>
      <svg viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id="cvcSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141B2B" />
            <stop offset="55%" stopColor="#0E1626" />
            <stop offset="100%" stopColor="#0A0E17" />
          </linearGradient>
          <radialGradient id="cvcSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC062" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFC062" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="960" height="540" fill="url(#cvcSky)" />

        {/* sun glow, top right */}
        <circle cx="770" cy="110" r="150" fill="url(#cvcSun)" />
        <circle cx="765" cy="155" r="55" fill="#FF9D2E" opacity="0.18" />

        {/* horizon */}
        <path d="M0 360 Q 480 320 960 368 L960 540 L0 540 Z" fill="#0A0E17" opacity="0.9" />
        <path d="M0 368 Q 480 328 960 376" stroke="#243049" strokeWidth="1.5" fill="none" opacity="0.8" />

        {/* cloud silhouettes */}
        <g fill="#1A2336" opacity="0.7">
          <ellipse cx="60" cy="330" rx="140" ry="30" />
          <ellipse cx="310" cy="340" rx="95" ry="22" />
          <ellipse cx="900" cy="350" rx="120" ry="26" />
        </g>

        {/* decorative HUD readout bars */}
        <g fill="#8893A8" opacity="0.14">
          <rect x="40" y="290" width="150" height="16" rx="8" />
          <rect x="260" y="310" width="120" height="12" rx="6" />
          <rect x="480" y="270" width="170" height="18" rx="9" />
          <rect x="700" y="300" width="140" height="14" rx="7" />
          <rect x="120" y="330" width="100" height="10" rx="5" />
          <rect x="560" y="250" width="90" height="10" rx="5" />
          <rect x="820" y="290" width="110" height="14" rx="7" />
        </g>

        {/* wing / attitude silhouette */}
        <g opacity="0.5">
          <path d="M-40 328 L 500 398 L 500 408 L -40 338 Z" fill="#243049" />
          <path d="M 80 330 L 185 340 L 185 351 L 80 345 Z" fill="#FF9D2E" opacity="0.4" />
        </g>

        {/* top-left caption badge */}
        <circle cx="34" cy="34" r="4" fill="#6FE0A6" />
        <text x="48" y="39" fontFamily="JetBrains Mono, monospace" fontSize="13" letterSpacing="1" fill="#8893A8">
          CRUISING AT 6,500 FT · 112 KT · 38 NM TO GO
        </text>

        {/* ALT / HDG / IAS instrument row */}
        <g fontFamily="JetBrains Mono, monospace" fontSize="17" fontWeight="700">
          <text x="120" y="486" fill="#F3ECDD">ALT <tspan fill="#FF9D2E">6,500</tspan></text>
          <text x="341" y="486" fill="#F3ECDD">HDG <tspan fill="#FF9D2E">322</tspan></text>
          <text x="544" y="486" fill="#F3ECDD">IAS <tspan fill="#FF9D2E">112</tspan></text>
        </g>
      </svg>
    </div>
  );
}
