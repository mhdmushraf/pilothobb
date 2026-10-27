import React from "react";

const V_LINES = [50, 100, 150, 200, 250];
const H_LINES = [80, 160, 240, 320, 400, 480, 560];

/**
 * Dark VFR moving-map phone mockup: magenta route, amber aircraft position.
 * Purely decorative marketing artwork.
 */
export default function MovingMapPhone() {
  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 300 }}>
      <div
        className="relative mx-auto bg-cockpit-border p-2 rounded-[44px] shadow-2xl shadow-black/60"
        style={{ aspectRatio: "9 / 19" }}
      >
        <div className="relative w-full h-full overflow-hidden bg-cockpit-panel rounded-[36px]">
          <svg viewBox="0 0 300 640" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            {/* chart grid */}
            {V_LINES.map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="640" className="stroke-cockpit-border/40" strokeWidth="1" />
            ))}
            {H_LINES.map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} className="stroke-cockpit-border/40" strokeWidth="1" />
            ))}

            {/* TMA boundary */}
            <polygon
              points="0,140 300,70 300,300 0,370"
              className="fill-cockpit-warning/5 stroke-cockpit-warning/30"
              strokeWidth="1.2"
              strokeDasharray="6 5"
            />
            {/* CTR */}
            <polygon
              points="106,300 212,278 250,424 122,462"
              className="fill-cockpit-expired/10 stroke-cockpit-expired/50"
              strokeWidth="1.4"
              strokeDasharray="5 4"
            />

            {/* flight track flown */}
            <path
              d="M 46 566 L 96 500 L 128 430"
              fill="none"
              className="stroke-fuchsia-400"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* planned route */}
            <path
              d="M 128 430 L 168 360 L 196 250 L 236 152"
              fill="none"
              className="stroke-fuchsia-400"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="7 6"
              opacity="0.65"
            />

            {/* aerodromes */}
            <circle cx="46" cy="566" r="4.5" className="fill-cockpit-cream" />
            <circle cx="236" cy="152" r="4.5" className="fill-cockpit-cream" />
            <circle cx="168" cy="360" r="3" className="fill-cockpit-muted" />

            <text x="58" y="570" fontSize="10" className="fill-cockpit-muted font-mono">FAGG</text>
            <text x="196" y="146" fontSize="10" className="fill-cockpit-muted font-mono">FAOH</text>
            <text x="176" y="356" fontSize="9" className="fill-cockpit-muted/70 font-mono">WAYPT</text>
            <text x="130" y="322" fontSize="9" className="fill-cockpit-expired/70 font-mono">CTR</text>
            <text x="16" y="132" fontSize="9" className="fill-cockpit-warning/60 font-mono">TMA</text>

            {/* aircraft position */}
            <g transform="translate(128 430) rotate(34)">
              <circle r="17" className="fill-cockpit-amber/15" />
              <circle r="9" className="fill-cockpit-amber/25" />
              <path d="M0,-11 L6.5,9 L0,4.5 L-6.5,9 Z" className="fill-cockpit-amber" />
            </g>
          </svg>

          {/* telemetry bar */}
          <div className="absolute top-0 left-0 right-0 px-3 pt-3 pb-4 bg-gradient-to-b from-cockpit-bg/90 to-transparent">
            <div className="flex items-center justify-between font-mono text-[9px] text-cockpit-muted">
              <span>GS <span className="text-cockpit-cream">118</span> kt</span>
              <span>ALT <span className="text-cockpit-cream">4,120</span> ft</span>
              <span>TRK <span className="text-cockpit-cream">041°</span></span>
            </div>
          </div>

          {/* record card */}
          <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-cockpit-border bg-cockpit-bg/90 backdrop-blur px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-cockpit-expired">
                <span className="w-1.5 h-1.5 rounded-full bg-cockpit-expired" /> Recording
              </span>
              <span className="font-mono text-[10px] text-cockpit-cream">00:42:18</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] font-semibold text-cockpit-cream">FAGG → FAOH</p>
                <p className="text-[9px] text-cockpit-muted">1.4 h tracked · 62 nm</p>
              </div>
              <span className="rounded-lg bg-cockpit-amber px-2.5 py-1.5 text-[10px] font-bold text-cockpit-bg">Stop &amp; save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}