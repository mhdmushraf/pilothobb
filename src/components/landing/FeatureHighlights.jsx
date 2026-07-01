import React from "react";
import { Moon, Gauge, ShieldAlert, Globe } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    icon: Moon,
    title: "Night cockpit design",
    description:
      "A dark, instrument-panel interface that's easy on the eyes — in the cockpit or the crew room.",
  },
  {
    icon: Gauge,
    title: "Hobbs & Tach tracking",
    description:
      "Log readings before and after. Flight time computes automatically to one decimal, just like your Hobbs meter.",
  },
  {
    icon: ShieldAlert,
    title: "Currency alerts",
    description:
      "Never let a licence, rating or medical lapse. Colour-coded expiry cards keep you always current.",
  },
  {
    icon: Globe,
    title: "Worldwide compliance",
    description:
      "FAA, EASA, UK CAA, SACAA, CASA and more. PilotHobb adapts to your authority, wherever you fly.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="px-4 py-20 max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cockpit-cream text-center mb-4">
          Everything a pilot needs
        </h2>
        <p className="text-cockpit-muted text-center max-w-lg mx-auto mb-12">
          Designed around the way pilots actually log — precise, calm, and always at hand.
        </p>
      </ScrollReveal>
      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <ScrollReveal key={f.title} delay={i * 100}>
              <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 hover:border-cockpit-amber/30 transition-colors h-full">
                <div className="w-12 h-12 rounded-xl bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-cockpit-amber" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-cockpit-cream mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-cockpit-muted leading-relaxed">
                  {f.description}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}