import React from "react";
import { Link } from "react-router-dom";
import { Lock, Download, KeyRound, ServerCog, EyeOff, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import Seo from "@/components/Seo";

const points = [
  { icon: Lock, title: "Encrypted in transit & at rest", text: "Your data is encrypted in transit and at rest. Passwords are hashed — never stored in plain text." },
  { icon: Download, title: "Your data is yours", text: "Export your full logbook to PDF or CSV whenever you like. Nothing is locked in, even if you cancel." },
  { icon: KeyRound, title: "You control access", text: "Only you can see your logbook. We never sell your personal information or share it for advertising." },
  { icon: ServerCog, title: "Reliable infrastructure", text: "Built on established cloud infrastructure with backups, so your records are safe as you change devices." },
  { icon: EyeOff, title: "Minimal by design", text: "We collect only what’s needed to run your logbook — no unnecessary tracking or data harvesting." },
  { icon: Trash2, title: "Delete on request", text: "Ask us to delete your account and we remove your data within a reasonable period, save where the law requires retention." },
];

export default function Security() {
  return (
    <>
      <Seo
        path="/security"
        title="Security & Your Data | PilotHobb"
        description="How PilotHobb keeps your pilot logbook secure and private: encryption, data ownership, PDF/CSV export, and full control over your records."
      />
      <PageHeader
        eyebrow="Trust"
        title="Your logbook. Your data. Full stop."
        subtitle="A logbook is a record you keep for a lifetime — so we treat it that way."
      />

      {/* Hero image */}
      <section className="px-4 sm:px-6 -mt-6 mb-12 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-cockpit-border shadow-xl shadow-cockpit-amber/10">
          <img
            src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=1600&q=75&auto=format&fit=crop"
            alt="Aerial view of coastline from altitude"
            loading="lazy"
            className="w-full h-52 sm:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cockpit-bg/85 to-transparent" />
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <ScrollReveal key={p.title} delay={Math.min(i * 80, 240)}>
                <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-cockpit-amber" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-cockpit-cream mb-2">{p.title}</h3>
                  <p className="text-sm text-cockpit-muted leading-relaxed">{p.text}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-24 max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-cockpit-muted">
            Read the details in our{" "}
            <Link to="/privacy" className="text-cockpit-amber font-semibold">Privacy Policy</Link>, or{" "}
            <Link to="/contact" className="text-cockpit-amber font-semibold">ask us anything</Link>.
          </p>
        </ScrollReveal>
      </section>
    </>
  );
}
