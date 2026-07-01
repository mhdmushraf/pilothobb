import React from "react";
import { Link } from "react-router-dom";
import { Compass, Globe2, ShieldCheck, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";

const values = [
  {
    icon: Compass,
    title: "Precision first",
    text: "Every hour, every reading, every decimal. Pilots deserve tools as precise as the instruments they fly by.",
  },
  {
    icon: Globe2,
    title: "Borderless",
    text: "Avation connects the world. PilotHobb works for pilots under any authority, on any continent.",
  },
  {
    icon: ShieldCheck,
    title: "Yours, always",
    text: "Your logbook is your record. We build tools to maintain it — never to lock it away.",
  },
];

export default function About() {
  return (
    <>
      <PageHeader
        title="For pilots, by pilots"
        subtitle="PilotHobb was born from a simple frustration: logging flights shouldn't feel like paperwork."
      />

      <section className="px-4 py-10 max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-8 sm:p-10">
            <h2 className="font-heading text-2xl font-bold text-cockpit-cream mb-4">Our story</h2>
            <div className="space-y-4 text-cockpit-muted leading-relaxed">
              <p>
                PilotHobb started in a dim crew room, scribbling readings into a paper logbook
                after a long cross-country. The Hobbs meter said 159.3 — and we thought, why
                doesn't a digital logbook feel as precise and calm as that counter?
              </p>
              <p>
                Most logbook apps are either spreadsheets dressed up as apps, or bloated
                enterprise tools that forget what it's like to actually sit in a cockpit.
                We wanted something different: a tool that feels like an instrument panel —
                dark, precise, premium, and calm.
              </p>
              <p>
                So we built PilotHobb. It tracks your Hobbs and Tach readings, computes flight
                time automatically, watches your currency, and keeps your career milestones —
                all in one place that feels like home base.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="px-4 py-10 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <ScrollReveal key={v.title} delay={i * 100}>
                <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 h-full">
                  <div className="w-10 h-10 rounded-lg bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-cockpit-amber" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-cockpit-cream mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-cockpit-muted leading-relaxed">{v.text}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16 max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <div className="rounded-2xl bg-cockpit-panel-light border border-cockpit-border p-8">
            <h2 className="font-heading text-xl font-bold text-cockpit-cream mb-2">
              Linkzone Global FZCO
            </h2>
            <p className="text-sm text-cockpit-muted leading-relaxed max-w-md mx-auto">
              PilotHobb is developed by Linkzone Global FZCO. We are an independent technology
              company and are not affiliated with any aviation authority. PilotHobb is a
              personal tracking tool — always verify your official records with your authority.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="px-4 py-10">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto rounded-3xl bg-cockpit-panel border border-cockpit-border p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cockpit-amber/5 to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="font-heading text-2xl font-bold text-cockpit-cream mb-3">
                Start your logbook today
              </h2>
              <p className="text-cockpit-muted mb-6">
                Free to begin. No credit card required.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-cockpit-amber text-cockpit-bg font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30 hover:-translate-y-0.5 transition-all"
              >
                Get the app <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}