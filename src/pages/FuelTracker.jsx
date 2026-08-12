import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Fuel, Plus, Trash2, X } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const FUELS = ["Avgas 100LL", "Jet A-1", "Mogas", "Other"];

function Tile({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-cockpit-muted">{label}</p>
      <p className="font-mono text-lg font-bold text-cockpit-amber mt-1">{value}</p>
      {sub && <p className="text-[10px] text-cockpit-muted mt-0.5">{sub}</p>}
    </div>
  );
}

export default function FuelTracker() {
  const [aircraft, setAircraft] = useState([]);
  const [logs, setLogs] = useState(null);
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ aircraft: "", date: today, litres: "", cost_per_litre: "", reading: "", fuel_type: "Avgas 100LL", location: "", notes: "" });

  const load = () => base44.entities.FuelLog.list("-date").then(setLogs).catch(() => setLogs([]));
  useEffect(() => {
    base44.entities.Aircraft.list().then((a) => { setAircraft(a); setForm((f) => ({ ...f, aircraft: a[0]?.id || "" })); }).catch(() => {});
    load();
  }, []);
  const acReg = (id) => aircraft.find((a) => a.id === id)?.registration || "—";

  const stats = useMemo(() => {
    if (!logs || logs.length === 0) return null;
    const totalL = logs.reduce((s, l) => s + (l.litres || 0), 0);
    const totalCost = logs.reduce((s, l) => s + (l.total_cost || (l.litres || 0) * (l.cost_per_litre || 0)), 0);
    // avg burn (L/hr) per aircraft from consecutive fills with readings
    const byAc = {};
    logs.forEach((l) => { if (l.aircraft && l.reading != null) (byAc[l.aircraft] ||= []).push(l); });
    let burnNum = 0, burnDen = 0;
    Object.values(byAc).forEach((arr) => {
      const s = arr.slice().sort((a, b) => (a.reading || 0) - (b.reading || 0));
      for (let i = 1; i < s.length; i++) {
        const dh = (s[i].reading || 0) - (s[i - 1].reading || 0);
        if (dh > 0 && dh < 100) { burnNum += s[i].litres || 0; burnDen += dh; }
      }
    });
    const burn = burnDen > 0 ? burnNum / burnDen : null;
    return { totalL, totalCost, avgPerL: totalL > 0 ? totalCost / totalL : 0, burn };
  }, [logs]);

  const save = async () => {
    if (!form.date || !form.litres) return;
    const litres = parseFloat(form.litres);
    const cpl = form.cost_per_litre ? parseFloat(form.cost_per_litre) : undefined;
    await base44.entities.FuelLog.create({
      aircraft: form.aircraft || undefined, date: form.date, litres,
      cost_per_litre: cpl, total_cost: cpl ? +(litres * cpl).toFixed(2) : undefined,
      reading: form.reading ? parseFloat(form.reading) : undefined,
      fuel_type: form.fuel_type, location: form.location || undefined, notes: form.notes || undefined,
    });
    setOpen(false); setForm((f) => ({ ...f, litres: "", cost_per_litre: "", reading: "", location: "", notes: "" })); load();
  };
  const del = async (id) => { await base44.entities.FuelLog.delete(id); load(); };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={Fuel} title="Fuel Tracker" subtitle="Uplifts, cost & consumption"
        action={<button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-cockpit-amber text-white rounded-full px-3.5 py-2 text-sm font-semibold"><Plus className="w-4 h-4" /> Add</button>} />

      {logs === null ? <div className="text-center py-20 text-cockpit-muted">Loading…</div> : (
        <>
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <Tile label="Litres" value={stats.totalL.toFixed(0)} />
              <Tile label="Spend" value={stats.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
              <Tile label="Avg /L" value={stats.avgPerL ? stats.avgPerL.toFixed(2) : "—"} />
              <Tile label="Burn" value={stats.burn ? stats.burn.toFixed(1) : "—"} sub="L/hr" />
            </div>
          )}
          {logs.length === 0 ? (
            <div className="text-center py-16 text-cockpit-muted"><Fuel className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No fuel logs yet. Add your first uplift.</p></div>
          ) : (
            <div className="space-y-3">
              {logs.map((l) => (
                <div key={l.id} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-cockpit-cream">{acReg(l.aircraft)}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cockpit-amber/10 text-cockpit-amber">{l.fuel_type || "Fuel"}</span>
                    </div>
                    <button onClick={() => del(l.id)} className="text-cockpit-muted p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-cockpit-muted font-mono flex-wrap">
                    <span>{l.date ? new Date(l.date).toLocaleDateString("en-GB") : ""}</span>
                    <span className="text-cockpit-cream">{l.litres} L</span>
                    {l.cost_per_litre != null && <span>@ {l.cost_per_litre}</span>}
                    {(l.total_cost != null || (l.litres && l.cost_per_litre)) && <span className="text-cockpit-cream">= {(l.total_cost ?? l.litres * l.cost_per_litre).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>}
                    {l.reading != null && <span>{l.reading} hrs</span>}
                    {l.location && <span>{l.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-cockpit-panel rounded-t-3xl sm:rounded-3xl border border-cockpit-border p-5 max-h-[88%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-bold text-cockpit-cream">Add fuel uplift</h2><button onClick={() => setOpen(false)}><X className="w-5 h-5 text-cockpit-muted" /></button></div>
            <div className="space-y-3">
              <select className="ph-inp" value={form.aircraft} onChange={(e) => setForm({ ...form, aircraft: e.target.value })}>
                <option value="">— No aircraft —</option>
                {aircraft.map((a) => <option key={a.id} value={a.id}>{a.registration} · {a.type}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input className="ph-inp" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <select className="ph-inp" value={form.fuel_type} onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}>{FUELS.map((t) => <option key={t}>{t}</option>)}</select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="ph-inp" type="number" placeholder="Litres" value={form.litres} onChange={(e) => setForm({ ...form, litres: e.target.value })} />
                <input className="ph-inp" type="number" placeholder="Cost / litre" value={form.cost_per_litre} onChange={(e) => setForm({ ...form, cost_per_litre: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="ph-inp" type="number" placeholder="Reading (hrs)" value={form.reading} onChange={(e) => setForm({ ...form, reading: e.target.value })} />
                <input className="ph-inp" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              {form.litres && form.cost_per_litre && (
                <p className="text-xs text-cockpit-muted text-center">Total: <span className="font-mono text-cockpit-cream">{(parseFloat(form.litres) * parseFloat(form.cost_per_litre)).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></p>
              )}
              <button onClick={save} className="w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3">Save uplift</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.ph-inp{width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;color:#191C1E;font-size:15px}`}</style>
    </div>
  );
}
