import React from "react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import Seo from "@/components/Seo";

const TAGS = {
  New: "bg-cockpit-amber/15 text-cockpit-amber border-cockpit-amber/25",
  Improved: "bg-cockpit-glow-blue/15 text-cockpit-glow-blue border-cockpit-glow-blue/25",
  Fixed: "bg-cockpit-valid/15 text-cockpit-valid border-cockpit-valid/25",
};

const releases = [
  {
    version: "Preview",
    date: "August 2026",
    changes: [
      ["New", "Brand refresh — new indigo “Aero-Modernist” theme and the PilotHobb wing logo across the app."],
      ["New", "Ten new tools: Flight Analytics, Currency Tracker, Aircraft Schedule, Quick Checklists, Export, Flight Map, Maintenance Log, Pilot Notes, Aerodrome Directory and Goals."],
      ["New", "Public pages: FAQ, RPAS/Drone, Security, Download, Privacy and Terms."],
      ["Improved", "Marketing pages redesigned with real aviation imagery."],
    ],
  },
  {
    version: "Foundations",
    date: "Earlier 2026",
    changes: [
      ["New", "Hobbs/Tach auto-totalling with stops and touch-and-go counts."],
      ["New", "Currency tracking for licences, medicals, ratings and exams."],
      ["New", "Page-replica PDF export and endorsements with photos."],
      ["New", "Separate RPAS (drone) hour logging with mission and operation categories."],
    ],
  },
];

export default function Changelog() {
  return (
    <>
      <Seo
        path="/changelog"
        title="What's New — PilotHobb Changelog"
        description="The latest updates, improvements and new features in PilotHobb, the digital pilot logbook for manned and drone (RPAS) flying."
      />
      <PageHeader eyebrow="Product" title="What's new" subtitle="Every improvement to your logbook, in one place." />

      <section className="px-4 sm:px-6 pb-24 max-w-3xl mx-auto">
        <div className="space-y-12">
          {releases.map((r) => (
            <ScrollReveal key={r.version}>
              <div className="relative pl-6 border-l-2 border-cockpit-border">
                <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-cockpit-amber" />
                <div className="flex items-baseline gap-3 mb-4">
                  <h2 className="font-heading text-xl font-bold text-cockpit-cream">{r.version}</h2>
                  <span className="text-xs text-cockpit-muted">{r.date}</span>
                </div>
                <ul className="space-y-3">
                  {r.changes.map(([tag, text], i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${TAGS[tag]}`}>
                        {tag}
                      </span>
                      <span className="text-sm text-cockpit-muted leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <p className="text-center text-xs text-cockpit-muted mt-14">
            Have a feature request? We’d love to hear it — reach us on the contact page.
          </p>
        </ScrollReveal>
      </section>
    </>
  );
}
