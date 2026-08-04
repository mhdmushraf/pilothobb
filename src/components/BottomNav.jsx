import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Plane, MoreHorizontal, Plus, Radar } from "lucide-react";
import { tap } from "@/lib/haptic";

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
  const navigate = useNavigate();

  const handleTabClick = (e, tab) => {
    tap();
    const active = tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);
    if (active) {
      // Already on this tab: clear any open detail overlay / search params,
      // reset child routing to the tab root, and scroll back to the top —
      // native tab-tap behaviour. rAF ensures the scroll runs after the
      // location update and any overlay unmount.
      e.preventDefault();
      navigate(tab.path, { replace: true });
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cockpit-panel/95 backdrop-blur-lg border-t-2 border-cockpit-border shadow-[0_-8px_24px_rgba(0,0,0,0.35)]">
      <div className="flex items-end justify-around px-2 pb-[env(safe-area-inset-bottom)] max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);
          const Icon = tab.icon;

          if (tab.isFab) {
            return (
              <Link
                key={tab.path}
                to={tab.path}
                onClick={() => tap()}
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
              onClick={(e) => handleTabClick(e, tab)}
              className="relative flex flex-col items-center pt-2 pb-1 px-3 min-w-[56px] active:scale-95 transition-transform"
            >
              {active && (
                <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cockpit-amber shadow-[0_0_8px_2px_rgba(79,70,229,0.5)]" />
              )}
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