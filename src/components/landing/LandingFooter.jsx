import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Moving map", to: "/features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Drone / RPAS", to: "/rpas" },
      { label: "Get the app", to: "/download" },
      { label: "What's new", to: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "FAQ", to: "/faq" },
      { label: "Security & data", to: "/security" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-cockpit-border bg-cockpit-panel">
      <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo size={34} />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-cockpit-muted">
              Digital pilot logbook — track flight hours, currency and career.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-cockpit-cream">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[14px] text-cockpit-muted transition-colors hover:text-cockpit-amber">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-cockpit-border pt-6 md:flex-row md:items-center">
          <p className="text-[12.5px] text-cockpit-muted">© 2026 PilotHobb · Linkzone Global FZ-LLC</p>
          <span className="font-mono text-[12.5px] text-cockpit-amber">pilothobb.com</span>
        </div>
      </div>
    </footer>
  );
}