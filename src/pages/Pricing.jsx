import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import Seo from "@/components/Seo";

const tiers = [
  {
    name: "Student",
    description: "For PPL & CPL students building hours.",
    price: "Free trial",
    period: "14 days · no card",
    features: [
      "Unlimited flight logging",
      "Hobbs / Tach auto-totals",
      "Currency & exam clocks",
    ],
    cta: "Start free",
    highlighted: false,
    buttonClass: "bg-transparent border border-cockpit-border text-cockpit-cream hover:border-cockpit-amber/40 hover:bg-cockpit-panel-light",
  },
  {
    name: "Pilot Pro",
    description: "The full logbook for active pilots.",
    price: "$6.99",
    period: "/month · or $69/year — save 18%",
    features: [
      "Everything in Student",
      "Licence & medical renewals",
      "Page-replica PDF export",
      "Endorsements with photos",
      "Camera meter scan (soon)",
    ],
    cta: "Get Pilot Pro",
    highlighted: true,
    buttonClass: "bg-cockpit-amber text-cockpit-bg hover:shadow-lg hover:shadow-cockpit-amber/30",
  },
  {
    name: "Academy",
    description: "For flight schools managing many students.",
    price: "Talk to us",
    period: "per-seat · billed yearly",
    features: [
      "Everything in Pilot Pro",
      "Student roster & oversight",
      "Bulk seats & school branding",
    ],
    cta: "Contact sales",
    highlighted: false,
    buttonClass: "bg-transparent border border-cockpit-border text-cockpit-cream hover:border-cockpit-amber/40 hover:bg-cockpit-panel-light",
  },
];

const faqs = [
  {
    q: "Which licensing authority does it work for?",
    a: "PilotHobb is built around how pilots log worldwide; it adapts to FAA, EASA, UK CAA, CASA, SACAA and more.",
  },
  {
    q: "Hobbs or Tach?",
    a: "Chosen per aircraft. Time totals from the before and after readings, automatically.",
  },
  {
    q: "Can I export my logbook?",
    a: "Any time. Pick a page range and export a clean, authority-ready PDF.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "It stays yours. Export to PDF anytime — your logbook is never locked in.",
  },
  {
    q: "Does the camera scan work?",
    a: "Camera meter scan is rolling out after launch, included in Pilot Pro.",
  },
  {
    q: "Is there a plan for flight schools?",
    a: "Yes — the Academy plan offers per-seat pricing, student oversight, and school branding.",
  },
];

const tabletClasses = [
  "md:order-2 lg:order-none",
  "md:order-1 md:col-span-2 lg:order-none lg:col-span-1",
  "md:order-3 lg:order-none",
];

export default function Pricing() {
  return (
    <>
      <Seo
        path="/pricing"
        title="Pricing — PilotHobb Digital Pilot Logbook"
        description="Simple pricing for PilotHobb, the digital logbook for student, private and commercial pilots. Track flight hours, currency, aircraft maintenance and drone (RPAS) time in one app."
      />
      <PageHeader
        eyebrow="Pricing"
        title="One subscription. Your whole flying career."
        subtitle="Start free, keep your logbook for life. Cancel anytime — your data exports to PDF whenever you want it."
      />

      {/* Pricing cards */}
      <section className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 100} className={tabletClasses[i]}>
              <div
                className={`rounded-2xl p-6 h-full flex flex-col ${
                  tier.highlighted
                    ? "bg-cockpit-panel border-2 border-cockpit-amber/40 shadow-xl shadow-cockpit-amber/10"
                    : "bg-cockpit-panel border border-cockpit-border"
                }`}
              >
                {tier.highlighted && (
                  <span className="inline-block self-start px-2.5 py-0.5 rounded-full bg-cockpit-amber/15 text-cockpit-amber text-[10px] font-semibold uppercase tracking-wider mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold text-cockpit-cream mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-cockpit-muted mb-5">{tier.description}</p>
                <div className="mb-1">
                  <span className="font-mono text-3xl font-bold text-cockpit-cream">
                    {tier.price}
                  </span>
                </div>
                <p className="text-xs text-cockpit-muted mb-6">{tier.period}</p>
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
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${tier.buttonClass}`}
                >
                  {tier.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <p className="text-center text-xs text-cockpit-muted mt-6">
          Prices shown are placeholders — final pricing set at launch. Shown in USD.
        </p>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-20 max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-cockpit-cream text-center mb-10">
            Frequently asked
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-5 h-full">
                <h4 className="text-sm font-semibold text-cockpit-cream mb-2">{faq.q}</h4>
                <p className="text-sm text-cockpit-muted leading-relaxed">{faq.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Band */}
      <section className="px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto rounded-3xl bg-cockpit-panel border border-cockpit-border p-10 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cockpit-amber/5 to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cockpit-cream mb-3">
                Start your logbook tonight.
              </h2>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <a href="#" className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-cockpit-panel-light border border-cockpit-border hover:border-cockpit-amber/30 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-cockpit-cream" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.14 16.37 3.01 11.68 5.04 8.5c1.01-1.62 2.82-2.65 4.76-2.68 1.28-.03 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
                  </svg>
                  <span className="text-sm font-semibold text-cockpit-cream font-heading">Download for iPhone</span>
                </a>
                <a href="#" className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-cockpit-panel-light border border-cockpit-border hover:border-cockpit-amber/30 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M3 3.5v17l9-8.5-9-8.5z" fill="#FF9D2E"/>
                    <path d="M3 3.5l9 8.5 3.5-3.3L4.5 3.5H3z" fill="#F3ECDD" opacity="0.6"/>
                    <path d="M3 20.5l9-8.5 3.5 3.3L4.5 20.5H3z" fill="#8893A8"/>
                  </svg>
                  <span className="text-sm font-semibold text-cockpit-cream font-heading">Download for Android</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}