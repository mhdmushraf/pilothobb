import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import usePilot from "@/hooks/usePilot";
import { computeTotals } from "@/lib/flightTotals";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Plane, Trash2, X, FileDown, BarChart3, Loader2, ChevronRight, Pencil, Plus,
} from "lucide-react";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";
import BottomSheet from "@/components/BottomSheet";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AppHeader from "@/components/AppHeader";
import SectionTitle from "@/components/SectionTitle";

const PAGE_SIZE = 20;

const ROLE_CHIPS = ["All", "PIC", "Dual", "PICUS", "Co-pilot", "RPAS"];
const PERIODS = ["All", "30d", "90d", "1y"];

const PERIOD_DAYS = { "30d": 30, "90d": 90, "1y": 365 };

function periodStart(period) {
  if (period === "All") return null;
  const d = new Date();
  d.setDate(d.getDate() - PERIOD_DAYS[period]);
  return d.toISOString().split("T")[0];
}

function dedupe(list) {
  const seen = new Set();
  return list.filter((f) => {
    if (seen.has(f.id)) return false;
    seen.add(f.id);
    return true;
  });
}

function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-cockpit-border last:border-0">
      <span className="text-xs text-cockpit-muted uppercase tracking-wider">{label}</span>
      <span className="text-sm text-cockpit-cream font-mono text-right">{value}</span>
    </div>
  );
}

