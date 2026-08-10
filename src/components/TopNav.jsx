import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const links = [
  { path: "/", label: "Home" },
  { path: "/features", label: "Features" },
  { path: "/pricing", label: "Pricing" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cockpit-bg/90 backdrop-blur-lg border-b border-cockpit-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <Logo size={44} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-sm font-medium transition-colors ${
                pathname === l.path
                  ? "text-cockpit-amber"
                  : "text-cockpit-muted hover:text-cockpit-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/register"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-cockpit-amber text-cockpit-bg text-sm font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30 hover:-translate-y-0.5 transition-all"
          >
            Get the app
          </Link>
        </div>

        <button
          className="md:hidden text-cockpit-cream p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-cockpit-bg/95 backdrop-blur-lg border-b border-cockpit-border animate-accordion-down">
          <div className="px-4 py-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`block py-2.5 text-sm font-medium ${
                  pathname === l.path ? "text-cockpit-amber" : "text-cockpit-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/register"
              className="block py-2.5 text-sm font-semibold text-cockpit-amber"
            >
              Get the app →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}