import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Student",
    tagline: "For student pilots",
    price: "R0",
    period: "forever",
    cta: "Start free",
    to: "/register",
    highlighted: false,
    features: [
      "Up to 50 flight entries",
      "Up to 3 aircraft",
      "CPL hour dashboard (view only)",
      "Watermarked PDF logbook",
      "CSV export — always",
    ],
  },
  {
    name: "CPL",
    tagline: "For active & commercial pilots",
    price: "R499",
    period: "/yr · R59/mo",
    cta: "Go CPL",
    to: "/register",
    highlighted: true,
    features: [
      "Unlimited flights & aircraft",
      "Live moving map & GPS tracks",
      "SACAA-shaped export + CA 61-91 pre-fill",
      "Full CPL hour dashboard",
      "Currency expiry alerts",
      "Unlimited instructor signatures",
      "Clean PDF logbook print",
    ],
  },
  {
    name: "School",
    tagline: "For flight schools & academies",
    price: "R199",
    period: "/student/yr",
    cta: "Contact sales",
    to: "/contact",
    highlighted: false,
    features: [
      "Everything in CPL",
      "Student roster & oversight",
      "Bulk seats billed yearly",
      "School branding",
    ],
  },
];

export default function PricingCards() {
  return (
    <div className="grid items-start gap-5 md:grid-cols-3">
      {TIERS.map((t) => (
        <div
          key={t.name}
          className={`relative flex flex-col rounded-2xl p-7 md:p-8 ${
            t.highlighted
              ? "border-2 border-cockpit-amber/50 bg-cockpit-panel shadow-2xl shadow-cockpit-amber/10 md:-mt-4"
              : "border border-cockpit-border bg-cockpit-panel/50"
          }`}
        >
          {t.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cockpit-amber px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-cockpit-bg">
              Most popular
            </span>
          )}

          <h3 className="font-heading text-[20px] font-semibold text-cockpit-cream">{t.name}</h3>
          <p className="mt-1 text-[13px] text-cockpit-muted">{t.tagline}</p>

          <div className="mt-5 flex items-baseline gap-1.5">
            <span className="font-mono text-[36px] font-bold leading-none text-cockpit-amber">{t.price}</span>
            <span className="font-mono text-[12px] text-cockpit-muted">{t.period}</span>
          </div>

          <ul className="mt-6 flex-1 space-y-3">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-cockpit-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cockpit-valid" />
                {f}
              </li>
            ))}
          </ul>

          <Link
            to={t.to}
            className={`mt-8 block rounded-xl py-3.5 text-center text-[14px] font-bold transition-all ${
              t.highlighted
                ? "bg-cockpit-amber text-cockpit-bg hover:brightness-110"
                : "border border-cockpit-border text-cockpit-cream hover:border-cockpit-amber/40 hover:bg-cockpit-panel-light"
            }`}
          >
            {t.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}