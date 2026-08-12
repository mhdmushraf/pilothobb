import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart3 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 ${className}`}>{children}</div>;
}

export default function Analytics() {
  const [flights, setFlights] = useState(null);
  useEffect(() => { base44.entities.Flight.list("-date", 1000).then(setFlights).catch(() => setFlights([])); }, []);

  const data = useMemo(() => {
    if (!flights) return [];
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTHS[d.getMonth()], total: 0, pic: 0, dual: 0, night: 0 });
    }
    const map = Object.fromEntries(buckets.map((b) => [b.key, b]));
    flights.forEach((f) => {
      if (!f.date || f.is_rpas) return;
      const d = new Date(f.date); const k = `${d.getFullYear()}-${d.getMonth()}`;
      if (map[k]) { map[k].total += f.flight_time || 0; map[k].pic += f.pic_time || 0; map[k].dual += f.dual_time || 0; map[k].night += f.night_time || 0; }
    });
    return buckets.map((b) => ({ label: b.label, total: +b.total.toFixed(1), pic: +b.pic.toFixed(1), dual: +b.dual.toFixed(1), night: +b.night.toFixed(1) }));
  }, [flights]);

  const sum = (k) => data.reduce((s, b) => s + b[k], 0).toFixed(1);
  const tip = { contentStyle: { background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 12 } };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={BarChart3} title="Flight Analytics" subtitle="Trends over the last 6 months" />
      {flights === null ? (
        <div className="text-center py-20 text-cockpit-muted">Loading…</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[["Total", sum("total"), "text-cockpit-amber"], ["PIC", sum("pic"), "text-cockpit-cream"], ["Dual", sum("dual"), "text-cockpit-cream"], ["Night", sum("night"), "text-cockpit-glow-blue"]].map(([l, v, c]) => (
              <Card key={l} className="text-center !p-3">
                <p className="text-[10px] uppercase tracking-wider text-cockpit-muted">{l}</p>
                <p className={`font-mono text-lg font-bold mt-1 ${c}`}>{v}</p>
              </Card>
            ))}
          </div>

          <Card>
            <p className="text-sm font-semibold text-cockpit-cream mb-3">Total hours flown</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} /><stop offset="100%" stopColor="#4F46E5" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip {...tip} />
                <Area type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={2.5} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <p className="text-sm font-semibold text-cockpit-cream mb-3">PIC vs Dual vs Night</p>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip {...tip} />
                <Bar dataKey="pic" stackId="a" fill="#4F46E5" radius={[0, 0, 0, 0]} />
                <Bar dataKey="dual" stackId="a" fill="#818cf8" />
                <Bar dataKey="night" stackId="a" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-2 text-[11px] text-cockpit-muted">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#4F46E5" }} />PIC</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#818cf8" }} />Dual</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#0EA5E9" }} />Night</span>
            </div>
          </Card>
          {flights.length === 0 && <p className="text-center text-xs text-cockpit-muted">Log some flights to see your trends.</p>}
        </div>
      )}
    </div>
  );
}
