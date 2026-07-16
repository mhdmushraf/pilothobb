import React from "react";
import { ChevronRight } from "lucide-react";

export default function AircraftCard({ ac, onClick }) {
  const isDrone = ac.category === "Drone (RPAS)";
  const pillColor = isDrone
    ? "text-cockpit-glow-blue bg-cockpit-glow-blue/10"
    : "text-cockpit-amber bg-cockpit-amber/10";

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl bg-cockpit-panel border border-cockpit-border p-4 hover:border-cockpit-amber/20 transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-base font-bold text-cockpit-cream">{ac.registration}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${pillColor}`}>
            {ac.category || "—"}
          </span>
          <ChevronRight className="w-4 h-4 text-cockpit-muted" />
        </div>
      </div>
      <p className="text-sm text-cockpit-muted mb-2">{ac.type}</p>
      <div className="flex gap-4 text-xs text-cockpit-muted font-mono">
        <span>Total <span className="text-cockpit-cream">{(ac.total_time ?? 0).toFixed(1)}</span></span>
        {isDrone ? (
          <>
            <span>SN <span className="text-cockpit-cream">{ac.serial_number || "—"}</span></span>
            <span>{ac.weight_class || "—"}</span>
          </>
        ) : (
          <>
            <span>PIC <span className="text-cockpit-cream">{(ac.pic_time ?? 0).toFixed(1)}</span></span>
            <span>{ac.time_source || "Hobbs"}</span>
          </>
        )}
      </div>
    </button>
  );
}