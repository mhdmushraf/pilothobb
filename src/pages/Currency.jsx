import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ShieldCheck, Moon, Compass, Stethoscope, RefreshCw, AlertTriangle } from "lucide-react";
import AppHeader from "@/components/AppHeader";

function dayDiff(dstr) {
  if (!dstr) return null;
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const e = new Date(dstr); e.setHours(0, 0, 0, 0);
  return Math.round((e - t) / 86400000);
}
function statusColor(d) { if (d === null) return "#6B7280"; if (d <= 0) return "#EF4444"; if (d <= 90) return "#F59E0B"; return "#10B981"; }
function fmt(d) { return d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"; }

function Ring({ days }) {
  const col = statusColor(days);
  const label = days === null ? "—" : days <= 0 ? "EXP" : days;
  const R = 26, C = 2 * Math.PI * R, pct = days === null ? 0 : Math.max(0, Math.min(1, days / 365));
  return (
    <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
      <svg width="64" height="64" className="-rotate-90"><circle cx="32" cy="32" r={R} fill="none" stroke="#E2E8F0" strokeWidth="5" /><circle cx="32" cy="32" r={R} fill="none" stroke={col} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${C * pct} ${C}`} /></svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-mono text-sm font-bold" style={{ color: col }}>{label}</span><span className="text-[8px] text-cockpit-muted uppercase">days</span></div>
    </div>
  );
}

export default function Currency() {
  const [licences, setLicences] = useState(null);
  const [flights, setFlights] = useState([]);
  useEffect(() => {
    base44.entities.Licence.list("expiry_date").then(setLicences).catch(() => setLicences([]));
    base44.entities.Flight.list("-date", 400).then(setFlights).catch(() => setFlights([]));
  }, []);

  const recency = useMemo(() => {
    const now = new Date();
    const within = (days) => (f) => f.date && (now - new Date(f.date)) / 86400000 <= days;
    const lastNight = flights.filter((f) => (f.night_time || 0) > 0 || (f.night_landings || 0) > 0).sort((a, b) => b.date.localeCompare(a.date))[0];
    const lastInstr = flights.filter((f) => (f.instrument_actual || 0) + (f.instrument_sim || 0) > 0).sort((a, b) => b.date.localeCompare(a.date))[0];
    const nightDaysLeft = lastNight ? 90 - Math.round((now - new Date(lastNight.date)) / 86400000) : null;
    const instrDaysLeft = lastInstr ? 180 - Math.round((now - new Date(lastInstr.date)) / 86400000) : null;
    const dayLandings90 = flights.filter(within(90)).reduce((s, f) => s + (f.landings || 0), 0);
    return { nightDaysLeft, instrDaysLeft, dayLandings90, lastNight, lastInstr };
  }, [flights]);

  const medical = (licences || []).find((l) => l.category === "Medical");
  const ratings = (licences || []).filter((l) => l.category === "Rating");

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={ShieldCheck} title="Currency Tracker" subtitle="Medicals · reviews · recency" />
      {Array.isArray(licences) && (() => {
        const soon = licences.map((l) => ({ l, d: dayDiff(l.expiry_date) })).filter((x) => x.d !== null && x.d <= 90).sort((a, b) => a.d - b.d);
        if (!soon.length) return null;
        return (
          <div className="rounded-2xl border p-4 mb-3" style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.3)" }}>
            <p className="text-sm font-semibold text-cockpit-cream flex items-center gap-1.5 mb-2"><AlertTriangle className="w-4 h-4 text-cockpit-amber" /> Expiring soon</p>
            <div className="space-y-1.5">
              {soon.map(({ l, d }) => (
                <div key={l.id} className="flex items-center justify-between">
                  <span className="text-sm text-cockpit-cream">{l.name}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: statusColor(d) }}>{d <= 0 ? "EXPIRED" : `${d}d · ${fmt(l.expiry_date)}`}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      {licences === null ? <div className="text-center py-20 text-cockpit-muted">Loading…</div> : (
        <div className="space-y-3">
          {/* Recency computed cards */}
          <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 flex items-center gap-4">
            <Ring days={recency.nightDaysLeft} />
            <div className="flex-1"><p className="text-sm font-semibold text-cockpit-cream flex items-center gap-1.5"><Moon className="w-4 h-4 text-cockpit-glow-blue" /> Night currency</p><p className="text-xs text-cockpit-muted mt-0.5">90-day rolling · last night flight {recency.lastNight ? fmt(recency.lastNight.date) : "none logged"}</p></div>
          </div>
          <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 flex items-center gap-4">
            <Ring days={recency.instrDaysLeft} />
            <div className="flex-1"><p className="text-sm font-semibold text-cockpit-cream flex items-center gap-1.5"><Compass className="w-4 h-4 text-cockpit-amber" /> Instrument currency</p><p className="text-xs text-cockpit-muted mt-0.5">6-month window · last instrument time {recency.lastInstr ? fmt(recency.lastInstr.date) : "none logged"}</p></div>
          </div>

          {/* Medical */}
          <p className="text-[11px] uppercase tracking-widest text-cockpit-muted pt-2 pl-1">Medical &amp; reviews</p>
          {medical ? (
            <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 flex items-center gap-4">
              <Ring days={dayDiff(medical.expiry_date)} />
              <div className="flex-1"><p className="text-sm font-semibold text-cockpit-cream flex items-center gap-1.5"><Stethoscope className="w-4 h-4" style={{ color: statusColor(dayDiff(medical.expiry_date)) }} /> {medical.name}</p><p className="text-xs text-cockpit-muted mt-0.5">{medical.framework || "—"} · expires {fmt(medical.expiry_date)}</p></div>
            </div>
          ) : (
            <Link to="/documents" className="block rounded-2xl border border-dashed border-cockpit-border p-4 text-center text-sm text-cockpit-muted">No medical tracked — <span className="text-cockpit-amber font-semibold">add in Documents</span></Link>
          )}

          {ratings.map((r) => (
            <div key={r.id} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 flex items-center gap-4">
              <Ring days={dayDiff(r.expiry_date)} />
              <div className="flex-1"><p className="text-sm font-semibold text-cockpit-cream">{r.name}</p><p className="text-xs text-cockpit-muted mt-0.5">{r.framework || "—"} · Rating · expires {fmt(r.expiry_date)}</p></div>
            </div>
          ))}

          <div className="rounded-2xl bg-cockpit-panel-light border border-cockpit-border p-4 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-cockpit-amber shrink-0" />
            <p className="text-xs text-cockpit-muted"><span className="text-cockpit-cream font-semibold">{recency.dayLandings90}</span> landings in the last 90 days. Add your Biennial Flight Review as a Rating in <Link to="/documents" className="text-cockpit-amber font-semibold">Documents</Link> to track it here.</p>
          </div>
        </div>
      )}
    </div>
  );
}
