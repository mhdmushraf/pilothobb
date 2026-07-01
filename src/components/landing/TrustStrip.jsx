import React from "react";
import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { value: "Hobbs / Tach", label: "Time sources" },
  { value: "Currency", label: "Tracked to the day" },
  { value: "PDF", label: "Export ready" },
  { value: "iOS + Android", label: "On every device" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-cockpit-border bg-cockpit-panel/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-semibold text-cockpit-cream whitespace-nowrap">
              Built for how pilots actually log
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {stats.map((s) => (
                <div key={s.value} className="text-center md:text-left">
                  <p className="font-mono text-sm font-bold text-cockpit-amber">{s.value}</p>
                  <p className="text-[10px] text-cockpit-muted uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}