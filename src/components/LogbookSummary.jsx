import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { X, Loader2, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* Logbook summary — hours per aircraft type (model) over a selected date range,
   split Day/Night × Dual/PIC, with TOTAL and GRAND TOTAL rows. */

const r1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
const HRS = (v) => (v > 0 ? v.toFixed(1) : "-");
const fmtUK = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");

export default function LogbookSummary({ pilot, aircraftList = [], onClose }) {
  const [flights, setFlights] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const acById = useMemo(() => {
    const m = {}; aircraftList.forEach((a) => { m[a.id] = a; }); return m;
  }, [aircraftList]);

  useEffect(() => {
    base44.entities.Flight.list("date", 2000)
      .then((all) => {
        const manned = all.filter((f) => !f.is_rpas);
        setFlights(manned);
        if (manned.length) {
          setFrom((f) => f || manned[0].date || "");
          setTo((t) => t || new Date().toISOString().split("T")[0]);
        }
      })
      .catch(() => setFlights([]));
  }, []);

  const { rows, totals, grand } = useMemo(() => {
    const groups = {};
    (flights || []).forEach((f) => {
      if (from && f.date < from) return;
      if (to && f.date > to) return;
      const acId = typeof f.aircraft === "string" ? f.aircraft : f.aircraft?.id;
      const type = acById[acId]?.type || "Unknown";
      const g = groups[type] || (groups[type] = { type, dayDual: 0, dayPIC: 0, nightDual: 0, nightPIC: 0 });
      const night = f.night_time || 0;
      const day = Math.max(0, (f.flight_time || 0) - night);
      if (f.pilot_role === "Dual") { g.dayDual += day; g.nightDual += night; }
      else { g.dayPIC += day; g.nightPIC += night; } // PIC / PICUS / Co-pilot → PIC column
    });
    const rows = Object.values(groups)
      .map((g) => ({ ...g, dayDual: r1(g.dayDual), dayPIC: r1(g.dayPIC), nightDual: r1(g.nightDual), nightPIC: r1(g.nightPIC) }))
      .sort((a, b) => a.type.localeCompare(b.type));
    const totals = rows.reduce((t, g) => ({
      dayDual: t.dayDual + g.dayDual, dayPIC: t.dayPIC + g.dayPIC,
      nightDual: t.nightDual + g.nightDual, nightPIC: t.nightPIC + g.nightPIC,
    }), { dayDual: 0, dayPIC: 0, nightDual: 0, nightPIC: 0 });
    Object.keys(totals).forEach((k) => { totals[k] = r1(totals[k]); });
    const grand = r1(totals.dayDual + totals.dayPIC + totals.nightDual + totals.nightPIC);
    return { rows, totals, grand };
  }, [flights, from, to, acById]);

  const rowTotal = (g) => r1(g.dayDual + g.dayPIC + g.nightDual + g.nightPIC);

  const exportPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.setTextColor(30, 30, 30);
    doc.text("Logbook Summary", 14, 16);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(80, 80, 80);
    doc.text(`${pilot?.full_name || "Pilot"}  ·  ${fmtUK(from)} – ${fmtUK(to)}`, 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["Aircraft", "Day Dual", "Day PIC", "Night Dual", "Night PIC", "Total"]],
      body: [
        ...rows.map((g) => [g.type, HRS(g.dayDual), HRS(g.dayPIC), HRS(g.nightDual), HRS(g.nightPIC), HRS(rowTotal(g))]),
        [{ content: "TOTAL", styles: { fontStyle: "bold" } }, HRS(totals.dayDual), HRS(totals.dayPIC), HRS(totals.nightDual), HRS(totals.nightPIC), HRS(grand)],
        [{ content: "GRAND TOTAL", styles: { fontStyle: "bold", fillColor: [237, 233, 254] }, colSpan: 5 }, { content: HRS(grand), styles: { fontStyle: "bold", fillColor: [237, 233, 254] } }],
      ],
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
      bodyStyles: { font: "courier", fontSize: 10, textColor: [30, 30, 30], halign: "center" },
      columnStyles: { 0: { halign: "left", fontStyle: "bold" } },
      margin: { left: 14, right: 14 },
    });
    doc.save("pilothobb-logbook-summary.pdf");
  };

  const th = "border border-slate-400 px-3 py-2 text-[11px] font-semibold text-slate-700 text-center whitespace-nowrap";
  const td = "border border-slate-300 px-3 py-2 text-sm text-slate-800 text-center whitespace-nowrap font-mono";

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/50">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div>
          <p className="text-sm font-bold text-slate-900">Logbook Summary</p>
          <p className="text-[11px] text-slate-500">{pilot?.full_name || "Pilot"} · hours by aircraft type</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportPDF} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg px-3 py-1.5 hover:bg-indigo-700">
            <FileDown className="w-3.5 h-3.5" /> Export PDF
          </button>
          <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg px-3 py-1.5">
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>
      </div>

      <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap items-end gap-3">
        <label className="text-[11px] text-slate-600">From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 block border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-slate-800" />
        </label>
        <label className="text-[11px] text-slate-600">To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 block border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-slate-800" />
        </label>
        <p className="text-[11px] text-slate-500 pb-1.5">{fmtUK(from)} – {fmtUK(to)}</p>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50 p-4">
        {flights === null ? (
          <div className="flex items-center justify-center py-24 text-slate-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…</div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-bold text-slate-900">LOGBOOK SUMMARY</p>
              <p className="text-[11px] text-slate-500">{fmtUK(from)} – {fmtUK(to)}</p>
            </div>
            <table className="w-full border-collapse border border-slate-400">
              <thead>
                <tr>
                  <th className={th} rowSpan={2} style={{ textAlign: "left" }}>AIRCRAFT</th>
                  <th className={th} colSpan={2} style={{ background: "#FCF6DC" }}>DAY</th>
                  <th className={th} colSpan={2} style={{ background: "#E9EEFB" }}>NIGHT</th>
                  <th className={th} rowSpan={2}>TOTAL</th>
                </tr>
                <tr>
                  <th className={th} style={{ background: "#FCF6DC" }}>DUAL</th>
                  <th className={th} style={{ background: "#FCF6DC" }}>PIC</th>
                  <th className={th} style={{ background: "#E9EEFB" }}>DUAL</th>
                  <th className={th} style={{ background: "#E9EEFB" }}>PIC</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td className={td} colSpan={6} style={{ padding: 32, color: "#94A3B8" }}>No manned flights in this date range.</td></tr>
                ) : (
                  <>
                    {rows.map((g) => (
                      <tr key={g.type}>
                        <td className={td} style={{ textAlign: "left", fontWeight: 700 }}>{g.type}</td>
                        <td className={td} style={{ background: "#FDFBEA" }}>{HRS(g.dayDual)}</td>
                        <td className={td} style={{ background: "#FDFBEA" }}>{HRS(g.dayPIC)}</td>
                        <td className={td} style={{ background: "#EEF1FB" }}>{HRS(g.nightDual)}</td>
                        <td className={td} style={{ background: "#EEF1FB" }}>{HRS(g.nightPIC)}</td>
                        <td className={td} style={{ fontWeight: 700 }}>{HRS(rowTotal(g))}</td>
                      </tr>
                    ))}
                    <tr style={{ background: "#FCFBEF", fontWeight: 700 }}>
                      <td className={td} style={{ textAlign: "left" }}>TOTAL</td>
                      <td className={td}>{HRS(totals.dayDual)}</td>
                      <td className={td}>{HRS(totals.dayPIC)}</td>
                      <td className={td}>{HRS(totals.nightDual)}</td>
                      <td className={td}>{HRS(totals.nightPIC)}</td>
                      <td className={td}>{HRS(grand)}</td>
                    </tr>
                    <tr style={{ background: "#EDE9FE", fontWeight: 800 }}>
                      <td className={td} colSpan={5} style={{ textAlign: "left" }}>GRAND TOTAL</td>
                      <td className={td}>{HRS(grand)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            <p className="text-[10px] text-slate-400 px-4 py-2">Dual = flights logged as Dual · PIC column includes PIC, PICUS &amp; Co-pilot · RPAS excluded.</p>
          </div>
        )}
      </div>
    </div>
  );
}
