import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", path: "/features" },
      { label: "Pricing", path: "/pricing" },
      { label: "Get the app", path: "/register" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", path: "/about" },
      { label: "Terms", path: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-cockpit-border mt-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Logo size={32} />
            <p className="text-xs text-cockpit-muted mt-3 max-w-[200px] leading-relaxed">
              The digital logbook for pilots worldwide.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-cockpit-cream uppercase tracking-wider mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.path}
                      className="text-sm text-cockpit-muted hover:text-cockpit-amber transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-cockpit-border">
          <p className="text-xs text-cockpit-muted text-center leading-relaxed">
            © 2026 PilotHobb · Linkzone Global FZCO · Not affiliated with any aviation authority
          </p>
        </div>
      </div>
    </footer>
  );
}