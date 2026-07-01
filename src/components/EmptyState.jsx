import React from "react";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-cockpit-panel border border-cockpit-border flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-cockpit-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-cockpit-cream mb-1">{title}</h3>
      <p className="text-sm text-cockpit-muted max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}