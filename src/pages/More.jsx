import React from "react";
import { Link } from "react-router-dom";
import { FileText, Briefcase, Settings, ChevronRight, User } from "lucide-react";

const menuItems = [
  { path: "/documents", label: "Documents", description: "Exams, licences & medical", icon: FileText },
  { path: "/career", label: "Career", description: "Milestones & goals", icon: Briefcase },
  { path: "/settings", label: "Pilot Profile", description: "Edit your details", icon: User },
];

export default function More() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-cockpit-cream mb-5 flex items-center gap-2">
        <Settings className="w-5 h-5 text-cockpit-amber" /> More
      </h1>

      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 rounded-xl bg-cockpit-panel border border-cockpit-border p-4 active:bg-cockpit-panel-light transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-cockpit-amber" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cockpit-cream">{item.label}</p>
                <p className="text-xs text-cockpit-muted">{item.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-cockpit-muted shrink-0" />
            </Link>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <span className="text-lg font-bold text-cockpit-amber tracking-tight">PilotHobb</span>
        <p className="text-xs text-cockpit-muted mt-1">Your personal pilot logbook</p>
      </div>
    </div>
  );
}