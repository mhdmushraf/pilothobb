import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { BookOpen, Plane } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";

const PAGE_SIZE = 20;

export default function Logbook() {
  const [flights, setFlights] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadFlights = useCallback(async (skip = 0) => {
    const result = await base44.entities.Flight.list("-date", PAGE_SIZE + 1);
    setHasMore(result.length > PAGE_SIZE);
    setFlights(result.slice(0, PAGE_SIZE));
  }, []);

  useEffect(() => { loadFlights(); }, [loadFlights]);

  const loadMore = async () => {
    if (loadingMore || !hasMore || !flights) return;
    setLoadingMore(true);
    try {
      const result = await base44.entities.Flight.filter(
        { created_date: { $lt: flights[flights.length - 1].created_date } },
        "-date",
        PAGE_SIZE + 1
      );
      setHasMore(result.length > PAGE_SIZE);
      setFlights((prev) => [...prev, ...result.slice(0, PAGE_SIZE)]);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-cockpit-cream mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-cockpit-amber" /> Logbook
      </h1>

      {flights === null ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : flights.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No flights yet"
          description="Log your first flight to start building your logbook"
        />
      ) : (
        <>
          <div className="space-y-2">
            {flights.map((f) => (
              <div
                key={f.id}
                className="rounded-xl bg-cockpit-panel border border-cockpit-border p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-semibold text-cockpit-cream">
                    {f.route || `${f.from_aerodrome}–${f.to_aerodrome}`}
                  </span>
                  <span className="font-mono text-sm font-bold text-cockpit-amber">
                    {(f.flight_time ?? 0).toFixed(1)}h
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-cockpit-muted">
                  <span className="font-mono">
                    {f.date ? new Date(f.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                  </span>
                  {f.pilot_role && (
                    <span className="text-cockpit-amber bg-cockpit-amber/10 px-1.5 py-0.5 rounded font-medium text-[10px]">
                      {f.pilot_role}
                    </span>
                  )}
                  <span>{f.landings ?? 0} ldg</span>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full mt-4 py-3 rounded-xl bg-cockpit-panel-light border border-cockpit-border text-sm text-cockpit-muted font-medium"
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          )}
        </>
      )}
    </div>
  );
}