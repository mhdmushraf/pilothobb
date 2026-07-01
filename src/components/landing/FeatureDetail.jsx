import React from "react";
import ScrollReveal from "@/components/ScrollReveal";

export default function FeatureDetail({ icon: Icon, title, description, points, reverse, visual }) {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } gap-10 items-center`}
    >
      <ScrollReveal className="flex-1">
        <div className="w-12 h-12 rounded-xl bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-cockpit-amber" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-cockpit-cream mb-3">{title}</h3>
        <p className="text-cockpit-muted mb-5 leading-relaxed">{description}</p>
        <ul className="space-y-2">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-cockpit-muted">
              <span className="text-cockpit-amber mt-0.5">▸</span> {p}
            </li>
          ))}
        </ul>
      </ScrollReveal>
      <ScrollReveal delay={150} className="flex-1 w-full">
        {visual}
      </ScrollReveal>
    </div>
  );
}