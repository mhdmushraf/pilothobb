import React from "react";

/** Night-cockpit marketing background: navy with a faint chart grid and an amber glow. */
export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cockpit-bg" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(36,48,73,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(36,48,73,0.28) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          WebkitMaskImage: "radial-gradient(80% 60% at 50% 0%, black 20%, transparent 80%)",
          maskImage: "radial-gradient(80% 60% at 50% 0%, black 20%, transparent 80%)",
        }}
      />
      <div className="absolute inset-0" style={{ background: "radial-gradient(700px 420px at 85% -5%, rgba(255,157,46,0.08), transparent 65%)" }} />
    </div>
  );
}
