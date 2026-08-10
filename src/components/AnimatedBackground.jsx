import React from "react";

/**
 * Clean, professional marketing background.
 * Static (no animation) — a light surface with two very subtle brand-tinted
 * glows, in the spirit of modern SaaS sites. Sits behind all content.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 85% -10%, rgba(79,70,229,0.06), transparent 60%)," +
            "radial-gradient(800px 500px at 0% 110%, rgba(20,184,166,0.05), transparent 60%)," +
            "#F7F9FB",
        }}
      />
    </div>
  );
}
