import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, LocateFixed, Square } from "lucide-react";

// Airspace groups drawn on the map, in the order they appear in the layer list.
const GROUPS = [
  { id: "ctr", label: "Control zones (CTR / ATZ)", on: true, style: { color: "#FF6B6B", weight: 2, fillOpacity: 0.1 } },
  { id: "tma", label: "TMA", on: true, style: { color: "#F5B73C", weight: 1.5, dashArray: "8 6", fillOpacity: 0.04 } },
  { id: "special", label: "Danger / restricted / prohibited", on: true, style: { color: "#C77DFF", weight: 1.5, dashArray: "4 4", fillOpacity: 0.08 } },
  { id: "cta", label: "Upper airspace (CTA)", on: false, style: { color: "#4A90D9", weight: 1, fillOpacity: 0.02 } },
  { id: "other", label: "Other areas", on: false, style: { color: "#8893A8", weight: 1, dashArray: "2 5", fillOpacity: 0.03 } },
  { id: "fields", label: "Aerodromes", on: true },
  { id: "navaids", label: "Navaids", on: false },
];

function groupOf(a) {
  const n = a.n.toUpperCase();
  if (a.t === "CTR" || n.startsWith("CTR") || n.startsWith("ATZ")) return "ctr";
  if (n.startsWith("TMA")) return "tma";
  if (n.startsWith("CTA")) return "cta";
  if (a.c === "P" || a.c === "R" || a.c === "Q") return "special";
  return "other";
}

const KT = 1.94384;
const FT = 3.28084;

