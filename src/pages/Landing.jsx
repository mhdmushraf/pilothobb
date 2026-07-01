import React from "react";
import Hero from "@/components/landing/Hero";
import FeatureHighlights from "@/components/landing/FeatureHighlights";
import CTASection from "@/components/landing/CTASection";

export default function Landing() {
  return (
    <>
      <Hero />
      <FeatureHighlights />
      <CTASection />
    </>
  );
}