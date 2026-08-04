import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Wrench, Plus, Trash2, X } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const TYPES = ["MPI", "Annual", "100-hour", "Oil change", "Repair", "Inspection", "AD/SB", "Other"];

export default function MaintenanceLog() {
  const [aircraft, setAircraft] = useState([]);
  const [records, setRecords] = useState(null);
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ aircraft: "", date: today, type: "MPI", reading: "", description: "", cost: "" });

  const load = () => base44.entities.MaintenanceRecord.list("-date").then(setRecords).catch(() => setRecords([]));
  useEffect(() => {
    base44.entities.Aircraft.list().then((a) => { setAircraft(a); setForm((f) => ({ ...f, aircraft: a[0]?.id || "" })); }).catch(() => {});
    load();
  }, []);
  const acReg = (id) => aircraft.find((a) => a.id === id)?.registration || "—";

  const save = async () => {
    if (!form.aircraft || !form.date || !form.type) return;
    await base44.entities.MaintenanceRecord.create({ ...form, reading: form.reading ? parseFloat(form.reading) : undefined, cost: form.cost ? parseFloat(form.cost) : undefined });
    setOpen(false); setForm((f) => ({ ...f, type: "MPI", reading: "", description: "", cost: "" })); load();
  };
  const del = async (id) => { await base44.entities.MaintenanceRecord.delete(id); load(); };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={Wrench} title="Maintenance Log" subtitle="Service history & inspections"
        action={<button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-cockpit-amber text-white rounded-full px-3.5 py-2 text-sm font-semibold"><Plus className="w-4 h-4" /> Add</button>} />

      {records === null ? <div className="text-center py-20 text-cockpit-muted">Loading…</div> : records.length === 0 ? (
        <div className="text-center py-16 text-cockpit-muted"><Wrench className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No maintenance records yet.</p></div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cockpit-amber/10 text-cockpit-amber">{r.type}</span>
                  <span className="font-mono text-sm font-bold text-cockpit-cream">{acReg(r.aircraft)}</span>
                </div>
                <button onClick={() => del(r.id)} className="text-cockpit-muted p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
              {r.description && <p className="text-sm text-cockpit-cream mt-2">{r.description}</p>}
              <div className="flex items-center gap-3 mt-2 text-xs text-cockpit-muted font-mono">
                <span>{r.date ? new Date(r.date).toLocaleDateString("en-GB") : ""}</span>
                {r.reading != null && <span>{r.reading} hrs</span>}
                {r.cost != null && <span className="text-cockpit-cream">{r.cost.toLocaleString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-cockpit-panel rounded-t-3xl sm:rounded-3xl border border-cockpit-border p-5 max-h-[88%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-bold text-cockpit-cream">Add record</h2><button onClick={() => setOpen(false)}><X className="w-5 h-5 text-cockpit-muted" /></button></div>
            <div className="space-y-3">
              <select className="ph-inp" value={form.aircraft} onChange={(e) => setForm({ ...form, aircraft: e.target.value })}>{aircraft.map((a) => <option key={a.id} value={a.id}>{a.registration} · {a.type}</option>)}</select>
              <div className="grid grid-cols-2 gap-3">
                <select className="ph-inp" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
                <input className="ph-inp" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="ph-inp" type="number" placeholder="Reading (hrs)" value={form.reading} onChange={(e) => setForm({ ...form, reading: e.target.value })} />
                <input className="ph-inp" type="number" placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
              </div>
              <textarea className="ph-inp" rows="2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <button onClick={save} className="w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3">Save record</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.ph-inp{width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;color:#191C1E;font-size:15px}`}</style>
    </div>
  );
}
