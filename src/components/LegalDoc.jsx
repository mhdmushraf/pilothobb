import React from "react";
import ScrollReveal from "@/components/ScrollReveal";

// Simple, readable legal-document layout shared by Privacy & Terms.
export default function LegalDoc({ updated, intro, sections }) {
  return (
    <section className="px-4 sm:px-6 pb-24 max-w-3xl mx-auto">
      <ScrollReveal>
        <p className="text-xs text-cockpit-muted mb-8">Last updated: {updated}</p>
        {intro && <p className="text-cockpit-muted leading-relaxed mb-10">{intro}</p>}
      </ScrollReveal>

      <div className="space-y-10">
        {sections.map((s, i) => (
          <ScrollReveal key={i} delay={Math.min(i * 40, 200)}>
            <div>
              <h2 className="font-heading text-xl font-bold text-cockpit-cream mb-3">
                {i + 1}. {s.h}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="text-sm text-cockpit-muted leading-relaxed mb-3">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-2 space-y-2">
                  {s.list.map((li, k) => (
                    <li key={k} className="flex gap-2 text-sm text-cockpit-muted leading-relaxed">
                      <span className="text-cockpit-amber mt-0.5">•</span>
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 text-center">
        <p className="text-sm text-cockpit-muted">
          Questions about this document? Email{" "}
          <a href="mailto:hello@pilothobb.com" className="text-cockpit-amber font-medium">
            hello@pilothobb.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
