import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plane, ChevronRight, Shield, Clock, Plus } from "lucide-react";
import usePilot from "@/hooks/usePilot";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";

function TotalTimeCard({ pilot }) {
  const hours = pilot?.total_time ?? 0;
  const wholeHours = Math.floor(hours);
  const decimal = (hours % 1).toFixed(1).substring(1);
  const digits = String(wholeHours).padStart(4, "0").split("");

  return (
    <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-5">
      <p className="text-xs font-medium text-cockpit-muted uppercase tracking-widest mb-3">Total Time</p>
      <div className="flex items-baseline gap-0.5 justify-center">
        {digits.map((d, i) => (
          <span
            key={i}
            className="font-mono text-5xl font-bold text-cockpit-cream bg-cockpit-panel-light border border-cockpit-border rounded-lg px-3 py-2 leading-none"
          >
            {d}
          </span>
        ))}
        <span className="font-mono text-4xl font-bold text-cockpit-amber leading-none">{decimal}</span>
      </div>
      <p className="text-center text-sm text-cockpit-muted mt-3 font-mono">
        HOURS · <span className="text-cockpit-cream">{pilot?.total_landings ?? 0}</span> LANDINGS
      </p>
    </div>
  );
}

function CurrencyCard({ licence }) {
  const today = new Date();
  const expiry = new Date(licence.expiry_date);
  const diffMs = expiry - today;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let color = "text-cockpit-valid";
  let bgColor = "bg-cockpit-valid/10";
  let borderColor = "border-cockpit-valid/20";
  if (daysLeft <= 0) {
    color = "text-cockpit-expired";
    bgColor = "bg-cockpit-expired/10";
    borderColor = "border-cockpit-expired/20";
  } else if (daysLeft <= 30) {
    color = "text-cockpit-warning";
    bgColor = "bg-cockpit-warning/10";
    borderColor = "border-cockpit-warning/20";
  } else if (daysLeft <= 90) {
    color = "text-cockpit-warning";
    bgColor = "bg-cockpit-warning/10";
    borderColor = "border-cockpit-warning/20";
  }

  return (
    <div className={`flex-1 min-w-0 rounded-xl ${bgColor} border ${borderColor} p-3`}>
      <p className="text-[11px] text-cockpit-muted truncate mb-1">{licence.name}</p>
      <p className={`font-mono text-lg font-bold ${color}`}>
        {daysLeft <= 0 ? "EXP" : daysLeft}
      </p>
      <p className={`text-[10px] ${color}`}>
        {daysLeft <= 0 ? "Expired" : "days left"}
      </p>
    </div>
  );
}

function FlightRow({ flight }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-cockpit-border last:border-0">
      <div className="w-9 h-9 rounded-lg bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center shrink-0">
        <Plane className="w-4 h-4 text-cockpit-amber" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-cockpit-cream font-mono truncate">
            {flight.route || `${flight.from_aerodrome}–${flight.to_aerodrome}`}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-cockpit-muted font-mono">
            {flight.date ? new Date(flight.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : ""}
          </span>
          {flight.pilot_role && (
            <span className="text-[10px] text-cockpit-amber bg-cockpit-amber/10 px-1.5 py-0.5 rounded font-medium">
              {flight.pilot_role}
            </span>
          )}
        </div>
      </div>
      <span className="font-mono text-sm font-bold text-cockpit-cream">
        {(flight.flight_time ?? 0).toFixed(1)}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { pilot, loading: pilotLoading } = usePilot();
  const [licences, setLicences] = useState(null);
  const [flights, setFlights] = useState(null);

  useEffect(() => {
    base44.entities.Licence.filter({}, "expiry_date", 3)
      .then(setLicences)
      .catch(() => setLicences([]));

    base44.entities.Flight.list("-date", 5)
      .then(setFlights)
      .catch(() => setFlights([]));
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-cockpit-muted">{greeting}</p>
          <h1 className="text-xl font-bold text-cockpit-cream">
            {pilotLoading ? "..." : (pilot?.full_name || "Pilot")}
          </h1>
        </div>
        <span className="text-lg font-bold text-cockpit-amber tracking-tight font-heading">
          PilotHobb
        </span>
      </div>

      {/* Total Time */}
      {pilotLoading ? (
        <SkeletonCard lines={2} className="mb-4" />
      ) : (
        <TotalTimeCard pilot={pilot} />
      )}

      {/* Currency */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-cockpit-muted uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Currency
          </h2>
        </div>
        {licences === null ? (
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 skeleton-shimmer h-20 rounded-xl" />
            ))}
          </div>
        ) : licences.length === 0 ? (
          <div className="rounded-xl bg-cockpit-panel border border-cockpit-border p-4 text-center">
            <p className="text-xs text-cockpit-muted">No licences or ratings tracked yet</p>
          </div>
        ) : (
          <div className="flex gap-2">
            {licences.map((l) => (
              <CurrencyCard key={l.id} licence={l} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Flights */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-cockpit-muted uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Recent Flights
          </h2>
          {flights && flights.length > 0 && (
            <Link to="/logbook" className="text-xs text-cockpit-amber flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border px-4">
          {flights === null ? (
            <div className="py-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-shimmer h-12 rounded-lg" />
              ))}
            </div>
          ) : flights.length === 0 ? (
            <EmptyState
              icon={Plane}
              title="No flights yet"
              description="Log your first flight to see it here"
              action={
                <Link
                  to="/add-flight"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-cockpit-amber"
                >
                  <Plus className="w-4 h-4" /> Add flight
                </Link>
              }
            />
          ) : (
            flights.map((f) => <FlightRow key={f.id} flight={f} />)
          )}
        </div>
      </div>
    </div>
  );
}