import React from "react";
export default function AppHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: "rgba(255,157,46,.14)", border: "1px solid rgba(255,157,46,.28)" }}>
            {Icon && <Icon className="w-5 h-5 text-cockpit-amber" />}
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold text-cockpit-cream leading-none truncate">{title}</h1>
            {subtitle && <p className="text-xs text-cockpit-muted mt-1 truncate">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="mt-4 h-px w-full"
           style={{ background: "linear-gradient(90deg, rgba(255,157,46,.55), rgba(36,48,73,0))" }} />
    </div>
  );
}