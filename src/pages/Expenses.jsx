import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Receipt, Plus, Trash2, X } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const CATS = ["Fuel", "Maintenance", "Landing fees", "Training", "Insurance", "Hangar", "Subscriptions", "Other"];
const COLORS = { Fuel: "#4F46E5", Maintenance: "#14B8A6", "Landing fees": "#6366F1", Training: "#F59E0B", Insurance: "#0EA5E9", Hangar: "#818cf8", Subscriptions: "#10B981", Other: "#94A3B8" };

export default function Expenses() {
  const [manual, setManual] = useState(null);
  const [fuel, setFuel] = useState([]);
  const [maint, setMaint] = useState([]);
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ date: today, category: "Landing fees", amount: "", description: "" });

  const load = () => base44.entities.Expense.list("-date").then(setManual).catch(() => setManual([]));
  useEffect(() => {
    load();
    base44.entities.FuelLog.list("-date", 1000).then(setFuel).catch(() => {});
    base44.entities.MaintenanceRecord.list("-date", 1000).then(setMaint).catch(() => {});
  }, []);

  const items = useMemo(() => {
    const rows = [];
    (manual || []).forEach((e) => rows.push({ id: e.id, date: e.date, category: e.category, amount: e.amount || 0, description: e.description, manual: true }));
    fuel.forEach((f) => rows.push({ id: "f" + f.id, date: f.date, category: "Fuel", amount: f.total_cost ?? (f.litres || 0) * (f.cost_per_litre || 0), description: `${f.litres || 0} L`, manual: false }));
    maint.forEach((m) => { if (m.cost != null) rows.push({ id: "m" + m.id, date: m.date, category: "Maintenance", amount: m.cost, description: m.type || "Service", manual: false }); });
    return rows.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [manual, fuel, maint]);

  const summary = useMemo(() => {
    const by = {}; let total = 0;
    items.forEach((r) => { by[r.category] = (by[r.category] || 0) + (r.amount || 0); total += r.amount || 0; });
    const now = new Date(); const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const month = items.filter((r) => (r.date || "").startsWith(ym)).reduce((s, r) => s + (r.amount || 0), 0);
    const cats = Object.entries(by).sort((a, b) => b[1] - a[1]);
    return { by, total, month, cats, max: cats[0]?.[1] || 1 };
  }, [items]);

  const save = async () => {
    if (!form.date || !form.category || !form.amount) return;
    await base44.entities.Expense.create({ date: form.date, category: form.category, amount: parseFloat(form.amount), description: form.description || undefined });
    setOpen(false); setForm((f) => ({ ...f, amount: "", description: "" })); load();
  };
  const del = async (id) => { await base44.entities.Expense.delete(id); load(); };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={Receipt} title="Expenses" subtitle="Fuel, maintenance & operating costs"
        action={<button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-cockpit-amber text-white rounded-full px-3.5 py-2 text-sm font-semibold"><Plus className="w-4 h-4" /> Add</button>} />

      {manual === null ? <div className="text-center py-20 text-cockpit-muted">Loading…</div> : (
        <>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-cockpit-muted">Total spend</p>
              <p className="font-mono text-2xl font-bold text-cockpit-amber mt-1">{summary.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-cockpit-muted">This month</p>
              <p className="font-mono text-2xl font-bold text-cockpit-cream mt-1">{summary.month.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          {summary.cats.length > 0 && (
            <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 mb-4">
              <p className="text-sm font-semibold text-cockpit-cream mb-3">By category</p>
              <div className="space-y-2.5">
                {summary.cats.map(([cat, amt]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-cockpit-muted">{cat}</span><span className="font-mono text-cockpit-cream">{amt.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                    <div className="h-2 rounded-full bg-cockpit-panel-light overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.max(4, (amt / summary.max) * 100)}%`, background: COLORS[cat] || "#4F46E5" }} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-16 text-cockpit-muted"><Receipt className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No expenses yet. Fuel and maintenance costs appear here automatically.</p></div>
          ) : (
            <div className="space-y-2">
              {items.slice(0, 60).map((r) => (
                <div key={r.id} className="rounded-xl bg-cockpit-panel border border-cockpit-border p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[r.category] || "#4F46E5" }} />
                      <span className="text-sm font-medium text-cockpit-cream truncate">{r.category}</span>
                      {!r.manual && <span className="text-[9px] uppercase tracking-wider text-cockpit-muted">auto</span>}
                    </div>
                    <p className="text-xs text-cockpit-muted font-mono mt-0.5">{r.date ? new Date(r.date).toLocaleDateString("en-GB") : ""}{r.description ? ` · ${r.description}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-sm font-bold text-cockpit-cream">{(r.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    {r.manual && <button onClick={() => del(r.id)} className="text-cockpit-muted p-1"><Trash2 className="w-4 h-4" /></button>}
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
          <div className="relative w-full sm:max-w-md bg-cockpit-panel rounded-t-3xl sm:rounded-3xl border border-cockpit-border p-5">
            <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-bold text-cockpit-cream">Add expense</h2><button onClick={() => setOpen(false)}><X className="w-5 h-5 text-cockpit-muted" /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input className="ph-inp" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <select className="ph-inp" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
              </div>
              <input className="ph-inp" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <input className="ph-inp" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <button onClick={save} className="w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3">Save expense</button>
              <p className="text-[11px] text-cockpit-muted text-center">Fuel &amp; maintenance costs are pulled in automatically — only add other costs here.</p>
            </div>
          </div>
        </div>
      )}
      <style>{`.ph-inp{width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;color:#191C1E;font-size:15px}`}</style>
    </div>
  );
}
