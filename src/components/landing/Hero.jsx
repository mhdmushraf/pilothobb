import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HobbsCounter from "@/components/HobbsCounter";
import ScrollReveal from "@/components/ScrollReveal";

function AppStoreBadge() {
  return (
    <a href="#" className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-cockpit-panel border border-cockpit-border hover:border-cockpit-amber/30 transition-colors">
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-cockpit-cream" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.14 16.37 3.01 11.68 5.04 8.5c1.01-1.62 2.82-2.65 4.76-2.68 1.28-.03 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
      </svg>
      <div className="text-left leading-none">
        <p className="text-[9px] text-cockpit-muted">Download on the</p>
        <p className="text-sm font-semibold text-cockpit-cream font-heading">App Store</p>
      </div>
    </a>
  );
}

function PlayBadge() {
  return (
    <a href="#" className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-cockpit-panel border border-cockpit-border hover:border-cockpit-amber/30 transition-colors">
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <path d="M3 3.5v17l9-8.5-9-8.5z" fill="#FF9D2E"/>
        <path d="M3 3.5l9 8.5 3.5-3.3L4.5 3.5H3z" fill="#F3ECDD" opacity="0.6"/>
        <path d="M3 20.5l9-8.5 3.5 3.3L4.5 20.5H3z" fill="#8893A8"/>
      </svg>
      <div className="text-left leading-none">
        <p className="text-[9px] text-cockpit-muted">Get it on</p>
        <p className="text-sm font-semibold text-cockpit-cream font-heading">Google Play</p>
      </div>
    </a>
  );
}

function QuickStat({ children }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-cockpit-amber shrink-0" />
      <span className="text-xs sm:text-sm text-cockpit-muted leading-tight">{children}</span>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto" style={{ width: 300 }}>
      {/* Phone frame */}
      <div className="rounded-[2.5rem] bg-gradient-to-b from-[#1A2336] to-[#0A0E17] border border-cockpit-border p-2.5 shadow-2xl shadow-black/50">
        {/* Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0A0E17] rounded-b-2xl z-10" />
        {/* Screen */}
        <div className="rounded-[2rem] bg-cockpit-bg overflow-hidden" style={{ minHeight: 540 }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1">
            <span className="text-[10px] font-mono text-cockpit-cream">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 rounded-sm border border-cockpit-cream/40" />
            </div>
          </div>
          {/* App content */}
          <div className="px-4 pt-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] text-cockpit-muted">Good afternoon</p>
                <p className="text-sm font-bold text-cockpit-cream">Captain Reed</p>
              </div>
              <span className="text-xs font-bold text-cockpit-amber font-heading">PilotHobb</span>
            </div>

            {/* Total Time card */}
            <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 mb-3">
              <p className="text-[9px] font-medium text-cockpit-muted uppercase tracking-widest mb-3">Total Time</p>
              <div className="flex justify-center">
                <HobbsCounter target={159.3} duration={2500} />
              </div>
              <p className="text-center text-[10px] text-cockpit-muted mt-2 font-mono">
                HOURS · <span className="text-cockpit-cream">142</span> LANDINGS
              </p>
            </div>

            {/* Currency chips */}
            <p className="text-[9px] font-medium text-cockpit-muted uppercase tracking-widest mb-2">Currency</p>
            <div className="flex gap-1.5 mb-3">
              <div className="flex-1 rounded-lg bg-cockpit-valid/10 border border-cockpit-valid/20 p-2 text-center">
                <p className="text-[8px] text-cockpit-muted truncate">Medical</p>
                <p className="font-mono text-sm font-bold text-cockpit-valid">184d</p>
              </div>
              <div className="flex-1 rounded-lg bg-cockpit-warning/10 border border-cockpit-warning/20 p-2 text-center">
                <p className="text-[8px] text-cockpit-muted truncate">Night</p>
                <p className="font-mono text-sm font-bold text-cockpit-warning">12d</p>
              </div>
              <div className="flex-1 rounded-lg bg-cockpit-valid/10 border border-cockpit-valid/20 p-2 text-center">
                <p className="text-[8px] text-cockpit-muted truncate">IR</p>
                <p className="font-mono text-sm font-bold text-cockpit-valid">61d</p>
              </div>
            </div>

            {/* Recent flights preview */}
            <p className="text-[9px] font-medium text-cockpit-muted uppercase tracking-widest mb-2">Recent Flights</p>
            <div className="rounded-xl bg-cockpit-panel border border-cockpit-border px-3 py-1">
              {[
                { route: "FAGG–FAOH", time: "1.4", role: "PIC" },
                { route: "FAOH–FALA", time: "0.8", role: "Dual" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 py-2 border-b border-cockpit-border last:border-0">
                  <div className="w-6 h-6 rounded bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center shrink-0">
                    <span className="text-[8px] text-cockpit-amber">✈</span>
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-cockpit-cream flex-1">{f.route}</span>
                  <span className="text-[7px] text-cockpit-amber bg-cockpit-amber/10 px-1 rounded">{f.role}</span>
                  <span className="font-mono text-[10px] font-bold text-cockpit-cream">{f.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Amber glow behind phone */}
      <div className="absolute inset-0 -z-10 bg-cockpit-amber/10 rounded-full blur-3xl scale-110" />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="px-4 sm:px-6 pt-24 pb-16 max-w-6xl mx-auto">
      <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-12">
        {/* Left column */}
        <div className="flex-1 w-full">
          <ScrollReveal>
            <span className="inline-block text-[11px] font-semibold text-cockpit-amber uppercase tracking-[0.15em] mb-4">
              Digital Pilot Logbook · Worldwide
            </span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-cockpit-cream leading-[1.1] mb-5">
              Your logbook, down to the{" "}
              <span className="text-cockpit-amber">tenth of an hour.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-cockpit-muted text-base sm:text-lg leading-relaxed mb-7 max-w-lg">
              Log every flight from the Hobbs reading, track exam and licence currency to the
              day, and export a clean logbook for any authority — wherever you fly.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="flex flex-wrap gap-3 mb-8">
              <AppStoreBadge />
              <PlayBadge />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <QuickStat>
                <span className="text-cockpit-cream font-semibold">159.3 hrs</span> logged in seconds
              </QuickStat>
              <QuickStat>Any licensing authority</QuickStat>
              <QuickStat>
                <span className="text-cockpit-cream font-semibold">0</span> renewal dates missed
              </QuickStat>
            </div>
          </ScrollReveal>
        </div>

        {/* Right column — phone */}
        <ScrollReveal delay={200} className="flex-1 w-full flex justify-center">
          <PhoneMockup />
        </ScrollReveal>
      </div>
    </section>
  );
}