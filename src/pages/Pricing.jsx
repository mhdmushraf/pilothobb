import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Start logging your flights today.",
    features: [
      "Up to 50 flights",
      "2 aircraft in your fleet",
      "Dashboard with running totals",
      "Currency expiry tracking",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$8",
    period: "per month",
    description: "For the active private pilot.",
    features: [
      "Unlimited flights",
      "Unlimited aircraft",
      "All currency & document tracking",
      "PDF export (coming soon)",
      "Multi-device sync",
    ],
    cta: "Get the app",
    highlighted: true,
  },
  {
    name: "Pro+",
    price: "$15",
    period: "per month",
    description: "For career-track pilots.",
    features: [
      "Everything in Pro",
      "Career milestones & goals",
      "Advanced analytics",
      "Camera logbook scan (coming soon)",
      "Priority support",
    ],
    cta: "Get the app",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <>
      <PageHeader
        title="Simple, honest pricing"
        subtitle="Start free. Upgrade when you need more. No hidden fees, cancel anytime."
      />

      <section className="px-4 py-10 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 100}>
              <div
                className={`rounded-2xl p-6 h-full flex flex-col ${
                  tier.highlighted
                    ? "bg-cockpit-panel border-2 border-cockpit-amber/40 shadow-xl shadow-cockpit-amber/10"
                    : "bg-cockpit-panel border border-cockpit-border"
                }`}
              >
                {tier.highlighted && (
                  <span className="inline-block self-start px-2.5 py-0.5 rounded-full bg-cockpit-amber/15 text-cockpit-amber text-[10px] font-semibold uppercase tracking-wider mb-3">
                    Most popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold text-cockpit-cream mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-cockpit-muted mb-4">{tier.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-mono text-4xl font-bold text-cockpit-cream">
                    {tier.price}
                  </span>
                  <span className="text-sm text-cockpit-muted">/ {tier.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-cockpit-muted">
                      <Check className="w-4 h-4 text-cockpit-amber mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${
                    tier.highlighted
                      ? "bg-cockpit-amber text-cockpit-bg hover:shadow-lg hover:shadow-cockpit-amber/30"
                      : "bg-cockpit-panel-light border border-cockpit-border text-cockpit-cream hover:border-cockpit-amber/30"
                  }`}
                >
                  {tier.cta} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 max-w-3xl mx-auto">
        <ScrollReveal>
          <h2 className="font-heading text-2xl font-bold text-cockpit-cream text-center mb-8">
            Frequently asked
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is my data tied to one country or authority?",
                a: "No. PilotHobb supports FAA, EASA, UK CAA, SACAA, CASA and Other. You set your authority in your profile — it works the same worldwide.",
              },
              {
                q: "Can I export my logbook later?",
                a: "PDF export is coming soon for Pro and Pro+ subscribers. Your data is always yours.",
              },
              {
                q: "Is PilotHobb affiliated with any aviation authority?",
                a: "No. PilotHobb is an independent tool. It helps you track your hours, but it is not a substitute for your official logbook where one is required.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl bg-cockpit-panel border border-cockpit-border p-5">
                <h4 className="text-sm font-semibold text-cockpit-cream mb-2">{faq.q}</h4>
                <p className="text-sm text-cockpit-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}