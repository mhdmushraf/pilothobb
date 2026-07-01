import React from "react";
import { Link } from "react-router-dom";
import { Gauge, ShieldAlert, BookOpen, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const cards = [
  {
    icon: Gauge,
    title: "Log from the Hobbs",
    text: "Enter reading before and after. Flight time computes to one decimal — just like the meter.",
  },
  {
    icon: ShieldAlert,
    title: "Currency, never guessed",
    text: "Licences, ratings, medicals — colour-coded by days remaining. You always know where you stand.",
  },
  {
    icon: BookOpen,
    title: "Your logbook, page for page",
    text: "Export a clean, authority-ready logbook. Every page, every entry, every tenth accounted for.",
  },
];

export default function WhySection() {
  return (
    <section className="px-4 sm:px-6 py-20 max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cockpit-cream text-center mb-12 max-w-2xl mx-auto leading-tight">
          The paperwork of flying, finally handled.
        </h2>
      </ScrollReveal>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <ScrollReveal key={c.title} delay={i * 100}>
              <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 hover:border-cockpit-amber/30 transition-colors h-full">
                <div className="w-12 h-12 rounded-xl bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-cockpit-amber" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-cockpit-cream mb-2">
                  {c.title}
                </h3>
                <p className="text-sm text-cockpit-muted leading-relaxed">{c.text}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
      <ScrollReveal delay={300}>
        <div className="text-center">
          <Link
            to="/features"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-transparent border border-cockpit-border text-cockpit-cream text-sm font-semibold hover:border-cockpit-amber/40 hover:bg-cockpit-panel transition-all"
          >
            See everything it does <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}