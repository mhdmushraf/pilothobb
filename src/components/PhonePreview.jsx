import React, { useState, useEffect, useRef, useCallback } from "react";
import { Home, BookOpen, User, Plus } from "lucide-react";
import { BRAND_ASSETS } from "@/components/Logo";

const SCREENS = ["dashboard", "addflight", "logbook", "career"];
const INTERVAL = 3000;

/* ===== Animated digit roll-up (odometer) ===== */
function RollingDigits({ value, active }) {
  const [display, setDisplay] = useState("0.0");

  useEffect(() => {
    if (!active) { setDisplay("0.0"); return; }
    let raf;
    const start = performance.now();
    const duration = 1400;
    const target = parseFloat(value);
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = target * eased;
      setDisplay(v.toFixed(1));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  const [intPart, decPart] = display.split(".");
  const digits = intPart.split("");

  return (
    <div className="flex items-center font-mono font-bold text-cockpit-cream">
      <div className="flex">
        {digits.map((d, i) => (
          <span key={i} className="inline-block w-[0.65em] text-center tabular-nums">{d}</span>
        ))}
      </div>
      <span className="mx-0.5">.</span>
      <span className="inline-block w-[0.65em] text-center tabular-nums text-cockpit-amber">{decPart}</span>
    </div>
  );
}

/* ===== Count-up value ===== */
function CountUp({ to, active, decimals = 1, suffix = "" }) {
  const [val, setVal] = useState("0");

  useEffect(() => {
    if (!active) { setVal((0).toFixed(decimals)); return; }
    let raf;
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal((to * eased).toFixed(decimals));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to, decimals]);

  return <span className="font-mono tabular-nums">{val}{suffix}</span>;
}

/* ===== Animated progress bar ===== */
function ProgressFill({ active, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!active) { setW(0); return; }
    const id = setTimeout(() => setW(100), delay);
    return () => clearTimeout(id);
  }, [active, delay]);
  return (
    <div className="h-1 rounded-full bg-cockpit-border/60 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${w}%` }} />
    </div>
  );
}

/* ===== Animated horizontal bar ===== */
function AnimatedBar({ active, pct, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!active) { setW(0); return; }
    const id = setTimeout(() => setW(pct), delay);
    return () => clearTimeout(id);
  }, [active, pct, delay]);
  return (
    <div className={`h-2.5 rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${w}%` }} />
  );
}