function FlightDetail({ flight, aircraftReg, onClose, onDelete, onEdit, deleting }) {
  const date = flight.date ? new Date(flight.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  return (
    <BottomSheet onClose={onClose} backDismisses={false}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-base font-bold text-cockpit-cream">
              {flight.route || `${flight.from_aerodrome}–${flight.to_aerodrome}`}
            </p>
            <p className="text-xs text-cockpit-muted font-mono">{date}</p>
          </div>
          <button onClick={onClose} className="p-1 text-cockpit-muted hover:text-cockpit-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-4 mb-4">
          <DetailRow label="Aircraft" value={aircraftReg} />
          <DetailRow label="Flight time" value={`${(flight.flight_time ?? 0).toFixed(1)} h`} />
          <DetailRow label="Role" value={flight.pilot_role} />
          <DetailRow label="From" value={flight.from_aerodrome} />
          <DetailRow label="To" value={flight.to_aerodrome} />
          <DetailRow label="Takeoffs" value={flight.takeoffs} />
          <DetailRow label="Landings" value={flight.landings} />
          <DetailRow label="Touch & go" value={flight.touch_and_go} />
          <DetailRow label="Reading before" value={flight.reading_before} />
          <DetailRow label="Reading after" value={flight.reading_after} />
          <DetailRow label="PIC time" value={flight.pic_time?.toFixed?.(1)} />
          <DetailRow label="Dual time" value={flight.dual_time?.toFixed?.(1)} />
          <DetailRow label="PICUS time" value={flight.picus_time?.toFixed?.(1)} />
          <DetailRow label="Co-pilot time" value={flight.co_pilot_time?.toFixed?.(1)} />
          <DetailRow label="XC time" value={flight.xc_time?.toFixed?.(1)} />
          <DetailRow label="Night time" value={flight.night_time?.toFixed?.(1)} />
          <DetailRow label="Night landings" value={flight.night_landings} />
          <DetailRow label="Night takeoffs" value={flight.night_takeoffs} />
          <DetailRow label="Instrument actual" value={flight.instrument_actual?.toFixed?.(1)} />
          <DetailRow label="Instrument sim" value={flight.instrument_sim?.toFixed?.(1)} />
          <DetailRow label="Sim time" value={flight.sim_time?.toFixed?.(1)} />
          <DetailRow label="Autorotations" value={flight.autorotations} />
          <DetailRow label="Hoist cycles" value={flight.hoist_cycles} />
          {flight.is_rpas && <DetailRow label="RPAS" value="Yes" />}
          <DetailRow label="Mission type" value={flight.mission_type} />
          <DetailRow label="Operation" value={flight.operation_category} />
          <DetailRow label="Battery cycles" value={flight.battery_cycles} />
          <DetailRow label="Observer" value={flight.observer} />
        </div>

        {flight.remarks && (
          <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-4 mb-4">
            <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-1">Remarks</p>
            <p className="text-sm text-cockpit-cream">{flight.remarks}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex-1 border-cockpit-amber/30 text-cockpit-amber hover:bg-cockpit-amber/10"
          >
            <Pencil className="w-4 h-4" /> Edit
          </Button>
          <Button
            onClick={onDelete}
            disabled={deleting}
            variant="outline"
            className="flex-1 border-cockpit-expired/30 text-cockpit-expired hover:bg-cockpit-expired/10"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
    </BottomSheet>
  );
}

export default function Logbook() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { pilot } = usePilot();

  const [flights, setFlights] = useState(
    location.state?.optimisticFlight ? [location.state.optimisticFlight] : null
  );

  useEffect(() => {
    if (location.state?.optimisticFlight) {
      window.history.replaceState({}, "");
    }
  }, []);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);

  const [roleFilter, setRoleFilter] = useState("All");
  const [aircraftFilter, setAircraftFilter] = useState("All");
  const [periodFilter, setPeriodFilter] = useState("All");
  const [aircraftList, setAircraftList] = useState([]);

  const [selected, setSelected] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const flightIdParam = searchParams.get("flightId");

  const openFlight = (flight) => {
    setSelected(flight);
    setSearchParams({ flightId: flight.id });
  };
  const closeFlight = () => {
    setSelected(null);
    setSearchParams({}, { replace: true });
  };

  // Sync the detail sheet with the URL so the Android back button dismisses it.
  useEffect(() => {
    if (flightIdParam) {
      const f = (flights || []).find((x) => x.id === flightIdParam);
      if (f && (!selected || selected.id !== f.id)) setSelected(f);
    } else if (selected) {
      setSelected(null);
    }
  }, [flightIdParam, flights]);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const activeFilters = useMemo(() => {
    const f = {};
    if (roleFilter === "RPAS") f.is_rpas = true;
    else if (roleFilter !== "All") f.pilot_role = roleFilter;
    if (aircraftFilter !== "All") f.aircraft = aircraftFilter;
    const start = periodStart(periodFilter);
    if (start) f.date = { $gte: start };
    return f;
  }, [roleFilter, aircraftFilter, periodFilter]);

  const loadPage = async (pageNum, append) => {
    if (append) setLoadingMore(true);
    try {
      const result = await base44.entities.Flight.filter(
        activeFilters, "-date", PAGE_SIZE + 1, pageNum * PAGE_SIZE
      );
      setHasMore(result.length > PAGE_SIZE);
      const slice = result.slice(0, PAGE_SIZE);
      setFlights((prev) => (append ? dedupe([...(prev || []), ...slice]) : slice));
    } catch {
      setFlights((prev) => prev ?? []);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPage(0, false);
    setPage(0);
  }, [activeFilters]);

  useEffect(() => {
    base44.entities.Aircraft.list().then(setAircraftList).catch(() => setAircraftList([]));
  }, []);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    loadPage(next, true);
  };

  const refreshData = async () => {
    try {
      const result = await base44.entities.Flight.filter(
        activeFilters, "-date", PAGE_SIZE + 1, 0
      );
      setHasMore(result.length > PAGE_SIZE);
      setFlights(result.slice(0, PAGE_SIZE));
      setPage(0);
    } catch {
      // keep existing data on error
    }
  };

  const { onTouchStart, onTouchMove, onTouchEnd, pullIndicator } = usePullToRefresh(refreshData);

  const updateFilter = (setter) => (val) => {
    setter(val);
    setPage(0);
  };

  const totalTime = useMemo(
    () => (flights || []).reduce((s, f) => s + (Number(f.flight_time) || 0), 0),
    [flights]
  );

  const aircraftRegFor = (flight) => {
    const id = typeof flight.aircraft === "string" ? flight.aircraft : flight.aircraft?.id;
    const ac = aircraftList.find((a) => a.id === id);
    return ac?.registration || id || "—";
  };

  const handleExportPDF = async () => {
    if (!pilot) return;
    setExporting(true);
    try {
      const hasFilters = Object.keys(activeFilters).length > 0;
      const allFlights = hasFilters
        ? await base44.entities.Flight.filter(activeFilters, "-date", 1000)
        : await base44.entities.Flight.list("-date", 1000);

      const acMap = {};
      aircraftList.forEach((a) => { acMap[a.id] = a.registration || "—"; });

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 157, 46);
      doc.text("PilotHobb — Flight Log", 14, 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(pilot.full_name || "Pilot", 14, 22);

      doc.setFontSize(9);
      doc.text(
        `Total: ${(pilot.total_time || 0).toFixed(1)}h  ·  PIC: ${(pilot.total_pic || 0).toFixed(1)}h  ·  Dual: ${(pilot.total_dual || 0).toFixed(1)}h  ·  Night: ${(pilot.total_night || 0).toFixed(1)}h  ·  XC: ${(pilot.total_xc || 0).toFixed(1)}h`,
        14, 28
      );

      autoTable(doc, {
        startY: 33,
        head: [["Date", "Aircraft", "Route", "Hobbs Bef", "Hobbs Aft", "Total", "PIC", "Dual", "Night", "Ldg", "Remarks"]],
        body: allFlights.map((f) => {
          const acId = typeof f.aircraft === "string" ? f.aircraft : f.aircraft?.id;
          const reg = acMap[acId] || acId || "—";
          const route = f.route || `${f.from_aerodrome || ""}–${f.to_aerodrome || ""}`;
          const date = f.date ? new Date(f.date).toLocaleDateString("en-GB") : "—";
          return [
            date,
            reg,
            route,
            f.reading_before ?? "",
            f.reading_after ?? "",
            (f.flight_time ?? 0).toFixed(1),
            (f.pic_time ?? 0).toFixed(1),
            (f.dual_time ?? 0).toFixed(1),
            (f.night_time ?? 0).toFixed(1),
            f.landings ?? 0,
            (f.remarks || "").slice(0, 50),
          ];
        }),
        headStyles: {
          fillColor: [255, 157, 46],
          textColor: [10, 14, 23],
          fontStyle: "bold",
        },
        bodyStyles: {
          font: "courier",
          fontSize: 8,
          textColor: [40, 40, 40],
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
      });

      doc.save("pilothobb-logbook.pdf");
      toast({ title: "Logbook PDF exported" });
    } catch (e) {
      toast({ title: "Export failed", description: e.message, variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !pilot) return;
    setDeleting(true);
    try {
      const flight = selected;
      const aircraftId = typeof flight.aircraft === "string" ? flight.aircraft : flight.aircraft?.id;
      let ac = aircraftList.find((a) => a.id === aircraftId);
      if (!ac && aircraftId) {
        ac = await base44.entities.Aircraft.get(aircraftId);
      }
      const { pilotPatch, aircraftPatch } = computeTotals(flight, pilot, ac, -1);
      await base44.entities.Pilot.update(pilot.id, pilotPatch);
      if (ac) await base44.entities.Aircraft.update(ac.id, aircraftPatch);
      await base44.entities.Flight.delete(flight.id);

      setFlights((prev) => (prev || []).filter((f) => f.id !== flight.id));
      closeFlight();
      toast({ title: "Flight deleted", description: "Totals reversed." });
    } catch (e) {
      toast({ title: "Delete failed", description: e.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-4 pt-6 pb-4" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {pullIndicator}
      <AppHeader
        icon={BookOpen}
        title="Logbook"
        subtitle={flights ? `${flights.length} flight${flights.length !== 1 ? "s" : ""} · ${totalTime.toFixed(1)} h` : ""}
        action={flights !== null && flights.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-cockpit-border text-cockpit-muted hover:text-cockpit-cream h-8" onClick={handleExportPDF} disabled={exporting}>
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
              {exporting ? "Generating…" : "Export PDF"}
            </Button>
            <Button variant="outline" size="sm" className="border-cockpit-border text-cockpit-muted hover:text-cockpit-cream h-8" onClick={() => navigate("/career")}>
              <BarChart3 className="w-3.5 h-3.5" /> Career summary
            </Button>
          </div>
        )}
      />

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {ROLE_CHIPS.map((r) => (
            <button
              key={r}
              onClick={() => updateFilter(setRoleFilter)(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                roleFilter === r
                  ? "bg-cockpit-amber/15 border-cockpit-amber/40 text-cockpit-amber"
                  : "bg-cockpit-panel border-cockpit-border text-cockpit-muted"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={aircraftFilter} onValueChange={updateFilter(setAircraftFilter)}>
            <SelectTrigger className="bg-cockpit-panel border-cockpit-border text-cockpit-cream h-9">
              <SelectValue placeholder="Aircraft" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All aircraft</SelectItem>
              {aircraftList.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.registration}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={updateFilter(setPeriodFilter)}>
            <SelectTrigger className="bg-cockpit-panel border-cockpit-border text-cockpit-cream h-9">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p} value={p}>{p === "All" ? "All time" : p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Flight list */}
      {flights === null ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : flights.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No flights found"
          description="Try adjusting filters or log your first flight"
          action={
            <button onClick={() => navigate("/add-flight")} className="inline-flex items-center gap-1.5 text-sm font-medium text-cockpit-amber hover:text-cockpit-amber-hi">
              <Plus className="w-4 h-4" /> Log your first flight
            </button>
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {flights.map((f) => (
              <button
                key={f.id}
                onClick={() => openFlight(f)}
                className="relative w-full text-left ph-card p-4 pl-5 hover:border-cockpit-amber/20 transition-all active:scale-[0.98] overflow-hidden"
              >
                <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${f.is_rpas ? "bg-cockpit-glow-blue" : "bg-cockpit-amber"}`} />
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-semibold text-cockpit-cream">
                    {f.route || `${f.from_aerodrome}–${f.to_aerodrome}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cockpit-amber">
                      {(f.flight_time ?? 0).toFixed(1)}h
                    </span>
                    <ChevronRight className="w-4 h-4 text-cockpit-muted" />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-cockpit-muted">
                  <span className="font-mono">
                    {f.date ? new Date(f.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                  </span>
                  {f.is_rpas ? (
                    <span className="text-cockpit-glow-blue bg-cockpit-glow-blue/10 px-1.5 py-0.5 rounded font-medium text-[10px]">RPAS</span>
                  ) : f.pilot_role ? (
                    <span className="text-cockpit-amber bg-cockpit-amber/10 px-1.5 py-0.5 rounded font-medium text-[10px]">{f.pilot_role}</span>
                  ) : null}
                  <span className="font-mono">{aircraftRegFor(f)}</span>
                  <span>{f.landings ?? 0} ldg</span>
                </div>
              </button>
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

      {/* Flight detail modal */}
      {selected && (
        <FlightDetail
          flight={selected}
          aircraftReg={aircraftRegFor(selected)}
          onClose={closeFlight}
          onDelete={handleDelete}
          onEdit={() => navigate(`/edit-flight/${selected.id}`)}
          deleting={deleting}
        />
      )}
    </div>
  );
}