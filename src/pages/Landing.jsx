import React from "react";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import WhySection from "@/components/landing/WhySection";
import CTABand from "@/components/landing/CTABand";
import Seo from "@/components/Seo";

const landingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://pilothobb.com/#org",
      "name": "PilotHobb",
      "url": "https://pilothobb.com",
      "email": "hello@pilothobb.com",
      "logo": "https://media.base44.com/images/public/6a455fc5475b58bb52305622/1a9086f0b_pilothobb-icon-appstore-1024.png"
    },
    {
      "@type": "SoftwareApplication",
      "name": "PilotHobb",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "url": "https://pilothobb.com",
      "publisher": { "@id": "https://pilothobb.com/#org" },
      "description": "Digital pilot logbook for tracking flight hours from Hobbs or Tach readings, licence and medical currency, aircraft maintenance, and RPAS drone hours.",
      "featureList": [
        "Log flights from Hobbs or Tach meter readings",
        "Scan the Hobbs meter with your camera",
        "Automatic touch-and-go landing and take-off totals",
        "Licence, medical and rating expiry tracking",
        "Aircraft maintenance monitoring (MPI and oil hours)",
        "RPAS drone hours tracked separately from manned hours",
        "Career summary and logbook PDF export"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does PilotHobb track drone (RPAS) hours?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. PilotHobb tracks RPAS drone hours in a separate total from manned aeroplane and helicopter hours, because aviation authorities require remote pilot time to be logged separately. Drone flights record mission type, VLOS/BVLOS operation category, battery cycles and observer, and roll into their own RPAS totals." }
        },
        {
          "@type": "Question",
          "name": "Can I log flights using Hobbs or Tach time?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Each aircraft is set to either Hobbs or Tach as its time source. When logging a flight, PilotHobb pre-fills the reading before from the aircraft's last known meter value, you enter the reading after, and flight time is calculated automatically. You can also scan the meter with your phone camera instead of typing it." }
        },
        {
          "@type": "Question",
          "name": "Does PilotHobb track licence and medical expiry?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. PilotHobb tracks licences, ratings, medicals, theory exam validity and English proficiency, showing days remaining with colour-coded status and surfacing the nearest expiry so nothing lapses." }
        },
        {
          "@type": "Question",
          "name": "Which aviation authorities does PilotHobb support?",
          "acceptedAnswer": { "@type": "Answer", "text": "PilotHobb supports pilots under SACAA, FAA, EASA, UK CAA and CASA, for both manned licences (Student, PPL, CPL, ATPL) and remote pilot licences such as SACAA RPL and FAA Part 107." }
        },
        {
          "@type": "Question",
          "name": "How is a touch-and-go counted in PilotHobb?",
          "acceptedAnswer": { "@type": "Answer", "text": "Each touch-and-go counts as one landing and one take-off. PilotHobb totals them automatically from the intermediate stops you add to a route, plus the initial take-off and the final full-stop landing." }
        }
      ]
    }
  ]
};

export default function Landing() {
  return (
    <>
      <Seo
        path="/"
        title="PilotHobb — Digital Pilot Logbook for Flight Hours, Currency & Drone Hours"
        description="PilotHobb is a digital pilot logbook that tracks flight hours from your Hobbs or Tach meter, licence and medical expiry, aircraft maintenance, and RPAS drone hours separately. For SACAA, FAA, EASA and UK CAA pilots."
        jsonLd={landingJsonLd}
      />
      <Hero />
      <TrustStrip />
      <WhySection />
      <CTABand />
    </>
  );
}