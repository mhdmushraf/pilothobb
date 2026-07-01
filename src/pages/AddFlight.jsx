import React from "react";
import { Plus } from "lucide-react";

export default function AddFlight() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-cockpit-cream mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-cockpit-amber" /> Add Flight
      </h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-4">
          <Plus className="w-7 h-7 text-cockpit-amber" />
        </div>
        <h3 className="text-lg font-semibold text-cockpit-cream mb-1">Coming soon</h3>
        <p className="text-sm text-cockpit-muted max-w-xs">
          The flight entry wizard is being built — check back shortly.
        </p>
      </div>
    </div>
  );
}