import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarDays } from "lucide-react";

/* GitHub-style flying-activity heatmap — trailing ~26 weeks, one cell per day,
   shaded by hours flown that day. */

const WEEKS = 26;
const shade = (h) => (h <= 0 ? "#EEF1F5" : h < 1 ? "#C7D2FE" : h < 2 ? "#A5B4FC" : h < 4 ? "#818CF8" : "#4F46E5");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ActivityHeatmap() {
  const [flights, setFlights] = useState(null);

  useEffect(() => {
    base44.entities.Flight.list("date", 1000).then(setFlights).catch(() => setFlights([]));
  }, []);

  const { weeks, daysFlown, monthLabels } = useMemo(() => {
    const byDate = {};
    (flights || []).forEach((f) => { if (f.date) byDate[f.date] = (byDate[f.date] || 0) + (f.flight_time || 0); });
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - (WEEKS * 7 - 1));
    start.setDate(start.getDate() - start.getDay()); // align to Sunday
    const weeks = [];
    const monthLabels = [];
    let cur = new Date(start);
    let daysFlown = 0;
    while (cur <= today) {
      const col = [];
      let colMonth = null;
      for (let d = 0; d < 7; d++) {
        const key = cur.toISOString().split("T")[0];
        const hrs = byDate[key] || 0;
        if (hrs > 0) daysFlown += 1;
        if (d === 0) colMonth = cur.getMonth();
        col.push({ key, hrs });
        cur = new Date(cur.getTime() + 86400000);
      }
      monthLabels.push(colMonth);
      weeks.push(col);
    }
    return { weeks, daysFlown, monthLabels };
  }, [flights]);

  if (flights === null) return null;

  return (
    <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-cockpit-cream flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-cockpit-amber" /> Flying activity
        </p>
        <span className="text-[11px] text-cockpit-muted font-mono">{daysFlown} day{daysFlown !== 1 ? "s" : ""} · 6 mo</span>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="inline-flex flex-col gap-1" style={{ minWidth: "min-content" }}>
          {/* month labels */}
          <div className="flex gap-[3px] pl-0">
            {weeks.map((_, wi) => {
              const m = monthLabels[wi];
              const prev = wi > 0 ? monthLabels[wi - 1] : null;
              const show = wi === 0 || m !== prev;
              return (
                <div key={wi} style={{ width: 12 }} className="text-[8px] text-cockpit-muted text-left">
                  {show ? MONTHS[m] : ""}
                </div>
              );
            })}
          </div>
          {/* grid */}
          <div className="flex gap-[3px]">
            {weeks.map((col, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {col.map((cell) => (
                  <div
                    key={cell.key}
                    title={`${new Date(cell.key).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} · ${cell.hrs.toFixed(1)} h`}
                    className="rounded-[2px]"
                    style={{ width: 12, height: 12, background: shade(cell.hrs) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-2">
        <span className="text-[9px] text-cockpit-muted">Less</span>
        {["#EEF1F5", "#C7D2FE", "#A5B4FC", "#818CF8", "#4F46E5"].map((c) => (
          <span key={c} className="rounded-[2px]" style={{ width: 10, height: 10, background: c }} />
        ))}
        <span className="text-[9px] text-cockpit-muted">More</span>
      </div>
    </div>
  );
}
