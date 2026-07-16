import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import usePilot from "@/hooks/usePilot";

export default function AppLayout() {
  const { pilot, loading } = usePilot();
  if (!loading && pilot && pilot.onboarded !== true) {
    return <Navigate to="/onboarding" replace />;
  }
  return (
    <div className="min-h-screen bg-cockpit-bg">
      <main className="pb-24 max-w-lg mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}