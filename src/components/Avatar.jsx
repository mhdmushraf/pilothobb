import React from "react";

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PH";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Avatar({ pilot, size = 44 }) {
  const url = pilot?.avatar_url;
  const init = initials(pilot?.full_name);
  const dim = { width: size, height: size };
  if (url) {
    return (
      <img
        src={url}
        alt=""
        style={dim}
        className="rounded-full object-cover border border-cockpit-border shrink-0"
      />
    );
  }
  return (
    <span
      style={{ ...dim, fontSize: size * 0.34 }}
      className="rounded-full bg-cockpit-panel border border-cockpit-border flex items-center justify-center font-heading font-bold text-cockpit-amber shrink-0"
    >
      {init}
    </span>
  );
}