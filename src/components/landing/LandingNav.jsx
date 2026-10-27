import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Moving map", href: "#moving-map" },
  { label: "Pricing", href: "#pricing" },
  { label: "Drone / RPAS", to: "/rpas" },
  { label: "FAQ", to: "/faq" },
];

const linkClass = "text-[15px] font-medium text-cockpit-muted hover:text-cockpit-cream transition-colors";
const mobileLinkClass = "block py-2.5 text-[15px] font-medium text-cockpit-muted hover:text-cockpit-cream";

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cockpit-border bg-cockpit-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-4 md:px-8">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo size={30} />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} className={linkClass}>{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href} className={linkClass}>{l.label}</a>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-[15px] font-semibold text-cockpit-muted hover:text-cockpit-amber transition-colors">
            Sign in
          </Link>
          <Link
            to="/download"
            className="rounded-xl bg-cockpit-amber px-5 py-2.5 text-[14px] font-bold text-cockpit-bg transition-all hover:brightness-110 active:scale-95"
          >
            Get the app
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="lg:hidden flex h-10 w-10 items-center justify-center text-cockpit-cream"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-cockpit-border px-4 py-3">
          {LINKS.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className={mobileLinkClass}>{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className={mobileLinkClass}>{l.label}</a>
            )
          )}
          <Link to="/login" onClick={() => setOpen(false)} className="block py-2.5 text-[15px] font-semibold text-cockpit-amber">
            Sign in
          </Link>
        </div>
      )}
    </header>
  );
}