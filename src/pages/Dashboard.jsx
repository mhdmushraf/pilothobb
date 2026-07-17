import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plane, ChevronRight, Shield, Clock, Plus } from "lucide-react";
import usePilot from "@/hooks/usePilot";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import HobbsCounter from "@/components/HobbsCounter";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

function DroneIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="5" cy="5" r="2.3" /><circle cx="19" cy="5" r="2.3" />
      <circle cx="5" cy="19" r="2.3" /><circle cx="19" cy="19" r="2.3" />
      <path d="M7 7l3 3m4-4l-3 3m0 4l-3 3m8 0l-3-3" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  );
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PH";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function dayDiff(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);
  return Math.round((exp - today) / (1000 * 60 * 60 * 24));
}

function ringColor(daysLeft) {
  if (daysLeft <= 0) return "#FF6B6B"; // cockpit-expired
  if (daysLeft <= 90) return "#F5B73C"; // cockpit-warning
  return "#6FE0A6"; // cockpit-valid
}

function CurrencyRing({ licence }) {
  const daysLeft = dayDiff(licence.expiry_date);
  const color = ringColor(daysLeft);
  const label = daysLeft <= 0 ? "EXP" : daysLeft;
  const R = 26;
  const C = 2 * Math.PI * R;
  const pct = Math.max(0, Math.min(1, daysLeft / 365));
  const dash = C * pct;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-cockpit-border last:border-0">
      <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
        <svg width="64" height="64" className="-rotate-90">
          <circle cx="32" cy="32" r={R} fill="none" stroke="#243049" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-base font-bold leading-none" style={{ color }}>
            {label}
          </span>
          <span className="text-[8px] text-cockpit-muted uppercase mt-0.5">days</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-cockpit-cream truncate">{licence.name}</p>
        <p className="text-xs text-cockpit-muted mt-0.5">
          {licence.framework || "—"} · {licence.category}
        </p>
        <p className="text-xs text-cockpit-muted font-mono mt-0.5">
          {licence.expiry_date
            ? new Date(licence.expiry_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : "No expiry"}
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, bar }) {
  return (
    <div className="relative flex-1 overflow-hidden rounded-2xl border border-cockpit-border p-4 shadow-lg shadow-black/20"
         style={{ background: "linear-gradient(180deg,#141B2B,#111725)" }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: bar }} />
      <p className="text-[11px] text-cockpit-muted uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-mono text-4xl font-bold leading-none ${accent}`}>{(value ?? 0).toFixed(1)}</p>
      <p className="text-[10px] text-cockpit-muted uppercase mt-1.5">hours</p>
    </div>
  );
}

