import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Map as MapIcon, Plane } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip as LTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Built-in coordinates for common ICAO/IATA aerodromes. User-defined Aerodrome
// entities (with lat/lon) are merged on top of this so anyone can extend it.
const AERO_COORDS = {
  // South Africa
  FALA: [-25.938, 28.140], FAGC: [-25.986, 28.140], FAWB: [-25.653, 28.224],
  FAOR: [-26.139, 28.246], FAJS: [-26.139, 28.246], FACT: [-33.965, 18.602],
  FADN: [-29.970, 30.951], FAPE: [-33.985, 25.617], FAKN: [-25.383, 31.105],
  FABL: [-29.093, 26.302], FAGG: [-34.005, 22.379], FAPN: [-25.333, 28.393],
  FASI: [-25.876, 27.777], FARG: [-28.741, 32.093], FAKD: [-27.657, 27.316],
  FAWM: [-25.831, 30.984], FAHS: [-24.369, 31.049], FAUP: [-28.399, 21.260],
  FAEL: [-33.036, 27.826], FAPG: [-34.199, 22.038], FAMM: [-29.087, 26.301],
  // Common international
  EGLL: [51.470, -0.461], KJFK: [40.640, -73.779], KLAX: [33.942, -118.408],
  OMDB: [25.253, 55.365], VABB: [19.089, 72.868], VIDP: [28.556, 77.100],
  YSSY: [-33.946, 151.177], NZAA: [-37.008, 174.792], FYWH: [-22.480, 17.470],
  FVHA: [-17.918, 31.093], HKJK: [-1.319, 36.928], DNMM: [6.577, 3.321],
};

function normCode(s) {
  if (!s) return "";
  const m = String(s).toUpperCase().match(/[A-Z]{3,4}/);
  return m ? m[0] : String(s).toUpperCase().trim();
}

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 ${className}`}>{children}</div>;
}

export default function FlightMap() {
  const [flights, setFlights] = useState(null);
  const [aeros, setAeros] = useState([]);

  useEffect(() => {
    base44.entities.Flight.list("-date", 1000).then(setFlights).catch(() => setFlights([]));
    base44.entities.Aerodrome.list("-created_date", 500).then(setAeros).catch(() => setAeros([]));
  }, []);

  // Merge built-in coords with user-defined aerodromes that have lat/lon.
  const coords = useMemo(() => {
    const c = { ...AERO_COORDS };
    aeros.forEach((a) => {
      if (a.latitude != null && a.longitude != null && a.icao) {
        c[normCode(a.icao)] = [Number(a.latitude), Number(a.longitude)];
      }
    });
    return c;
  }, [aeros]);

  const { legs, airports, missing } = useMemo(() => {
    const legs = [];
    const airports = {};
    const missing = new Set();
    (flights || []).forEach((f) => {
      const a = normCode(f.from_aerodrome);
      const b = normCode(f.to_aerodrome);
      const pa = coords[a];
      const pb = coords[b];
      if (pa) airports[a] = pa; else if (a) missing.add(a);
      if (pb) airports[b] = pb; else if (b) missing.add(b);
      if (pa && pb && a !== b) legs.push({ from: a, to: b, a: pa, b: pb });
    });
    return { legs, airports, missing: [...missing] };
  }, [flights, coords]);

  const airportList = Object.entries(airports);
  const center = airportList.length
    ? [airportList.reduce((s, [, p]) => s + p[0], 0) / airportList.length,
       airportList.reduce((s, [, p]) => s + p[1], 0) / airportList.length]
    : [-28.5, 24.7];

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <AppHeader icon={MapIcon} title="Flight Map" subtitle="Every logged route on one map" />

      {flights === null ? (
        <div className="text-center py-20 text-cockpit-muted">Loading…</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[["Routes", legs.length], ["Airports", airportList.length], ["Flights", flights.length]].map(([l, v]) => (
              <Card key={l} className="text-center !p-3">
                <p className="text-[10px] uppercase tracking-wider text-cockpit-muted">{l}</p>
                <p className="font-mono text-lg font-bold mt-1 text-cockpit-amber">{v}</p>
              </Card>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-cockpit-border" style={{ height: 380 }}>
            <MapContainer center={center} zoom={airportList.length > 1 ? 5 : 4} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {legs.map((leg, i) => (
                <Polyline key={i} positions={[leg.a, leg.b]} pathOptions={{ color: "#4F46E5", weight: 2, opacity: 0.6 }} />
              ))}
              {airportList.map(([code, p]) => (
                <CircleMarker key={code} center={p} radius={6} pathOptions={{ color: "#3525CD", fillColor: "#4F46E5", fillOpacity: 0.9, weight: 2 }}>
                  <LTooltip>{code}</LTooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {legs.length === 0 && (
            <Card className="text-center">
              <Plane className="w-8 h-8 mx-auto text-cockpit-muted mb-2" />
              <p className="text-sm text-cockpit-cream font-semibold">No mappable routes yet</p>
              <p className="text-xs text-cockpit-muted mt-1">
                Log flights using ICAO codes (e.g. FALA, FACT) for departure and arrival, or add coordinates for your aerodromes in the Directory.
              </p>
            </Card>
          )}

          {missing.length > 0 && (
            <Card>
              <p className="text-xs font-semibold text-cockpit-cream mb-1">Unmapped aerodromes</p>
              <p className="text-[11px] text-cockpit-muted leading-relaxed">
                No coordinates for: {missing.join(", ")}. Add them with lat/lon in the Aerodrome Directory to plot these routes.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
