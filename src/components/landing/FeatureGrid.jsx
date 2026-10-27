import React from "react";
import { Moon, Gauge, CalendarClock, Globe2, PlaneTakeoff, BarChart3, Wrench, FileDown } from "lucide-react";

const FEATURES = [
  {
    icon: Moon,
    title: "Night cockpit design",
    desc: "A dark, instrument-panel interface that's easy on the eyes — in the cockpit or the crew room.",
  },
  {
    icon: Gauge,
    title: "Hobbs & Tach tracking",
    desc: "Readings before and after. Flight time to one decimal, just like your meter.",
  },
  {
    icon: CalendarClock,
    title: "Currency alerts",
    desc: "Never let a licence, rating or medical lapse. Colour-coded expiry cards keep you current.",
  },
  {
    icon: Globe2,
    title: "Worldwide compliance",
    desc: "FAA, EASA, UK CAA, SACAA, CASA and more. PilotHobb adapts to your authority.",
  },
  {
    icon: PlaneTakeoff,
    title: "Aircraft + Drone",
    desc: "One logbook for manned flying and RPAS — mission type, category and battery cycles.",
  },
  {
    icon: BarChart3,
    title: "CPL hour dashboard",
    desc: "PIC, dual, night, cross-country and instrument totals against your licence targets.",
  },
  {
    icon: Wrench,
    title: "Fleet, fuel & maintenance",
    desc: "Aircraft bookings, fuel logs, MPI and oil-change due readings, expenses — per aircraft.",
  },
  {
    icon: FileDown,
    title: "Export in seconds",
    desc: "Clean PDF logbook print, CSV, and SACAA CA 61-91 auto pre-fill.",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="rounded-2xl border border-cockpit-border bg-cockpit-panel p-6 transition-colors hover:border-cockpit-amber/30"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cockpit-amber/20 bg-cockpit-amber/10">
            <Icon className="w-5 h-5 text-cockpit-amber" />
          </div>
          <h3 className="font-heading text-[16px] font-semibold text-cockpit-cream">{title}</h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-cockpit-muted">{desc}</p>
        </div>
      ))}
    </div>
  );
}