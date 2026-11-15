import React from "react";
import { Link } from "react-router-dom";
import { Navigation } from "lucide-react";
import Seo from "@/components/Seo";
import { Breadcrumbs, AuthorCard, FaqList, RelatedCards, CtaBand } from "@/components/marketing/Kit";

const ROWS = [
  ["Total time", "200 h", "Up to 10 h in an approved FSTD"],
  ["Pilot-in-command", "100 h", "Includes PICUS where approved"],
  ["Cross-country PIC", "20 h", "One flight ≥ 300 NM with 2 full-stop landings"],
  ["Instrument time", "10 h", "Max 5 h in FSTD"],
  ["Night flying", "5 h", "5 take-offs + 5 landings at night"],
  ["Instruction (dual)", "As required", "Part 61.06.2"],
];

const TOC = [
  ["Minimum hours at a glance", "#glance"],
  ["How much PIC time is required?", "#pic"],
  ["FAQ", "#faq"],
];

const FAQ = [
  { q: "Does simulator time count towards a SACAA CPL?", a: "Up to 10 hours in an approved FSTD count toward the 200-hour total, and up to 5 of the 10 instrument hours." },
  { q: "Does PICUS count as PIC for the CPL?", a: "Yes, where it is logged under an approved scheme and signed by the instructor. PilotHobb has a separate PICUS column so it is reported correctly." },
  { q: "How long does it take to reach 200 hours?", a: "Most full-time students reach 200 hours in 12–18 months; part-time pilots typically take 2–3 years." },
];

const RELATED = [
  { kind: "Product", label: "Moving map & GPS recording", to: "/moving-map" },
  { kind: "Product", label: "All features", to: "/features" },
  { kind: "Compare", label: "PilotHobb vs LogTen Pro", to: "/compare/pilothobb-vs-logten" },
  { kind: "Product", label: "Pricing", to: "/pricing" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "What hours do you need for a SACAA CPL?",
      author: { "@type": "Person", name: "Muhammed Musharaf" },
      dateModified: "2026-10-27",
      publisher: { "@type": "Organization", name: "PilotHobb" },
    },
    { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

const Tag = ({ children, amber }) => (
  <span className={`rounded-md border px-2 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.15em] ${amber ? "border-cockpit-amber/40 bg-cockpit-amber/10 text-cockpit-amber" : "border-cockpit-border text-cockpit-muted"}`}>{children}</span>
);

export default function GuideCplHours() {
  return (
    <div>
      <Seo
        path="/guides/sacaa-cpl-hour-requirements"
        title="SACAA CPL Hour Requirements: What Hours Do You Need? — PilotHobb"
        description="A SACAA Commercial Pilot Licence (Aeroplane) requires a minimum of 200 hours total time, including 100 hours PIC, 20 hours cross-country PIC, 10 hours instrument and 5 hours night. Each requirement explained."
        jsonLd={jsonLd}
      />

      <section className="ph-container pb-12 pt-10 md:pt-14">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides" }, { label: "SACAA CPL hour requirements" }]} />
        <div className="mt-5 flex flex-wrap gap-2"><Tag amber>Guide</Tag><Tag>8 min read</Tag><Tag>Updated 27 Oct 2026</Tag></div>
        <h1 className="mt-5 max-w-3xl font-heading text-[36px] font-bold leading-[1.08] text-cockpit-cream md:text-[52px]">
          What hours do you need for a SACAA CPL?
        </h1>
        <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-cockpit-muted md:text-[17px]">
          A SACAA Commercial Pilot Licence (Aeroplane) requires a minimum of 200 hours total flight time, including 100 hours as pilot-in-command, 20 hours cross-country PIC, 10 hours instrument time and 5 hours night flying with at least 5 night take-offs and landings. This guide breaks each requirement down and shows how to track them.
        </p>
        <div className="mt-7"><AuthorCard updated="27 Oct 2026" /></div>
      </section>

      <section className="border-t border-cockpit-border py-12 md:py-14">
        <div className="ph-container grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-cockpit-border bg-cockpit-panel p-5">
              <p className="mb-3 font-mono text-[9.5px] font-semibold uppercase tracking-[0.25em] text-cockpit-amber">On this page</p>
              <ul className="space-y-2.5">
                {TOC.map(([label, href]) => (
                  <li key={href}><a href={href} className="text-[13px] text-cockpit-muted transition-colors hover:text-cockpit-cream">{label}</a></li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0">
            <h2 id="glance" className="scroll-mt-24 font-heading text-[24px] font-bold text-cockpit-cream md:text-[28px]">Minimum hours at a glance</h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-cockpit-border bg-cockpit-panel">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="border-b border-cockpit-border text-[11px] uppercase tracking-wider text-cockpit-muted">
                    <th className="px-5 py-3 font-medium">Requirement</th>
                    <th className="px-5 py-3 font-medium">Minimum</th>
                    <th className="px-5 py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(([req, min, note]) => (
                    <tr key={req} className="border-b border-cockpit-border/60 last:border-0">
                      <td className="px-5 py-3.5 text-[14px] font-medium text-cockpit-cream">{req}</td>
                      <td className="px-5 py-3.5 font-mono text-[13.5px] font-bold text-cockpit-amber">{min}</td>
                      <td className="px-5 py-3.5 text-[13px] text-cockpit-muted">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[12px] text-cockpit-muted">Figures from SACAA Civil Aviation Regulations Part 61 — verify against the current CARs before applying.</p>

            <h2 id="pic" className="mt-12 scroll-mt-24 font-heading text-[24px] font-bold text-cockpit-cream md:text-[28px]">How much PIC time is required?</h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-cockpit-muted">
              You need 100 hours as pilot-in-command. Solo time as a student counts as PIC once you hold a valid SPL. PilotHobb's CPL dashboard shows PIC hours against this target automatically, so you can see how many hours remain before applying.
            </p>

            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-cockpit-amber/30 bg-cockpit-amber/[0.06] px-6 py-5 sm:flex-row sm:items-center">
              <p className="flex items-start gap-3 text-[14px] text-cockpit-cream">
                <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-cockpit-amber" />
                Track every one of these targets automatically in PilotHobb's CPL hour dashboard — free for student pilots.
              </p>
              <Link to="/register" className="shrink-0 rounded-xl bg-cockpit-amber px-5 py-2.5 text-[14px] font-bold text-cockpit-bg transition-all hover:brightness-110">Start free</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-cockpit-border py-12 md:py-14">
        <div className="ph-container">
          <h2 className="mb-7 font-heading text-[24px] font-bold text-cockpit-cream md:text-[28px]">FAQ</h2>
          <FaqList items={FAQ} />
        </div>
      </section>

      <RelatedCards title="Keep reading" items={RELATED} />
      <CtaBand />
    </div>
  );
}
