import React from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import Seo from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";

const tiers = [
  {
    name: "Free",
    tagline: "For student pilots",
    price: "R0",
    period: "free forever",
    cta: "Start free",
    to: "/register",
    highlighted: false,
    features: [
      "Up to 50 flight entries",
      "Up to 3 aircraft",
      "CPL hour dashboard (view only)",
      "5 instructor signatures",
      "Watermarked PDF logbook",
      "CSV export — always",
    ],
    buttonClass:
      "bg-transparent border border-cockpit-border text-cockpit-cream hover:border-cockpit-amber/40 hover:bg-cockpit-panel-light",
  },
  {
    name: "CPL",
    tagline: "For active & commercial pilots",
    price: "R499",
    period: "/year · or R59/month (~$27/yr)",
    cta: "Get CPL",
    to: "/register",
    highlighted: true,
    features: [
      "Unlimited flights & aircraft",
      "SACAA-shaped export",
      "CA 61-91 auto pre-fill",
      "Full CPL hour dashboard",
      "Credit expiry alerts",
      "Unlimited instructor signatures",
      "Clean PDF logbook print",
    ],
    buttonClass: "bg-cockpit-amber text-cockpit-bg hover:shadow-lg hover:shadow-cockpit-amber/30",
  },
  {
    name: "School",
    tagline: "For flight schools & academies",
    price: "R199",
    period: "per student / year · min 10 seats",
    cta: "Contact sales",
    to: "/contact",
    highlighted: false,
    features: [
      "Everything in CPL",
      "Student roster & oversight",
      "Bulk seats, billed yearly",
      "School branding",
    ],
    buttonClass:
      "bg-transparent border border-cockpit-border text-cockpit-cream hover:border-cockpit-amber/40 hover:bg-cockpit-panel-light",
  },
];

// Comparison matrix. Values: string = text, true = ✓, false = ✗
const rows = [
  ["Price", "R0", "R499/yr · R59/mo", "R199/student/yr"],
  ["Flight entries", "50 flights", "Unlimited", "Unlimited"],
  ["Aircraft", "3", "Unlimited", "Unlimited"],
  ["SACAA export", false, true, true],
  ["CA 61-91 pre-fill", false, true, true],
  ["CPL hour dashboard", "View only", "Full", "Full"],
  ["Credit expiry alerts", false, true, true],
  ["Instructor signatures", "5 total", "Unlimited", "Unlimited"],
  ["PDF logbook print", "Watermarked", "Clean", "Clean"],
  ["CSV export", "Always", true, true],
];

function Cell({ v }) {
  if (v === true) return <Check className="w-4 h-4 text-cockpit-valid inline" aria-label="Included" />;
  if (v === false) return <X className="w-4 h-4 text-cockpit-muted/50 inline" aria-label="Not included" />;
  return <span className="text-cockpit-muted">{v}</span>;
}

const faqs = [
  { q: "What currency is this in?", a: "Prices are in South African Rand (ZAR). The approximate USD figure is a guide; you’re billed in Rand." },
  { q: "Is the free tier really free?", a: "Yes — R0, no card required. It covers a typical PPL student through roughly their first solo cross-country before you’d need to upgrade." },
  { q: "What happens at 50 flights?", a: "Your existing entries stay fully visible and exportable. To add more flights, or to unlock SACAA export and credit tracking, you upgrade to CPL." },
  { q: "Can I always export my data?", a: "Always. CSV export is available on every plan, including Free — your logbook is never held hostage. Clean, watermark-free PDF comes with CPL and School." },
  { q: "How does the School plan work?", a: "R199 per student per year, billed yearly, minimum 10 seats — with a student roster, oversight, and school branding. Get in touch and we’ll set you up." },
  { q: "Do prices change?", a: "Pricing shown is for launch and may be adjusted. Anyone already subscribed keeps the terms they signed up on for that period." },
];

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Seo
        path="/pricing"
        title="Pricing — PilotHobb Digital Pilot Logbook"
        description="Simple pricing for PilotHobb. Free for student pilots, R499/yr for CPL with SACAA export and credit tracking, and per-seat School plans for flight academies."
      />
      <PageHeader
        eyebrow="Pricing"
        title="Free while you train. Ready when you fly for a living."
        subtitle="Start free, keep your logbook for life, and upgrade when you need SACAA-ready exports and credit tracking. CSV export is always free."
      />

      {/* Pricing cards */}
      <section className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <h3 className="font-heading text-xl font-bold text-cockpit-cream mb-1">{tier.name}</h3>
                <p className="text-sm text-cockpit-muted mb-5">{tier.tagline}</p>
                <div className="mb-1">
                  <span className="font-mono text-3xl font-bold text-cockpit-cream">{tier.price}</span>
                </div>
                <p className="text-xs text-cockpit-muted mb-6 min-h-[2rem]">{tier.period}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-cockpit-muted">
                      <Check className="w-4 h-4 text-cockpit-amber mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.name === "CPL" ? (isAuthenticated ? "/upgrade" : "/register?next=/upgrade") : tier.to}
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${tier.buttonClass}`}
                >
                  {tier.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-4 sm:px-6 py-12 max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-heading text-2xl font-bold text-cockpit-cream text-center mb-8">Compare plans</h2>
          <div className="rounded-2xl border border-cockpit-border bg-cockpit-panel overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-cockpit-border">
                  <th className="text-left font-semibold text-cockpit-muted py-4 px-4 w-[34%]"></th>
                  <th className="text-left font-heading font-bold text-cockpit-cream py-4 px-4">Free <span className="block text-[11px] font-body font-normal text-cockpit-muted">Student</span></th>
                  <th className="text-left font-heading font-bold text-cockpit-amber py-4 px-4 bg-cockpit-amber/5">CPL</th>
                  <th className="text-left font-heading font-bold text-cockpit-cream py-4 px-4">School</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-cockpit-border last:border-0">
                    <td className="py-3.5 px-4 font-medium text-cockpit-cream">{r[0]}</td>
                    <td className="py-3.5 px-4"><Cell v={r[1]} /></td>
                    <td className="py-3.5 px-4 bg-cockpit-amber/5"><Cell v={r[2]} /></td>
                    <td className="py-3.5 px-4"><Cell v={r[3]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-cockpit-muted mt-4">
            Prices in ZAR (South African Rand). CSV export is included on every plan — your data is always yours.
          </p>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-16 max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-cockpit-cream text-center mb-10">Pricing questions</h2>
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
          <div className="max-w-4xl mx-auto rounded-3xl border border-cockpit-border p-10 sm:p-12 text-center relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600&q=75&auto=format&fit=crop"
              alt="Business jet on the tarmac"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-cockpit-bg/85 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-cockpit-amber/10 to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cockpit-cream mb-3">
                Start your logbook tonight — free.
              </h2>
              <p className="text-cockpit-muted mb-6 max-w-lg mx-auto">
                No card required. Upgrade to CPL the day you need a SACAA-ready export.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-cockpit-amber text-cockpit-bg font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30 hover:-translate-y-0.5 transition-all"
              >
                Start free
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
