import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plane, Plus } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";
import AircraftCard from "@/components/fleet/AircraftCard";
import AddAircraftModal from "@/components/fleet/AddAircraftModal";
import AircraftDetail from "@/components/fleet/AircraftDetail";
import AppHeader from "@/components/AppHeader";

const PAGE_SIZE = 20;

export default function Fleet() {
  const [aircraft, setAircraft] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const aircraftIdParam = searchParams.get("aircraftId");

  const openAircraft = (ac) => {
    setSelected(ac);
    setSearchParams({ aircraftId: ac.id });
  };
  const closeAircraft = () => {
    setSelected(null);
    setSearchParams({}, { replace: true });
  };

  // Sync the detail sheet with the URL so the Android back button dismisses it.
  useEffect(() => {
    if (aircraftIdParam) {
      const ac = (aircraft || []).find((a) => a.id === aircraftIdParam);
      if (ac && (!selected || selected.id !== ac.id)) setSelected(ac);
    } else if (selected) {
      setSelected(null);
    }
  }, [aircraftIdParam, aircraft]);

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
      <AppHeader
        icon={Plane}
        title="Fleet"
        subtitle="Your aircraft & drones"
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cockpit-amber/15 border border-cockpit-amber/30 text-cockpit-amber text-sm font-medium hover:bg-cockpit-amber/20 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add aircraft
          </button>
        }
      />

      {aircraft === null ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : aircraft.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="No aircraft"
          description="Add your first aircraft to start tracking flights"
          action={
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cockpit-amber"
            >
              <Plus className="w-4 h-4" /> Add aircraft
            </button>
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {aircraft.map((ac) => (
              <AircraftCard key={ac.id} ac={ac} onClick={() => openAircraft(ac)} />
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

      {showAdd && (
        <AddAircraftModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            loadAircraft();
          }}
        />
      )}

      {selected && (
        <AircraftDetail aircraft={selected} onClose={closeAircraft} />
      )}
    </div>
  );
}