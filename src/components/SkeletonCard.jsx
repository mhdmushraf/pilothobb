import React from "react";

export default function SkeletonCard({ className = "", lines = 3 }) {
  return (
    <div className={`rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 ${className}`}>
      <div className="skeleton-shimmer h-4 w-1/3 rounded mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton-shimmer h-3 rounded mb-2" style={{ width: `${80 - i * 15}%` }} />
      ))}
    </div>
  );
}