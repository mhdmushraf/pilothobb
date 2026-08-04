import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Target, Plus, Trophy, Trash2, X } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import usePilot from "@/hooks/usePilot";

const METRICS = ["Total hours", "PIC hours", "Dual hours", "Night hours", "Instrument hours", "Cross-country hours", "RPAS hours", "Landings", "Custom"];
const FIELD = { "Total hours": "total_time", "PIC hours": "total_pic", "Dual hours": "total_dual", "Night hours": "total_night", "Instrument hours": "total_instrument", "Cross-country hours": "total_xc", "RPAS hours": "rpas_total_time", "Landings": "total_landings" };

export default function Goals() {
  const { pilot } = usePilot();
  const [goals, setGoals] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", metric: "Total hours", target: "", current: "", target_date: "", notes: "" });

  const load = () => base44.entities.Goal.list("-created_date").then(setGoals).catch(() => setGoals([]));
  useEffect(() => { load(); }, []);

  const currentFor = (g) => { const f = FIELD[g.metric]; if (f && pilot) return pilot[f] || 0; return g.current || 0; };

  const save = async () => {
    if (!form.title || !form.target) return;
    await base44.entities.Goal.create({ title: form.title, metric: form.metric, target: parseFloat(form.target), current: parseFloat(form.current) || 0, target_date: form.target_date || undefined, notes: form.notes });
    setOpen(false); setForm({ title: "", metric: "Total hours", target: "", current: "", target_date: "", notes: "" }); load();
  };
  const del = async (id) => { await base44.entities.Goal.delete(id); load(); };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={Target} title="Goals Tracker" subtitle="Milestones & progress"
        action={<button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-cockpit-amber text-white rounded-full px-3.5 py-2 text-sm font-semibold"><Plus className="w-4 h-4" /> New</button>} />

      {goals === null ? <div className="text-center py-20 text-cockpit-muted">Loading…</div> : goals.length === 0 ? (
        <div className="text-center py-16 text-cockpit-muted"><Target className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No goals yet. Set your first milestone.</p></div>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => {
            const cur = currentFor(g), pct = Math.min(100, Math.round((cur / g.target) * 100)), done = cur >= g.target;
            return (
              <div key={g.id} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">{done && <Trophy className="w-4 h-4 text-cockpit-warning" />}<p className="text-sm font-semibold text-cockpit-cream">{g.title}</p></div>
                  <button onClick={() => del(g.id)} className="text-cockpit-muted p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-cockpit-muted mt-0.5">{g.metric}{g.target_date ? ` · by ${new Date(g.target_date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}` : ""}</p>
                <div className="flex items-baseline justify-between mt-3 mb-1"><span className="font-mono text-sm text-cockpit-cream">{(+cur).toFixed(g.metric === "Landings" ? 0 : 1)} / {g.target}</span><span className="text-xs font-semibold" style={{ color: done ? "#10B981" : "#4F46E5" }}>{pct}%</span></div>
                <div className="h-2.5 rounded-full bg-cockpit-panel-light overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: done ? "#10B981" : "linear-gradient(90deg,#4F46E5,#14B8A6)" }} /></div>
                {g.notes && <p className="text-xs text-cockpit-muted mt-2">{g.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-cockpit-panel rounded-t-3xl sm:rounded-3xl border border-cockpit-border p-5 max-h-[85%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-bold text-cockpit-cream">New Goal</h2><button onClick={() => setOpen(false)}><X className="w-5 h-5 text-cockpit-muted" /></button></div>
            <div className="space-y-3">
              <input className="ph-inp" placeholder="e.g. Reach 250 hours" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <select className="ph-inp" value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })}>{METRICS.map((m) => <option key={m}>{m}</option>)}</select>
              <div className="grid grid-cols-2 gap-3">
                <input className="ph-inp" type="number" placeholder="Target" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
                {form.metric === "Custom" ? <input className="ph-inp" type="number" placeholder="Current" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} /> : <input className="ph-inp" type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} />}
              </div>
              {form.metric !== "Custom" && <input className="ph-inp" type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} />}
              <textarea className="ph-inp" rows="2" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <button onClick={save} className="w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3">Add goal</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.ph-inp{width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;color:#191C1E;font-size:15px}`}</style>
    </div>
  );
}
