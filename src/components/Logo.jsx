import React from "react";

export default function Logo({ size = 36, showWordmark = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <circle cx="24" cy="24" r="22" stroke="#243049" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="18" stroke="#1c2740" strokeWidth="0.8" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x1 = 24 + Math.cos(angle) * 20;
          const y1 = 24 + Math.sin(angle) * 20;
          const x2 = 24 + Math.cos(angle) * 22;
          const y2 = 24 + Math.sin(angle) * 22;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i === 0 ? "#FF9D2E" : "#243049"}
              strokeWidth={i === 0 ? 1.5 : 1}
            />
          );
        })}
        <path d="M24 2 L20.5 7 L27.5 7 Z" fill="#FF9D2E" />
        <rect x="13" y="19" width="22" height="11" rx="2" fill="#0A0E17" stroke="#243049" strokeWidth="0.8" />
        <text
          x="24" y="27.5"
          textAnchor="middle"
          fill="#FF9D2E"
          fontSize="7.5"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
          letterSpacing="0.5"
        >
          159.3
        </text>
      </svg>
      {showWordmark && (
        <span className="font-heading text-lg font-bold tracking-tight">
          <span className="text-cockpit-muted">Pilot</span>
          <span className="text-cockpit-cream">Hobb</span>
        </span>
      )}
    </div>
  );
}