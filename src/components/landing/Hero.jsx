import React from "react";
import ScrollReveal from "@/components/ScrollReveal";
import PhonePreview from "@/components/PhonePreview";

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
        <path d="M3 3.5v17l9-8.5-9-8.5z" fill="#4F46E5"/>
        <path d="M3 3.5l9 8.5 3.5-3.3L4.5 3.5H3z" fill="#191C1E" opacity="0.6"/>
        <path d="M3 20.5l9-8.5 3.5 3.3L4.5 20.5H3z" fill="#6B7280"/>
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

export default function Hero() {
  return (
    <section className="px-4 sm:px-6 pt-24 pb-16 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-8 lg:gap-12">
        {/* Left column */}
        <div className="hero-copy flex-1 w-full">
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
        <ScrollReveal delay={200} className="hero-visual flex-1 w-full flex justify-center">
          <PhonePreview />
        </ScrollReveal>
      </div>
    </section>
  );
}