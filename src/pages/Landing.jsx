import React from "react";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import WhySection from "@/components/landing/WhySection";
import CTABand from "@/components/landing/CTABand";

export default function Landing() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhySection />
      <CTABand />
    </>
  );
}