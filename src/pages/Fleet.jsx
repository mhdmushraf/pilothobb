import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Plane } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";

const PAGE_SIZE = 20;

export default function Fleet() {
  const [aircraft, setAircraft] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadAircraft = useCallback(async () => {
    const result = await base44.entities.Aircraft.list("-created_date", PAGE_SIZE + 1);
    setHasMore(result.length > PAGE_SIZE);
    setAircraft(result.slice(0, PAGE_SIZE));
  }, []);

  useEffect(() => { loadAircraft(); }, [loadAircraft]);

  const loadMore = async () => {
    if (loadingMore || !hasMore || !aircraft) return;
    setLoadingMore(true);
    try {
      const result = await base44.entities.Aircraft.filter(
        { created_date: { $lt: aircraft[aircraft.length - 1].created_date } },
        "-created_date",
        PAGE_SIZE + 1
      );
      setHasMore(result.length > PAGE_SIZE);
      setAircraft((prev) => [...prev, ...result.slice(0, PAGE_SIZE)]);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-cockpit-cream mb-4 flex items-center gap-2">
        <Plane className="w-5 h-5 text-cockpit-amber" /> Fleet
      </h1>

      {aircraft === null ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : aircraft.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="No aircraft"
          description="Aircraft will appear here once you log a flight or add one manually"
        />
      ) : (
        <>
          <div className="space-y-2">
            {aircraft.map((ac) => (
              <div
                key={ac.id}
                className="rounded-xl bg-cockpit-panel border border-cockpit-border p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-base font-bold text-cockpit-cream">{ac.registration}</span>
                  <span className="text-[10px] font-medium text-cockpit-amber bg-cockpit-amber/10 px-2 py-0.5 rounded">
                    {ac.category || "—"}
                  </span>
                </div>
                <p className="text-sm text-cockpit-muted mb-2">{ac.type}</p>
                <div className="flex gap-4 text-xs text-cockpit-muted font-mono">
                  <span>Total <span className="text-cockpit-cream">{(ac.total_time ?? 0).toFixed(1)}</span></span>
                  <span>PIC <span className="text-cockpit-cream">{(ac.pic_time ?? 0).toFixed(1)}</span></span>
                  <span>{ac.time_source || "Hobbs"}</span>
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