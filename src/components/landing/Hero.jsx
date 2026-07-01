import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HobbsCounter from "@/components/HobbsCounter";
import ScrollReveal from "@/components/ScrollReveal";

export default function Hero() {
  return (
    <section className="min-h-[88vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <ScrollReveal>
        <span className="inline-block px-3 py-1 rounded-full bg-cockpit-amber/10 border border-cockpit-amber/20 text-xs font-medium text-cockpit-amber mb-6">
          ✦ Built by pilots, for pilots
        </span>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-cockpit-cream max-w-3xl leading-[1.1]">
          The digital logbook
          <br />
          for pilots worldwide
        </h1>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <p className="text-cockpit-muted text-lg max-w-xl mt-6 leading-relaxed">
          Track every flight with Hobbs/Tach precision. Monitor currency, manage
          licences, and keep your career milestones — all in one calm, precise cockpit.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={300}>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-cockpit-amber text-cockpit-bg font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30 hover:-translate-y-0.5 transition-all"
          >
            Get the app <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            to="/features"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-cockpit-panel border border-cockpit-border text-cockpit-cream font-semibold hover:bg-cockpit-panel-light transition-all"
          >
            See features
          </Link>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={500}>
        <div className="mt-16">
          <p className="text-xs text-cockpit-muted uppercase tracking-widest mb-4">
            Total time logged
          </p>
          <HobbsCounter target={159.3} />
        </div>
      </ScrollReveal>
    </section>
  );
}