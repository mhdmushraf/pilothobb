import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

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
      <Footer />
    </div>
  );
}