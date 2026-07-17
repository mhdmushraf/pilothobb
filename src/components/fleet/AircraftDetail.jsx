import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plane, Clock, Gauge, Wrench, Droplet, Hash, Settings } from "lucide-react";
import BottomSheet from "@/components/BottomSheet";
import SkeletonCard from "@/components/SkeletonCard";

function StatTile({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-cockpit-muted" />
        <span className="text-[10px] text-cockpit-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className={`font-mono text-base font-bold ${accent || "text-cockpit-cream"}`}>{value}</p>
    </div>
  );
}

function MaintRow({ label, hoursRemaining, onSet }) {
  let color = "text-cockpit-valid";
  let bg = "bg-cockpit-valid/10 border-cockpit-valid/30";
  let status = "Healthy";
  if (hoursRemaining == null) {
    color = "text-cockpit-muted";
    bg = "bg-cockpit-panel-light border-cockpit-border";
    status = "Not set";
  } else if (hoursRemaining < 0) {
    color = "text-cockpit-expired";
    bg = "bg-cockpit-expired/10 border-cockpit-expired/30";
    status = "Overdue";
  } else if (hoursRemaining < 5) {
    color = "text-cockpit-expired";
    bg = "bg-cockpit-expired/10 border-cockpit-expired/30";
    status = "Due soon";
  } else if (hoursRemaining <= 20) {
    color = "text-cockpit-warning";
    bg = "bg-cockpit-warning/10 border-cockpit-warning/30";
    status = "Approaching";
  }

  return (
    <div className={`rounded-xl border p-3 flex items-center justify-between ${bg}`}>
      <div>
        <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`font-mono text-lg font-bold ${color}`}>
          {hoursRemaining == null ? "Not set" : `${hoursRemaining.toFixed(1)} h`}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-[11px] font-semibold ${color}`}>{status}</p>
        {hoursRemaining == null && (
          <Button size="sm" variant="outline" onClick={onSet} className="h-7 mt-1 px-3 text-xs border-cockpit-amber/30 text-cockpit-amber hover:bg-cockpit-amber/10">
            Set
          </Button>
        )}
      </div>
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
  const [editingMaint, setEditingMaint] = useState(null);
  const [maintForm, setMaintForm] = useState({ mpi_due_reading: "", oil_due_reading: "" });

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

  const mpiHours = aircraft.mpi_due_reading != null
    ? aircraft.mpi_due_reading - (aircraft.current_reading ?? 0)
    : null;
  const oilHours = aircraft.oil_due_reading != null
    ? aircraft.oil_due_reading - (aircraft.current_reading ?? 0)
    : null;

  const openMaintEditor = (field) => {
    setMaintForm({
      mpi_due_reading: aircraft.mpi_due_reading ?? "",
      oil_due_reading: aircraft.oil_due_reading ?? "",
    });
    setEditingMaint(field);
  };

  const saveMaint = async () => {
    try {
      const updates = {};
      if (maintForm.mpi_due_reading !== "") updates.mpi_due_reading = Number(maintForm.mpi_due_reading);
      else updates.mpi_due_reading = null;
      if (maintForm.oil_due_reading !== "") updates.oil_due_reading = Number(maintForm.oil_due_reading);
      else updates.oil_due_reading = null;
      await base44.entities.Aircraft.update(aircraft.id, updates);
      Object.assign(aircraft, updates);
      setEditingMaint(null);
    } catch {
      setEditingMaint(null);
    }
  };

  return (
    <BottomSheet onClose={onClose} className="max-h-[92vh]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-lg font-bold text-cockpit-cream">{aircraft.registration}</p>
          <p className="text-xs text-cockpit-muted">{aircraft.type} · {aircraft.category}</p>
        </div>
        <button onClick={onClose} className="p-1 text-cockpit-muted hover:text-cockpit-cream">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatTile icon={Clock} label="Total time" value={`${(aircraft.total_time ?? 0).toFixed(1)} h`} accent="text-cockpit-amber" />
        <StatTile icon={Plane} label="PIC" value={`${(aircraft.pic_time ?? 0).toFixed(1)} h`} />
        <StatTile icon={Plane} label="Dual" value={`${(aircraft.dual_time ?? 0).toFixed(1)} h`} />
        <StatTile icon={Gauge} label="Time source" value={aircraft.time_source || "—"} />
        <StatTile icon={Gauge} label="Current reading" value={(aircraft.current_reading ?? 0).toFixed(1)} />
        <StatTile icon={Settings} label="Engine hours" value={`${(aircraft.engine_hours ?? 0).toFixed(1)} h`} />
        <StatTile icon={Clock} label="Last flown" value={lastFlown} />
      </div>

      {/* Maintenance section */}
      {isManned && (
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-cockpit-muted uppercase tracking-wider mb-2">Maintenance</h3>
          {editingMaint ? (
            <div className="space-y-3 rounded-xl bg-cockpit-panel border border-cockpit-border p-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Next MPI due at (reading)</Label>
                <Input type="number" step="0.1" value={maintForm.mpi_due_reading}
                  onChange={(e) => setMaintForm((f) => ({ ...f, mpi_due_reading: e.target.value }))}
                  className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Next oil change due at (reading)</Label>
                <Input type="number" step="0.1" value={maintForm.oil_due_reading}
                  onChange={(e) => setMaintForm((f) => ({ ...f, oil_due_reading: e.target.value }))}
                  className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingMaint(null)} className="flex-1 border-cockpit-border text-cockpit-muted">Cancel</Button>
                <Button size="sm" onClick={saveMaint} className="flex-1 bg-cockpit-amber text-cockpit-bg hover:bg-cockpit-amber-hi">Save</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <MaintRow label="MPI" hoursRemaining={mpiHours} onSet={() => openMaintEditor("mpi")} />
              <MaintRow label="Oil change" hoursRemaining={oilHours} onSet={() => openMaintEditor("oil")} />
              <Button variant="ghost" size="sm" onClick={() => openMaintEditor("edit")} className="w-full text-xs text-cockpit-muted hover:text-cockpit-cream">
                <Settings className="w-3 h-3" /> Edit maintenance schedule
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Drone-specific */}
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
    </BottomSheet>
  );
}