import React, { useEffect, useLayoutEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import usePilot from "@/hooks/usePilot";
import ErrorBoundary from "@/components/ErrorBoundary";
import Dashboard from "@/pages/Dashboard";
import Logbook from "@/pages/Logbook";
import Fleet from "@/pages/Fleet";
import Tracking from "@/pages/Tracking";
import More from "@/pages/More";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Bottom-tab pages are kept mounted (hidden when inactive) so each tab
// preserves its own scroll position and component state across switches.
const TAB_PAGES = {
  "/dashboard": Dashboard,
  "/logbook": Logbook,
  "/fleet": Fleet,
  "/tracking": Tracking,
  "/more": More,
};

const scrollCache = {};

export default function AppLayout() {
  const { pilot, loading } = usePilot();
  const location = useLocation();
  const ActiveTab = TAB_PAGES[location.pathname];

  // Continuously record the scroll position of the active tab.
  useEffect(() => {
    const onScroll = () => {
      const p = window.location.pathname;
      if (TAB_PAGES[p]) scrollCache[p] = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Restore the remembered scroll position when switching to a tab.
  useLayoutEffect(() => {
    if (ActiveTab) {
      const y = scrollCache[location.pathname] ?? 0;
      window.scrollTo(0, y);
    }
  }, [location.pathname, ActiveTab]);

  if (!loading && pilot && pilot.onboarded !== true) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-cockpit-bg safe-top">
      <main className="app-scroll pb-24 max-w-lg mx-auto">
        {ActiveTab ? (
          Object.entries(TAB_PAGES).map(([path, Comp]) => (
            <div key={path} className={path === location.pathname ? "" : "hidden"}>
              <ErrorBoundary><Comp /></ErrorBoundary>
            </div>
          ))
        ) : (
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15, ease: "easeOut" }}
          >
            <ErrorBoundary><Outlet /></ErrorBoundary>
          </motion.div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}