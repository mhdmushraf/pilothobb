import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Route, Plus, Trash2, X, Fuel, Clock, Wind, Gauge } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const num = (v) => (v === "" || v == null ? 0 : parseFloat(v) || 0);
const hhmm = (hrs) => {
  if (!isFinite(hrs) || hrs <= 0) return "—";
  const m = Math.round(hrs * 60);
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
};

function compute(p) {
  const dist = num(p.distance_nm);
  const cruise = num(p.cruise_speed);
  const burn = num(p.fuel_burn_rate);
  const reserve = num(p.reserve_min) || 45;
  const head = num(p.wind_speed); // + headwind, - tailwind
  const gs = Math.max(1, cruise - head);
  const ete = dist > 0 && cruise > 0 ? dist / gs : 0;
  const enrouteFuel = ete * burn;
  const reserveFuel = (reserve / 60) * burn;
  const totalFuel = enrouteFuel + reserveFuel;
  return { gs, ete, enrouteFuel, reserveFuel, totalFuel };
}

export default function FlightPlanning() {
  const [plans, setPlans] = useState(null);
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const blank = { title: "", date: today, from_aerodrome: "", to_aerodrome: "", distance_nm: "", cruise_speed: "", fuel_burn_rate: "", reserve_min: 45, wind_dir: "", wind_speed: "", notes: "" };
  const [form, setForm] = useState(blank);

  const load = () => base44.entities.FlightPlan.list("-date").then(setPlans).catch(() => setPlans([]));
  useEffect(() => { load(); }, []);

  const live = useMemo(() => compute(form), [form]);

  const save = async () => {
    if (!form.title) return;
    await base44.entities.FlightPlan.create({
      ...form,
      distance_nm: num(form.distance_nm) || undefined,
      cruise_speed: num(form.cruise_speed) || undefined,
      fuel_burn_rate: num(form.fuel_burn_rate) || undefined,
      reserve_min: num(form.reserve_min) || 45,
      wind_dir: num(form.wind_dir) || undefined,
      wind_speed: form.wind_speed === "" ? undefined : num(form.wind_speed),
    });
    setOpen(false); setForm(blank); load();
  };
  const del = async (id) => { await base44.entities.FlightPlan.delete(id); load(); };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={Route} title="Flight Planning" subtitle="Fuel · time · wind calculator"
        action={<button onClick={() => { setForm(blank); setOpen(true); }} className="flex items-center gap-1.5 bg-cockpit-amber text-white rounded-full px-3.5 py-2 text-sm font-semibold"><Plus className="w-4 h-4" /> New plan</button>} />

      {plans === null ? <div className="text-center py-20 text-cockpit-muted">Loading…</div> : plans.length === 0 ? (
        <div className="text-center py-16 text-cockpit-muted"><Route className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No flight plans yet.</p><p className="text-xs mt-1">Tap “New plan” to work out fuel and time for a leg.</p></div>
      ) : (
        <div className="space-y-3">
          {plans.map((p) => {
            const c = compute(p);
            return (
              <div key={p.id} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-cockpit-cream">{p.title}</p>
                    <p className="text-xs text-cockpit-muted font-mono mt-0.5">
                      {(p.from_aerodrome || "—")}{p.to_aerodrome ? ` → ${p.to_aerodrome}` : ""}{p.date ? ` · ${new Date(p.date).toLocaleDateString("en-GB")}` : ""}
                    </p>
                  </div>
                  <button onClick={() => del(p.id)} className="text-cockpit-muted p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-cockpit-muted">ETE</p>
                    <p className="font-mono text-sm font-bold text-cockpit-cream mt-0.5">{hhmm(c.ete)}</p>
                  </div>
                  <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-cockpit-muted">Fuel</p>
                    <p className="font-mono text-sm font-bold text-cockpit-amber mt-0.5">{c.totalFuel > 0 ? c.totalFuel.toFixed(1) : "—"}</p>
                  </div>
                  <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-cockpit-muted">GS</p>
                    <p className="font-mono text-sm font-bold text-cockpit-cream mt-0.5">{c.gs > 1 ? Math.round(c.gs) : "—"}</p>
                  </div>
                </div>
                {p.notes && <p className="text-xs text-cockpit-muted mt-2">{p.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-cockpit-panel rounded-t-3xl sm:rounded-3xl border border-cockpit-border p-5 max-h-[90%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-bold text-cockpit-cream">New flight plan</h2><button onClick={() => setOpen(false)}><X className="w-5 h-5 text-cockpit-muted" /></button></div>
            <div className="space-y-3">
              <input className="ph-inp" placeholder="Plan title (e.g. FAOR → FAGG)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="ph-inp" placeholder="From (FAOR)" value={form.from_aerodrome} onChange={(e) => setForm({ ...form, from_aerodrome: e.target.value })} />
                <input className="ph-inp" placeholder="To (FAGG)" value={form.to_aerodrome} onChange={(e) => setForm({ ...form, to_aerodrome: e.target.value })} />
              </div>
              <input className="ph-inp" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <label className="ph-lbl">Distance (nm)<input className="ph-inp mt-1" type="number" inputMode="decimal" value={form.distance_nm} onChange={(e) => setForm({ ...form, distance_nm: e.target.value })} /></label>
                <label className="ph-lbl">Cruise TAS (kt)<input className="ph-inp mt-1" type="number" inputMode="decimal" value={form.cruise_speed} onChange={(e) => setForm({ ...form, cruise_speed: e.target.value })} /></label>
                <label className="ph-lbl">Burn (/hr)<input className="ph-inp mt-1" type="number" inputMode="decimal" value={form.fuel_burn_rate} onChange={(e) => setForm({ ...form, fuel_burn_rate: e.target.value })} /></label>
                <label className="ph-lbl">Reserve (min)<input className="ph-inp mt-1" type="number" inputMode="numeric" value={form.reserve_min} onChange={(e) => setForm({ ...form, reserve_min: e.target.value })} /></label>
                <label className="ph-lbl">Wind dir (°)<input className="ph-inp mt-1" type="number" inputMode="numeric" value={form.wind_dir} onChange={(e) => setForm({ ...form, wind_dir: e.target.value })} /></label>
                <label className="ph-lbl">Headwind (kt)<input className="ph-inp mt-1" type="number" inputMode="numeric" placeholder="+head / −tail" value={form.wind_speed} onChange={(e) => setForm({ ...form, wind_speed: e.target.value })} /></label>
              </div>

              <div className="rounded-2xl bg-cockpit-panel-light border border-cockpit-border p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-cockpit-glow-blue" /><div><p className="text-[10px] uppercase tracking-wider text-cockpit-muted">Ground speed</p><p className="font-mono text-lg font-bold text-cockpit-cream">{live.gs > 1 ? Math.round(live.gs) : "—"} <span className="text-xs font-normal">kt</span></p></div></div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-cockpit-glow-blue" /><div><p className="text-[10px] uppercase tracking-wider text-cockpit-muted">Time enroute</p><p className="font-mono text-lg font-bold text-cockpit-cream">{hhmm(live.ete)}</p></div></div>
                  <div className="flex items-center gap-2"><Fuel className="w-4 h-4 text-cockpit-amber" /><div><p className="text-[10px] uppercase tracking-wider text-cockpit-muted">Enroute fuel</p><p className="font-mono text-lg font-bold text-cockpit-cream">{live.enrouteFuel > 0 ? live.enrouteFuel.toFixed(1) : "—"}</p></div></div>
                  <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-cockpit-amber" /><div><p className="text-[10px] uppercase tracking-wider text-cockpit-muted">Total + reserve</p><p className="font-mono text-lg font-bold text-cockpit-amber">{live.totalFuel > 0 ? live.totalFuel.toFixed(1) : "—"}</p></div></div>
                </div>
              </div>

              <textarea className="ph-inp" rows="2" placeholder="Notes (alternates, freq, remarks)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <button onClick={save} disabled={!form.title} className="w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3 disabled:opacity-50">Save plan</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.ph-inp{width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;color:#191C1E;font-size:15px}.ph-lbl{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6B7280}`}</style>
    </div>
  );
}