export default function LiveVfrMap() {
  const boxRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({});
  const gpsRef = useRef({ watch: null, marker: null, ring: null, line: null, pts: [] });
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [info, setInfo] = useState("");
  const [visible, setVisible] = useState(() => Object.fromEntries(GROUPS.map((g) => [g.id, g.on])));
  const [panel, setPanel] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [fix, setFix] = useState(null);
  const [gpsError, setGpsError] = useState("");

  // Build the map once
  useEffect(() => {
    const map = L.map(boxRef.current, { center: [-26.51, 28.39], zoom: 9, minZoom: 5, maxZoom: 14, preferCanvas: true, scrollWheelZoom: false });
    mapRef.current = map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO · Contains information from the <a href="https://www.openflightmaps.org" target="_blank" rel="noreferrer">open flightmaps</a> database',
    }).addTo(map);
    GROUPS.forEach((g) => { layersRef.current[g.id] = L.layerGroup(); });

    let cancelled = false;
    fetch("/data/fa-airspace.json")
      .then((r) => { if (!r.ok) throw new Error("load"); return r.json(); })
      .then((data) => {
        if (cancelled) return;
        data.airspaces.forEach((a) => {
          const g = groupOf(a);
          const pts = [];
          for (let i = 0; i < a.p.length; i += 2) pts.push([a.p[i], a.p[i + 1]]);
          const base = GROUPS.find((x) => x.id === g).style;
          const style = a.c === "P" ? { ...base, color: "#FF6B6B", dashArray: null, fillOpacity: 0.18 } : a.c === "Q" ? { ...base, color: "#FF9D2E" } : base;
          L.polygon(pts, style)
            .bindTooltip(`<b>${a.n}</b><br/>${a.lo || "GND"} – ${a.hi || ""}`, { sticky: true })
            .addTo(layersRef.current[g]);
        });
        data.points.forEach((p) => {
          const field = p.s === 2 || p.s === 5;
          const navaid = p.s === 9 || p.s === 10;
          if (!field && !navaid) return;
          const m = L.circleMarker([p.lat, p.lon], field
            ? { radius: 4, color: "#F3ECDD", weight: 1.5, fillColor: p.s === 5 ? "#F3ECDD" : "#0A0E17", fillOpacity: 1 }
            : { radius: 3, color: "#6FE0A6", weight: 1.5, fillColor: "#0A0E17", fillOpacity: 1 });
          const extra = [p.e && `Elev ${p.e}`, p.r && `Rwy ${p.r}`, p.f].filter(Boolean).join(" · ");
          m.bindTooltip(`<b>${p.c}</b> ${p.n}${extra ? `<br/>${extra}` : ""}`);
          m.addTo(layersRef.current[field ? "fields" : "navaids"]);
        });
        GROUPS.forEach((g) => { if (g.on) layersRef.current[g.id].addTo(map); });
        setInfo(data.source || "");
        setStatus("ready");
      })
      .catch(() => { if (!cancelled) setStatus("error"); });

    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (gpsRef.current.watch != null) navigator.geolocation.clearWatch(gpsRef.current.watch);
      map.remove();
    };
  }, []);

  const toggle = (id) => {
    const map = mapRef.current;
    const next = !visible[id];
    if (next) layersRef.current[id].addTo(map); else map.removeLayer(layersRef.current[id]);
    setVisible({ ...visible, [id]: next });
  };

  const stop = () => {
    const g = gpsRef.current;
    if (g.watch != null) navigator.geolocation.clearWatch(g.watch);
    g.watch = null;
    setTracking(false);
  };

  const start = () => {
    setGpsError("");
    if (!("geolocation" in navigator)) { setGpsError("This browser has no location service."); return; }
    const map = mapRef.current;
    const g = gpsRef.current;
    g.pts = [];
    if (g.line) { map.removeLayer(g.line); g.line = null; }
    let first = true;
    g.watch = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, speed, altitude, heading } = pos.coords;
        const ll = [latitude, longitude];
        if (!g.marker) {
          g.ring = L.circle(ll, { radius: accuracy || 0, color: "#4A90D9", weight: 1, fillOpacity: 0.08 }).addTo(map);
          g.marker = L.circleMarker(ll, { radius: 7, color: "#0A0E17", weight: 2, fillColor: "#FF9D2E", fillOpacity: 1 }).addTo(map);
        } else {
          g.marker.setLatLng(ll);
          g.ring.setLatLng(ll).setRadius(accuracy || 0);
        }
        g.pts.push(ll);
        if (!g.line) g.line = L.polyline(g.pts, { color: "#C77DFF", weight: 3 }).addTo(map);
        else g.line.setLatLngs(g.pts);
        if (first) { map.setView(ll, Math.max(map.getZoom(), 11)); first = false; }
        setFix({
          gs: speed != null && speed >= 0 ? Math.round(speed * KT) : null,
          alt: altitude != null ? Math.round(altitude * FT) : null,
          trk: heading != null && !Number.isNaN(heading) ? Math.round(heading) : null,
          acc: accuracy != null ? Math.round(accuracy) : null,
        });
      },
      (err) => {
        setGpsError(err.code === 1 ? "Location permission was denied. Allow it in your browser to see your position." : "Could not get a GPS position.");
        stop();
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 },
    );
    setTracking(true);
  };

  const cell = (label, value, unit) => (
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-cockpit-muted">{label}</p>
      <p className="font-mono text-[18px] font-bold text-cockpit-cream">{value ?? "—"}<span className="ml-1 text-[10px] font-medium text-cockpit-muted">{unit}</span></p>
    </div>
  );

  return (
    <div className="ph-map ph-unzoom relative w-full overflow-hidden rounded-3xl border border-cockpit-border bg-cockpit-bg" style={{ height: "min(72vh, 760px)", minHeight: 420 }}>
      <div ref={boxRef} className="absolute inset-0" />

      {status === "loading" && (
        <div className="absolute inset-0 z-[500] animate-pulse bg-cockpit-panel">
          <div className="absolute left-4 top-4 h-14 w-64 rounded-xl bg-cockpit-panel-light" />
          <div className="absolute bottom-4 left-4 h-11 w-44 rounded-xl bg-cockpit-panel-light" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute left-1/2 top-4 z-[600] -translate-x-1/2 rounded-xl border border-cockpit-expired/40 bg-cockpit-panel px-4 py-2 text-[13px] text-cockpit-expired">
          Airspace data could not be loaded. Reload the page to try again.
        </div>
      )}

      {/* HUD */}
      <div className="absolute left-3 top-3 z-[600] flex gap-5 rounded-xl border border-cockpit-border bg-cockpit-panel/95 px-4 py-2.5 backdrop-blur">
        {cell("GS", fix?.gs, "kt")}
        {cell("ALT", fix?.alt != null ? fix.alt.toLocaleString() : null, "ft")}
        {cell("TRK", fix?.trk != null ? String(fix.trk).padStart(3, "0") : null, "°")}
        {fix?.acc != null && cell("GPS", `±${fix.acc}`, "m")}
      </div>

      {/* Layers */}
      <div className="absolute right-3 top-3 z-[600] flex flex-col items-end gap-2">
        <button type="button" onClick={() => setPanel(!panel)} aria-label="Map layers" aria-expanded={panel}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-cockpit-border bg-cockpit-panel/95 text-cockpit-cream hover:text-cockpit-amber">
          <Layers className="h-5 w-5" />
        </button>
        {panel && (
          <div className="w-64 rounded-xl border border-cockpit-border bg-cockpit-panel/95 p-3 backdrop-blur">
            {GROUPS.map((g) => (
              <label key={g.id} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-cockpit-cream">
                <input type="checkbox" checked={visible[g.id]} onChange={() => toggle(g.id)} className="h-4 w-4 accent-[#FF9D2E]" />
                {g.style && <span className="h-0.5 w-5 shrink-0" style={{ background: g.style.color }} />}
                {g.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* GPS */}
      <div className="absolute bottom-7 left-3 z-[600] flex max-w-[80%] flex-col items-start gap-2">
        {gpsError && <p className="rounded-lg border border-cockpit-expired/40 bg-cockpit-panel px-3 py-1.5 text-[12px] text-cockpit-expired">{gpsError}</p>}
        {tracking ? (
          <button type="button" onClick={stop} className="inline-flex items-center gap-2 rounded-xl bg-cockpit-expired px-4 py-2.5 text-[13px] font-bold text-cockpit-bg">
            <Square className="h-3.5 w-3.5 fill-current" /> Stop tracking
          </button>
        ) : (
          <button type="button" onClick={start} className="inline-flex items-center gap-2 rounded-xl bg-cockpit-amber px-4 py-2.5 text-[13px] font-bold text-cockpit-bg hover:brightness-110">
            <LocateFixed className="h-4 w-4" /> Show my position
          </button>
        )}
      </div>

      <p className="pointer-events-none absolute bottom-7 right-3 z-[600] rounded-lg bg-cockpit-bg/80 px-2.5 py-1 text-[10.5px] text-cockpit-muted">
        Not for navigation{info ? ` · ${info.replace("open flightmaps (openflightmaps.org), ", "")}` : ""}
      </p>
    </div>
  );
}
