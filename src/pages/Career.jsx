import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import usePilot from "@/hooks/usePilot";
import { Briefcase, Clock, Plane, Moon, Compass, Download, Activity, Award, Plus } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";
import AppHeader from "@/components/AppHeader";
import Avatar from "@/components/Avatar";
import SectionTitle from "@/components/SectionTitle";

function StatCard({ icon: Icon, label, value, accent, barColor }) {
  return (
    <div className="relative ph-card p-3 pt-4 overflow-hidden">
      <span className={`absolute top-0 left-0 right-0 h-[3px] ${barColor || "bg-cockpit-border"}`} />
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-cockpit-muted" />
        <span className="text-[10px] text-cockpit-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className={`font-mono text-2xl font-bold ${accent || "text-cockpit-cream"}`}>
        {(value ?? 0).toFixed(1)}<span className="text-sm font-normal text-cockpit-muted ml-1">h</span>
      </p>
    </div>
  );
}

function TypeRow({ type, pic, dual, lastFlown }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-cockpit-border last:border-0">
      <span className="text-sm font-medium text-cockpit-cream truncate">{type}</span>
      <div className="flex items-center gap-4 font-mono text-xs shrink-0">
        <span className="text-cockpit-muted">PIC <span className="text-cockpit-cream">{pic.toFixed(1)}</span></span>
        <span className="text-cockpit-muted">Dual <span className="text-cockpit-cream">{dual.toFixed(1)}</span></span>
        <span className="text-cockpit-muted w-20 text-right">{lastFlown}</span>
      </div>
    </div>
  );
}

export default function Career() {
  const { pilot, loading } = usePilot();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [typeStats, setTypeStats] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.Flight.list("-date", 500),
      base44.entities.Aircraft.list(),
    ])
      .then(([flights, aircraft]) => {
        const acMap = {};
        aircraft.forEach((a) => { acMap[a.id] = a.type; });
        const stats = {};
        flights
          .filter((f) => !f.is_rpas && f.aircraft)
          .forEach((f) => {
            const type = acMap[f.aircraft] || "Unknown";
            if (!stats[type]) stats[type] = { pic: 0, dual: 0, last: null };
            stats[type].pic += f.pic_time || 0;
            stats[type].dual += f.dual_time || 0;
            if (!f.date) return;
            const d = f.date;
            if (!stats[type].last || d > stats[type].last) stats[type].last = d;
          });
        setTypeStats(stats);
      })
      .catch(() => setTypeStats({}));
  }, []);

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
    : "—";

  return (
    <div className="px-4 pt-6 pb-8">
      <AppHeader icon={Award} title="Career" subtitle="Totals & experience" />

      {/* Header */}
      {loading ? (
        <SkeletonCard lines={2} />
      ) : (
        <div className="ph-card p-4 mb-4 flex items-center gap-4">
          <Avatar pilot={pilot} size={56} />
          <div className="min-w-0">
            <p className="text-lg font-bold text-cockpit-cream">{pilot?.full_name || "Pilot"}</p>
            <div className="flex gap-2 mt-1.5">
              {pilot?.authority && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-cockpit-amber/10 text-cockpit-amber">
                  {pilot.authority}
                </span>
              )}
              {pilot?.licence_type && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-cockpit-valid/10 text-cockpit-valid">
                  {pilot.licence_type}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary stat grid */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <StatCard icon={Clock} label="Total time" value={pilot?.total_time} accent="text-cockpit-amber" barColor="bg-cockpit-amber" />
        <StatCard icon={Plane} label="RPAS total" value={pilot?.rpas_total_time} accent="text-cockpit-glow-blue" barColor="bg-cockpit-glow-blue" />
        <StatCard icon={Plane} label="PIC" value={pilot?.total_pic} barColor="bg-cockpit-amber" />
        <StatCard icon={Plane} label="Dual" value={pilot?.total_dual} barColor="bg-cockpit-amber" />
        <StatCard icon={Moon} label="Night" value={pilot?.total_night} barColor="bg-cockpit-amber" />
        <StatCard icon={Compass} label="Cross-country" value={pilot?.total_xc} barColor="bg-cockpit-amber" />
      </div>

      {/* Hours by type */}
      <div className="mb-6">
        <SectionTitle icon={Plane}>Hours by type</SectionTitle>
        {typeStats === null ? (
          <SkeletonCard lines={3} />
        ) : Object.keys(typeStats).length === 0 ? (
          <div className="ph-card flex flex-col items-center text-center px-6 py-6">
            <div className="w-12 h-12 rounded-full bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-2">
              <Plane className="w-5 h-5 text-cockpit-muted" />
            </div>
            <p className="text-xs text-cockpit-muted mb-2">No manned flights logged yet</p>
            <button onClick={() => navigate("/add-flight")} className="inline-flex items-center gap-1.5 text-xs font-medium text-cockpit-amber hover:text-cockpit-amber-hi">
              <Plus className="w-3 h-3" /> Log a flight
            </button>
          </div>
        ) : (
          <div className="ph-card px-4">
            {Object.entries(typeStats)
              .sort((a, b) => b[1].pic + b[1].dual - a[1].pic - a[1].dual)
              .map(([type, s]) => (
                <TypeRow
                  key={type}
                  type={type}
                  pic={s.pic}
                  dual={s.dual}
                  lastFlown={fmtDate(s.last)}
                />
              ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => toast({ title: "Coming soon", description: "Career résumé PDF export will be available shortly." })}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cockpit-amber/15 border border-cockpit-amber/30 text-cockpit-amber text-sm font-medium hover:bg-cockpit-amber/20 transition-colors"
        >
          <Download className="w-4 h-4" /> Export career résumé (PDF)
        </button>
        <button
          onClick={() => navigate("/tracking")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cockpit-panel border border-cockpit-border text-cockpit-cream text-sm font-medium hover:border-cockpit-glow-blue/30 transition-colors"
        >
          <Activity className="w-4 h-4 text-cockpit-glow-blue" /> Live tracking
        </button>
      </div>
    </div>
  );
}