function FlightRow({ flight }) {
  return (
    <Link
      to="/logbook"
      className="flex items-center gap-3 py-3 border-b border-cockpit-border last:border-0"
    >
      <div className="w-9 h-9 rounded-lg bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center shrink-0">
        {flight.is_rpas ? (
          <DroneIcon className="w-4 h-4 text-cockpit-glow-blue" />
        ) : (
          <Plane className="w-4 h-4 text-cockpit-amber" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-cockpit-cream font-mono truncate">
            {flight.route || `${flight.from_aerodrome}–${flight.to_aerodrome}`}
          </span>
          {flight.pilot_role && (
            <span className="text-[10px] text-cockpit-amber bg-cockpit-amber/10 px-1.5 py-0.5 rounded font-medium shrink-0">
              {flight.pilot_role}
            </span>
          )}
          {flight.is_rpas && (
            <span className="text-[10px] text-cockpit-glow-blue bg-cockpit-glow-blue/10 px-1.5 py-0.5 rounded font-medium shrink-0">
              RPAS
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-cockpit-muted font-mono">
            {flight.date ? new Date(flight.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : ""}
          </span>
          {flight.aircraft && (
            <span className="text-[10px] text-cockpit-muted">{flight.aircraft}</span>
          )}
        </div>
      </div>
      <span className="font-mono text-sm font-bold text-cockpit-cream">
        {(flight.flight_time ?? 0).toFixed(1)}
      </span>
    </Link>
  );
}

export default function Dashboard() {
  const { pilot, loading: pilotLoading } = usePilot();
  const [licences, setLicences] = useState(null);
  const [flights, setFlights] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const [lic, fl] = await Promise.all([
        base44.entities.Licence.filter({ expiry_date: { $gte: today } }, "expiry_date", 3),
        base44.entities.Flight.list("-date", 4),
      ]);
      setLicences(lic);
      setFlights(fl);
    } catch {
      setLicences([]);
      setFlights([]);
    }
  };

  useEffect(() => { loadData(); }, []);

  const { onTouchStart, onTouchMove, onTouchEnd, pullIndicator } = usePullToRefresh(loadData);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const bannerLicence = licences && licences.length > 0 ? licences[0] : null;
  const bannerDays = bannerLicence ? dayDiff(bannerLicence.expiry_date) : null;
  const showBanner = bannerLicence && bannerDays !== null && bannerDays <= 90;

  return (
    <div className="px-4 pt-6 pb-4" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {pullIndicator}
      {/* 1. App bar */}
      <div className="flex items-center justify-between mb-4">
        <Logo size={30} />
        <Link to="/career" className="shrink-0 rounded-full p-[1.5px]"
              style={{ background: "linear-gradient(135deg,#FF9D2E,#4A90D9)" }}>
          <Avatar pilot={pilot} size={44} />
        </Link>
      </div>
      <div className="mb-6">
        <p className="text-sm text-cockpit-muted">{greeting}, Captain</p>
        <h1 className="text-xl font-heading font-bold text-cockpit-cream leading-tight">
          {pilotLoading ? "…" : (pilot?.full_name || "Pilot")}
        </h1>
        {!pilotLoading && pilot && (pilot.authority || pilot.licence_type) && (
          <p className="text-xs text-cockpit-muted mt-1 font-mono uppercase tracking-wider">
            {[pilot.authority, pilot.licence_type].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {/* 2. Total Time */}
      {pilotLoading ? (
        <SkeletonCard lines={2} className="mb-4" />
      ) : (
        <div
          className="relative overflow-hidden rounded-3xl border border-cockpit-border p-6 mb-4"
          style={{ background: "linear-gradient(180deg,#141B2B,#0d1220)" }}
        >
          <div
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-40"
            style={{ background: "radial-gradient(circle, rgba(255,157,46,.22), transparent 70%)" }}
          />
          <svg
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
            width="220" height="220" viewBox="0 0 220 220"
          >
            <circle cx="110" cy="110" r="100" fill="none" stroke="#2b3855" strokeWidth="1" />
            <circle cx="110" cy="110" r="82" fill="none" stroke="#FF9D2E" strokeWidth="1" strokeDasharray="3 7" opacity="0.5" />
            <path d="M110 6 l5 9 h-10 z" fill="#FF9D2E" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 - 90) * Math.PI / 180;
              return (
                <line key={i}
                  x1={110 + 88 * Math.cos(a)} y1={110 + 88 * Math.sin(a)}
                  x2={110 + 100 * Math.cos(a)} y2={110 + 100 * Math.sin(a)}
                  stroke="#2b3855" strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
                />
              );
            })}
          </svg>
          <div className="relative">
            <p className="text-xs font-medium text-cockpit-muted uppercase tracking-widest mb-3 text-center">Total Time</p>
            <div className="flex justify-center">
              <HobbsCounter target={pilot?.total_time ?? 0} />
            </div>
            <p className="text-center text-sm text-cockpit-muted mt-3 font-mono">
              HOURS · <span className="text-cockpit-cream">{pilot?.total_landings ?? 0}</span> LDG · <span className="text-cockpit-cream">{pilot?.total_takeoffs ?? 0}</span> T/O
            </p>
          </div>
        </div>
      )}

      {/* 3. RPAS card */}
      <Link
        to="/fleet"
        className="block rounded-2xl border border-cockpit-border p-4 mb-4 shadow-lg shadow-black/20 hover:border-cockpit-glow-blue/40 transition-all active:scale-[0.98]"
        style={{ background: "linear-gradient(180deg,#141B2B,#111725)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-cockpit-muted uppercase tracking-widest">RPAS · Drone — logged separately</p>
            <p className="font-mono text-3xl font-bold text-cockpit-glow-blue mt-1">
              {(pilot?.rpas_total_time ?? 0).toFixed(1)}
            </p>
            <p className="text-xs text-cockpit-muted mt-0.5">
              {pilot?.rpas_launches ?? 0} launches
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: "rgba(74,144,217,.12)", border: "1px solid rgba(74,144,217,.25)" }}>
            <DroneIcon className="w-5 h-5 text-cockpit-glow-blue" />
          </div>
        </div>
      </Link>

      {/* 4. Stat cards */}
      <div className="flex gap-3 mb-5">
        <StatCard label="PIC" value={pilot?.total_pic} accent="text-cockpit-amber" bar="#FF9D2E" />
        <StatCard label="Dual" value={pilot?.total_dual} accent="text-cockpit-cream" bar="#243049" />
      </div>

      {/* 5. Reminder banner */}
      {showBanner && (
        <button
          onClick={() => navigate("/documents")}
          className="w-full text-left rounded-2xl border border-cockpit-warning/30 p-4 mb-5 flex items-center gap-3 shadow-lg shadow-black/20 hover:border-cockpit-warning/50 transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(180deg,#141B2B,#111725)" }}
        >
          <Shield className="w-5 h-5 text-cockpit-warning shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-cockpit-warning truncate">
              {bannerLicence.name} expires in {bannerDays} days
            </p>
            <p className="text-xs text-cockpit-muted">tap to renew</p>
          </div>
          <ChevronRight className="w-4 h-4 text-cockpit-warning shrink-0" />
        </button>
      )}

      {/* 6. Currency list */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-cockpit-muted uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Currency
          </h2>
        </div>
        {licences === null ? (
          <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border px-4">
            <div className="py-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-shimmer h-16 rounded-lg" />
              ))}
            </div>
          </div>
        ) : licences.length === 0 ? (
          <div className="rounded-2xl border border-cockpit-border p-6 text-center shadow-lg shadow-black/20" style={{ background: "linear-gradient(180deg,#141B2B,#111725)" }}>
            <Shield className="w-6 h-6 text-cockpit-muted mx-auto mb-2" />
            <p className="text-xs text-cockpit-muted mb-2">No licences or ratings tracked yet</p>
            <Link to="/documents" className="text-xs font-medium text-cockpit-amber">
              Add in Documents
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border px-4">
            {licences.map((l) => (
              <CurrencyRing key={l.id} licence={l} />
            ))}
          </div>
        )}
      </div>

      {/* 8. Recent flights */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-cockpit-muted uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Recent Flights
          </h2>
          {flights && flights.length > 0 && (
            <Link to="/logbook" className="text-xs text-cockpit-amber flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border px-4">
          {flights === null ? (
            <div className="py-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-shimmer h-12 rounded-lg" />
              ))}
            </div>
          ) : flights.length === 0 ? (
            <EmptyState
              icon={Plane}
              title="No flights yet"
              description="Log your first flight to see it here"
              action={
                <Link
                  to="/add-flight"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-cockpit-amber"
                >
                  <Plus className="w-4 h-4" /> Add flight
                </Link>
              }
            />
          ) : (
            flights.map((f) => <FlightRow key={f.id} flight={f} />)
          )}
        </div>
      </div>
    </div>
  );
}