import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import StoreButtons from "@/components/StoreButtons";
import Seo from "@/components/Seo";

const highlights = [
  "Log flights from your Hobbs or Tach in seconds",
  "Currency & renewal reminders, colour-coded",
  "Separate manned and RPAS (drone) hours",
  "Authority-ready PDF & CSV export",
];

export default function Download() {
  return (
    <>
      <Seo
        path="/download"
        title="Get the App — PilotHobb for iPhone & Android"
        description="Download PilotHobb, the digital pilot logbook for manned and drone (RPAS) flying. Available for iPhone and Android."
      />
      <PageHeader
        eyebrow="Get the app"
        title="Your logbook, in your pocket."
        subtitle="Start free tonight — your first flight is only a few taps away."
      />

      {/* Hero image */}
      <section className="px-4 sm:px-6 -mt-6 mb-10 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-cockpit-border shadow-xl shadow-cockpit-amber/10">
          <img
            src="https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=1600&q=75&auto=format&fit=crop"
            alt="Airliner climbing into a clear sky"
            loading="lazy"
            className="w-full h-52 sm:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cockpit-bg/85 to-transparent" />
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-10 max-w-3xl mx-auto">
        <ScrollReveal>
          <StoreButtons className="justify-center mb-8" />
          <p className="text-center text-xs text-cockpit-muted mb-10">
            App store links go live at launch. In the meantime, you can start in your browser.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-cockpit-cream mb-4 text-center">What you get</h2>
            <ul className="space-y-3 max-w-md mx-auto">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-cockpit-muted">
                  <Check className="w-4 h-4 text-cockpit-amber mt-0.5 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="text-center mt-8">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-cockpit-amber text-cockpit-bg font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30 hover:-translate-y-0.5 transition-all"
              >
                Start free in your browser
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
