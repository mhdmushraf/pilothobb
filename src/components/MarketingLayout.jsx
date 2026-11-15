import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import AnimatedBackground from "@/components/AnimatedBackground";
import ErrorBoundary from "@/components/ErrorBoundary";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MarketingLayout() {
  const location = useLocation();
  return (
    <div className="ph-site relative font-body">
      <AnimatedBackground />
      <LandingNav />
      <main>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15, ease: "easeOut" }}
        >
          <ErrorBoundary><Outlet /></ErrorBoundary>
        </motion.div>
      </main>
      <LandingFooter />
    </div>
  );
}
