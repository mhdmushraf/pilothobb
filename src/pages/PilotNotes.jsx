import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { NotebookPen, Plus, Trash2, X } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const CATS = ["Training", "Instructor Feedback", "Debrief", "General", "Study"];
const CAT_COLOR = { "Training": "#4F46E5", "Instructor Feedback": "#14B8A6", "Debrief": "#F59E0B", "General": "#6B7280", "Study": "#0EA5E9" };

export default function PilotNotes() {
  const [notes, setNotes] = useState(null);
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ title: "", category: "Training", date: today, body: "" });

  const load = () => base44.entities.PilotNote.list("-date").then(setNotes).catch(() => setNotes([]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title) return;
    await base44.entities.PilotNote.create(form);
    setOpen(false); setForm({ title: "", category: "Training", date: today, body: "" }); load();
  };
  const del = async (id) => { await base44.entities.PilotNote.delete(id); load(); };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={NotebookPen} title="Pilot Notes" subtitle="Training thoughts & feedback"
        action={<button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-cockpit-amber text-white rounded-full px-3.5 py-2 text-sm font-semibold"><Plus className="w-4 h-4" /> New</button>} />

      {notes === null ? <div className="text-center py-20 text-cockpit-muted">Loading…</div> : notes.length === 0 ? (
        <div className="text-center py-16 text-cockpit-muted"><NotebookPen className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No notes yet. Jot down your first debrief.</p></div>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ background: `${CAT_COLOR[n.category]}1a`, color: CAT_COLOR[n.category] }}>{n.category}</span><span className="text-xs text-cockpit-muted font-mono">{n.date ? new Date(n.date).toLocaleDateString("en-GB") : ""}</span></div>
                  <p className="text-sm font-semibold text-cockpit-cream">{n.title}</p>
                </div>
                <button onClick={() => del(n.id)} className="text-cockpit-muted p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
              {n.body && <p className="text-sm text-cockpit-muted mt-2 whitespace-pre-wrap">{n.body}</p>}
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-cockpit-panel rounded-t-3xl sm:rounded-3xl border border-cockpit-border p-5 max-h-[88%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-bold text-cockpit-cream">New note</h2><button onClick={() => setOpen(false)}><X className="w-5 h-5 text-cockpit-muted" /></button></div>
            <div className="space-y-3">
              <input className="ph-inp" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <select className="ph-inp" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
                <input className="ph-inp" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <textarea className="ph-inp" rows="5" placeholder="Write your note…" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              <button onClick={save} className="w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3">Save note</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.ph-inp{width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;color:#191C1E;font-size:15px}`}</style>
    </div>
  );
}
