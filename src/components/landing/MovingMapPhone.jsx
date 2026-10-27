import React from "react";
import { Layers, Compass, Crosshair, Plus, Minus, Satellite } from "lucide-react";

const V_LINES = [50, 100, 150, 200, 250];
const H_LINES = [60, 120, 180, 240, 300, 360, 420, 480, 540, 600];

/**
 * Dark VFR moving-map phone mockup — live GPS, HUD strip, airspace labels,
 * map controls and a bottom "next waypoint" sheet.
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
          {/* status bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-2.5">
            <span className="font-mono text-[10px] font-semibold text-cockpit-cream">9:41</span>
            <span className="font-mono text-[9px] text-cockpit-cream/70">●●● ᯤ ▮▮▮</span>
          </div>

          {/* map canvas */}
          <svg viewBox="0 0 300 640" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            {/* graticule */}
            {V_LINES.map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="640" className="stroke-cockpit-border/30" strokeWidth="1" />
            ))}
            {H_LINES.map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} className="stroke-cockpit-border/30" strokeWidth="1" />
            ))}

            {/* terrain blobs */}
            <ellipse cx="40" cy="520" rx="110" ry="70" className="fill-cockpit-bg/60" />
            <ellipse cx="250" cy="180" rx="90" ry="55" className="fill-cockpit-bg/60" />

            {/* TMA boundary */}
            <polygon
              points="0,140 300,70 300,300 0,370"
              className="fill-cockpit-warning/5 stroke-cockpit-warning/35"
              strokeWidth="1.2"
              strokeDasharray="6 5"
            />
            {/* CTR ring */}
            <circle cx="158" cy="320" r="78" className="fill-cockpit-expired/5 stroke-cockpit-expired/45" strokeWidth="1.4" strokeDasharray="5 4" />
            {/* danger area */}
            <polygon
              points="60,540 140,520 150,590 70,610"
              className="fill-cockpit-expired/10 stroke-cockpit-expired/40"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* range rings around ownship */}
            <circle cx="128" cy="430" r="46" className="stroke-cockpit-border/50" strokeWidth="1" fill="none" />
            <circle cx="128" cy="430" r="92" className="stroke-cockpit-border/30" strokeWidth="1" fill="none" />

            {/* flight track flown */}
            <path d="M 46 566 L 96 500 L 128 430" fill="none" className="stroke-fuchsia-400" strokeWidth="3" strokeLinecap="round" opacity="0.95" />
            {/* planned route */}
            <path d="M 128 430 L 168 360 L 196 250 L 236 152" fill="none" className="stroke-fuchsia-400" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="7 6" opacity="0.65" />

            {/* aerodromes */}
            <circle cx="46" cy="566" r="4.5" className="fill-cockpit-cream" />
            <circle cx="236" cy="152" r="4.5" className="fill-cockpit-cream" />
            <circle cx="168" cy="360" r="3" className="fill-cockpit-muted" />
            <circle cx="258" cy="266" r="3" className="fill-cockpit-muted" />

            <text x="56" y="586" fontSize="10" className="fill-cockpit-muted font-mono">FAHG</text>
            <text x="246" y="146" fontSize="10" className="fill-cockpit-muted font-mono">FAGM</text>
            <text x="176" y="356" fontSize="9" className="fill-cockpit-muted/70 font-mono">RANDJ</text>
            <text x="266" y="262" fontSize="9" className="fill-cockpit-muted/70 font-mono">FASK</text>
            <text x="166" y="336" fontSize="8.5" className="fill-cockpit-expired/70 font-mono">CTR · FAOR</text>
            <text x="12" y="132" fontSize="8.5" className="fill-cockpit-warning/60 font-mono">TMA 5500–FL195</text>
            <text x="70" y="534" fontSize="8" className="fill-cockpit-expired/70 font-mono">FAR-105 DANGER</text>

            {/* ownship */}
            <g transform="translate(128 430) rotate(34)">
              <circle r="18" className="fill-cockpit-amber/15" />
              <circle r="10" className="fill-cockpit-amber/25" />
              <path d="M0,-11 L6.5,9 L0,4.5 L-6.5,9 Z" className="fill-cockpit-amber" />
            </g>
          </svg>

          {/* HUD strip */}
          <div className="absolute top-7 left-0 right-0 px-3">
            <div className="grid grid-cols-4 gap-1 rounded-xl border border-cockpit-border/70 bg-cockpit-bg/85 backdrop-blur px-2.5 py-2">
              {[
                ["GS", "112", "kt"],
                ["ALT", "6,250", "ft"],
                ["TRK", "047", "°M"],
                ["VS", "+300", "fpm"],
              ].map(([label, value, unit]) => (
                <div key={label} className="text-center">
                  <p className="font-mono text-[7px] text-cockpit-muted">{label}</p>
                  <p className="font-mono text-[12px] font-bold leading-tight text-cockpit-cream">
                    {value}
                    <span className="ml-0.5 text-[7px] font-normal text-cockpit-muted">{unit}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* chips */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full border border-cockpit-expired/30 bg-cockpit-bg/85 px-2 py-1 font-mono text-[7.5px] text-cockpit-expired">
                <span className="h-1.5 w-1.5 rounded-full bg-cockpit-expired" /> REC 00:42:17
              </span>
              <span className="flex items-center gap-1 rounded-full border border-cockpit-border/70 bg-cockpit-bg/85 px-2 py-1 font-mono text-[7.5px] text-cockpit-muted">
                <Satellite className="h-2.5 w-2.5 text-cockpit-valid" /> 11 sats
              </span>
              <span className="rounded-full border border-cockpit-border/70 bg-cockpit-bg/85 px-2 py-1 font-mono text-[7.5px] text-cockpit-muted">N-UP</span>
            </div>
          </div>

          {/* map controls */}
          <div className="absolute right-3 top-[220px] flex flex-col gap-1.5">
            {[Layers, Compass, Crosshair, Plus, Minus].map((Icon, i) => (
              <div key={i} className="flex h-7 w-7 items-center justify-center rounded-lg border border-cockpit-border/70 bg-cockpit-bg/85 backdrop-blur">
                <Icon className="h-3.5 w-3.5 text-cockpit-cream/80" />
              </div>
            ))}
          </div>

          {/* bottom sheet */}
          <div className="absolute bottom-3 left-3 right-3 space-y-2">
            <div className="rounded-xl border border-cockpit-border bg-cockpit-bg/90 backdrop-blur px-3 py-2">
              <p className="font-mono text-[8px] uppercase tracking-wider text-cockpit-amber">Next · RANDJ → FAGM Rand</p>
              <p className="mt-0.5 font-mono text-[9.5px] text-cockpit-cream">11.2 NM · BRG 047° · ETA 06 min</p>
            </div>
            <div className="rounded-xl border border-cockpit-border bg-cockpit-bg/90 backdrop-blur px-3 py-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-cockpit-expired">
                  <span className="w-1.5 h-1.5 rounded-full bg-cockpit-expired" /> Recording
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[11px] font-semibold text-cockpit-cream">FAHG → FAGM</p>
                  <p className="text-[9px] text-cockpit-muted">Hobbs 1.3 h tracked</p>
                </div>
                <span className="rounded-lg bg-cockpit-amber px-2.5 py-1.5 text-[9.5px] font-bold text-cockpit-bg">Stop &amp; log</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
