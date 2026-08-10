import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a href="#" className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-cockpit-panel border border-cockpit-border hover:border-cockpit-amber/40 transition-colors">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-cockpit-cream" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.14 16.37 3.01 11.68 5.04 8.5c1.01-1.62 2.82-2.65 4.76-2.68 1.28-.03 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
              </svg>
              <span className="text-left">
                <span className="block text-[10px] text-cockpit-muted leading-none">Download on the</span>
                <span className="block text-sm font-semibold text-cockpit-cream font-heading">App Store</span>
              </span>
            </a>
            <a href="#" className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-cockpit-panel border border-cockpit-border hover:border-cockpit-amber/40 transition-colors">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M3 3.5v17l9-8.5-9-8.5z" fill="#4F46E5" />
                <path d="M3 3.5l9 8.5 3.5-3.3L4.5 3.5H3z" fill="#191C1E" opacity="0.6" />
                <path d="M3 20.5l9-8.5 3.5 3.3L4.5 20.5H3z" fill="#6B7280" />
              </svg>
              <span className="text-left">
                <span className="block text-[10px] text-cockpit-muted leading-none">Get it on</span>
                <span className="block text-sm font-semibold text-cockpit-cream font-heading">Google Play</span>
              </span>
            </a>
          </div>
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
