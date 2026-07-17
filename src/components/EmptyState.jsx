import React from "react";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex justify-center py-8">
      <div className="ph-card flex flex-col items-center text-center px-6 py-8 max-w-xs w-full">
        {Icon && (
          <div className="w-14 h-14 rounded-full bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center mb-3">
            <Icon className="w-6 h-6 text-cockpit-muted" />
          </div>
        )}
        <h3 className="text-sm font-semibold text-cockpit-cream mb-1">{title}</h3>
        <p className="text-xs text-cockpit-muted">{description}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}