import React from "react";
import Logo from "@/components/Logo";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{ background: "radial-gradient(120% 60% at 50% -10%, rgba(255,157,46,.10), transparent 55%), #0A0E17" }}
    >
      {/* live airspace canvas, dimmed, behind everything */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <AnimatedBackground />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Logo size={46} />
          </div>
          {Icon && (
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cockpit-amber/15 border border-cockpit-amber/30 mb-4">
              <Icon className="w-5 h-5 text-cockpit-amber" aria-hidden="true" />
            </div>
          )}
          <h1 className="text-3xl font-heading font-bold tracking-tight text-cockpit-cream">{title}</h1>
          {subtitle && <p className="text-cockpit-muted mt-2">{subtitle}</p>}
        </div>

        <div
          className="rounded-3xl border border-cockpit-border p-8 shadow-2xl shadow-black/40 backdrop-blur-sm"
          style={{ background: "linear-gradient(180deg, rgba(20,27,43,.92), rgba(16,21,31,.92))" }}
        >
          {children}
        </div>

        {footer && (
          <p className="text-center text-sm text-cockpit-muted mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}