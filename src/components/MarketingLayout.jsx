import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import ErrorBoundary from "@/components/ErrorBoundary";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MarketingLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <TopNav />
      <main className="pt-16 app-scroll">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15, ease: "easeOut" }}
        >
          <ErrorBoundary><Outlet /></ErrorBoundary>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}