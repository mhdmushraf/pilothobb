import React from "react";
import { Link } from "react-router-dom";
import { FileText, Briefcase, Settings, ChevronRight, User, BarChart3, ShieldCheck,
  CalendarDays, ClipboardCheck, Download, Map as MapIcon, Wrench, StickyNote, Building2, Target } from "lucide-react";

const sections = [
  {
    title: "Insights",
    items: [
      { path: "/analytics", label: "Flight Analytics", description: "Trends & hour breakdowns", icon: BarChart3 },
      { path: "/currency", label: "Currency Tracker", description: "Ratings & recency status", icon: ShieldCheck },
      { path: "/goals", label: "Goals Tracker", description: "Set & track flying goals", icon: Target },
      { path: "/flight-map", label: "Flight Map", description: "Your routes on a map", icon: MapIcon },
    ],
  },
  {
    title: "Operations",
    items: [
      { path: "/schedule", label: "Aircraft Schedule", description: "Bookings & availability", icon: CalendarDays },
      { path: "/checklists", label: "Quick Checklists", description: "Pre-flight & emergency", icon: ClipboardCheck },
      { path: "/maintenance-log", label: "Maintenance Log", description: "Track aircraft servicing", icon: Wrench },
      { path: "/aerodromes", label: "Aerodrome Directory", description: "Airports & frequencies", icon: Building2 },
    ],
  },
  {
    title: "Records",
    items: [
      { path: "/documents", label: "Documents", description: "Exams, licences & medical", icon: FileText },
      { path: "/career", label: "Career", description: "Milestones & goals", icon: Briefcase },
      { path: "/pilot-notes", label: "Pilot Notes", description: "Personal flying notes", icon: StickyNote },
      { path: "/export", label: "Export Data", description: "Download PDF / CSV logbook", icon: Download },
      { path: "/settings", label: "Pilot Profile", description: "Edit your details", icon: User },
    ],
  },
];

export default function More() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-cockpit-cream mb-5 flex items-center gap-2">
        <Settings className="w-5 h-5 text-cockpit-amber" /> More
      </h1>

      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="text-[11px] uppercase tracking-wider text-cockpit-muted font-semibold mb-2 px-1">{section.title}</p>
          <div className="space-y-2">
            {section.items.map((item) => {
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
        </div>
      ))}

      <div className="mt-10 text-center">
        <span className="text-lg font-bold text-cockpit-amber tracking-tight">PilotHobb</span>
        <p className="text-xs text-cockpit-muted mt-1">Your personal pilot logbook</p>
      </div>
    </div>
  );
}