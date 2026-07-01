import React from "react";
import ScrollReveal from "@/components/ScrollReveal";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="px-4 py-20 text-center max-w-3xl mx-auto">
      {eyebrow && (
        <ScrollReveal>
          <span className="inline-block text-[11px] font-semibold text-cockpit-amber uppercase tracking-[0.15em] mb-4">
            {eyebrow}
          </span>
        </ScrollReveal>
      )}
      <ScrollReveal delay={100}>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-cockpit-cream mb-4 leading-tight">
          {title}
        </h1>
      </ScrollReveal>
      {subtitle && (
        <ScrollReveal delay={200}>
          <p className="text-cockpit-muted text-lg max-w-xl mx-auto">{subtitle}</p>
        </ScrollReveal>
      )}
    </section>
  );
}