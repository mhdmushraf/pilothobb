import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Plus, Trash2, X, Radio, Ruler, DollarSign, Phone } from "lucide-react";
import AppHeader from "@/components/AppHeader";

export default function Aerodromes() {
  const [list, setList] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ icao: "", name: "", elevation: "", runways: "", frequency: "", landing_fee: "", contact: "", notes: "" });

  const load = () => base44.entities.Aerodrome.list("icao").then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.icao) return;
    await base44.entities.Aerodrome.create({ ...form, icao: form.icao.toUpperCase(), elevation: form.elevation ? parseFloat(form.elevation) : undefined });
    setOpen(false); setForm({ icao: "", name: "", elevation: "", runways: "", frequency: "", landing_fee: "", contact: "", notes: "" }); load();
  };
  const del = async (id) => { await base44.entities.Aerodrome.delete(id); load(); };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={MapPin} title="Aerodrome Directory" subtitle="Your favourite airports"
        action={<button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-cockpit-amber text-white rounded-full px-3.5 py-2 text-sm font-semibold"><Plus className="w-4 h-4" /> Add</button>} />

      {list === null ? <div className="text-center py-20 text-cockpit-muted">Loading…</div> : list.length === 0 ? (
        <div className="text-center py-16 text-cockpit-muted"><MapPin className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No aerodromes saved yet.</p></div>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a.id} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div><p className="font-mono text-lg font-bold text-cockpit-amber leading-none">{a.icao}</p><p className="text-sm text-cockpit-cream mt-1">{a.name || "—"}</p></div>
                <button onClick={() => del(a.id)} className="text-cockpit-muted p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-xs text-cockpit-muted">
                {a.elevation != null && <span className="flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5" /> {a.elevation} ft</span>}
                {a.runways && <span className="flex items-center gap-1.5"><span className="font-mono">RWY</span> {a.runways}</span>}
                {a.frequency && <span className="flex items-center gap-1.5"><Radio className="w-3.5 h-3.5" /> {a.frequency}</span>}
                {a.landing_fee && <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {a.landing_fee}</span>}
                {a.contact && <span className="flex items-center gap-1.5 col-span-2"><Phone className="w-3.5 h-3.5" /> {a.contact}</span>}
              </div>
              {a.notes && <p className="text-xs text-cockpit-muted mt-2">{a.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-cockpit-panel rounded-t-3xl sm:rounded-3xl border border-cockpit-border p-5 max-h-[88%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-bold text-cockpit-cream">Add aerodrome</h2><button onClick={() => setOpen(false)}><X className="w-5 h-5 text-cockpit-muted" /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3"><input className="ph-inp font-mono uppercase" placeholder="ICAO" value={form.icao} onChange={(e) => setForm({ ...form, icao: e.target.value })} /><input className="ph-inp" type="number" placeholder="Elevation (ft)" value={form.elevation} onChange={(e) => setForm({ ...form, elevation: e.target.value })} /></div>
              <input className="ph-inp" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3"><input className="ph-inp" placeholder="Runways (e.g. 03/21)" value={form.runways} onChange={(e) => setForm({ ...form, runways: e.target.value })} /><input className="ph-inp" placeholder="Frequency" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3"><input className="ph-inp" placeholder="Landing fee" value={form.landing_fee} onChange={(e) => setForm({ ...form, landing_fee: e.target.value })} /><input className="ph-inp" placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
              <textarea className="ph-inp" rows="2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <button onClick={save} className="w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3">Save aerodrome</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.ph-inp{width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;color:#191C1E;font-size:15px}`}</style>
    </div>
  );
}
