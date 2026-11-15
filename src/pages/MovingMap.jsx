import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Seo from "@/components/Seo";
import { Breadcrumbs, FaqList, RelatedCards, CtaBand } from "@/components/marketing/Kit";
import LiveVfrMap from "@/components/marketing/LiveVfrMap";

const TLDR = [
  "Live GPS: ground speed, altitude, track and vertical speed",
  "Airspace shown for CTR, TMA and danger areas along your route",
  "Flight logged with Hobbs time, route and GPS track when you land",
  "Included in the CPL plan — R499/yr",
];

const STEPS = [
  { n: "1", title: "Start tracking", desc: "One tap on the dashboard or from a scheduled flight" },
  { n: "2", title: "Fly", desc: "Moving map with your position, track and nearest aerodromes" },
  { n: "3", title: "Land", desc: "Tap stop — flight time, route and track are captured" },
  { n: "4", title: "Confirm", desc: "Hobbs, route and track pre-filled — save to logbook" },
];

const FAQ = [
  { q: "Does the moving map work without mobile signal?", a: "GPS itself does not need mobile data, so your position and track keep recording. Map and chart tiles need a connection to load, so open the area you plan to fly before you lose signal." },
  { q: "Is the GPS track accepted as proof of flight by SACAA?", a: "The logbook entry remains the legal record. The GPS track is attached to the entry as supporting evidence." },
  { q: "Which airspace data does PilotHobb use?", a: "Airspace and aerodromes come from the open flightmaps community database for South Africa. It is not certified aeronautical data and must not be used as your primary means of navigation — always carry current official charts." },
  { q: "Can I use it on a tablet in the cockpit?", a: "Yes. The map runs on phones and tablets. Keep the device on power — continuous GPS recording uses noticeably more battery." },
];

const RELATED = [
  { kind: "Guide", label: "SACAA CPL hour requirements", to: "/guides/sacaa-cpl-hour-requirements" },
  { kind: "Product", label: "All features", to: "/features" },
  { kind: "Compare", label: "PilotHobb vs LogTen Pro", to: "/compare/pilothobb-vs-logten" },
  { kind: "Product", label: "Pricing", to: "/pricing" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function MovingMap() {
  return (
    <div>
      <Seo
        path="/moving-map"
        title="Moving Map & GPS Flight Recording for Pilots — PilotHobb"
        description="PilotHobb's moving map shows your live GPS position on a VFR map with South African airspace and aerodromes, and saves the flight time, route and GPS track to your logbook when you land."
        jsonLd={jsonLd}
      />

      <section className="ph-container pb-14 pt-10 md:pt-14">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Product", to: "/features" }, { label: "Moving map" }]} />
        <h1 className="mt-6 max-w-3xl font-heading text-[36px] font-bold leading-[1.08] text-cockpit-cream md:text-[52px]">
          A moving map that logs the flight for you
        </h1>
        <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-cockpit-muted md:text-[17px]">
          PilotHobb's moving map shows your live GPS position on a VFR map with South African airspace, aerodromes and your planned route. When you land, the flight time, route and GPS track are saved to your logbook — no typing.
        </p>

        <div className="mt-7 max-w-3xl rounded-2xl border border-cockpit-amber/40 bg-cockpit-panel px-6 py-5">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-cockpit-amber">TL;DR</p>
          <ul className="space-y-2.5">
            {TLDR.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[14px] text-cockpit-cream">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cockpit-valid" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/download" className="rounded-xl bg-cockpit-amber px-6 py-3 text-[14px] font-bold text-cockpit-bg transition-all hover:brightness-110">Get the app</Link>
          <Link to="/pricing" className="rounded-xl border border-cockpit-border bg-cockpit-panel px-6 py-3 text-[14px] font-bold text-cockpit-cream transition-all hover:bg-cockpit-panel-light">See pricing</Link>
        </div>

      </section>

      <section className="pb-14">
        <div className="ph-container">
          <h2 className="font-heading text-[26px] font-bold text-cockpit-cream md:text-[32px]">Live South African airspace map</h2>
          <p className="mb-6 mt-3 max-w-3xl text-[15px] leading-relaxed text-cockpit-muted">
            Control zones, TMAs, danger, restricted and prohibited areas and aerodromes across South Africa. Hover an area for its name and limits, switch layers on and off, and tap “Show my position” to see your own GPS position and track on the chart.
          </p>
          <LiveVfrMap />
        </div>
      </section>

      <section className="border-t border-cockpit-border py-14 md:py-16">
        <div className="ph-container">
          <h2 className="font-heading text-[26px] font-bold text-cockpit-cream md:text-[32px]">How does GPS flight recording work?</h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-cockpit-muted">
            Tap Start tracking before take-off. PilotHobb records your position using the phone's GPS and draws your track on the map. When you stop, it opens a pre-filled logbook entry for you to confirm.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-cockpit-border bg-cockpit-panel p-5">
                <p className="font-mono text-[22px] font-bold text-cockpit-amber">{s.n}</p>
                <h3 className="mt-2 font-heading text-[16px] font-semibold text-cockpit-cream">{s.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-cockpit-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-cockpit-border py-14 md:py-16">
        <div className="ph-container">
          <h2 className="mb-7 font-heading text-[26px] font-bold text-cockpit-cream md:text-[32px]">Frequently asked questions</h2>
          <FaqList items={FAQ} />
        </div>
      </section>

      <RelatedCards title="Related" items={RELATED} />
      <CtaBand />
    </div>
  );
}