/* ===== Tab bar ===== */
function TabBar({ activeScreen }) {
  const tabFor = (screen) => {
    if (screen === "dashboard") return "dashboard";
    if (screen === "logbook") return "logbook";
    if (screen === "career") return "career";
    return null; // addflight highlights the FAB
  };
  const highlightTab = tabFor(activeScreen);

  return (
    <div className="flex items-center justify-around px-2 py-2 bg-cockpit-panel border-t border-cockpit-border">
      <TabIcon icon={Home} label="Home" active={highlightTab === "dashboard"} />
      <TabIcon icon={BookOpen} label="Logbook" active={highlightTab === "logbook"} />
      <div className="relative -mt-5">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${activeScreen === "addflight" ? "bg-cockpit-amber ring-2 ring-cockpit-amber/40 ring-offset-2 ring-offset-cockpit-panel" : "bg-cockpit-amber"}`}>
          <Plus className="w-5 h-5 text-cockpit-bg" />
        </div>
      </div>
      <TabIcon icon={User} label="Career" active={highlightTab === "career"} />
    </div>
  );
}
function TabIcon({ icon: Icon, label, active }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon className={`w-4 h-4 ${active ? "text-cockpit-amber" : "text-cockpit-muted"}`} />
      <span className={`text-[7px] ${active ? "text-cockpit-amber font-semibold" : "text-cockpit-muted"}`}>{label}</span>
    </div>
  );
}

/* ===== Screen 1: Dashboard ===== */
function ScreenDashboard({ active }) {
  return (
    <div className="px-4 pt-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-cockpit-muted">Good afternoon</p>
          <p className="text-sm font-bold text-cockpit-cream">Captain Reed</p>
        </div>
        <div className="flex items-center gap-1">
          <img src={BRAND_ASSETS.mark} alt="" style={{ height: 14, width: "auto" }} />
          <span className="text-[11px] font-bold font-heading">
            <span className="text-cockpit-muted">Pilot</span>
            <span className="text-cockpit-cream">Hobb</span>
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 mb-3">
        <p className="text-[9px] font-medium text-cockpit-muted uppercase tracking-widest mb-3">Total Time</p>
        <div className="flex justify-center items-baseline">
          <RollingDigits value={159.3} active={active} />
          <span className="text-[9px] text-cockpit-muted ml-1 font-mono">HRS</span>
        </div>
        <p className="text-center text-[10px] text-cockpit-muted mt-2 font-mono">
          HOURS · <span className="text-cockpit-cream">142</span> LANDINGS
        </p>
      </div>

      <p className="text-[9px] font-medium text-cockpit-muted uppercase tracking-widest mb-2">Currency</p>
      <div className="flex gap-1.5 mb-3">
        <CurrencyChip label="Medical" value="184d" color="valid" active={active} delay={300} />
        <CurrencyChip label="Night" value="12d" color="warning" active={active} delay={450} />
        <CurrencyChip label="IR" value="61d" color="valid" active={active} delay={600} />
      </div>

      <p className="text-[9px] font-medium text-cockpit-muted uppercase tracking-widest mb-2">Recent Flights</p>
      <div className="rounded-xl bg-cockpit-panel border border-cockpit-border px-3 py-1">
        {[
          { route: "FAGG→FAOH", time: "1.4", role: "PIC" },
          { route: "FAOH→FALA", time: "0.8", role: "Dual" },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-2 py-2 border-b border-cockpit-border last:border-0">
            <div className="w-6 h-6 rounded bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center shrink-0">
              <span className="text-[8px] text-cockpit-amber">✈</span>
            </div>
            <span className="font-mono text-[10px] font-semibold text-cockpit-cream flex-1">{f.route}</span>
            <span className="text-[7px] text-cockpit-amber bg-cockpit-amber/10 px-1 rounded">{f.role}</span>
            <span className="font-mono text-[10px] font-bold text-cockpit-cream">{f.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function CurrencyChip({ label, value, color, active, delay }) {
  const colorMap = {
    valid: { text: "text-cockpit-valid", bg: "bg-cockpit-valid/10", border: "border-cockpit-valid/20", bar: "bg-cockpit-valid" },
    warning: { text: "text-cockpit-warning", bg: "bg-cockpit-warning/10", border: "border-cockpit-warning/20", bar: "bg-cockpit-warning" },
  };
  const c = colorMap[color];
  return (
    <div className={`flex-1 rounded-lg ${c.bg} border ${c.border} p-2 text-center`}>
      <p className="text-[8px] text-cockpit-muted truncate">{label}</p>
      <p className={`font-mono text-sm font-bold ${c.text}`}>{value}</p>
      <div className="mt-1.5"><ProgressFill active={active} color={c.bar} delay={delay} /></div>
    </div>
  );
}

/* ===== Screen 2: Add Flight ===== */
function ScreenAddFlight({ active }) {
  return (
    <div className="px-4 pt-2">
      <p className="text-[9px] font-medium text-cockpit-muted uppercase tracking-widest mb-1">Add Flight · Step 2/4</p>
      <p className="text-sm font-bold text-cockpit-cream mb-3">Route & Hobbs</p>

      <div className="rounded-xl bg-cockpit-panel border border-cockpit-border p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[8px] text-cockpit-muted uppercase tracking-wider">Aircraft</span>
          <span className="text-[7px] text-cockpit-amber bg-cockpit-amber/10 px-1.5 py-0.5 rounded font-mono">Hobbs</span>
        </div>
        <p className="font-mono text-xs font-bold text-cockpit-cream">ZU-PBL · Sling 4TSI</p>
      </div>

      <p className="text-[9px] font-medium text-cockpit-muted uppercase tracking-widest mb-2">Route</p>
      <div className="rounded-xl bg-cockpit-panel border border-cockpit-border p-3 mb-3 space-y-1.5">
        {[
          { code: "FAGG", note: "Departure" },
          { code: "FAOH", note: "3 T&G" },
          { code: "FALA", note: "2 T&G" },
          { code: "FAGG", note: "Arrival" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center shrink-0">
              <span className="text-[7px] font-mono text-cockpit-amber">{i + 1}</span>
            </div>
            <span className="font-mono text-[10px] font-semibold text-cockpit-cream">{s.code}</span>
            <span className="text-[8px] text-cockpit-muted ml-auto">{s.note}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 rounded-xl bg-cockpit-panel border border-cockpit-border p-2.5">
          <p className="text-[7px] text-cockpit-muted uppercase tracking-wider mb-1">Hobbs Before</p>
          <p className="font-mono text-xs font-bold text-cockpit-cream">1147.0</p>
        </div>
        <div className="flex-1 rounded-xl bg-cockpit-panel border border-cockpit-border p-2.5">
          <p className="text-[7px] text-cockpit-muted uppercase tracking-wider mb-1">Hobbs After</p>
          <p className="font-mono text-xs font-bold text-cockpit-cream">1149.6</p>
        </div>
      </div>

      <div className="rounded-xl bg-cockpit-panel border border-cockpit-border p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[7px] text-cockpit-muted uppercase tracking-wider">Flight time</p>
            <p className="font-mono text-lg font-bold text-cockpit-amber">
              <CountUp to={2.6} active={active} />
              <span className="text-[9px] text-cockpit-muted ml-1">hrs</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[7px] text-cockpit-muted uppercase tracking-wider">Totals</p>
            <p className="font-mono text-[10px] font-semibold text-cockpit-cream">
              <span className="text-cockpit-amber">6</span> LDG · <span className="text-cockpit-amber">6</span> T/O
            </p>
          </div>
        </div>
      </div>

      <button className="w-full rounded-xl bg-cockpit-amber text-cockpit-bg text-xs font-bold py-2.5">
        Save flight
      </button>
    </div>
  );
}

/* ===== Screen 3: Logbook ===== */
function ScreenLogbook() {
  const flights = [
    { route: "FAGG→FAOH", date: "28 Jun", role: "PIC", time: "1.4", ldg: 2 },
    { route: "FAOH→FALA", date: "27 Jun", role: "Dual", time: "0.8", ldg: 1 },
    { route: "FALA→FAGG", date: "27 Jun", role: "PIC", time: "1.2", ldg: 1 },
    { route: "FAGG→FAGG", date: "24 Jun", role: "PIC", time: "2.6", ldg: 6 },
    { route: "FAGG→FAOR", date: "21 Jun", role: "PICUS", time: "3.1", ldg: 1 },
  ];
  const roleColor = (r) => r === "PIC" ? "text-cockpit-amber bg-cockpit-amber/10" : r === "Dual" ? "text-cockpit-valid bg-cockpit-valid/10" : "text-cockpit-warning bg-cockpit-warning/10";

  return (
    <div className="px-4 pt-2">
      <p className="text-sm font-bold text-cockpit-cream mb-3">Logbook</p>
      <div className="space-y-2">
        {flights.map((f, i) => (
          <div key={i} className="rounded-xl bg-cockpit-panel border border-cockpit-border p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center shrink-0">
              <span className="text-[9px] text-cockpit-amber">✈</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] font-semibold text-cockpit-cream truncate">{f.route}</p>
              <p className="text-[8px] text-cockpit-muted">{f.date} · {f.ldg} ldg</p>
            </div>
            <span className={`text-[7px] px-1.5 py-0.5 rounded font-mono font-semibold ${roleColor(f.role)}`}>{f.role}</span>
            <span className="font-mono text-[11px] font-bold text-cockpit-cream">{f.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Screen 4: Career ===== */
function ScreenCareer({ active }) {
  const types = [
    { name: "Sling 4TSI", hours: 48.7, pct: 100 },
    { name: "Cessna 152", hours: 48.6, pct: 99 },
    { name: "X320", hours: 13.4, pct: 28 },
    { name: "UF10", hours: 8.4, pct: 17 },
  ];

  return (
    <div className="px-4 pt-2">
      <p className="text-sm font-bold text-cockpit-cream mb-3">Career</p>

      <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-3 mb-4">
        <p className="text-[8px] text-cockpit-muted uppercase tracking-widest">Total Hours</p>
        <div className="flex items-baseline">
          <RollingDigits value={159.3} active={active} />
          <span className="text-[9px] text-cockpit-muted ml-1 font-mono">HRS</span>
        </div>
      </div>

      <p className="text-[9px] font-medium text-cockpit-muted uppercase tracking-widest mb-2">Hours by type</p>
      <div className="space-y-2.5">
        {types.map((t, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-cockpit-cream">{t.name}</span>
              <span className="font-mono text-[10px] font-bold text-cockpit-amber">{t.hours}h</span>
            </div>
            <div className="h-2 rounded-full bg-cockpit-border/50 overflow-hidden">
              <AnimatedBar active={active} pct={t.pct} color="bg-cockpit-amber" delay={200 + i * 150} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Phone Preview ===== */
export default function PhonePreview() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % SCREENS.length), INTERVAL);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const active = SCREENS[index];
  const prev = useRef(index);
  const direction = index >= prev.current ? 1 : -1;
  useEffect(() => { prev.current = index; }, [index]);

  const renderScreen = (screen) => {
    switch (screen) {
      case "dashboard": return <ScreenDashboard active={active === "dashboard" || reducedMotion} />;
      case "addflight": return <ScreenAddFlight active={active === "addflight"} />;
      case "logbook": return <ScreenLogbook />;
      case "career": return <ScreenCareer active={active === "career"} />;
      default: return null;
    }
  };

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 300 }}>
      <div className="rounded-[2.5rem] bg-gradient-to-b from-[#1A2336] to-[#0A0E17] border border-cockpit-border p-2.5 shadow-2xl shadow-black/50">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0A0E17] rounded-b-2xl z-10" />
        <div className="rounded-[2rem] bg-cockpit-bg overflow-hidden flex flex-col" style={{ minHeight: 540 }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 shrink-0">
            <span className="text-[10px] font-mono text-cockpit-cream">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex items-end gap-[2px]">
                <div className="w-[3px] h-1.5 rounded-sm bg-cockpit-cream/50" />
                <div className="w-[3px] h-2 rounded-sm bg-cockpit-cream/70" />
                <div className="w-[3px] h-2.5 rounded-sm bg-cockpit-cream" />
              </div>
              <div className="w-5 h-2.5 rounded-[3px] border border-cockpit-cream/40 relative ml-1">
                <div className="absolute inset-[1px] right-[5px] rounded-[1px] bg-cockpit-cream/80" />
              </div>
            </div>
          </div>

          {/* Screen content — cross-fade */}
          <div className="flex-1 relative overflow-hidden">
            {reducedMotion ? (
              <div className="absolute inset-0">{renderScreen("dashboard")}</div>
            ) : (
              SCREENS.map((screen, i) => {
                const isActive = i === index;
                return (
                  <div
                    key={screen}
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateX(0)" : `translateX(${direction * 20}px)`,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    {renderScreen(screen)}
                  </div>
                );
              })
            )}
          </div>

          {/* Page dots */}
          {!reducedMotion && (
            <div className="flex justify-center gap-1.5 py-1.5 shrink-0">
              {SCREENS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${i === index ? "w-4 bg-cockpit-amber" : "w-1 bg-cockpit-border"}`}
                />
              ))}
            </div>
          )}

          {/* Tab bar */}
          <TabBar activeScreen={active} />
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-cockpit-amber/10 rounded-full blur-3xl scale-110" />
    </div>
  );
}