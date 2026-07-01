import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function MarketingLayout() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <TopNav />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}