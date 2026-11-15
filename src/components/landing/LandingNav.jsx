import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const LINKS = [
  { label: "Features", to: "/features" },
  { label: "Moving map", to: "/moving-map" },
  { label: "Pricing", to: "/pricing" },
  { label: "Drone / RPAS", to: "/rpas" },
  { label: "FAQ", to: "/faq" },
];

const linkClass = ({ isActive }) =>
  `text-[14px] font-medium transition-colors ${isActive ? "text-cockpit-amber" : "text-cockpit-muted hover:text-cockpit-cream"}`;
const mobileLinkClass = ({ isActive }) =>
  `block py-3 text-[15px] font-medium ${isActive ? "text-cockpit-amber" : "text-cockpit-muted"}`;

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-cockpit-border bg-cockpit-bg/95 backdrop-blur">
      <div className="ph-container flex h-[68px] items-center justify-between gap-6">
        <Link to="/" className="shrink-0" aria-label="PilotHobb home">
          <Logo size={32} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden text-[14px] font-semibold text-cockpit-cream transition-colors hover:text-cockpit-amber sm:block">
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
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center text-cockpit-cream lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-cockpit-border lg:hidden">
          <div className="ph-container py-2">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={mobileLinkClass}>{l.label}</NavLink>
            ))}
            <Link to="/login" className="block py-3 text-[15px] font-semibold text-cockpit-amber">Sign in</Link>
          </div>
        </div>
      )}
    </header>
  );
}
