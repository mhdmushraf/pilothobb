import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { X, Loader2, Printer } from "lucide-react";

/* SACAA-style physical logbook view.
   Reconstructs the numbered 32-column civil logbook layout from the pilot's
   recorded flights. Manned flights only (RPAS is logged separately). */

const HRS = (v) => (v > 0 ? v.toFixed(1) : "-");
const INT = (v) => (v > 0 ? v : "-");
const ddmmyy = (d) => {
  if (!d) return "";
  const x = new Date(d);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(x.getDate())}/${p(x.getMonth() + 1)}/${String(x.getFullYear()).slice(-2)}`;
};

// role → index in [Dual, PIC, PICUS, Co-Plt]
const roleIdx = (r) => ({ Dual: 0, PIC: 1, PICUS: 2, "Co-pilot": 3, "Co-Plt": 3 }[r] ?? 0);

function computeRow(f, ac, pilotName) {
  const c = {}; // c8,c9,c13,c14..c29,c30,c31
  const day = Math.max(0, (f.flight_time || 0) - (f.night_time || 0));
  const night = f.night_time || 0;
  const idx = roleIdx(f.pilot_role);
  const isME = ac?.category === "MEP";
  const base = isME ? 22 : 14; // ME day base 22, SE day base 14
  const nightBase = base + 4;
  c[base + idx] = (c[base + idx] || 0) + day;
  c[nightBase + idx] = (c[nightBase + idx] || 0) + night;
  c.c8 = f.instrument_actual || 0;
  c.c9 = f.instrument_sim || 0;
  c.c13 = f.sim_time || 0;
  c.c30 = Math.max(0, (f.landings || 0) - (f.night_landings || 0));
  c.c31 = f.night_landings || 0;
  return {
    date: ddmmyy(f.date),
    type: ac?.type || "—",
    reg: ac?.registration || "—",
    pic: f.pic_name || (f.pilot_role === "PIC" ? (pilotName || "SELF") : "—"),
    details: f.remarks || f.route || `${f.from_aerodrome || ""}${f.to_aerodrome ? "–" + f.to_aerodrome : ""}` || "—",
    c,
  };
}

const ENGINE_KEYS = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

export default function LogbookView({ pilot, aircraftList = [], onClose }) {
  const [flights, setFlights] = useState(null);
  const acById = useMemo(() => {
    const m = {};
    aircraftList.forEach((a) => { m[a.id] = a; });
    return m;
  }, [aircraftList]);

  useEffect(() => {
    base44.entities.Flight.list("date", 1000)
      .then((all) => setFlights(all.filter((f) => !f.is_rpas)))
      .catch(() => setFlights([]));
  }, []);

  const rows = useMemo(() => {
    if (!flights) return [];
    return flights.map((f) => {
      const acId = typeof f.aircraft === "string" ? f.aircraft : f.aircraft?.id;
      return computeRow(f, acById[acId], pilot?.full_name);
    });
  }, [flights, acById, pilot]);

  const totals = useMemo(() => {
    const t = { c8: 0, c9: 0, c13: 0, c30: 0, c31: 0 };
    ENGINE_KEYS.forEach((k) => { t[k] = 0; });
    rows.forEach((r) => {
      t.c8 += r.c.c8 || 0; t.c9 += r.c.c9 || 0; t.c13 += r.c.c13 || 0;
      t.c30 += r.c.c30 || 0; t.c31 += r.c.c31 || 0;
      ENGINE_KEYS.forEach((k) => { t[k] += r.c[k] || 0; });
    });
    return t;
  }, [rows]);

  const OPEN_FIELDS = [
    ["opening_se_day_dual", "SE Day Dual", 14], ["opening_se_day_pic", "SE Day PIC", 15],
    ["opening_se_night_dual", "SE Night Dual", 18], ["opening_se_night_pic", "SE Night PIC", 19],
    ["opening_me_day_dual", "ME Day Dual", 22], ["opening_me_day_pic", "ME Day PIC", 23],
    ["opening_instrument", "Instrument", "c8"], ["opening_ldg_day", "Landings Day", "c30"],
    ["opening_ldg_night", "Landings Night", "c31"],
  ];
  const [opening, setOpening] = useState(() => {
    const o = {}; OPEN_FIELDS.forEach(([k]) => { o[k] = pilot?.[k] || 0; }); return o;
  });
  const [editOpen, setEditOpen] = useState(false);
  const [openForm, setOpenForm] = useState({});
  const [savingOpen, setSavingOpen] = useState(false);
  const openCol = {};
  OPEN_FIELDS.forEach(([k, , col]) => { openCol[col] = opening[k] || 0; });
  const openVal = (key) => openCol[key] || 0;
  const grand = (key) => (openCol[key] || 0) + (totals[key] || 0);
  const saveOpening = async () => {
    if (!pilot?.id) { setEditOpen(false); return; }
    setSavingOpen(true);
    const patch = {}; OPEN_FIELDS.forEach(([k]) => { patch[k] = Number(openForm[k]) || 0; });
    try { await base44.entities.Pilot.update(pilot.id, patch); setOpening(patch); setEditOpen(false); }
    catch { /* ignore */ } finally { setSavingOpen(false); }
  };

  const th = "border border-slate-300 px-1.5 py-1 text-[10px] font-semibold text-slate-700 text-center whitespace-nowrap";
  const td = "border border-slate-200 px-1.5 py-1 text-[11px] text-slate-800 text-center whitespace-nowrap";
  const tdL = "border border-slate-200 px-1.5 py-1 text-[11px] text-slate-800 text-left whitespace-nowrap";
  const numCell = (v, tint) => <td className={td} style={tint ? { background: tint } : undefined}>{HRS(v)}</td>;

  const DAY = "#FDFBEA", NIGHT = "#EEF1FB"; // faint column tints

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/50">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div>
          <p className="text-sm font-bold text-slate-900">Pilot Logbook — official view</p>
          <p className="text-[11px] text-slate-500">{pilot?.full_name || "Pilot"}{pilot?.authority ? ` · ${pilot.authority}` : ""} · SACAA-format</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { const f = {}; OPEN_FIELDS.forEach(([k]) => { f[k] = opening[k] || 0; }); setOpenForm(f); setEditOpen(true); }} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 border border-indigo-300 rounded-lg px-3 py-1.5 hover:bg-indigo-50">
            <Pencil className="w-3.5 h-3.5" /> Opening balances
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg px-3 py-1.5">
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white" id="logbook-print-area">
        {flights === null ? (
          <div className="flex items-center justify-center py-24 text-slate-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading logbook…</div>
        ) : (
          <table className="border-collapse" style={{ minWidth: 1600 }}>
            <thead className="sticky top-0 z-10 bg-white">
              {/* Row 1 — group headers */}
              <tr>
                <th className={th} rowSpan={3}>(1)<br />DATE<br />(DD/MM/YY)</th>
                <th className={th} rowSpan={3}>(2)<br />Type</th>
                <th className={th} rowSpan={3}>(3)<br />Reg Marks</th>
                <th className={th} rowSpan={3}>(4)<br />Pilot in<br />Command</th>
                <th className={th} rowSpan={3} style={{ minWidth: 160 }}>(5)<br />Flight Details</th>
                <th className={th} rowSpan={3}>(6)<br />Nav Aids</th>
                <th className={th} colSpan={3} style={{ background: "#F3F0FB" }}>(7-9) Instrument Time</th>
                <th className={th} colSpan={3} style={{ background: "#FDF3E7" }}>(10-12) Instructor</th>
                <th className={th} rowSpan={3} style={{ background: "#F3F0FB" }}>(13)<br />FSTD<br />ACTUAL</th>
                <th className={th} colSpan={8} style={{ background: "#EAF7EE" }}>(14-21) Single Engine</th>
                <th className={th} colSpan={8} style={{ background: "#EAF3F7" }}>(22-29) Multi Engine</th>
                <th className={th} colSpan={2} style={{ background: "#FCF3C7" }}>(30-31) Landings</th>
                <th className={th} rowSpan={3} style={{ minWidth: 140 }}>(32)<br />Remarks</th>
              </tr>
              {/* Row 2 — sub groups */}
              <tr>
                <th className={th} rowSpan={2} style={{ background: "#F3F0FB" }}>Place</th>
                <th className={th} rowSpan={2} style={{ background: "#F3F0FB" }}>Actual<br />Time</th>
                <th className={th} rowSpan={2} style={{ background: "#F3F0FB" }}>FSTD<br />Time</th>
                <th className={th} rowSpan={2} style={{ background: "#FDF3E7" }}>SE</th>
                <th className={th} rowSpan={2} style={{ background: "#FDF3E7" }}>ME</th>
                <th className={th} rowSpan={2} style={{ background: "#FDF3E7" }}>FSTD<br />Time</th>
                <th className={th} colSpan={4} style={{ background: "#FCF6DC" }}>Day</th>
                <th className={th} colSpan={4} style={{ background: "#E9EEFB" }}>Night</th>
                <th className={th} colSpan={4} style={{ background: "#FCF6DC" }}>Day</th>
                <th className={th} colSpan={4} style={{ background: "#E9EEFB" }}>Night</th>
                <th className={th} rowSpan={2} style={{ background: "#FCF3C7" }}>Day</th>
                <th className={th} rowSpan={2} style={{ background: "#DCE6FA" }}>Night</th>
              </tr>
              {/* Row 3 — numbered columns */}
              <tr>
                <th className={th} style={{ background: "#FCF6DC" }}>(14)<br />Dual</th>
                <th className={th} style={{ background: "#FCF6DC" }}>(15)<br />PIC</th>
                <th className={th} style={{ background: "#FCF6DC" }}>(16)<br />PICUS</th>
                <th className={th} style={{ background: "#FCF6DC" }}>(17)<br />Co-Plt</th>
                <th className={th} style={{ background: "#E9EEFB" }}>(18)<br />Dual</th>
                <th className={th} style={{ background: "#E9EEFB" }}>(19)<br />PIC</th>
                <th className={th} style={{ background: "#E9EEFB" }}>(20)<br />PICUS</th>
                <th className={th} style={{ background: "#E9EEFB" }}>(21)<br />Co-Plt</th>
                <th className={th} style={{ background: "#FCF6DC" }}>(22)<br />Dual</th>
                <th className={th} style={{ background: "#FCF6DC" }}>(23)<br />PIC</th>
                <th className={th} style={{ background: "#FCF6DC" }}>(24)<br />PICUS</th>
                <th className={th} style={{ background: "#FCF6DC" }}>(25)<br />Co-Plt</th>
                <th className={th} style={{ background: "#E9EEFB" }}>(26)<br />Dual</th>
                <th className={th} style={{ background: "#E9EEFB" }}>(27)<br />PIC</th>
                <th className={th} style={{ background: "#E9EEFB" }}>(28)<br />PICUS</th>
                <th className={th} style={{ background: "#E9EEFB" }}>(29)<br />Co-Plt</th>
              </tr>
            </thead>
            <tbody>
              {/* Opening hours (carried forward from a previous logbook) */}
              <tr style={{ background: "#F1F5FB" }}>
                <td className={th} colSpan={7} style={{ textAlign: "center" }}>OPENING HOURS</td>
                <td className={td}>{HRS(openVal("c8"))}</td>
                <td className={td}>-</td>
                <td className={td}>-</td><td className={td}>-</td><td className={td}>-</td>
                <td className={td}>-</td>
                {ENGINE_KEYS.map((k, i) => <td key={k} className={td} style={{ background: (i % 8) < 4 ? DAY : NIGHT }}>{HRS(openVal(k))}</td>)}
                <td className={td} style={{ background: DAY }}>{INT(openVal("c30"))}</td>
                <td className={td} style={{ background: NIGHT }}>{INT(openVal("c31"))}</td>
                <td className={td}></td>
              </tr>
              {/* System totals */}
              <tr style={{ background: "#FCFBEF", fontWeight: 700 }}>
                <td className={th} colSpan={7} style={{ textAlign: "center" }}>HOURS FROM SYSTEM FLIGHTS</td>
                <td className={td}>{HRS(totals.c8)}</td>
                <td className={td}>{HRS(totals.c9)}</td>
                <td className={td}>-</td><td className={td}>-</td><td className={td}>-</td>
                <td className={td}>{HRS(totals.c13)}</td>
                {ENGINE_KEYS.map((k, i) => <td key={k} className={td} style={{ background: (i % 8) < 4 ? DAY : NIGHT }}>{HRS(totals[k])}</td>)}
                <td className={td} style={{ background: DAY }}>{INT(totals.c30)}</td>
                <td className={td} style={{ background: NIGHT }}>{INT(totals.c31)}</td>
                <td className={td}></td>
              </tr>
              {/* Grand total (opening + system) */}
              <tr style={{ background: "#EDE9FE", fontWeight: 700 }}>
                <td className={th} colSpan={7} style={{ textAlign: "center" }}>TOTAL (OPENING + SYSTEM)</td>
                <td className={td}>{HRS(grand("c8"))}</td>
                <td className={td}>{HRS(totals.c9)}</td>
                <td className={td}>-</td><td className={td}>-</td><td className={td}>-</td>
                <td className={td}>{HRS(totals.c13)}</td>
                {ENGINE_KEYS.map((k, i) => <td key={k} className={td} style={{ background: (i % 8) < 4 ? DAY : NIGHT }}>{HRS(grand(k))}</td>)}
                <td className={td} style={{ background: DAY }}>{INT(grand("c30"))}</td>
                <td className={td} style={{ background: NIGHT }}>{INT(grand("c31"))}</td>
                <td className={td}></td>
              </tr>
              {/* Flight rows */}
              {rows.map((r, ri) => (
                <tr key={ri}>
                  <td className={td}>{r.date}</td>
                  <td className={td}>{r.type}</td>
                  <td className={td} style={{ color: "#B91C1C", fontWeight: 600 }}>{r.reg}</td>
                  <td className={tdL}>{r.pic}</td>
                  <td className={tdL}>{r.details}</td>
                  <td className={td}>-</td>
                  <td className={td}>-</td>
                  <td className={td}>{HRS(r.c.c8)}</td>
                  <td className={td}>{HRS(r.c.c9)}</td>
                  <td className={td}>-</td><td className={td}>-</td><td className={td}>-</td>
                  <td className={td}>{HRS(r.c.c13)}</td>
                  {ENGINE_KEYS.map((k, i) => numCell(r.c[k] || 0, (i % 8) < 4 ? DAY : NIGHT))}
                  <td className={td} style={{ background: DAY }}>{INT(r.c.c30)}</td>
                  <td className={td} style={{ background: NIGHT }}>{INT(r.c.c31)}</td>
                  <td className={tdL} style={{ whiteSpace: "normal", minWidth: 140 }}></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td className={td} colSpan={32} style={{ padding: 40, color: "#94A3B8" }}>No manned flights logged yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {editOpen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 max-h-[90%] overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-900">Opening balances</p>
              <button onClick={() => setEditOpen(false)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">Hours &amp; landings carried forward from a previous (paper) logbook. These fill the OPENING HOURS row and are added into the grand total.</p>
            <div className="grid grid-cols-2 gap-2">
              {OPEN_FIELDS.map(([k, label]) => (
                <label key={k} className="text-[11px] text-slate-600">{label}
                  <input type="number" step="0.1" value={openForm[k] ?? 0} onChange={(e) => setOpenForm({ ...openForm, [k]: e.target.value })}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-slate-800" />
                </label>
              ))}
            </div>
            <button onClick={saveOpening} disabled={savingOpen} className="mt-4 w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50">{savingOpen ? "Saving…" : "Save balances"}</button>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #logbook-print-area, #logbook-print-area * { visibility: visible; }
          #logbook-print-area { position: absolute; left: 0; top: 0; width: 100%; overflow: visible; }
        }
      `}</style>
    </div>
  );
}
