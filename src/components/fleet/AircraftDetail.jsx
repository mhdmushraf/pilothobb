import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { X, Plane, Clock, Gauge, Wrench, Droplet, Hash } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";

function StatTile({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-cockpit-muted" />
        <span className="text-[10px] text-cockpit-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className={`font-mono text-lg font-bold ${accent || "text-cockpit-cream"}`}>{value}</p>
    </div>
  );
}

function FlightMini({ flight }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-cockpit-border last:border-0">
      <div className="min-w-0">
        <p className="font-mono text-sm text-cockpit-cream truncate">
          {flight.route || `${flight.from_aerodrome}–${flight.to_aerodrome}`}
        </p>
        <p className="text-xs text-cockpit-muted font-mono">
          {flight.date ? new Date(flight.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""}
          {flight.pilot_role ? ` · ${flight.pilot_role}` : ""}
        </p>
      </div>
      <span className="font-mono text-sm font-bold text-cockpit-amber shrink-0 ml-2">
        {(flight.flight_time ?? 0).toFixed(1)}h
      </span>
    </div>
  );
}

export default function AircraftDetail({ aircraft, onClose }) {
  const [flights, setFlights] = useState(null);
  const isDrone = aircraft.category === "Drone (RPAS)";
  const isManned = !isDrone;

  useEffect(() => {
    base44.entities.Flight.filter({ aircraft: aircraft.id }, "-date", 20)
      .then(setFlights)
      .catch(() => setFlights([]));
  }, [aircraft.id]);

  const lastFlown = aircraft.last_flown
    ? new Date(aircraft.last_flown).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-cockpit-panel border border-cockpit-border p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-lg font-bold text-cockpit-cream">{aircraft.registration}</p>
            <p className="text-xs text-cockpit-muted">{aircraft.type} · {aircraft.category}</p>
          </div>
          <button onClick={onClose} className="p-1 text-cockpit-muted hover:text-cockpit-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <StatTile icon={Clock} label="Total time" value={`${(aircraft.total_time ?? 0).toFixed(1)} h`} accent="text-cockpit-amber" />
          <StatTile icon={Plane} label="PIC" value={`${(aircraft.pic_time ?? 0).toFixed(1)} h`} />
          <StatTile icon={Plane} label="Dual" value={`${(aircraft.dual_time ?? 0).toFixed(1)} h`} />
          <StatTile icon={Gauge} label="Time source" value={aircraft.time_source || "—"} />
          <StatTile icon={Gauge} label="Current reading" value={(aircraft.current_reading ?? 0).toFixed(1)} />
          <StatTile icon={Clock} label="Last flown" value={lastFlown} />
        </div>

        {isManned && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatTile icon={Wrench} label="MPI" value="—" />
            <StatTile icon={Droplet} label="Oil" value="—" />
          </div>
        )}

        {isDrone && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatTile icon={Hash} label="Serial number" value={aircraft.serial_number || "—"} />
            <StatTile icon={Gauge} label="Weight class" value={aircraft.weight_class || "—"} />
          </div>
        )}

        {/* Flights */}
        <div className="mt-2">
          <h3 className="text-xs font-semibold text-cockpit-muted uppercase tracking-wider mb-2">Recent flights</h3>
          {flights === null ? (
            <SkeletonCard lines={2} />
          ) : flights.length === 0 ? (
            <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-4 text-center">
              <p className="text-xs text-cockpit-muted">No flights logged for this aircraft yet</p>
            </div>
          ) : (
            <div className="rounded-xl bg-cockpit-panel border border-cockpit-border px-4">
              {flights.map((f) => <FlightMini key={f.id} flight={f} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}