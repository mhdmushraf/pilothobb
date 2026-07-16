import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Plane, MoreHorizontal, Plus, Radar } from "lucide-react";

const tabs = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/logbook", label: "Logbook", icon: BookOpen },
  { path: "/add-flight", label: "Add", icon: Plus, isFab: true },
  { path: "/fleet", label: "Fleet", icon: Plane },
  { path: "/tracking", label: "Track", icon: Radar },
  { path: "/more", label: "More", icon: MoreHorizontal },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cockpit-panel/95 backdrop-blur-lg border-t border-cockpit-border">
      <div className="flex items-end justify-around px-2 pb-[env(safe-area-inset-bottom)] max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);
          const Icon = tab.icon;

          if (tab.isFab) {
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="relative -top-4 flex items-center justify-center w-14 h-14 rounded-full bg-cockpit-amber shadow-lg shadow-cockpit-amber/30 active:scale-95 transition-transform"
              >
                <Icon className="w-7 h-7 text-cockpit-bg" strokeWidth={2.5} />
              </Link>
            );
          }

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center pt-2 pb-1 px-3 min-w-[56px]"
            >
              <Icon
                className={`w-5 h-5 mb-0.5 transition-colors ${active ? "text-cockpit-amber" : "text-cockpit-muted"}`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${active ? "text-cockpit-amber" : "text-cockpit-muted"}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}