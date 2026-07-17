import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import usePilot from "@/hooks/usePilot";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function AppLayout() {
  const { pilot, loading } = usePilot();
  const location = useLocation();

  if (!loading && pilot && pilot.onboarded !== true) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-cockpit-bg safe-top">
      <main className="app-scroll pb-24 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.22, ease: "easeOut" }
            }
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}