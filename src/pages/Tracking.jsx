import React, { useState, useEffect, useRef, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Radar, Share2, Plane } from "lucide-react";

const AERODROMES = [
  { code: "FAGM", x: 25, y: 30 },
  { code: "FAOH", x: 55, y: 55 },
  { code: "FALA", x: 78, y: 28 },
];

const TRAFFIC_DATA = [
  { reg: "ZS-XYZ", type: "C172", alt: 5500, spd: 110 },
  { reg: "ZS-ABC", type: "PA28", alt: 4200, spd: 95 },
  { reg: "ZS-DEF", type: "BE20", alt: 12000, spd: 230 },
  { reg: "ZS-GHI", type: "C550", alt: 18000, spd: 280 },
];

function RadarMap() {
  const markerRefs = useRef([]);
  const positions = useRef(
    TRAFFIC_DATA.map(() => ({
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      dx: (Math.random() - 0.5) * 0.08,
      dy: (Math.random() - 0.5) * 0.08,
    }))
  );

  useEffect(() => {
    let raf;
    const animate = () => {
      positions.current.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 5 || p.x > 95) p.dx *= -1;
        if (p.y < 5 || p.y > 95) p.dy *= -1;
        const el = markerRefs.current[i];
        if (el) {
          el.style.left = p.x + "%";
          el.style.top = p.y + "%";
        }
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative w-full aspect-square rounded-2xl overflow-hidden border border-cockpit-border"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0F1626 0%, #0A0E17 70%), #0A0E17",
      }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#243049 1px, transparent 1px), linear-gradient(90deg, #243049 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Range rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full border border-cockpit-border/50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full border border-cockpit-border/50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full border border-cockpit-border/40" />

      {/* Radar sweep */}
      <div
        className="absolute inset-0 animate-spin origin-center"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(255,157,46,0.25), rgba(255,157,46,0.05) 40deg, transparent 60deg, transparent 360deg)",
          animationDuration: "4s",
        }}
      />

      {/* Cross hairs */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-cockpit-border/30" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cockpit-border/30" />

      {/* Aerodromes */}
      {AERODROMES.map((ad) => (
        <div
          key={ad.code}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: ad.x + "%", top: ad.y + "%" }}
        >
          <div className="w-2 h-2 rounded-full bg-cockpit-glow-blue/60" />
          <span className="absolute top-2.5 left-2.5 text-[9px] font-mono font-semibold text-cockpit-muted whitespace-nowrap">
            {ad.code}
          </span>
        </div>
      ))}

      {/* Own aircraft */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "45%" }}>
        <div className="relative">
          <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-cockpit-amber/20 animate-ping" />
          <Plane className="w-5 h-5 text-cockpit-amber" fill="currentColor" style={{ transform: "rotate(45deg)" }} />
        </div>
      </div>

      {/* Traffic markers */}
      {TRAFFIC_DATA.map((t, i) => (
        <div
          key={t.reg}
          ref={(el) => (markerRefs.current[i] = el)}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-none"
        >
          <Plane className="w-3.5 h-3.5 text-cockpit-muted" fill="currentColor" style={{ transform: "rotate(" + (i * 30 + 20) + "deg)" }} />
          <span className="absolute -top-3.5 left-2 text-[8px] font-mono text-cockpit-muted/70 whitespace-nowrap">
            {t.reg}
          </span>
        </div>
      ))}

      {/* Scan label */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        <Radar className="w-3.5 h-3.5 text-cockpit-amber animate-pulse" />
        <span className="text-[10px] font-mono text-cockpit-muted uppercase tracking-wider">Live scan</span>
      </div>
    </div>
  );
}

function TrafficRow({ traffic }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-cockpit-border last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <Plane className="w-3.5 h-3.5 text-cockpit-muted shrink-0" fill="currentColor" />
        <span className="font-mono text-sm text-cockpit-cream">{traffic.reg}</span>
        <span className="text-xs text-cockpit-muted">{traffic.type}</span>
      </div>
      <div className="flex items-center gap-4 font-mono text-xs shrink-0">
        <span className="text-cockpit-muted">{traffic.alt.toLocaleString()}<span className="text-cockpit-muted/50"> ft</span></span>
        <span className="text-cockpit-muted">{traffic.spd}<span className="text-cockpit-muted/50"> kt</span></span>
      </div>
    </div>
  );
}

export default function Tracking() {
  const { toast } = useToast();
  const [shareId] = useState(() => Math.random().toString(36).substring(2, 10));

  const handleShare = async () => {
    const url = `pilothobb.com/track?id=${shareId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Live track link copied", description: url });
    } catch {
      toast({ title: "Live track link", description: url });
    }
  };

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="text-xl font-bold text-cockpit-cream mb-4 flex items-center gap-2">
        <Radar className="w-5 h-5 text-cockpit-amber" /> Live Tracking
      </h1>

      <RadarMap />

      <button
        onClick={handleShare}
        className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-cockpit-amber/15 border border-cockpit-amber/30 text-cockpit-amber text-sm font-medium hover:bg-cockpit-amber/20 transition-colors"
      >
        <Share2 className="w-4 h-4" /> Share live track link
      </button>

      {/* Nearby traffic */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-cockpit-muted uppercase tracking-wider mb-3">
          Nearby traffic
        </h2>
        <div className="rounded-xl bg-cockpit-panel border border-cockpit-border px-4">
          {TRAFFIC_DATA.map((t) => (
            <TrafficRow key={t.reg} traffic={t} />
          ))}
        </div>
        <p className="text-[11px] text-cockpit-muted/60 mt-2 text-center">
          Visual prototype — no real GPS data
        </p>
      </div>
    </div>
  );
}