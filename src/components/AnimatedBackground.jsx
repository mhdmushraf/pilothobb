import React, { useMemo } from "react";

export default function AnimatedBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 30,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-cockpit-bg" />

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#FF9D2E 1px, transparent 1px), linear-gradient(90deg, #FF9D2E 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "hudPan 60s linear infinite",
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: "-10%", left: "-5%",
          background: "radial-gradient(circle, #FF9D2E 0%, transparent 70%)",
          opacity: 0.2,
          animation: "auroraPulse 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          bottom: "-10%", right: "-5%",
          background: "radial-gradient(circle, #4A90D9 0%, transparent 70%)",
          opacity: 0.15,
          animation: "auroraPulse 10s ease-in-out infinite 2s",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          top: "40%", left: "30%",
          background: "radial-gradient(circle, #FF9D2E 0%, transparent 70%)",
          opacity: 0.1,
          animation: "auroraPulse 12s ease-in-out infinite 4s",
        }}
      />

      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cockpit-cream"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `starDrift ${star.duration}s linear infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}