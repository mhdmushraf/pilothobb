import React from "react";

/**
 * Soft cockpit-glow backdrop for the hero — pure atmosphere, no text/edges
 * so it never competes with or clips behind the phone mockup in front of it.
 */
export default function CruiseViewCard({ className = "" }) {
  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        background:
          "radial-gradient(55% 55% at 68% 28%, rgba(255,157,46,0.22) 0%, rgba(255,157,46,0) 62%)," +
          "radial-gradient(50% 50% at 22% 72%, rgba(74,144,217,0.12) 0%, rgba(74,144,217,0) 65%)",
        WebkitMaskImage:
          "radial-gradient(55% 55% at 55% 45%, black 35%, transparent 80%)",
        maskImage:
          "radial-gradient(55% 55% at 55% 45%, black 35%, transparent 80%)",
        filter: "blur(4px)",
      }}
    />
  );
}
