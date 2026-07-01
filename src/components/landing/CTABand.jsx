import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function CTABand() {
  return (
    <section className="px-4 sm:px-6 py-16">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto rounded-3xl bg-cockpit-panel border border-cockpit-border p-10 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cockpit-amber/5 to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cockpit-cream mb-3">
              Start your logbook tonight.
            </h2>
            <p className="text-cockpit-muted mb-8 max-w-md mx-auto">
              Free for 14 days. Your hours, current to the tenth.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-cockpit-amber text-cockpit-bg font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30 hover:-translate-y-0.5 transition-all"
              >
                Get PilotHobb <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-transparent border border-cockpit-border text-cockpit-cream font-semibold hover:border-cockpit-amber/40 hover:bg-cockpit-panel-light transition-all"
              >
                Explore features
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}