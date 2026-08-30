import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Download, FileText, FileSpreadsheet, Loader2, FileBarChart, RefreshCw, Lock, Sparkles } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import usePilot from "@/hooks/usePilot";
import UpgradeSheet from "@/components/UpgradeSheet";
import { hasPaidPlan } from "@/lib/plan";
import { recalcPilotTotals } from "@/lib/flightTotals";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportData() {
  const { pilot, reload } = usePilot();
  const [aircraft, setAircraft] = useState([]);
  const [count, setCount] = useState(null);
  const [busy, setBusy] = useState("");
  const [recalcMsg, setRecalcMsg] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const paid = hasPaidPlan(pilot);

  // Diagonal watermark on free-plan PDFs.
  const watermark = (doc) => {
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      const w = doc.internal.pageSize.getWidth();
      const h = doc.internal.pageSize.getHeight();
      doc.setFont("helvetica", "bold"); doc.setFontSize(46); doc.setTextColor(210, 214, 224);
      doc.text("PilotHobb — FREE", w / 2, h / 2, { align: "center", angle: 32 });
      doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(200, 204, 214);
      doc.text("Upgrade to CPL for a clean, authority-ready logbook · pilothobb.com", w / 2, h / 2 + 14, { align: "center", angle: 32 });
    }
  };

  const recalcTotals = async () => {
    setBusy("recalc"); setRecalcMsg("");
    try {
      const flights = await base44.entities.Flight.filter({}, "-date", 5000);
      const patch = recalcPilotTotals(flights);
      if (pilot?.id) await base44.entities.Pilot.update(pilot.id, patch);
      if (reload) await reload();
      setRecalcMsg(`Done — ${patch.total_time.toFixed(1)}h total · ${patch.total_pic.toFixed(1)}h PIC · ${patch.total_landings} landings from ${flights.length} flights.`);
    } catch {
      setRecalcMsg("Couldn’t recalculate — please try again.");
    } finally { setBusy(""); }
  };
  useEffect(() => {
    base44.entities.Aircraft.list().then(setAircraft).catch(() => {});
    base44.entities.Flight.list("-date", 1).then(() => {}).catch(() => {});
    base44.entities.Flight.filter({}, "-date", 5000).then((f) => setCount(f.length)).catch(() => setCount(0));
  }, []);
  const acReg = (id) => { const a = aircraft.find((x) => x.id === (typeof id === "string" ? id : id?.id)); return a?.registration || "—"; };

  const load = async () => base44.entities.Flight.list("-date", 5000);

  const exportPDF = async () => {
    setBusy("pdf");
    try {
      const flights = await load();
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(79, 70, 229);
      doc.text("PilotHobb — Flight Logbook", 14, 15);
      doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(40, 40, 40);
      doc.text(pilot?.full_name || "Pilot", 14, 22);
      doc.setFontSize(9);
      doc.text(`Total ${(pilot?.total_time || 0).toFixed(1)}h · PIC ${(pilot?.total_pic || 0).toFixed(1)}h · Dual ${(pilot?.total_dual || 0).toFixed(1)}h · Night ${(pilot?.total_night || 0).toFixed(1)}h · XC ${(pilot?.total_xc || 0).toFixed(1)}h`, 14, 28);
      autoTable(doc, {
        startY: 33,
        head: [["Date", "Aircraft", "Route", "Before", "After", "Total", "PIC", "Dual", "Night", "Ldg", "Remarks"]],
        body: flights.map((f) => [f.date ? new Date(f.date).toLocaleDateString("en-GB") : "", acReg(f.aircraft), f.route || `${f.from_aerodrome || ""}-${f.to_aerodrome || ""}`, f.reading_before ?? "", f.reading_after ?? "", (f.flight_time ?? 0).toFixed(1), (f.pic_time ?? 0).toFixed(1), (f.dual_time ?? 0).toFixed(1), (f.night_time ?? 0).toFixed(1), f.landings ?? 0, (f.remarks || "").slice(0, 40)]),
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
        bodyStyles: { font: "courier", fontSize: 8, textColor: [40, 40, 40] },
        alternateRowStyles: { fillColor: [242, 244, 246] }, margin: { left: 14, right: 14 },
      });
      if (!paid) watermark(doc);
      doc.save("pilothobb-logbook.pdf");
    } finally { setBusy(""); }
  };

  const exportSummary = async () => {
    setBusy("sum");
    try {
      const flights = await load();
      const byAc = {};
      flights.forEach((f) => { const r = acReg(f.aircraft); if (!byAc[r]) byAc[r] = { hrs: 0, n: 0 }; byAc[r].hrs += f.flight_time || 0; byAc[r].n += 1; });
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(79, 70, 229);
      doc.text("PilotHobb — Logbook Summary", 14, 18);
      doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor(30, 30, 30);
      doc.text(pilot?.full_name || "Pilot", 14, 26);
      doc.setFontSize(9); doc.setTextColor(110, 110, 110);
      doc.text(`Generated ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`, 14, 31);
      autoTable(doc, {
        startY: 38,
        head: [["Total", "PIC", "Dual", "Night", "XC", "Instrument", "Flights"]],
        body: [[(pilot?.total_time || 0).toFixed(1), (pilot?.total_pic || 0).toFixed(1), (pilot?.total_dual || 0).toFixed(1), (pilot?.total_night || 0).toFixed(1), (pilot?.total_xc || 0).toFixed(1), (pilot?.total_instrument || 0).toFixed(1), String(count ?? flights.length)]],
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
        bodyStyles: { font: "courier", fontSize: 11, textColor: [30, 30, 30], halign: "center" },
        headStyles2: {}, margin: { left: 14, right: 14 },
      });
      const acRows = Object.entries(byAc).sort((a, b) => b[1].hrs - a[1].hrs).map(([reg, v]) => [reg, v.hrs.toFixed(1), String(v.n)]);
      autoTable(doc, {
        startY: (doc.lastAutoTable?.finalY || 50) + 8,
        head: [["Aircraft", "Hours", "Flights"]],
        body: acRows.length ? acRows : [["—", "0.0", "0"]],
        headStyles: { fillColor: [20, 184, 166], textColor: [255, 255, 255], fontStyle: "bold" },
        bodyStyles: { font: "courier", fontSize: 10, textColor: [40, 40, 40] },
        alternateRowStyles: { fillColor: [242, 244, 246] }, margin: { left: 14, right: 14 },
      });
      doc.setFontSize(8); doc.setTextColor(150, 150, 150);
      doc.text("PilotHobb · pilothobb.com — this summary reflects totals recorded in your account.", 14, 285);
      if (!paid) watermark(doc);
      doc.save("pilothobb-summary.pdf");
    } finally { setBusy(""); }
  };

  const exportCSV = async () => {
    setBusy("csv");
    try {
      const flights = await load();
      const cols = ["date", "aircraft", "route", "from_aerodrome", "to_aerodrome", "reading_before", "reading_after", "flight_time", "pilot_role", "pic_time", "dual_time", "xc_time", "night_time", "instrument_actual", "landings", "takeoffs", "is_rpas", "remarks"];
      const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const rows = flights.map((f) => cols.map((c) => c === "aircraft" ? esc(acReg(f.aircraft)) : esc(f[c])).join(","));
      const csv = [cols.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a");
      a.href = url; a.download = "pilothobb-logbook.csv"; a.click(); URL.revokeObjectURL(url);
    } finally { setBusy(""); }
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={Download} title="Export Data" subtitle="Download your logbook for official records" />
      <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-5 mb-4 text-center">
        <p className="font-mono text-3xl font-bold text-cockpit-cream">{count === null ? "…" : count}</p>
        <p className="text-xs text-cockpit-muted mt-1">flights · {(pilot?.total_time || 0).toFixed(1)} total hours</p>
      </div>
      <div className="space-y-3">
        <button onClick={exportPDF} disabled={!!busy} className="w-full flex items-center gap-4 rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 active:scale-[0.99] transition-transform">
          <div className="w-11 h-11 rounded-xl bg-cockpit-amber/10 flex items-center justify-center shrink-0">{busy === "pdf" ? <Loader2 className="w-5 h-5 text-cockpit-amber animate-spin" /> : <FileText className="w-5 h-5 text-cockpit-amber" />}</div>
          <div className="flex-1 text-left"><p className="text-sm font-semibold text-cockpit-cream">Export as PDF</p><p className="text-xs text-cockpit-muted">Authority-ready, formatted logbook</p></div>
        </button>
        <button onClick={exportCSV} disabled={!!busy} className="w-full flex items-center gap-4 rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 active:scale-[0.99] transition-transform">
          <div className="w-11 h-11 rounded-xl bg-cockpit-valid/10 flex items-center justify-center shrink-0">{busy === "csv" ? <Loader2 className="w-5 h-5 text-cockpit-valid animate-spin" /> : <FileSpreadsheet className="w-5 h-5 text-cockpit-valid" />}</div>
          <div className="flex-1 text-left"><p className="text-sm font-semibold text-cockpit-cream">Export as CSV</p><p className="text-xs text-cockpit-muted">Spreadsheet-friendly, every field</p></div>
        </button>
        <button onClick={exportSummary} disabled={!!busy} className="w-full flex items-center gap-4 rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 active:scale-[0.99] transition-transform">
          <div className="w-11 h-11 rounded-xl bg-cockpit-glow-blue/10 flex items-center justify-center shrink-0">{busy === "sum" ? <Loader2 className="w-5 h-5 text-cockpit-glow-blue animate-spin" /> : <FileBarChart className="w-5 h-5 text-cockpit-glow-blue" />}</div>
          <div className="flex-1 text-left"><p className="text-sm font-semibold text-cockpit-cream">Printable summary</p><p className="text-xs text-cockpit-muted">One-page totals &amp; hours by aircraft</p></div>
        </button>

        {!paid && (
          <button onClick={() => setShowUpgrade(true)} className="w-full flex items-center gap-4 rounded-2xl bg-cockpit-amber/5 border border-cockpit-amber/30 p-4 active:scale-[0.99] transition-transform">
            <div className="w-11 h-11 rounded-xl bg-cockpit-amber/15 flex items-center justify-center shrink-0"><Lock className="w-5 h-5 text-cockpit-amber" /></div>
            <div className="flex-1 text-left"><p className="text-sm font-semibold text-cockpit-cream flex items-center gap-1.5">SACAA-format logbook &amp; clean PDF <Sparkles className="w-3.5 h-3.5 text-cockpit-amber" /></p><p className="text-xs text-cockpit-muted">Free PDFs are watermarked. Upgrade to CPL for authority-ready exports.</p></div>
          </button>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-cockpit-panel border border-cockpit-border p-4">
        <p className="text-sm font-semibold text-cockpit-cream flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-cockpit-glow-blue" /> Recalculate totals</p>
        <p className="text-xs text-cockpit-muted mt-1">Rebuilds your total hours, PIC/dual and landings from every logged flight. Use this if your dashboard totals look out of sync.</p>
        <button onClick={recalcTotals} disabled={!!busy} className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-cockpit-glow-blue/10 border border-cockpit-glow-blue/30 text-cockpit-glow-blue font-semibold py-2.5 text-sm disabled:opacity-50">
          {busy === "recalc" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {busy === "recalc" ? "Recalculating…" : "Recalculate from logbook"}
        </button>
        {recalcMsg && <p className="text-xs text-center text-cockpit-valid mt-2">{recalcMsg}</p>}
      </div>

      <p className="text-[11px] text-cockpit-muted text-center mt-6">Your data is always yours — export anytime, cancel anytime.</p>

      {showUpgrade && (
        <UpgradeSheet trigger="export" onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  );
}
