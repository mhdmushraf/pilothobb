import React, { useState } from "react";
import { ClipboardCheck, RotateCcw, AlertTriangle } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const CHECKLISTS = {
  "Pre-flight": {
    emergency: false,
    groups: [
      { name: "Cabin", items: ["Documents & POH aboard", "Control locks — removed", "Ignition — OFF", "Master switch — ON", "Fuel quantity — checked", "Master switch — OFF"] },
      { name: "Walk-around", items: ["Pitot cover — removed", "Control surfaces — free & secure", "Fuel — sampled, no water", "Oil level — checked", "Prop & spinner — checked", "Tyres & brakes — checked", "Antennas & lights — secure"] },
    ],
  },
  "Before start": {
    emergency: false,
    groups: [{ name: "Cockpit", items: ["Seats & belts — secure", "Brakes — set", "Circuit breakers — in", "Avionics — OFF", "Mixture — rich", "Fuel selector — both", "Beacon — ON", "Clear prop!"] }],
  },
  "Engine failure": {
    emergency: true,
    groups: [{ name: "After takeoff", items: ["Airspeed — best glide", "Fuel selector — switch tank", "Mixture — rich", "Carb heat — ON", "Ignition — both / start", "If no restart: land straight ahead", "Fuel & ignition — OFF", "Mayday — 121.5"] }],
  },
};

function Section({ name, items, checks, toggle, emergency }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] uppercase tracking-widest text-cockpit-muted mb-2 pl-1">{name}</p>
      <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border overflow-hidden">
        {items.map((item, i) => {
          const key = name + i; const on = checks[key];
          return (
            <button key={key} onClick={() => toggle(key)} className="w-full flex items-center gap-3 px-4 py-3 border-b border-cockpit-border last:border-0 text-left active:bg-cockpit-panel-light">
              <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${on ? (emergency ? "bg-cockpit-expired border-cockpit-expired" : "bg-cockpit-amber border-cockpit-amber") : "border-cockpit-border"}`}>{on && <span className="text-white text-xs">✓</span>}</span>
              <span className={`text-sm ${on ? "text-cockpit-muted line-through" : "text-cockpit-cream"}`}>{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Checklists() {
  const [tab, setTab] = useState("Pre-flight");
  const [checks, setChecks] = useState({});
  const cfg = CHECKLISTS[tab];
  const toggle = (k) => setChecks((c) => ({ ...c, [k]: !c[k] }));
  const reset = () => setChecks((c) => { const n = { ...c }; cfg.groups.forEach((g) => g.items.forEach((_, i) => delete n[g.name + i])); return n; });
  const total = cfg.groups.reduce((s, g) => s + g.items.length, 0);
  const done = cfg.groups.reduce((s, g) => s + g.items.filter((_, i) => checks[g.name + i]).length, 0);

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={ClipboardCheck} title="Quick Checklists" subtitle="Tap items during your walk-around"
        action={<button onClick={reset} className="p-2 rounded-lg bg-cockpit-panel border border-cockpit-border text-cockpit-muted"><RotateCcw className="w-4 h-4" /></button>} />

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {Object.keys(CHECKLISTS).map((k) => (
          <button key={k} onClick={() => setTab(k)} className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-semibold border ${tab === k ? (CHECKLISTS[k].emergency ? "bg-cockpit-expired text-white border-cockpit-expired" : "bg-cockpit-amber text-white border-cockpit-amber") : "bg-cockpit-panel border-cockpit-border text-cockpit-muted"}`}>{CHECKLISTS[k].emergency && "⚠ "}{k}</button>
        ))}
      </div>

      {cfg.emergency && <div className="flex items-center gap-2 text-cockpit-expired text-xs mb-3 bg-cockpit-expired/10 rounded-xl p-3"><AlertTriangle className="w-4 h-4 shrink-0" /> Emergency memory items — verify against your aircraft POH.</div>}

      <div className="rounded-full h-2 bg-cockpit-panel-light overflow-hidden mb-4"><div className="h-full rounded-full transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%`, background: cfg.emergency ? "#EF4444" : "#4F46E5" }} /></div>

      {cfg.groups.map((g) => <Section key={g.name} name={g.name} items={g.items} checks={checks} toggle={toggle} emergency={cfg.emergency} />)}
    </div>
  );
}
