import React from "react";
import { Home, Compass, Plus, Plane, MoreHorizontal, Navigation, Camera, Check } from "lucide-react";
import MovingMapPhone from "@/components/landing/MovingMapPhone";

/**
 * Tab bar shared by the marketing phone mockups — matches the native app:
 * Home · Map · (+) · Fleet · More.
 */
export function PhoneTabBar({ active = "home" }) {
  const Tab = ({ id, icon: Icon, label }) => (
    <div className="flex flex-1 flex-col items-center gap-0.5">
      <Icon className={`h-3.5 w-3.5 ${active === id ? "text-cockpit-amber" : "text-cockpit-muted"}`} />
      <span className={`text-[7px] ${active === id ? "font-semibold text-cockpit-amber" : "text-cockpit-muted"}`}>{label}</span>
    </div>
  );
  return (
    <div className="flex items-center border-t border-cockpit-border bg-cockpit-panel px-2 pb-2.5 pt-2">
      <Tab id="home" icon={Home} label="Home" />
      <Tab id="map" icon={Compass} label="Map" />
      <div className="flex flex-1 justify-center">
        <div className="-mt-5 flex h-9 w-9 items-center justify-center rounded-full bg-cockpit-amber shadow-lg shadow-cockpit-amber/30">
          <Plus className="h-4 w-4 text-cockpit-bg" />
        </div>
      </div>
      <Tab id="fleet" icon={Plane} label="Fleet" />
      <Tab id="more" icon={MoreHorizontal} label="More" />
    </div>
  );
}

const RECENT = [
  { route: "FAHG → FAGM → FAHG", sub: "ZS-KLM · C172 · Today", time: "1.4" },
  { route: "FAHG local · circuits", sub: "ZS-KLM · C172 · Sat 25 Oct", time: "1.1" },
  { route: "FAHG → FALA", sub: "ZS-PWR · PA-28 · Wed 22 Oct", time: "0.9" },
];

/**
 * Dashboard phone mockup (PilotHobb 2.0) — decorative marketing artwork.
 */
export function DashboardPhone() {
  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 300 }}>
      <div className="relative mx-auto rounded-[44px] bg-cockpit-border p-2 shadow-2xl shadow-black/60" style={{ aspectRatio: "9 / 19" }}>
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[36px] bg-cockpit-bg">
          {/* status bar */}
          <div className="flex items-center justify-between px-4 pt-2.5">
            <span className="font-mono text-[10px] font-semibold text-cockpit-cream">9:41</span>
            <span className="font-mono text-[9px] text-cockpit-cream/70">●●● ᯤ ▮▮▮</span>
          </div>

          <div className="flex-1 overflow-hidden px-3.5 pt-3">
            {/* greeting */}
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[8.5px] text-cockpit-muted">Good afternoon</p>
                <p className="font-heading text-[14px] font-bold leading-tight text-cockpit-cream">Capt. Musharaf</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cockpit-amber/30 bg-cockpit-amber/10 font-mono text-[8px] font-bold text-cockpit-amber">MA</div>
            </div>

            {/* total time */}
            <div className="mb-3 rounded-2xl border border-cockpit-border bg-cockpit-panel p-3">
              <div className="flex items-center justify-between">
                <span className="text-[7.5px] font-semibold uppercase tracking-[0.18em] text-cockpit-muted">Total time</span>
                <span className="rounded-full border border-cockpit-valid/25 bg-cockpit-valid/10 px-1.5 py-0.5 font-mono text-[7px] text-cockpit-valid">+4.2 h this month</span>
              </div>
              <p className="mt-1.5 font-mono text-[30px] font-bold leading-none tracking-wide text-cockpit-amber">
                159.3<span className="ml-1 text-[9px] font-normal text-cockpit-muted">hrs</span>
              </p>
              <div className="mt-2.5 grid grid-cols-4 gap-1">
                {[["84.2", "PIC"], ["71.5", "Dual"], ["6.4", "Night"], ["22.0", "X-ctry"]].map(([v, l]) => (
                  <div key={l}>
                    <p className="font-mono text-[10px] font-semibold text-cockpit-cream">{v}</p>
                    <p className="text-[6.5px] uppercase tracking-wider text-cockpit-muted">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* currency */}
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-cockpit-cream">Currency</span>
              <span className="text-[7.5px] text-cockpit-amber">View all</span>
            </div>
            <div className="mb-3 flex gap-1.5 overflow-hidden">
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-cockpit-valid/30 bg-cockpit-valid/10 px-2 py-1 font-mono text-[7.5px] text-cockpit-valid">
                <Check className="h-2.5 w-2.5" /> Medical · 212d
              </span>
              <span className="shrink-0 rounded-full border border-cockpit-warning/30 bg-cockpit-warning/10 px-2 py-1 font-mono text-[7.5px] text-cockpit-warning">Night · 12d</span>
              <span className="shrink-0 rounded-full border border-cockpit-expired/30 bg-cockpit-expired/10 px-2 py-1 font-mono text-[7.5px] text-cockpit-expired">90-day pax</span>
            </div>

            {/* quick actions */}
            <div className="mb-3 grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5 rounded-xl bg-cockpit-amber px-2.5 py-2">
                <Navigation className="h-3.5 w-3.5 shrink-0 text-cockpit-bg" />
                <div className="min-w-0">
                  <p className="truncate text-[8.5px] font-bold text-cockpit-bg">Start tracking</p>
                  <p className="truncate text-[6.5px] text-cockpit-bg/70">GPS · moving map</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-cockpit-border bg-cockpit-panel px-2.5 py-2">
                <Camera className="h-3.5 w-3.5 shrink-0 text-cockpit-amber" />
                <div className="min-w-0">
                  <p className="truncate text-[8.5px] font-bold text-cockpit-cream">Scan Hobbs</p>
                  <p className="truncate text-[6.5px] text-cockpit-muted">Quick log</p>
                </div>
              </div>
            </div>

            {/* recent flights */}
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-cockpit-cream">Recent flights</span>
              <span className="text-[7.5px] text-cockpit-amber">Logbook</span>
            </div>
            <div className="rounded-xl border border-cockpit-border bg-cockpit-panel px-2.5">
              {RECENT.map((f) => (
                <div key={f.route} className="flex items-center gap-2 border-b border-cockpit-border py-2 last:border-0">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-cockpit-amber/20 bg-cockpit-amber/10">
                    <Plane className="h-3 w-3 text-cockpit-amber" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-[8.5px] font-semibold text-cockpit-cream">{f.route}</p>
                    <p className="truncate text-[7px] text-cockpit-muted">{f.sub}</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-cockpit-cream">{f.time}</span>
                </div>
              ))}
            </div>
          </div>

          <PhoneTabBar active="home" />
        </div>
      </div>
    </div>
  );
}

/**
 * Hero artwork: the dashboard phone behind, the moving-map phone in front.
 * Drawn on a fixed 470 × 632 stage and scaled down on smaller screens so the
 * fine detail inside both phones keeps its proportions.
 */
export default function HeroPhones() {
  return (
    <div className="relative mx-auto h-[430px] w-[320px] sm:h-[538px] sm:w-[400px] lg:h-[632px] lg:w-[470px]" aria-hidden="true">
      <div className="absolute left-0 top-0 h-[632px] w-[470px] origin-top-left scale-[0.68] sm:scale-[0.85] lg:scale-100">
        <div className="absolute left-0 top-[44px] w-[272px]">
          <DashboardPhone />
        </div>
        <div className="absolute right-0 top-0 z-10 w-[290px]">
          <MovingMapPhone />
        </div>
      </div>
    </div>
  );
}
