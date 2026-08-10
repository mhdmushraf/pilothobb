import React from "react";
import { Link } from "react-router-dom";
import { Plane, Layers, ShieldCheck, BatteryCharging, Eye, FileDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import Seo from "@/components/Seo";

const features = [
  { icon: Layers, title: "Manned + drone, one logbook", text: "Keep RPAS time completely separate from manned time — no more juggling two logbooks or a spreadsheet on the side." },
  { icon: ShieldCheck, title: "Operation categories", text: "Record VLOS, EVLOS or BVLOS on every flight, so your operating conditions are always part of the record." },
  { icon: BatteryCharging, title: "Battery cycles", text: "Track battery cycles per flight to keep on top of maintenance and airworthiness of your aircraft." },
  { icon: Eye, title: "Observer & mission type", text: "Log your observer and the mission — survey, inspection, photography, agriculture and more — for a complete operational history." },
  { icon: Plane, title: "Aircraft register", text: "Register each drone alongside your manned aircraft, with its own readings, hours and maintenance clock." },
  { icon: FileDown, title: "Export-ready", text: "Produce clean PDF or CSV exports of your RPAS hours for clients, audits, or authority requirements." },
];

export default function Rpas() {
  return (
    <>
      <Seo
        path="/rpas"
        title="Drone & RPAS Logbook — Track Remote Pilot Hours | PilotHobb"
        description="Log drone (RPAS) hours alongside your manned flying in one app. Track VLOS/EVLOS/BVLOS, mission type, battery cycles and observer, and export authority-ready records."
      />
      <PageHeader
        eyebrow="For Remote Pilots"
        title="A logbook that flies manned and unmanned."
        subtitle="PilotHobb keeps your RPAS hours as rigorously as your aircraft hours — separate, structured, and export-ready."
      />

      {/* Hero image */}
      <section className="px-4 sm:px-6 -mt-6 mb-12 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-cockpit-border shadow-xl shadow-cockpit-amber/10">
          <img
            src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1600&q=75&auto=format&fit=crop"
            alt="Drone in flight over water"
            loading="lazy"
            className="w-full h-56 sm:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cockpit-bg/85 via-cockpit-bg/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <span className="inline-block px-2.5 py-1 rounded-full bg-cockpit-amber/90 text-white text-[10px] font-semibold uppercase tracking-wider mb-2">
              RPAS-ready
            </span>
            <p className="font-heading text-lg sm:text-2xl font-bold text-white max-w-md leading-snug drop-shadow">
              Drone time, logged with the same precision as the cockpit.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <ScrollReveal key={f.title} delay={Math.min(i * 80, 240)}>
                <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-cockpit-amber" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-cockpit-cream mb-2">{f.title}</h3>
                  <p className="text-sm text-cockpit-muted leading-relaxed">{f.text}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-24 max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl bg-cockpit-panel border border-cockpit-border p-10 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cockpit-amber/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-cockpit-cream mb-3">
                Fly both? Log both.
              </h2>
              <p className="text-cockpit-muted mb-6 max-w-lg mx-auto">
                Start your logbook today and keep every hour — manned and unmanned — in one place.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-cockpit-amber text-cockpit-bg font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30 hover:-translate-y-0.5 transition-all"
              >
                Start free
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
