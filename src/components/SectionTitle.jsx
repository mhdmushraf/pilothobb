import React from "react";
export default function SectionTitle({ icon: Icon, children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] font-semibold text-cockpit-muted uppercase tracking-[0.14em] flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />} {children}
      </h2>
      {action}
    </div>
  );
}