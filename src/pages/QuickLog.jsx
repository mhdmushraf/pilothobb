import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import usePilot from "@/hooks/usePilot";
import { computeTotals } from "@/lib/flightTotals";
import { Zap, Check, Loader2, Plane } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import UpgradeSheet from "@/components/UpgradeSheet";
import { flightLimitReached } from "@/lib/plan";

const todayStr = () => new Date().toISOString().split("T")[0];
const r1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
const ROLE_FIELD = { PIC: "pic_time", Dual: "dual_time", PICUS: "picus_time", "Co-pilot": "co_pilot_time" };

function diffHours(t1, t2) {
  if (!t1 || !t2) return 0;
  const [h1, m1] = t1.split(":").map(Number);
  const [h2, m2] = t2.split(":").map(Number);
  let mins = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (mins < 0) mins += 24 * 60; // crossed midnight
  return r1(mins / 60);
}

export default function QuickLog() {
  const { pilot } = usePilot();
  const [aircraft, setAircraft] = useState([]);
  const [recent, setRecent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const blank = { aircraft: "", date: todayStr(), from_aerodrome: "", to_aerodrome: "", takeoff: "", landing: "", pilot_role: "PIC", landings: 1, pic_name: "" };
  const [form, setForm] = useState(blank);

  const loadRecent = () => base44.entities.Flight.list("-date", 8).then(setRecent).catch(() => setRecent([]));
  useEffect(() => {
    base44.entities.Aircraft.list().then((a) => { setAircraft(a); setForm((f) => ({ ...f, aircraft: a[0]?.id || "" })); }).catch(() => {});
    loadRecent();
  }, []);
  const acReg = (id) => { const a = aircraft.find((x) => x.id === (typeof id === "string" ? id : id?.id)); return a?.registration || "—"; };

  const ft = diffHours(form.takeoff, form.landing);

  const save = async () => {
    if (!form.aircraft || ft <= 0) { setMsg("Pick an aircraft and enter valid times."); return; }
    if (flightLimitReached(pilot)) { setShowUpgrade(true); return; }
    setSaving(true); setMsg("");
    let created = null;
    try {
      const ac = aircraft.find((a) => a.id === form.aircraft);
      const isRpas = ac?.category === "Drone (RPAS)";
      const data = {
        date: form.date, aircraft: form.aircraft, is_rpas: isRpas,
        flight_time: ft, pilot_role: form.pilot_role,
        from_aerodrome: form.from_aerodrome, to_aerodrome: form.to_aerodrome,
        pic_name: form.pic_name || undefined,
        takeoffs: 1, landings: Number(form.landings) || 1,
        [ROLE_FIELD[form.pilot_role]]: ft,
      };
      created = await base44.entities.Flight.create(data);
      if (pilot && ac) {
        const { pilotPatch, aircraftPatch } = computeTotals(created, pilot, ac, 1);
        pilotPatch.flight_count = (pilot.flight_count || 0) + 1;
        await base44.entities.Pilot.update(pilot.id, pilotPatch);
        await base44.entities.Aircraft.update(ac.id, aircraftPatch);
      }
      setMsg(`Logged ${ft.toFixed(1)}h on ${acReg(form.aircraft)}`);
      setForm((f) => ({ ...blank, aircraft: f.aircraft, date: f.date }));
      loadRecent();
    } catch (e) {
      if (created) { try { await base44.entities.Flight.delete(created.id); } catch { /* ignore */ } }
      setMsg(e.message || "Couldn’t save — try the full Add Flight form.");
    } finally { setSaving(false); }
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={Zap} title="Quick Log" subtitle="Log a flight in seconds" />

      <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-5 space-y-3">
        <select className="ph-inp" value={form.aircraft} onChange={(e) => setForm({ ...form, aircraft: e.target.value })}>
          {aircraft.length === 0 && <option value="">No aircraft — add one in Fleet</option>}
          {aircraft.map((a) => <option key={a.id} value={a.id}>{a.registration} · {a.type}</option>)}
        </select>
        <input className="ph-inp" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className="ph-inp" placeholder="From (FAOR)" value={form.from_aerodrome} onChange={(e) => setForm({ ...form, from_aerodrome: e.target.value })} />
          <input className="ph-inp" placeholder="To (FAGG)" value={form.to_aerodrome} onChange={(e) => setForm({ ...form, to_aerodrome: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="ph-lbl">Takeoff<input className="ph-inp mt-1" type="time" value={form.takeoff} onChange={(e) => setForm({ ...form, takeoff: e.target.value })} /></label>
          <label className="ph-lbl">Landing<input className="ph-inp mt-1" type="time" value={form.landing} onChange={(e) => setForm({ ...form, landing: e.target.value })} /></label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select className="ph-inp" value={form.pilot_role} onChange={(e) => setForm({ ...form, pilot_role: e.target.value })}>
            {["PIC", "Dual", "PICUS", "Co-pilot"].map((r) => <option key={r}>{r}</option>)}
          </select>
          <label className="ph-lbl">Landings<input className="ph-inp mt-1" type="number" inputMode="numeric" value={form.landings} onChange={(e) => setForm({ ...form, landings: e.target.value })} /></label>
        </div>
        <input className="ph-inp" placeholder="Pilot in Command (name) — optional" value={form.pic_name} onChange={(e) => setForm({ ...form, pic_name: e.target.value })} />

        <div className="rounded-xl bg-cockpit-amber/5 border border-cockpit-amber/20 p-4 text-center">
          <p className="text-[11px] text-cockpit-muted uppercase tracking-wider mb-1">Flight time</p>
          <p className="font-mono text-3xl font-bold text-cockpit-amber">{ft > 0 ? ft.toFixed(1) : "0.0"}</p>
        </div>

        <button onClick={save} disabled={saving || ft <= 0 || !form.aircraft} className="w-full flex items-center justify-center gap-2 bg-cockpit-amber text-white font-semibold rounded-xl py-3 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{saving ? "Saving…" : "Log flight"}
        </button>
        {msg && <p className="text-xs text-center text-cockpit-muted">{msg}</p>}
        <p className="text-[11px] text-cockpit-muted text-center">Need Hobbs readings, night or IFR time? Use the full <Link to="/add-flight" className="text-cockpit-amber font-semibold">Add Flight</Link> form.</p>
      </div>

      <p className="text-[11px] uppercase tracking-widest text-cockpit-muted pt-5 pb-2 pl-1">Recent</p>
      {recent === null ? <div className="text-center py-8 text-cockpit-muted text-sm">Loading…</div> : recent.length === 0 ? (
        <div className="text-center py-8 text-cockpit-muted text-sm">No flights logged yet.</div>
      ) : (
        <div className="space-y-2">
          {recent.map((f) => (
            <div key={f.id} className="rounded-xl bg-cockpit-panel border border-cockpit-border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cockpit-glow-blue/10 flex items-center justify-center shrink-0"><Plane className="w-4 h-4 text-cockpit-glow-blue" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cockpit-cream font-mono truncate">{acReg(f.aircraft)} · {(f.from_aerodrome || "—")}{f.to_aerodrome ? `–${f.to_aerodrome}` : ""}</p>
                <p className="text-xs text-cockpit-muted font-mono">{f.date ? new Date(f.date).toLocaleDateString("en-GB") : ""}</p>
              </div>
              <span className="font-mono text-sm font-bold text-cockpit-amber shrink-0">{(f.flight_time ?? 0).toFixed(1)}h</span>
            </div>
          ))}
        </div>
      )}
      <style>{`.ph-inp{width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;color:#191C1E;font-size:15px}.ph-lbl{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6B7280}`}</style>

      {showUpgrade && (
        <UpgradeSheet trigger="flights" onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  );
}
