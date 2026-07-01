import React from "react";
import { Gauge, ShieldAlert, Camera, BookOpen, Image, Briefcase } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import FeatureDetail from "@/components/landing/FeatureDetail";
import FeaturesCTA from "@/components/landing/FeaturesCTA";
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
      <PageHeader
        title="Everything a pilot has to track — in one place."
        subtitle="From the first training flight to ATPL, PilotHobb keeps your hours, currency and paperwork current, automatically."
      />

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