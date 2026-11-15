import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Layers, LocateFixed, Square } from "lucide-react";

const FONTS = "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf";
const OFM = "© OpenFreeMap © OpenStreetMap";
const DATA_CREDIT = "Airspace: open flightmaps";

// Base maps — all free to use without an API key.
const BASEMAPS = {
  standard: { label: "Standard", url: "https://tiles.openfreemap.org/styles/liberty" },
  light: { label: "Light", url: "https://tiles.openfreemap.org/styles/positron" },
  dark: { label: "Dark", url: "https://tiles.openfreemap.org/styles/dark", dark: true },
  satellite: {
    label: "Satellite", dark: true,
    raster: { maxzoom: 15, tiles: ["https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg"] },
    attribution: "Sentinel-2 cloudless by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2016)",
  },
  terrain: {
    label: "Terrain",
    raster: { maxzoom: 17, tiles: ["a", "b", "c"].map((s) => `https://${s}.tile.opentopomap.org/{z}/{x}/{y}.png`) },
    attribution: "© OpenTopoMap (CC-BY-SA) © OpenStreetMap contributors",
  },
};
function styleFor(key) {
  const b = BASEMAPS[key];
  if (!b.raster) return b.url;
  return {
    version: 8,
    glyphs: FONTS,
    sources: { base: { type: "raster", tiles: b.raster.tiles, tileSize: 256, maxzoom: b.raster.maxzoom, attribution: b.attribution } },
    layers: [{ id: "base", type: "raster", source: "base" }],
  };
}

// Airspace groups, in the order they appear in the layer list.
const GROUPS = [
  { id: "ctr", label: "Control zones (CTR / ATZ)", on: true, color: "#D6336C" },
  { id: "tma", label: "TMA", on: true, color: "#1C7ED6" },
  { id: "special", label: "Danger / restricted / prohibited", on: true, color: "#E03131" },
  { id: "cta", label: "Upper airspace (CTA)", on: false, color: "#5C7CFA" },
  { id: "other", label: "Other areas", on: false, color: "#868E96" },
  { id: "fields", label: "Aerodromes", on: true },
  { id: "navaids", label: "Navaids", on: false },
];
const COLOR = ["match", ["get", "group"], "ctr", "#D6336C", "tma", "#1C7ED6", "special", "#E03131", "cta", "#5C7CFA", "#868E96"];

function groupOf(a) {
  const n = a.n.toUpperCase();
  if (a.t === "CTR" || n.startsWith("CTR") || n.startsWith("ATZ")) return "ctr";
  if (n.startsWith("TMA")) return "tma";
  if (n.startsWith("CTA")) return "cta";
  if (a.c === "P" || a.c === "R" || a.c === "Q") return "special";
  return "other";
}
function centroid(r) {
  let a = 0, x = 0, y = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const f = r[i][0] * r[j][1] - r[j][0] * r[i][1];
    a += f; x += (r[i][0] + r[j][0]) * f; y += (r[i][1] + r[j][1]) * f;
  }
  return a ? [x / (3 * a), y / (3 * a)] : r[0];
}
const limits = (a) => [a.hi, a.lo || "GND"].filter(Boolean).join(" / ");

function toGeo(data) {
  const areas = [], labels = [], points = [];
  data.airspaces.forEach((a) => {
    const ring = [];
    for (let i = 0; i < a.p.length; i += 2) ring.push([a.p[i + 1], a.p[i]]);
    if (ring.length < 3) return;
    ring.push(ring[0]);
    const group = groupOf(a);
    const solid = group === "ctr" || a.c === "P";
    const name = a.n.replace(/\s+\d{3}\.\d+.*$/, "").replace(/\s*:\s.*$/, "");
    areas.push({ type: "Feature", properties: { group, solid, name: a.n, limits: limits(a) }, geometry: { type: "Polygon", coordinates: [ring] } });
    labels.push({ type: "Feature", properties: { group, label: `${name}\n${limits(a)}` }, geometry: { type: "Point", coordinates: centroid(ring) } });
  });
  data.points.forEach((p) => {
    const field = p.s === 2 || p.s === 5;
    const navaid = p.s === 9 || p.s === 10;
    if (!field && !navaid) return;
    points.push({
      type: "Feature",
      properties: {
        group: field ? "fields" : "navaids", code: p.c, name: p.n, paved: p.s === 5,
        icao: /^FA[A-Z]{2}$/.test(p.c), info: [p.e && `Elev ${p.e}`, p.r && `Rwy ${p.r}`, p.f].filter(Boolean).join(" · "),
      },
      geometry: { type: "Point", coordinates: [p.lon, p.lat] },
    });
  });
  const fc = (features) => ({ type: "FeatureCollection", features });
  return { areas: fc(areas), labels: fc(labels), points: fc(points) };
}

