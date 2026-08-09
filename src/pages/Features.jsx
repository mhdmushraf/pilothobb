import React from "react";
import { Gauge, ShieldAlert, Camera, BookOpen, Image, Briefcase } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import FeatureDetail from "@/components/landing/FeatureDetail";
import FeaturesCTA from "@/components/landing/FeaturesCTA";
import Seo from "@/components/Seo";
import {
  RouteVisual,
  CurrencyVisual,
  MeterVisual,
  LogbookVisual,
  EndorsementVisual,
  CareerVisual,
} from "@/components/landing/FeatureVisuals";

export default function Features() {
  return (
    <>
      <Seo
        path="/features"
        title="Features — Hobbs/Tach Logging, Currency Alerts & RPAS Hours | PilotHobb"
        description="Log flights straight from Hobbs or Tach readings with camera scanning, auto-calculate touch-and-go landings, track licence, medical and rating expiry, monitor MPI and oil hours, and keep drone (RPAS) hours separate from manned time."
      />
      <PageHeader
        title="Everything a pilot has to track — in one place."
        subtitle="From the first training flight to ATPL, PilotHobb keeps your hours, currency and paperwork current, automatically."
      />

      {/* Immersive hero image band */}
      <section className="px-4 sm:px-6 -mt-6 mb-4 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-cockpit-border shadow-xl shadow-cockpit-amber/10">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=75&auto=format&fit=crop"
            alt="Aircraft wing above a sea of clouds at sunset"
            loading="lazy"
            className="w-full h-56 sm:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cockpit-bg/85 via-cockpit-bg/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <span className="inline-block px-2.5 py-1 rounded-full bg-cockpit-amber/90 text-white text-[10px] font-semibold uppercase tracking-wider mb-2">
              Built for how pilots actually fly
            </span>
            <p className="font-heading text-lg sm:text-2xl font-bold text-white max-w-md leading-snug drop-shadow">
              Hours, currency, endorsements and drone time — one calm, accurate record.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-10 max-w-5xl mx-auto space-y-20">
        <FeatureDetail
          icon={Gauge}
          title="Log from the Hobbs — with stops & touch-and-go's"
          description="Pick Hobbs or Tach once per aircraft; before and after readings total themselves. Add intermediate stops, set a touch-and-go count at each, and landings and take-offs add up automatically."
          visual={<RouteVisual />}
        />

        <FeatureDetail
          reverse
          icon={ShieldAlert}
          title="Currency, calculated"
          description="Medicals, ratings, theory exams and English proficiency — renewal dates worked out from your entries. Green while valid, amber as it nears, red when it lapses."
          visual={<CurrencyVisual />}
        />

        <FeatureDetail
          icon={Camera}
          title="The camera reads the meter"
          description="Point the phone at the Hobbs or Tach and it reads the digits into the entry. Rolling out after launch."
          visual={<MeterVisual />}
        />

        <FeatureDetail
          reverse
          icon={BookOpen}
          title="The logbook, page for page"
          description="A faithful replica of a physical logbook spread. Pick a page range and export a clean PDF for an examiner, employer, or interview."
          visual={<LogbookVisual />}
        />

        <FeatureDetail
          icon={Image}
          title="Endorsements with a photo"
          description="Every endorsement kept as a record with the actual page captured alongside it — so your logbook is complete, visual, and verifiable."
          visual={<EndorsementVisual />}
        />

        <FeatureDetail
          reverse
          icon={Briefcase}
          title="Career summary"
          description="PIC and dual per type, and the date last flown each — always current for licence applications and interviews."
          visual={<CareerVisual />}
        />
      </section>

      <FeaturesCTA />
    </>
  );
}