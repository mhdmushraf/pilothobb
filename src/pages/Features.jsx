import React from "react";
import { Gauge, ShieldAlert, Camera, BookOpen, Image, Briefcase, BarChart3, Wrench, FileDown, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StoreButtons from "@/components/StoreButtons";
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

const CATS = [
  { icon: Gauge, title: "Flight logging", items: ["Hobbs or Tach — flight time auto-calculated", "Scan the meter with your camera", "Touch-and-go, take-off & landing totals", "Quick Log from takeoff/landing times", "PIC, Dual, PICUS & Co-pilot roles", "Night, cross-country & instrument time", "RPAS / drone hours logged separately"] },
  { icon: ShieldAlert, title: "Currency & compliance", items: ["Licences, ratings & medicals with expiry rings", "Theory-exam & English-proficiency validity", "Night & instrument recency from your flights", "‘Expiring soon’ alerts on your dashboard"] },
  { icon: BookOpen, title: "Records & documents", items: ["Fleet management by type & category", "Exams, licences & RPAS credentials", "Endorsements with a photo of the page", "Maintenance log with upcoming intervals", "Personal pilot notes & debriefs"] },
  { icon: BarChart3, title: "Insights & career", items: ["Dashboard totals, month snapshot & insights", "6-month analytics trends", "Career totals & hours by aircraft type", "Achievement badges", "Goals with progress tracking", "Logbook activity heatmap"] },
  { icon: Wrench, title: "Operations tools", items: ["Fuel tracker — cost & burn rate", "Expenses by category", "Flight planning — fuel, time & wind", "Aircraft schedule & bookings", "Aerodrome directory", "Pre-flight & emergency checklists"] },
  { icon: FileDown, title: "Your logbook, exportable", items: ["Filterable flight list", "Official SACAA 32-column logbook view", "Summary by aircraft type, any date range", "PDF + CSV export anytime", "Your data is never locked in"] },
];

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

      {/* Full capability catalog */}
      <section className="px-4 sm:px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-cockpit-cream mb-3">Everything in Pilot Hobb</h2>
          <p className="text-cockpit-muted">One app for logging, currency, records, insights and operations — for manned aircraft and drones alike.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6">
                <div className="w-11 h-11 rounded-xl bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-cockpit-amber" /></div>
                <h3 className="font-heading text-lg font-semibold text-cockpit-cream mb-3">{c.title}</h3>
                <ul className="space-y-2">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-cockpit-muted"><Check className="w-4 h-4 text-cockpit-valid mt-0.5 shrink-0" /> {it}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Download band */}
      <section className="px-4 sm:px-6 pb-20 max-w-3xl mx-auto">
        <div className="rounded-3xl bg-[#0f172a] text-white p-8 sm:p-10 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">Take it to the cockpit.</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">Get Pilot Hobb on your phone — or start free in your browser right now.</p>
          <StoreButtons className="mb-4" />
          <p className="text-white/50 text-xs">App store links go live at launch.</p>
        </div>
      </section>

      <FeaturesCTA />
    </>
  );
}