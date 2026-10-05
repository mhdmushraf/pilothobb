import React from "react";
import { Target, Lock, Globe2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import Seo from "@/components/Seo";

const values = [
  {
    icon: Target,
    title: "Accurate to the tenth",
    text: "Every hour, every reading, every decimal. Pilots deserve tools as precise as the instruments they fly by.",
  },
  {
    icon: Lock,
    title: "Yours, forever",
    text: "Your logbook is your record. Export to PDF anytime — your data is never locked in, even if you cancel.",
  },
  {
    icon: Globe2,
    title: "Built worldwide",
    text: "Aviation connects the world. PilotHobb adapts to any authority, on any continent, wherever you fly.",
  },
];

const stats = [
  { label: "Global", sub: "Any authority" },
  { label: "Recurring", sub: "Decades-long retention" },
  { label: "iOS + Android", sub: "On every device" },
  { label: "Reseller-ready", sub: "Academy seats" },
];

export default function About() {
  return (
    <>
      <Seo
        path="/about"
        title="About PilotHobb — A Modern Replacement for the Paper Logbook"
        description="PilotHobb is a worldwide digital pilot logbook replacing paper: Hobbs and Tach hour tracking, licence currency reminders, aircraft maintenance monitoring, and RPAS drone hours in one place."
      />
      <PageHeader eyebrow="About" title="Made by a pilot, for pilots." />

      {/* Hero image band */}
      <section className="px-4 sm:px-6 -mt-6 mb-2 max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-cockpit-border shadow-xl shadow-cockpit-amber/10">
          <img
            src="https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1600&q=75&auto=format&fit=crop"
            alt="Private aircraft on the ramp at golden hour"
            loading="lazy"
            className="w-full h-52 sm:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cockpit-bg/80 to-transparent" />
        </div>
      </section>

      {/* Story */}
      <section className="px-4 sm:px-6 py-8 max-w-2xl mx-auto">
        <ScrollReveal>
          <p className="text-cockpit-muted text-lg leading-relaxed text-center">
            PilotHobb started with a simple frustration: keeping a logbook and staying current
            takes more admin than it should. Hours to total, renewal dates to count, a physical
            book to keep perfect. We built the app we wished we had — one that handles the
            paperwork so pilots can focus on flying.
          </p>
        </ScrollReveal>
      </section>

      {/* Values */}
      <section className="px-4 sm:px-6 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <ScrollReveal key={v.title} delay={i * 100} className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""}>
                <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-cockpit-amber" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-cockpit-cream mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-cockpit-muted leading-relaxed">{v.text}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Partner / Investor section */}
      <section id="partner" className="px-4 sm:px-6 py-16 max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl bg-cockpit-panel border border-cockpit-amber/30 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cockpit-amber/10 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cockpit-amber/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1">
                <span className="inline-block text-[11px] font-semibold text-cockpit-amber uppercase tracking-[0.15em] mb-3">
                  For Partners & Investors
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-cockpit-cream mb-4 leading-tight">
                  A logbook every pilot needs — and keeps for life.
                </h2>
                <p className="text-cockpit-muted leading-relaxed mb-6 max-w-lg">
                  Pilots everywhere must keep a logbook from the first lesson through every
                  renewal. PilotHobb turns that into a subscription renewed for decades — low churn,
                  recurring revenue, a global market.
                </p>
                <a
                  href="mailto:hello@linkzoneglobal.com"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-cockpit-amber text-cockpit-bg text-sm font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30 hover:-translate-y-0.5 transition-all"
                >
                  Become a launch partner
                </a>
              </div>
              <div className="flex-1 w-full grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-4 text-center">
                    <p className="font-mono text-base font-bold text-cockpit-amber">{s.label}</p>
                    <p className="text-[10px] text-cockpit-muted mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Contact */}
      <section className="px-4 sm:px-6 py-16 max-w-2xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-heading text-3xl font-bold text-cockpit-cream mb-6">Talk to us.</h2>
          <a
            href="mailto:hello@linkzoneglobal.com"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-cockpit-amber text-cockpit-bg font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30 hover:-translate-y-0.5 transition-all"
          >
            hello@linkzoneglobal.com
          </a>
          <p className="text-xs text-cockpit-muted mt-6">
            PilotHobb · a Linkzone Global FZCO venture
          </p>
        </ScrollReveal>
      </section>
    </>
  );
}