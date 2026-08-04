import React from "react";

function Panel({ children }) {
  return (
    <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-5 sm:p-6 shadow-xl shadow-black/20">
      {children}
    </div>
  );
}

/* 1. Route list with stops & touch-and-go's */
export function RouteVisual() {
  const stops = [
    { code: "FAGG", tg: null, label: "Departure" },
    { code: "FAOH", tg: 3, label: "Stop 1" },
    { code: "FALA", tg: 2, label: "Stop 2" },
    { code: "FAGG", tg: null, label: "Arrival" },
  ];
  return (
    <Panel>
      <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-4">Route</p>
      <div className="space-y-0">
        {stops.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${i === 0 || i === stops.length - 1 ? "bg-cockpit-amber" : "bg-cockpit-muted"}`} />
              {i < stops.length - 1 && <div className="w-0.5 h-8 bg-cockpit-border" />}
            </div>
            <div className="flex-1 flex items-center justify-between pb-2">
              <span className="font-mono text-sm font-bold text-cockpit-cream">{s.code}</span>
              {s.tg !== null && (
                <span className="text-[10px] text-cockpit-amber bg-cockpit-amber/10 px-2 py-0.5 rounded font-medium">
                  {s.tg} T&G
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-3 border-t border-cockpit-border flex justify-between">
        <span className="text-xs text-cockpit-muted">Landings</span>
        <span className="font-mono text-sm font-bold text-cockpit-cream">6</span>
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-cockpit-muted">Take-offs</span>
        <span className="font-mono text-sm font-bold text-cockpit-cream">6</span>
      </div>
    </Panel>
  );
}

/* 2. Currency clocks with progress bars */
export function CurrencyVisual() {
  const items = [
    { label: "Medical", pct: 72, color: "bg-cockpit-valid", text: "text-cockpit-valid", days: "184d" },
    { label: "Night", pct: 12, color: "bg-cockpit-warning", text: "text-cockpit-warning", days: "12d" },
    { label: "IR", pct: 45, color: "bg-cockpit-valid", text: "text-cockpit-valid", days: "61d" },
    { label: "English", pct: 8, color: "bg-cockpit-expired", text: "text-cockpit-expired", days: "3d" },
  ];
  return (
    <Panel>
      <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-4">Currency</p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((c) => (
          <div key={c.label} className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-cockpit-muted">{c.label}</span>
              <span className={`font-mono text-sm font-bold ${c.text}`}>{c.days}</span>
            </div>
            <div className="h-1.5 rounded-full bg-cockpit-bg overflow-hidden">
              <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* 3. Camera meter readout */
export function MeterVisual() {
  return (
    <Panel>
      <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-4">Hobbs Reading</p>
      <div className="rounded-xl bg-cockpit-bg border border-cockpit-border p-6 text-center">
        <div className="inline-flex items-center gap-1">
          <span className="font-mono text-5xl font-bold text-cockpit-cream">1149</span>
          <span className="font-mono text-5xl font-bold text-cockpit-amber">.6</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cockpit-valid animate-pulse" />
        <span className="text-[11px] text-cockpit-muted">Scanned from camera</span>
      </div>
      <p className="text-[10px] text-cockpit-muted text-center mt-2 italic">Rolling out after launch</p>
    </Panel>
  );
}

/* 4. Logbook page replica */
export function LogbookVisual() {
  const rows = [
    { date: "14 JUN", reg: "ZS-ABC", route: "FAGG–FAOH", time: "1.4" },
    { date: "14 JUN", reg: "ZS-ABC", route: "FAOH–FALA", time: "0.8" },
    { date: "15 JUN", reg: "ZS-DEF", route: "FALA–FAGG", time: "1.1" },
  ];
  return (
    <Panel>
      <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-3">Logbook · Page 12</p>
      <div className="rounded-xl bg-[#191C1E] border border-[#E2E8F0]/20 overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto] gap-2 px-3 py-2 border-b border-[#E2E8F0]/20 text-[9px] font-semibold text-[#6B7280] uppercase tracking-wider">
          <span>Date</span>
          <span>Aircraft · Route</span>
          <span>Time</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[auto_1fr_auto] gap-2 px-3 py-2 border-b border-[#E2E8F0]/10 last:border-0">
            <span className="font-mono text-[10px] text-[#F7F9FB]">{r.date}</span>
            <span className="font-mono text-[10px] text-[#F7F9FB]">
              <span className="font-bold">{r.reg}</span> · {r.route}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#F7F9FB]">{r.time}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-3 py-2 bg-[#6B7280]/10">
          <span className="text-[9px] font-semibold text-[#F7F9FB] uppercase tracking-wider">Page Total</span>
          <span className="font-mono text-sm font-bold text-[#F7F9FB]">3.3</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-cockpit-muted">Running total</span>
        <span className="font-mono text-sm font-bold text-cockpit-amber">159.3 hrs</span>
      </div>
    </Panel>
  );
}

/* 5. Endorsement photo cards */
export function EndorsementVisual() {
  return (
    <Panel>
      <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-4">Endorsements</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "Complex Single", date: "12 MAR 2025" },
          { title: "Tailwheel", date: "04 APR 2025" },
        ].map((e) => (
          <div key={e.title} className="rounded-xl bg-cockpit-panel-light border border-cockpit-border overflow-hidden">
            <div className="aspect-[3/2] bg-cockpit-bg flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-cockpit-border/50 flex items-center justify-center">
                <span className="text-xs text-cockpit-muted">📷</span>
              </div>
            </div>
            <div className="p-2.5">
              <p className="text-[11px] font-semibold text-cockpit-cream">{e.title}</p>
              <p className="text-[9px] text-cockpit-muted font-mono">{e.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* 6. Career summary list */
export function CareerVisual() {
  const types = [
    { name: "Sling 4TSI", pic: 47.3, dual: 1.4 },
    { name: "Cessna 152", pic: 15.9, dual: 32.7 },
    { name: "UF10", pic: 5.6, dual: 2.8 },
  ];
  return (
    <Panel>
      <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-4">Per-Type Summary</p>
      <div className="space-y-2">
        {types.map((t) => (
          <div key={t.name} className="flex items-center justify-between p-3 rounded-lg bg-cockpit-panel-light border border-cockpit-border">
            <span className="text-sm text-cockpit-cream">{t.name}</span>
            <div className="flex gap-4 font-mono text-sm">
              <span className="text-cockpit-amber">{t.pic}</span>
              <span className="text-cockpit-muted">/</span>
              <span className="text-cockpit-cream">{t.dual}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-cockpit-border flex justify-between">
        <span className="text-[10px] text-cockpit-muted uppercase tracking-wider">PIC / Dual</span>
      </div>
    </Panel>
  );
}