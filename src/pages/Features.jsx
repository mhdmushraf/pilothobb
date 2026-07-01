import React from "react";
import { Gauge, ShieldAlert, Plane, FileText, Globe2, Moon } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import FeatureDetail from "@/components/landing/FeatureDetail";
import CTASection from "@/components/landing/CTASection";
import ScrollReveal from "@/components/ScrollReveal";

function MockupCard({ children }) {
  return (
    <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 shadow-xl shadow-black/20">
      {children}
    </div>
  );
}

export default function Features() {
  return (
    <>
      <PageHeader
        title="Built like an instrument panel"
        subtitle="Every detail of PilotHobb is designed for precision and calm — from the Hobbs counter to the currency alerts."
      />

      <section className="px-4 py-10 max-w-5xl mx-auto space-y-20">
        <FeatureDetail
          icon={Gauge}
          title="Hobbs & Tach precision"
          description="Enter your reading before and after each flight. PilotHobb computes flight time automatically — to one decimal place, exactly like your Hobbs meter."
          points={[
            "Supports both Hobbs and Tach time sources per aircraft",
            "Automatic flight time = reading after − reading before",
            "Per-aircraft running totals, always up to date",
          ]}
          visual={
            <MockupCard>
              <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-3">Flight Time</p>
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <p className="text-[10px] text-cockpit-muted mb-1">Before</p>
                  <p className="font-mono text-2xl font-bold text-cockpit-cream">1247.6</p>
                </div>
                <span className="text-cockpit-muted text-xl">→</span>
                <div>
                  <p className="text-[10px] text-cockpit-muted mb-1">After</p>
                  <p className="font-mono text-2xl font-bold text-cockpit-cream">1250.9</p>
                </div>
              </div>
              <div className="pt-4 border-t border-cockpit-border">
                <p className="text-xs text-cockpit-muted">Computed</p>
                <p className="font-mono text-3xl font-bold text-cockpit-amber">3.3 hrs</p>
              </div>
            </MockupCard>
          }
        />

        <FeatureDetail
          reverse
          icon={ShieldAlert}
          title="Currency that never slips"
          description="Your licences, ratings, and medicals are tracked with colour-coded expiry cards. Green, gold, or red — you always know where you stand."
          points={[
            "Dashboard currency row shows nearest expiries",
            "Green > 90 days · Gold ≤ 90 days · Red expired",
            "Licences, ratings, and medicals in one view",
          ]}
          visual={
            <MockupCard>
              <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-3">Currency</p>
              <div className="flex gap-2">
                <div className="flex-1 rounded-xl bg-cockpit-valid/10 border border-cockpit-valid/20 p-3">
                  <p className="text-[11px] text-cockpit-muted truncate">Class 1 Medical</p>
                  <p className="font-mono text-lg font-bold text-cockpit-valid">142</p>
                  <p className="text-[10px] text-cockpit-valid">days left</p>
                </div>
                <div className="flex-1 rounded-xl bg-cockpit-warning/10 border border-cockpit-warning/20 p-3">
                  <p className="text-[11px] text-cockpit-muted truncate">IR Rating</p>
                  <p className="font-mono text-lg font-bold text-cockpit-warning">28</p>
                  <p className="text-[10px] text-cockpit-warning">days left</p>
                </div>
                <div className="flex-1 rounded-xl bg-cockpit-valid/10 border border-cockpit-valid/20 p-3">
                  <p className="text-[11px] text-cockpit-muted truncate">CPL</p>
                  <p className="font-mono text-lg font-bold text-cockpit-valid">367</p>
                  <p className="text-[10px] text-cockpit-valid">days left</p>
                </div>
              </div>
            </MockupCard>
          }
        />

        <FeatureDetail
          icon={Plane}
          title="Fleet management"
          description="Each aircraft you fly gets its own profile with per-type totals, time source, and last-flown date — so your records stay organised."
          points={[
            "Per-aircraft PIC, dual, and total time",
            "SEP, MEP, Helicopter, and Other categories",
            "Last-flown tracking at a glance",
          ]}
          visual={
            <MockupCard>
              <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-3">Fleet</p>
              <div className="space-y-2">
                {[
                  { reg: "ZS-ABC", type: "C172", cat: "SEP", total: 482.3 },
                  { reg: "ZS-DEF", type: "PA28", cat: "SEP", total: 156.7 },
                  { reg: "ZS-GHI", type: "R44", cat: "Heli", total: 89.1 },
                ].map((ac) => (
                  <div key={ac.reg} className="flex items-center justify-between p-3 rounded-lg bg-cockpit-panel-light border border-cockpit-border">
                    <div>
                      <p className="font-mono text-sm font-bold text-cockpit-cream">{ac.reg}</p>
                      <p className="text-xs text-cockpit-muted">{ac.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-cockpit-amber">{ac.total}h</p>
                      <p className="text-[10px] text-cockpit-muted">{ac.cat}</p>
                    </div>
                  </div>
                ))}
              </div>
            </MockupCard>
          }
        />

        <FeatureDetail
          reverse
          icon={FileText}
          title="All your documents, organised"
          description="Exams, licences, ratings, medicals, and endorsements — grouped, sorted, and always at your fingertips. No more digging through folders."
          points={[
            "Exam validity windows calculated automatically (18 & 36 months)",
            "Licences, ratings, and medicals in separate groups",
            "Endorsements with page images for your logbook",
          ]}
          visual={
            <MockupCard>
              <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-3">Documents</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-cockpit-panel-light border border-cockpit-border">
                  <span className="text-sm text-cockpit-cream">PPL Air Law</span>
                  <span className="font-mono text-sm text-cockpit-valid">92%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-cockpit-panel-light border border-cockpit-border">
                  <span className="text-sm text-cockpit-cream">CPL</span>
                  <span className="font-mono text-xs text-cockpit-valid">365 days</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-cockpit-panel-light border border-cockpit-border">
                  <span className="text-sm text-cockpit-cream">Class 1 Medical</span>
                  <span className="font-mono text-xs text-cockpit-warning">28 days</span>
                </div>
              </div>
            </MockupCard>
          }
        />
      </section>

      <section className="px-4 py-20 max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Globe2, title: "Multi-authority", text: "FAA, EASA, UK CAA, SACAA, CASA & Other" },
              { icon: Moon, title: "Night cockpit", text: "Dark, calm, premium — built for low light" },
              { icon: Gauge, title: "Always precise", text: "Monospace numbers, never rounded" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 text-center">
                  <div className="w-10 h-10 rounded-lg bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-cockpit-amber" />
                  </div>
                  <h4 className="font-heading text-sm font-semibold text-cockpit-cream mb-1">{f.title}</h4>
                  <p className="text-xs text-cockpit-muted">{f.text}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      <CTASection />
    </>
  );
}