const KT = 1.94384;
const FT = 3.28084;
const PLANE = '<svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="17" fill="rgba(255,157,46,.22)"/><path d="M19 6 L28 30 L19 24.5 L10 30 Z" fill="#FF9D2E" stroke="#0A0E17" stroke-width="1.6" stroke-linejoin="round"/></svg>';

export default function LiveVfrMap() {
  const boxRef = useRef(null);
  const mapRef = useRef(null);
  const geoRef = useRef(null);
  const visRef = useRef(Object.fromEntries(GROUPS.map((g) => [g.id, g.on])));
  const baseRef = useRef("standard");
  const gpsRef = useRef({ watch: null, marker: null, pts: [] });
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [visible, setVisible] = useState(visRef.current);
  const [base, setBase] = useState("standard");
  const [panel, setPanel] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [fix, setFix] = useState(null);
  const [gpsError, setGpsError] = useState("");

  // (Re)draws airspace, aerodromes and the GPS track on top of whichever base map is showing.
  const addOverlays = () => {
    const map = mapRef.current, geo = geoRef.current;
    if (!map || !geo || map.getSource("ph-areas")) return;
    const dark = !!BASEMAPS[baseRef.current].dark;
    const ink = dark ? "#F3ECDD" : "#1B2437";
    const halo = dark ? "rgba(10,14,23,0.9)" : "rgba(255,255,255,0.92)";
    map.addSource("ph-areas", { type: "geojson", data: geo.areas });
    map.addSource("ph-labels", { type: "geojson", data: geo.labels });
    map.addSource("ph-points", { type: "geojson", data: geo.points });
    map.addSource("ph-track", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: gpsRef.current.pts } } });
    map.addLayer({ id: "ph-fill", type: "fill", source: "ph-areas",
      paint: { "fill-color": COLOR, "fill-opacity": ["match", ["get", "group"], "ctr", 0.12, "special", 0.14, "tma", 0.05, 0.03] } });
    map.addLayer({ id: "ph-line-solid", type: "line", source: "ph-areas", filter: ["==", ["get", "solid"], true],
      paint: { "line-color": COLOR, "line-width": 2 } });
    map.addLayer({ id: "ph-line-dash", type: "line", source: "ph-areas", filter: ["==", ["get", "solid"], false],
      paint: { "line-color": COLOR, "line-width": 1.6, "line-dasharray": [4, 3] } });
    map.addLayer({ id: "ph-label", type: "symbol", source: "ph-labels", minzoom: 7.5,
      layout: { "text-field": ["get", "label"], "text-font": ["Noto Sans Bold"], "text-size": 10.5, "text-line-height": 1.25, "text-max-width": 12, "text-padding": 6 },
      paint: { "text-color": dark ? ["match", ["get", "group"], "ctr", "#FF8FB1", "tma", "#74C0FC", "special", "#FF8787", "cta", "#91A7FF", "#CED4DA"] : COLOR, "text-halo-color": halo, "text-halo-width": 1.6 } });
    map.addLayer({ id: "ph-pt", type: "circle", source: "ph-points",
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 2, 9, 4.5, 12, 6],
        "circle-color": ["case", ["==", ["get", "group"], "navaids"], "#2F9E44", ["get", "paved"], "#7048E8", halo],
        "circle-stroke-color": ["case", ["==", ["get", "group"], "navaids"], "#2F9E44", "#7048E8"],
        "circle-stroke-width": 1.6,
      } });
    map.addLayer({ id: "ph-pt-label", type: "symbol", source: "ph-points", minzoom: 7,
      filter: ["any", ["get", "icao"], [">=", ["zoom"], 9.5]],
      layout: { "text-field": ["step", ["zoom"], ["get", "code"], 10.5, ["concat", ["get", "code"], "\n", ["get", "name"]]],
        "text-font": ["Noto Sans Bold"], "text-size": 10.5, "text-offset": [0, 0.9], "text-anchor": "top", "text-max-width": 9 },
      paint: { "text-color": ink, "text-halo-color": halo, "text-halo-width": 1.6 } });
    map.addLayer({ id: "ph-track", type: "line", source: "ph-track", layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#FF9D2E", "line-width": 4 } });
    applyFilters();
  };

  const applyFilters = () => {
    const map = mapRef.current;
    if (!map || !map.getLayer("ph-fill")) return;
    const on = ["literal", GROUPS.filter((g) => visRef.current[g.id]).map((g) => g.id)];
    const inGroup = ["in", ["get", "group"], on];
    map.setFilter("ph-fill", inGroup);
    map.setFilter("ph-line-solid", ["all", inGroup, ["==", ["get", "solid"], true]]);
    map.setFilter("ph-line-dash", ["all", inGroup, ["==", ["get", "solid"], false]]);
    map.setFilter("ph-label", inGroup);
    map.setFilter("ph-pt", inGroup);
    map.setFilter("ph-pt-label", ["all", inGroup, ["any", ["get", "icao"], [">=", ["zoom"], 9.5]]]);
  };

  useEffect(() => {
    const map = new maplibregl.Map({
      container: boxRef.current, style: styleFor("standard"), center: [28.3, -26.3], zoom: 8.2, minZoom: 4.5, maxZoom: 15,
      attributionControl: false, cooperativeGestures: true,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: `${OFM} · ${DATA_CREDIT}` }), "bottom-right");
    map.on("style.load", addOverlays);

    const popup = new maplibregl.Popup({ closeButton: false, maxWidth: "280px" });
    map.on("click", (e) => {
      const ids = ["ph-pt", "ph-fill"].filter((id) => map.getLayer(id));
      const hits = ids.length ? map.queryRenderedFeatures(e.point, { layers: ids }) : [];
      if (!hits.length) return;
      const seen = new Set();
      const rows = hits.filter((f) => { const k = f.properties.name + f.properties.limits + f.properties.code; if (seen.has(k)) return false; seen.add(k); return true; })
        .slice(0, 8).map((f) => (f.layer.id === "ph-pt"
          ? `<div><b>${f.properties.code}</b> ${f.properties.name}${f.properties.info ? `<br><span>${f.properties.info}</span>` : ""}</div>`
          : `<div><b>${f.properties.name}</b><br><span>${f.properties.limits}</span></div>`));
      popup.setLngLat(e.lngLat).setHTML(`<div class="ph-pop">${rows.join("")}</div>`).addTo(map);
    });
    ["ph-fill", "ph-pt"].forEach((id) => {
      map.on("mouseenter", id, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", id, () => { map.getCanvas().style.cursor = ""; });
    });

    let cancelled = false;
    fetch("/data/fa-airspace.json")
      .then((r) => { if (!r.ok) throw new Error("load"); return r.json(); })
      .then((data) => {
        if (cancelled) return;
        geoRef.current = toGeo(data);
        if (map.isStyleLoaded()) addOverlays();
        setStatus("ready");
      })
      .catch(() => { if (!cancelled) setStatus("error"); });

    return () => {
      cancelled = true;
      if (gpsRef.current.watch != null) navigator.geolocation.clearWatch(gpsRef.current.watch);
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id) => {
    visRef.current = { ...visRef.current, [id]: !visRef.current[id] };
    setVisible(visRef.current);
    applyFilters();
  };
  const pickBase = (key) => {
    if (key === baseRef.current) return;
    baseRef.current = key;
    setBase(key);
    mapRef.current.setStyle(styleFor(key), { diff: false });
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
    const map = mapRef.current, g = gpsRef.current;
    g.pts = [];
    let first = true;
    g.watch = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, speed, altitude, heading } = pos.coords;
        const ll = [longitude, latitude];
        if (!g.marker) {
          const el = document.createElement("div");
          el.innerHTML = PLANE;
          g.marker = new maplibregl.Marker({ element: el, rotationAlignment: "map" }).setLngLat(ll).addTo(map);
        } else g.marker.setLngLat(ll);
        if (heading != null && !Number.isNaN(heading)) g.marker.setRotation(heading);
        g.pts.push(ll);
        const src = map.getSource("ph-track");
        if (src) src.setData({ type: "Feature", geometry: { type: "LineString", coordinates: g.pts } });
        if (first) { map.easeTo({ center: ll, zoom: Math.max(map.getZoom(), 10.5) }); first = false; }
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
      <p className="font-mono text-[18px] font-bold leading-tight text-cockpit-cream">{value ?? "—"}<span className="ml-1 text-[10px] font-medium text-cockpit-muted">{unit}</span></p>
    </div>
  );

  return (
    <div className="ph-map ph-unzoom relative w-full overflow-hidden rounded-3xl border border-cockpit-border bg-cockpit-panel" style={{ height: "min(78vh, 820px)", minHeight: 440 }}>
      <div ref={boxRef} className="absolute inset-0" />

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 z-10 animate-pulse bg-cockpit-panel">
          <div className="absolute left-4 top-4 h-14 w-64 rounded-xl bg-cockpit-panel-light" />
          <div className="absolute bottom-4 left-4 h-11 w-44 rounded-xl bg-cockpit-panel-light" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-xl border border-cockpit-expired/40 bg-cockpit-panel px-4 py-2 text-[13px] text-cockpit-expired">
          Airspace data could not be loaded. Reload the page to try again.
        </div>
      )}

      {/* HUD */}
      <div className="absolute left-3 top-3 z-20 flex gap-5 rounded-xl border border-cockpit-border bg-cockpit-panel/95 px-4 py-2.5 shadow-lg backdrop-blur">
        {cell("GS", fix?.gs, "kt")}
        {cell("ALT", fix?.alt != null ? fix.alt.toLocaleString() : null, "ft")}
        {cell("TRK", fix?.trk != null ? String(fix.trk).padStart(3, "0") : null, "°")}
        {fix?.acc != null && cell("GPS", `±${fix.acc}`, "m")}
      </div>

      {/* Layers */}
      <div className="absolute right-3 top-3 z-20 flex flex-col items-end gap-2">
        <button type="button" onClick={() => setPanel(!panel)} aria-label="Map layers" aria-expanded={panel}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-cockpit-border bg-cockpit-panel/95 text-cockpit-cream shadow-lg hover:text-cockpit-amber">
          <Layers className="h-5 w-5" />
        </button>
        {panel && (
          <div className="w-64 rounded-xl border border-cockpit-border bg-cockpit-panel/95 p-3 shadow-lg backdrop-blur">
            <p className="mb-2 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-cockpit-muted">Base map</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {Object.entries(BASEMAPS).map(([key, b]) => (
                <button key={key} type="button" onClick={() => pickBase(key)}
                  className={`rounded-lg border px-2.5 py-1 text-[12px] font-semibold ${base === key ? "border-cockpit-amber bg-cockpit-amber text-cockpit-bg" : "border-cockpit-border text-cockpit-cream hover:border-cockpit-amber/50"}`}>
                  {b.label}
                </button>
              ))}
            </div>
            <p className="mb-1 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-cockpit-muted">Show</p>
            {GROUPS.map((g) => (
              <label key={g.id} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-cockpit-cream">
                <input type="checkbox" checked={visible[g.id]} onChange={() => toggle(g.id)} className="h-4 w-4 accent-[#FF9D2E]" />
                {g.color && <span className="h-0.5 w-5 shrink-0" style={{ background: g.color }} />}
                {g.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* GPS */}
      <div className="absolute bottom-4 left-3 z-20 flex max-w-[70%] flex-col items-start gap-2">
        {gpsError && <p className="rounded-lg border border-cockpit-expired/40 bg-cockpit-panel px-3 py-1.5 text-[12px] text-cockpit-expired">{gpsError}</p>}
        <div className="flex flex-wrap items-center gap-2">
          {tracking ? (
            <button type="button" onClick={stop} className="inline-flex items-center gap-2 rounded-xl bg-cockpit-expired px-4 py-2.5 text-[13px] font-bold text-cockpit-bg shadow-lg">
              <Square className="h-3.5 w-3.5 fill-current" /> Stop tracking
            </button>
          ) : (
            <button type="button" onClick={start} className="inline-flex items-center gap-2 rounded-xl bg-cockpit-amber px-4 py-2.5 text-[13px] font-bold text-cockpit-bg shadow-lg hover:brightness-110">
              <LocateFixed className="h-4 w-4" /> Show my position
            </button>
          )}
          <span className="rounded-lg bg-cockpit-bg/85 px-2.5 py-1.5 text-[11px] font-medium text-cockpit-cream">Not for navigation</span>
        </div>
      </div>
    </div>
  );
}
