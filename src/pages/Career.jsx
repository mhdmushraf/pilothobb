import React from "react";
import { Briefcase } from "lucide-react";

export default function Career() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-cockpit-cream mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-cockpit-amber" /> Career
      </h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-cockpit-panel border border-cockpit-border flex items-center justify-center mb-4">
          <Briefcase className="w-7 h-7 text-cockpit-muted" />
        </div>
        <h3 className="text-lg font-semibold text-cockpit-cream mb-1">Coming soon</h3>
        <p className="text-sm text-cockpit-muted max-w-xs">
          Career tracking and milestones are on the way.
        </p>
      </div>
    </div>
  );
}