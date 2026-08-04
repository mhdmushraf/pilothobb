import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarClock, Plus, Trash2, X, Plane } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const PURPOSES = ["Training", "Private", "Checkride", "Maintenance", "Cross-country", "Other"];

export default function Schedule() {
  const [aircraft, setAircraft] = useState([]);
  const [bookings, setBookings] = useState(null);
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ aircraft: "", date: today, start_time: "09:00", end_time: "11:00", purpose: "Training", notes: "" });

  const load = () => base44.entities.Booking.list("date").then(setBookings).catch(() => setBookings([]));
  useEffect(() => {
    base44.entities.Aircraft.list().then((a) => { setAircraft(a); setForm((f) => ({ ...f, aircraft: a[0]?.id || "" })); }).catch(() => {});
    load();
  }, []);

  const acReg = (id) => aircraft.find((a) => a.id === id)?.registration || "—";
  const upcoming = useMemo(() => (bookings || []).filter((b) => b.date >= today).sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time)), [bookings, today]);

  const save = async () => {
    if (!form.aircraft || !form.date || !form.start_time) return;
    await base44.entities.Booking.create(form);
    setOpen(false); load();
  };
  const del = async (id) => { await base44.entities.Booking.delete(id); load(); };

  const dayLabel = (d) => new Date(d).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={CalendarClock} title="Aircraft Schedule" subtitle="Reserve time on your fleet"
        action={<button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-cockpit-amber text-white rounded-full px-3.5 py-2 text-sm font-semibold"><Plus className="w-4 h-4" /> Book</button>} />

      {bookings === null ? <div className="text-center py-20 text-cockpit-muted">Loading…</div> : upcoming.length === 0 ? (
        <div className="text-center py-16 text-cockpit-muted"><CalendarClock className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No upcoming bookings. Reserve a slot to get started.</p></div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((b) => (
            <div key={b.id} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 flex items-center gap-3">
              <div className="text-center shrink-0 w-14"><p className="text-[10px] uppercase text-cockpit-muted">{dayLabel(b.date).split(" ")[0]}</p><p className="font-mono text-lg font-bold text-cockpit-amber leading-none">{b.date.slice(8, 10)}</p><p className="text-[10px] text-cockpit-muted">{new Date(b.date).toLocaleDateString("en-GB", { month: "short" })}</p></div>
              <div className="w-px h-10 bg-cockpit-border" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cockpit-cream flex items-center gap-1.5"><Plane className="w-3.5 h-3.5 text-cockpit-amber" /> {acReg(b.aircraft)} <span className="text-xs font-normal text-cockpit-muted">{b.purpose}</span></p>
                <p className="text-xs text-cockpit-muted font-mono mt-0.5">{b.start_time}{b.end_time ? `–${b.end_time}` : ""}{b.title ? ` · ${b.title}` : ""}</p>
              </div>
              <button onClick={() => del(b.id)} className="text-cockpit-muted p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-cockpit-panel rounded-t-3xl sm:rounded-3xl border border-cockpit-border p-5 max-h-[88%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-bold text-cockpit-cream">New booking</h2><button onClick={() => setOpen(false)}><X className="w-5 h-5 text-cockpit-muted" /></button></div>
            <div className="space-y-3">
              <select className="ph-inp" value={form.aircraft} onChange={(e) => setForm({ ...form, aircraft: e.target.value })}>{aircraft.map((a) => <option key={a.id} value={a.id}>{a.registration} · {a.type}</option>)}</select>
              <input className="ph-inp" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <div className="grid grid-cols-2 gap-3"><input className="ph-inp" type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /><input className="ph-inp" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
              <select className="ph-inp" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>{PURPOSES.map((p) => <option key={p}>{p}</option>)}</select>
              <input className="ph-inp" placeholder="Title / instructor (optional)" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <button onClick={save} className="w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3">Reserve slot</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.ph-inp{width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;color:#191C1E;font-size:15px}`}</style>
    </div>
  );
}
