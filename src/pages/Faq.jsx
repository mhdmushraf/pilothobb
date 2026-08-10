import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import Seo from "@/components/Seo";

const groups = [
  {
    title: "Getting started",
    items: [
      { q: "What is PilotHobb?", a: "A digital pilot logbook for manned aircraft and drones (RPAS). It records your flights, totals your hours from the Hobbs or Tach reading, tracks licence and medical currency, and exports an authority-ready PDF." },
      { q: "Which authority does it work for?", a: "PilotHobb is built around how pilots log worldwide and adapts to FAA, EASA, UK CAA, CASA, SACAA and more. You remain responsible for meeting your own authority’s specific requirements." },
      { q: "Do I need an internet connection?", a: "You can review your logbook on any device. Entries sync to your account so your records are safe even if you change phones." },
    ],
  },
  {
    title: "Logging flights",
    items: [
      { q: "Hobbs or Tach — which do I use?", a: "You choose per aircraft. Set it once; PilotHobb pre-fills the ‘before’ reading and totals your flight time from the ‘after’ reading automatically." },
      { q: "Can I add stops and touch-and-go’s?", a: "Yes. Add intermediate stops and a touch-and-go count at each, and landings and take-offs add up automatically." },
      { q: "Does the camera really read the meter?", a: "Camera meter scanning points your phone at the Hobbs or Tach and reads the digits into the entry. It’s rolling out after launch and is included in the Pilot Pro plan." },
    ],
  },
  {
    title: "Currency & records",
    items: [
      { q: "How does currency tracking work?", a: "Medicals, ratings, theory exams and English proficiency renewal dates are worked out from your entries — green while valid, amber as they near, red when they lapse." },
      { q: "Can I export my logbook?", a: "Any time. Pick a page range and export a clean PDF, or export everything to CSV. Your records are never locked in." },
      { q: "Are endorsements supported?", a: "Yes — each endorsement is kept as a record with the actual page captured alongside it, so your logbook is complete and verifiable." },
    ],
  },
  {
    title: "Drones (RPAS)",
    items: [
      { q: "Can I log drone hours too?", a: "Yes. RPAS time is tracked separately from manned time, with fields for mission type, operation category (VLOS/EVLOS/BVLOS), battery cycles and observer — so your drone and aircraft records never mix." },
    ],
  },
  {
    title: "Billing & data",
    items: [
      { q: "What happens to my data if I cancel?", a: "It stays yours. Export to PDF or CSV anytime — cancelling never deletes your ability to take your logbook with you." },
      { q: "Is there a plan for flight schools?", a: "Yes — the Academy plan offers per-seat pricing, student oversight and school branding. Reach out via the contact page." },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((g) =>
    g.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    }))
  ),
};

export default function Faq() {
  return (
    <>
      <Seo
        path="/faq"
        title="FAQ — PilotHobb Digital Pilot Logbook"
        description="Answers to common questions about PilotHobb: Hobbs vs Tach logging, currency tracking, PDF export, drone (RPAS) hours, billing and your data."
        jsonLd={faqJsonLd}
      />
      <PageHeader eyebrow="Help" title="Frequently asked questions" subtitle="Everything you need to know about logging with PilotHobb." />

      {/* Hero image band */}
      <section className="px-4 sm:px-6 -mt-6 mb-10 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-cockpit-border shadow-xl shadow-cockpit-amber/10">
          <img
            src="https://images.unsplash.com/photo-1559060017-445fb9722f2a?w=1600&q=75&auto=format&fit=crop"
            alt="Clouds at altitude"
            loading="lazy"
            className="w-full h-40 sm:h-52 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cockpit-bg/85 to-transparent" />
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16 max-w-3xl mx-auto space-y-12">
        {groups.map((g) => (
          <ScrollReveal key={g.title}>
            <div>
              <h2 className="font-heading text-lg font-bold text-cockpit-amber uppercase tracking-wide mb-4">{g.title}</h2>
              <div className="space-y-4">
                {g.items.map((it) => (
                  <div key={it.q} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-5">
                    <h3 className="text-sm font-semibold text-cockpit-cream mb-2">{it.q}</h3>
                    <p className="text-sm text-cockpit-muted leading-relaxed">{it.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>

      <section className="px-4 sm:px-6 pb-24 max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-cockpit-muted">
            Still have a question?{" "}
            <Link to="/contact" className="text-cockpit-amber font-semibold">Get in touch</Link>.
          </p>
        </ScrollReveal>
      </section>
    </>
  );
}
