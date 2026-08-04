import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import usePilot from "@/hooks/usePilot";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportData() {
  const { pilot } = usePilot();
  const [aircraft, setAircraft] = useState([]);
  const [count, setCount] = useState(null);
  const [busy, setBusy] = useState("");
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
      doc.save("pilothobb-logbook.pdf");
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
      </div>
      <p className="text-[11px] text-cockpit-muted text-center mt-6">Your data is always yours — export anytime, cancel anytime.</p>
    </div>
  );
}
