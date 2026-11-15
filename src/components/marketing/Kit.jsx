import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AppStoreBadgeIcon from "@/components/landing/AppStoreBadgeIcon";
import GooglePlayBadgeIcon from "@/components/landing/GooglePlayBadgeIcon";

const MEDIA = "https://media.base44.com/images/public/6a455fc5475b58bb52305622";
export const SHOTS = {
  dashboard: `${MEDIA}/17d0d47fa_hero-phone-dashboard.png`,
  map: `${MEDIA}/4109fd7cb_hero-phone-moving-map.png`,
};

export function Eyebrow({ children }) {
  return (
    <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] text-cockpit-amber">
      {children}
    </span>
  );
}

// The exported screens carry empty margin around the phone; these crops show only the phone itself.
const CROPS = {
  dashboard: { aspect: "857 / 1882", width: "137.57%", marginLeft: "-18.67%", marginTop: "-10.5%" },
  map: { aspect: "949 / 2083", width: "134.14%", marginLeft: "-16.97%", marginTop: "-9.48%" },
};

function Shot({ kind, alt, className = "", lazy = false }) {
  const c = CROPS[kind];
  return (
    <div
      className={`overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] ${className}`}
      style={{ aspectRatio: c.aspect, borderRadius: "10.5% / 4.8%" }}
    >
      <img
        src={SHOTS[kind]}
        alt={alt}
        draggable="false"
        loading={lazy ? "lazy" : undefined}
        className="block max-w-none select-none"
        style={{ width: c.width, marginLeft: c.marginLeft, marginTop: c.marginTop }}
      />
    </div>
  );
}

/** The two hero phones exactly as drawn in the design (dashboard behind, moving map in front). */
export function HeroPhoneShots({ className = "" }) {
  return (
    <div className={`relative aspect-[504/667] ${className}`}>
      <Shot kind="dashboard" alt="PilotHobb dashboard showing total flight time, currency and recent flights"
        className="absolute left-0 top-[9.1%] w-[54.2%]" />
      <Shot kind="map" alt="PilotHobb live moving map with airspace, route and GPS flight recording"
        className="absolute left-[39.7%] top-0 w-[60.3%]" />
    </div>
  );
}

/** A single moving-map phone, as drawn in the design. */
export function MapPhoneShot({ className = "" }) {
  return <Shot kind="map" alt="PilotHobb live moving map with airspace, route and GPS flight recording" className={className} lazy />;
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12.5px] text-cockpit-muted">
      {items.map((it, i) => (
        <React.Fragment key={it.label}>
          {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
          {it.to ? (
            <Link to={it.to} className="hover:text-cockpit-amber transition-colors">{it.label}</Link>
          ) : (
            <span className="text-cockpit-cream">{it.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function AuthorCard({ updated }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-cockpit-border bg-cockpit-panel px-5 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cockpit-amber font-heading text-[13px] font-bold text-cockpit-bg">MA</span>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-cockpit-cream">Written by Muhammed Musharaf · CPL candidate, Inversion Flight Academy</p>
        <p className="text-[12px] text-cockpit-muted">Updated {updated}</p>
      </div>
    </div>
  );
}

export function FaqList({ items }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cockpit-border bg-cockpit-panel">
      {items.map((f, i) => (
        <div key={f.q} className={`px-6 py-5 ${i > 0 ? "border-t border-cockpit-border" : ""}`}>
          <h3 className="font-heading text-[16px] font-semibold text-cockpit-cream">{f.q}</h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-cockpit-muted">{f.a}</p>
        </div>
      ))}
    </div>
  );
}

export function RelatedCards({ title, items }) {
  return (
    <section className="border-t border-cockpit-border py-14">
      <div className="ph-container">
        <h2 className="mb-6 font-heading text-[18px] font-semibold text-cockpit-cream">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((r) => (
            <Link key={r.label} to={r.to}
              className="rounded-xl border border-cockpit-border bg-cockpit-panel px-5 py-4 transition-colors hover:border-cockpit-amber/40">
              <span className="block text-[9.5px] font-semibold uppercase tracking-[0.2em] text-cockpit-amber">{r.kind}</span>
              <span className="mt-1.5 block text-[14px] font-semibold text-cockpit-cream">{r.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="py-16 md:py-20">
      <div className="ph-container">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-gradient-to-r from-[#F2A541] to-[#EE7A37] px-8 py-12 md:flex-row md:items-center md:px-14 md:py-14">
          <div>
            <h2 className="font-heading text-[28px] font-bold leading-tight text-cockpit-bg md:text-[38px]">Preflight check complete.</h2>
            <p className="mt-3 text-[16px] text-cockpit-bg/80 md:text-[17px]">Download PilotHobb and log your next flight down to the tenth.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link to="/download" className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-cockpit-bg px-6 py-3.5 text-[14px] font-semibold text-cockpit-cream transition-all hover:bg-cockpit-panel-light">
              <AppStoreBadgeIcon className="h-5 w-5" /> App Store
            </Link>
            <Link to="/download" className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-cockpit-bg px-6 py-3.5 text-[14px] font-semibold text-cockpit-cream transition-all hover:bg-cockpit-panel-light">
              <GooglePlayBadgeIcon className="h-5 w-5" /> Google Play
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
