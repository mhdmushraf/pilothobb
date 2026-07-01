import React from "react";
import ScrollReveal from "@/components/ScrollReveal";

export default function PageHeader({ title, subtitle }) {
  return (
    <section className="px-4 py-20 text-center max-w-3xl mx-auto">
      <ScrollReveal>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-cockpit-cream mb-4 leading-tight">
          {title}
        </h1>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <p className="text-cockpit-muted text-lg max-w-xl mx-auto">{subtitle}</p>
      </ScrollReveal>
    </section>
  );
}