import React from "react";
import { Link } from "react-router-dom";
import { Check, Gauge, ShieldCheck, FileDown, Apple, Play, ArrowRight, MoveRight } from "lucide-react";
import Seo from "@/components/Seo";
import PhonePreview from "@/components/PhonePreview";
import LandingNav from "@/components/landing/LandingNav";
import MovingMapPhone from "@/components/landing/MovingMapPhone";
import FeatureGrid from "@/components/landing/FeatureGrid";
import PricingCards from "@/components/landing/PricingCards";
import LandingFooter from "@/components/landing/LandingFooter";

const PROOF = ["Free for student pilots", "SACAA · FAA · EASA · CASA", "No card required"];
const AUTHORITIES = ["SACAA", "FAA", "EASA", "UK CAA", "CASA", "GCAA"];

const WHY = [
  {
    icon: Gauge,
    title: "Log from the Hobbs",
    desc: "Enter reading before and after. Flight time computes to one decimal — just like the meter.",
    stat: "1593.4 → 1594.8",
  },
  {
    icon: ShieldCheck,
    title: "Currency, never guessed",
    desc: "Licences, ratings, medicals — colour-coded by days remaining. You always know where you stand.",
    stat: "Medical · 212 d",
  },
  {
    icon: FileDown,
    title: "Your logbook, page for page",
    desc: "Export a clean, authority-ready logbook. Every page, every entry, every tenth accounted for.",
    stat: "CA 61-91 · PDF",
  },
];

const MAP_POINTS = [
  "Track-up map with ground speed, altitude, track and VS",
  "CTR / TMA / danger-area warnings before you enter them",
  "Nearest aerodromes with distance and bearing, one tap away",
  "GPS track attached to the logbook entry — proof of flight",
];

const landingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
  {
    "@type": "Organization",
    "@id": "https://pilothobb.com/#org",
    "name": "PilotHobb",
    "url": "https://pilothobb.com",
    "email": "hello@linkzoneglobal.com",
    "logo": "https://media.base44.com/images/public/6a455fc5475b58bb52305622/1a9086f0b_pilothobb-icon-appstore-1024.png"
  },
  {
    "@type": "SoftwareApplication",
    "name": "PilotHobb",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "url": "https://pilothobb.com",
    "publisher": { "@id": "https://pilothobb.com/#org" },
    "description": "Digital pilot logbook for tracking flight hours from Hobbs or Tach readings, licence and medical currency, aircraft maintenance, and RPAS drone hours.",
    "featureList": [
    "Log flights from Hobbs or Tach meter readings",
    "Scan the Hobbs meter with your camera",
    "Automatic touch-and-go landing and take-off totals",
    "Licence, medical and rating expiry tracking",
    "Aircraft maintenance monitoring (MPI and oil hours)",
    "RPAS drone hours tracked separately from manned hours",
    "Career summary and logbook PDF export"]

  },
  {
    "@type": "FAQPage",
    "mainEntity": [
    { "@type": "Question", "name": "Does PilotHobb track drone (RPAS) hours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. PilotHobb tracks RPAS drone hours in a separate total from manned aeroplane and helicopter hours, because aviation authorities require remote pilot time to be logged separately. Drone flights record mission type, VLOS/BVLOS operation category, battery cycles and observer, and roll into their own RPAS totals." } },
    { "@type": "Question", "name": "Can I log flights using Hobbs or Tach time?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Each aircraft is set to either Hobbs or Tach as its time source. When logging a flight, PilotHobb pre-fills the reading before from the aircraft's last known meter value, you enter the reading after, and flight time is calculated automatically. You can also scan the meter with your phone camera instead of typing it." } },
    { "@type": "Question", "name": "Does PilotHobb track licence and medical expiry?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. PilotHobb tracks licences, ratings, medicals, theory exam validity and English proficiency, showing days remaining with colour-coded status and surfacing the nearest expiry so nothing lapses." } },
    { "@type": "Question", "name": "Which aviation authorities does PilotHobb support?", "acceptedAnswer": { "@type": "Answer", "text": "PilotHobb supports pilots under SACAA, FAA, EASA, UK CAA and CASA, for both manned licences (Student, PPL, CPL, ATPL) and remote pilot licences such as SACAA RPL and FAA Part 107." } },
    { "@type": "Question", "name": "How is a touch-and-go counted in PilotHobb?", "acceptedAnswer": { "@type": "Answer", "text": "Each touch-and-go counts as one landing and one take-off. PilotHobb totals them automatically from the intermediate stops you add to a route, plus the initial take-off and the final full-stop landing." } }]

  }]

};

