import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import usePilot from "@/hooks/usePilot";
import ErrorBoundary from "@/components/ErrorBoundary";

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
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15, ease: "easeOut" }}
        >
          <ErrorBoundary><Outlet /></ErrorBoundary>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}