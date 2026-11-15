import React from "react";
import { Check, Minus } from "lucide-react";
import Seo from "@/components/Seo";
import { Breadcrumbs, AuthorCard, FaqList, RelatedCards, CtaBand } from "@/components/marketing/Kit";

const Y = "yes";
const N = "no";
const ROWS = [
  ["Price", "Free · R499/yr CPL", "$79.99/yr (≈ R1,450)", true],
  ["Hobbs before/after logging", Y, N],
  ["SACAA-shaped export", Y, N],
  ["Live moving map + GPS track", Y, N],
  ["Currency tracking", Y, Y],
  ["Airline / EASA FTL reports", N, Y],
  ["Drone / RPAS logbook", Y, N],
  ["Platforms", "iOS · Android · Web", "iOS · macOS", true],
  ["Free plan", "50 flights, 3 aircraft", "Trial only", true],
];

const FAQ = [
  { q: "Is PilotHobb available on Mac?", a: "PilotHobb runs in any browser on Mac and Windows, plus iOS and Android apps. There is no dedicated macOS app." },
  { q: "Can I get my data out of PilotHobb?", a: "Yes. CSV export is free on every plan, and you can export your logbook to PDF at any time." },
];

const RELATED = [
  { kind: "Product", label: "Moving map & GPS recording", to: "/moving-map" },
  { kind: "Guide", label: "SACAA CPL hour requirements", to: "/guides/sacaa-cpl-hour-requirements" },
  { kind: "Product", label: "All features", to: "/features" },
  { kind: "Product", label: "Pricing", to: "/pricing" },
];

function Cell({ v, amber }) {
  if (v === Y) return <Check className="h-4 w-4 text-cockpit-valid" aria-label="Yes" />;
  if (v === N) return <Minus className="h-4 w-4 text-cockpit-expired" aria-label="No" />;
  return <span className={`text-[13px] ${amber ? "font-semibold text-cockpit-amber" : "text-cockpit-muted"}`}>{v}</span>;
}

export default function CompareLogten() {
  return (
    <div>
      <Seo
        path="/compare/pilothobb-vs-logten"
        title="PilotHobb vs LogTen Pro (2026): Which Pilot Logbook? — PilotHobb"
        description="A like-for-like comparison of PilotHobb and LogTen Pro: price, Hobbs logging, SACAA exports, moving map, currency tracking, drone logging and platforms."
      />

      <section className="ph-container pb-12 pt-10 md:pt-14">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Compare" }, { label: "PilotHobb vs LogTen Pro" }]} />
        <h1 className="mt-6 max-w-3xl font-heading text-[36px] font-bold leading-[1.08] text-cockpit-cream md:text-[52px]">
          PilotHobb vs LogTen Pro (2026)
        </h1>
        <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-cockpit-muted md:text-[17px]">
          LogTen Pro is a mature, airline-oriented logbook priced in US dollars. PilotHobb is built for South African and training pilots: Hobbs before/after logging, SACAA-shaped exports, a live moving map, and a free student plan. Below is a like-for-like comparison.
        </p>
        <div className="mt-7"><AuthorCard updated="27 Oct 2026" /></div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-cockpit-border bg-cockpit-panel">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-cockpit-border text-[11px] uppercase tracking-wider text-cockpit-muted">
                <th className="px-5 py-3 font-medium">Feature</th>
                <th className="px-5 py-3 font-medium">PilotHobb</th>
                <th className="px-5 py-3 font-medium">LogTen Pro</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([f, a, b, text]) => (
                <tr key={f} className="border-b border-cockpit-border/60 last:border-0">
                  <td className="px-5 py-3.5 text-[14px] font-medium text-cockpit-cream">{f}</td>
                  <td className="px-5 py-3.5"><Cell v={a} amber={text} /></td>
                  <td className="px-5 py-3.5"><Cell v={b} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-cockpit-muted">Prices checked 27 Oct 2026. LogTen Pro is a trademark of Coradine Aviation Systems; feature list from their public site.</p>
      </section>

      <section className="border-t border-cockpit-border py-12 md:py-14">
        <div className="ph-container">
          <h2 className="mb-7 font-heading text-[24px] font-bold text-cockpit-cream md:text-[28px]">Which should you choose?</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-cockpit-amber/50 bg-cockpit-panel p-6">
              <h3 className="font-heading text-[17px] font-semibold text-cockpit-amber">Choose PilotHobb if…</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-cockpit-muted">You train or fly in South Africa, log from a Hobbs meter, need SACAA-shaped exports, or want a moving map and GPS tracks in the same app.</p>
            </div>
            <div className="rounded-2xl border border-cockpit-border bg-cockpit-panel p-6">
              <h3 className="font-heading text-[17px] font-semibold text-cockpit-cream">Choose LogTen Pro if…</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-cockpit-muted">You fly for an airline under EASA or FAA FTL rules, need crew duty reports, and live in the Apple ecosystem.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-cockpit-border py-12 md:py-14">
        <div className="ph-container">
          <h2 className="mb-7 font-heading text-[24px] font-bold text-cockpit-cream md:text-[28px]">FAQ</h2>
          <FaqList items={FAQ} />
        </div>
      </section>

      <RelatedCards title="More comparisons" items={RELATED} />
      <CtaBand />
    </div>
  );
}