function Eyebrow({ children }) {
  return (
    <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-cockpit-amber">
      {children}
    </span>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-cockpit-bg font-body text-cockpit-cream">
      <Seo
        path="/"
        title="PilotHobb — Digital Pilot Logbook for Flight Hours, Currency & Drone Hours"
        description="PilotHobb is a digital pilot logbook that tracks flight hours from your Hobbs or Tach meter, licence and medical expiry, aircraft maintenance, and RPAS drone hours separately. For SACAA, FAA, EASA and UK CAA pilots."
        jsonLd={landingJsonLd}
      />

      <LandingNav />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cockpit-amber/25 bg-cockpit-amber/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cockpit-amber">
                <span className="h-1.5 w-1.5 rounded-full bg-cockpit-amber" />
                New · Live moving map with GPS flight recording
              </span>

              <h1 className="mb-5 mt-6 font-heading text-[40px] font-bold leading-[1.03] md:text-[58px]">
                Every flight, down to the <span className="text-cockpit-amber">tenth of an hour.</span>
              </h1>

              <p className="mb-8 max-w-xl text-[17px] leading-relaxed text-cockpit-muted md:text-[19px]">
                The pilot logbook that reads your Hobbs meter, tracks your currency, and now flies with you — a live VFR moving map that logs the flight for you when you land.
              </p>

              <div className="mb-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/download"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-cockpit-amber px-6 py-3.5 text-[14px] font-bold text-cockpit-bg transition-all hover:brightness-110 active:scale-[0.99]"
                >
                  <Apple className="h-5 w-5" /> Download on the App Store
                </Link>
                <Link
                  to="/download"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-cockpit-border bg-cockpit-panel px-6 py-3.5 text-[14px] font-bold text-cockpit-cream transition-all hover:bg-cockpit-panel-light"
                >
                  <Play className="h-5 w-5" /> Get it on Google Play
                </Link>
              </div>

              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-cockpit-muted">
                {PROOF.map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-cockpit-valid" /> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex justify-center">
              <div className="pointer-events-none absolute inset-0 -m-12 rounded-full bg-cockpit-amber/10 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <PhonePreview />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-y border-cockpit-border bg-cockpit-bg">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-4 py-6 md:flex-row md:gap-10 md:px-8">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-cockpit-muted">
              Built for every authority
            </span>
            <div className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-between">
              {AUTHORITIES.map((a, i) => (
                <React.Fragment key={a}>
                  {i > 0 && <span className="text-cockpit-border">·</span>}
                  <span className="font-mono text-[13px] text-cockpit-muted">{a}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="mb-14 max-w-2xl">
              <Eyebrow>Why PilotHobb</Eyebrow>
              <h2 className="mt-4 font-heading text-[30px] font-bold leading-tight md:text-[42px]">
                Built like a cockpit, not a spreadsheet.
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {WHY.map(({ icon: Icon, title, desc, stat }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-cockpit-border bg-cockpit-panel p-7 transition-colors hover:border-cockpit-amber/30"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-cockpit-amber/20 bg-cockpit-amber/10">
                    <Icon className="h-5 w-5 text-cockpit-amber" />
                  </div>
                  <h3 className="mb-2 font-heading text-[19px] font-semibold">{title}</h3>
                  <p className="text-[14px] leading-relaxed text-cockpit-muted">{desc}</p>
                  <p className="mt-5 font-mono text-[12px] tracking-wide text-cockpit-amber">{stat}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MOVING MAP */}
        <section id="moving-map" className="border-y border-cockpit-border bg-cockpit-panel py-20 md:py-28">
          <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 md:px-8 lg:grid-cols-2">
            <div className="order-2 flex justify-center lg:order-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 -m-10 rounded-full bg-cockpit-amber/10 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <MovingMapPhone />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Eyebrow>New · Moving map</Eyebrow>
              <h2 className="mb-5 mt-4 font-heading text-[30px] font-bold leading-tight md:text-[42px]">
                Fly with it. It logs the flight for you.
              </h2>
              <p className="max-w-xl text-[16px] leading-relaxed text-cockpit-muted md:text-[17px]">
                Live GPS position on a VFR map with airspace, aerodromes and your planned route. Tap stop when you land and the Hobbs time, route and track are already in your logbook.
              </p>
              <ul className="mt-8 space-y-3.5">
                {MAP_POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[14.5px] text-cockpit-cream">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cockpit-valid" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/features"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-cockpit-amber px-6 py-3.5 text-[14px] font-bold text-cockpit-bg transition-all hover:brightness-110"
              >
                See the moving map <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="mb-14 max-w-2xl">
              <Eyebrow>Everything a working pilot needs</Eyebrow>
              <h2 className="mt-4 font-heading text-[30px] font-bold leading-tight md:text-[42px]">
                One app. The whole career.
              </h2>
            </div>
            <FeatureGrid />
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-t border-cockpit-border py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="mb-14 max-w-2xl">
              <Eyebrow>Pricing</Eyebrow>
              <h2 className="mt-4 font-heading text-[30px] font-bold leading-tight md:text-[42px]">
                Free to start. R499 a year when you mean it.
              </h2>
              <p className="mt-4 text-[16px] text-cockpit-muted">
                No card required for the free plan. Cancel anytime.
              </p>
            </div>
            <PricingCards />
            <p className="mt-8 flex items-center gap-2 text-[13px] text-cockpit-muted">
              <MoveRight className="h-4 w-4 text-cockpit-amber" />
              Prices in ZAR. CSV export is free on every plan.
              <Link to="/pricing" className="font-semibold text-cockpit-amber hover:underline">Compare plans</Link>
            </p>
          </div>
        </section>

        {/* CTA BAND */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-[1100px] px-4 md:px-8">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-cockpit-amber to-cockpit-warning px-6 py-14 text-center md:px-16 md:py-16">
              <h2 className="font-heading text-[28px] font-bold leading-tight text-cockpit-bg md:text-[42px]">
                Preflight check complete.
              </h2>
              <p className="mx-auto mt-3 mb-8 max-w-xl text-[16px] text-cockpit-bg/80 md:text-[18px]">
                Download PilotHobb and log your next flight down to the tenth.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/download"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-cockpit-bg px-6 py-3.5 text-[14px] font-semibold text-cockpit-cream transition-all hover:bg-cockpit-panel-light"
                >
                  <Apple className="h-5 w-5" /> App Store
                </Link>
                <Link
                  to="/download"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-cockpit-bg px-6 py-3.5 text-[14px] font-semibold text-cockpit-cream transition-all hover:bg-cockpit-panel-light"
                >
                  <Play className="h-5 w-5" /> Google Play
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}