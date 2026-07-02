import React, { useRef, useEffect } from "react";

/**
 * Animated "live airspace" background for marketing pages.
 * Canvas 2D only — no WebGL/libraries. Renders behind all content.
 *
 * Layers:
 *   1. CSS base + radial haze
 *   2. Three blurred aurora divs (screen blend) + faint HUD grid
 *   3. Canvas: radar sweep, waypoint beacons, airways, planes w/ contrails,
 *      parallax star layers, shooting stars
 */
export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1;
    let stars1 = [], stars2 = [];
    let beacons = [], airways = [], planes = [];
    let shootingStars = [], pulseRings = [];
    let radarAngle = 0, pulseTimer = 0;
    let rafId = null, running = true, lastTime = 0;

    /* ===== Scene init ===== */
    function initScene() {
      const area = W * H;

      // Far star layer — dim, slow
      stars1 = Array.from({ length: Math.floor(area / 9000) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.8 + 0.3,
        a: Math.random() * 0.3 + 0.1,
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.03 + 0.01,
        drift: Math.random() * 0.03 + 0.01,
      }));

      // Near star layer — brighter, faster, glow
      stars2 = Array.from({ length: Math.floor(area / 22000) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.5,
        a: Math.random() * 0.5 + 0.3,
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.05 + 0.02,
        drift: Math.random() * 0.08 + 0.03,
      }));

      // Waypoint beacons at fixed fractional positions
      const bp = [
        [0.12, 0.22], [0.28, 0.65], [0.42, 0.15], [0.52, 0.78],
        [0.66, 0.28], [0.72, 0.62], [0.88, 0.18], [0.92, 0.68],
      ];
      beacons = bp.map(([fx, fy], i) => ({
        x: fx * W,
        y: fy * H,
        blue: i % 3 === 2,
        phase: Math.random() * Math.PI * 2,
        ringR: Math.random() * 35,
        ringSpeed: 0.2 + Math.random() * 0.15,
      }));

      // Airways — dashed links between beacons
      const links = [[0, 2], [2, 4], [4, 5], [5, 7], [1, 3], [3, 5], [0, 1], [6, 4], [6, 7], [2, 5]];
      airways = links.map(([a, b]) => ({
        from: beacons[a],
        to: beacons[b],
        offset: Math.random() * 100,
      }));

      // Planes — count scales with screen width
      const pCount = W < 700 ? 4 : W < 1100 ? 6 : 7;
      planes = Array.from({ length: pCount }, (_, i) => makePlane(i));

      shootingStars = [];
      pulseRings = [];
    }

    function makePlane(i) {
      const fi = Math.floor(Math.random() * beacons.length);
      let ti = Math.floor(Math.random() * beacons.length);
      while (ti === fi) ti = Math.floor(Math.random() * beacons.length);
      const from = beacons[fi];
      const to = beacons[ti];
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy) || 1;
      const px = -dy / dist;
      const py = dx / dist;
      const off = (Math.random() - 0.5) * dist * 0.4;
      return {
        from,
        to,
        ctrl: { x: mx + px * off, y: my + py * off },
        t: Math.random(),
        speed: 0.0002 + Math.random() * 0.0002,
        reverse: Math.random() > 0.5,
        blue: i % 3 === 0,
        trail: [],
        size: 3 + Math.random() * 1.5,
      };
    }

    /* ===== Resize ===== */
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initScene();
    }

    /* ===== Helpers ===== */
    function bz(t, p0, p1, p2) {
      const u = 1 - t;
      return {
        x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
        y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
      };
    }

    /* ===== Draw: stars ===== */
    function drawStars(arr, dt) {
      for (const s of arr) {
        s.tw += s.ts * dt * 0.06;
        s.x -= s.drift * dt * 0.015;
        if (s.x < -2) s.x = W + 2;
        const a = s.a * (0.5 + 0.5 * Math.sin(s.tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243,236,221,${a})`;
        ctx.fill();
        if (s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(243,236,221,${a * 0.12})`;
          ctx.fill();
        }
      }
    }

    /* ===== Draw: airways ===== */
    function drawAirways(dt) {
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      for (const a of airways) {
        a.offset -= dt * 0.04;
        ctx.beginPath();
        ctx.moveTo(a.from.x, a.from.y);
        ctx.lineTo(a.to.x, a.to.y);
        ctx.strokeStyle = "rgba(74,144,217,0.07)";
        ctx.lineDashOffset = a.offset;
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    /* ===== Draw: radar sweep ===== */
    function drawRadar(dt) {
      const cx = W * 0.8;
      const cy = H * 0.42;
      const maxR = Math.min(W, H) * 0.32;

      // Range rings
      ctx.strokeStyle = "rgba(255,157,46,0.06)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxR * i) / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Repeating pulse ring
      pulseTimer += dt;
      if (pulseTimer > 3500) {
        pulseTimer = 0;
        pulseRings.push({ r: 0, a: 0.35 });
      }
      for (let i = pulseRings.length - 1; i >= 0; i--) {
        const p = pulseRings[i];
        p.r += dt * 0.08;
        p.a -= dt * 0.0001;
        if (p.a <= 0) {
          pulseRings.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,157,46,${p.a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Sweep wedge
      radarAngle += dt * 0.0008;
      const sw = 0.5;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, "rgba(255,157,46,0.12)");
      grad.addColorStop(1, "rgba(255,157,46,0)");
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, radarAngle - sw, radarAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Leading spoke
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(radarAngle) * maxR, cy + Math.sin(radarAngle) * maxR);
      ctx.strokeStyle = "rgba(255,157,46,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* ===== Draw: waypoint beacons ===== */
    function drawBeacons(dt) {
      for (const b of beacons) {
        b.phase += 0.02 * dt * 0.06;
        b.ringR += b.ringSpeed * dt * 0.06;
        if (b.ringR > 35) b.ringR = 0;

        const col = b.blue ? "74,144,217" : "255,157,46";

        // Expanding ring
        const ringA = (1 - b.ringR / 35) * 0.35;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${col},${ringA})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing dot
        const pulse = 0.5 + 0.5 * Math.sin(b.phase);
        const r = 2 + pulse * 1.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${0.08 * pulse})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fillStyle = b.blue ? "#4A90D9" : "#FF9D2E";
        ctx.fill();
      }
    }

    /* ===== Draw: planes with contrails ===== */
    function drawPlanes(dt) {
      for (const p of planes) {
        p.t += p.speed * dt;
        if (p.t > 1) {
          p.t = 0;
          p.trail = [];
          Object.assign(p, makePlane(p.blue ? 0 : 3));
        }

        const at = p.reverse ? 1 - p.t : p.t;
        const pos = bz(at, p.from, p.ctrl, p.to);
        const ahead = bz(Math.min(at + 0.01, 1), p.from, p.ctrl, p.to);
        const ang = Math.atan2(ahead.y - pos.y, ahead.x - pos.x);

        // Contrail
        p.trail.push({ x: pos.x, y: pos.y });
        if (p.trail.length > 30) p.trail.shift();
        for (let i = 0; i < p.trail.length - 1; i++) {
          const a = (i / p.trail.length) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.trail[i].x, p.trail[i].y);
          ctx.lineTo(p.trail[i + 1].x, p.trail[i + 1].y);
          ctx.strokeStyle = `rgba(243,236,221,${a})`;
          ctx.lineWidth = (i / p.trail.length) * 2;
          ctx.stroke();
        }

        // Glow
        const col = p.blue ? "74,144,217" : "255,157,46";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},0.12)`;
        ctx.fill();

        // Silhouette
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(ang);
        ctx.fillStyle = p.blue ? "#4A90D9" : "#FF9D2E";
        ctx.beginPath();
        ctx.moveTo(p.size, 0);
        ctx.lineTo(-p.size * 0.7, p.size * 0.5);
        ctx.lineTo(-p.size * 0.4, 0);
        ctx.lineTo(-p.size * 0.7, -p.size * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    /* ===== Draw: shooting stars ===== */
    function drawShootingStars(dt) {
      if (Math.random() < 0.0015) {
        shootingStars.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.5,
          vx: (Math.random() * 3 + 2) * (Math.random() > 0.5 ? 1 : -1),
          vy: Math.random() * 1.5 + 0.8,
          life: 1,
          trail: [],
        });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const fm = dt * 0.06;
        s.x += s.vx * fm;
        s.y += s.vy * fm;
        s.life -= dt * 0.0008;
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 15) s.trail.shift();
        if (s.life <= 0 || s.x < -50 || s.x > W + 50 || s.y > H + 50) {
          shootingStars.splice(i, 1);
          continue;
        }
        for (let j = 0; j < s.trail.length - 1; j++) {
          const a = (j / s.trail.length) * s.life * 0.5;
          ctx.beginPath();
          ctx.moveTo(s.trail[j].x, s.trail[j].y);
          ctx.lineTo(s.trail[j + 1].x, s.trail[j + 1].y);
          ctx.strokeStyle = `rgba(243,236,221,${a})`;
          ctx.lineWidth = (j / s.trail.length) * 1.5;
          ctx.stroke();
        }
      }
    }

    /* ===== Animation loop ===== */
    function frame(time) {
      if (!running) return;
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      ctx.clearRect(0, 0, W, H);
      drawStars(stars1, dt);
      drawShootingStars(dt);
      drawStars(stars2, dt);
      drawAirways(dt);
      drawRadar(dt);
      drawBeacons(dt);
      drawPlanes(dt);

      rafId = requestAnimationFrame(frame);
    }

    function staticFrame() {
      ctx.clearRect(0, 0, W, H);
      drawStars(stars1, 0);
      drawStars(stars2, 0);
      drawAirways(0);
      drawRadar(0);
      drawBeacons(0);
      drawPlanes(0);
    }

    /* ===== Resize + visibility ===== */
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reducedMotion) staticFrame();
      }, 200);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else if (!reducedMotion) {
        running = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    };

    /* ===== Start ===== */
    resize();
    if (reducedMotion) {
      staticFrame();
    } else {
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    }

    window.addEventListener("resize", debouncedResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", debouncedResize);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base + haze */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 700px at 82% -8%, rgba(255,157,46,.10), transparent 60%)," +
            "radial-gradient(1300px 340px at 50% 112%, rgba(74,144,217,.12), transparent 70%)," +
            "radial-gradient(900px 700px at 10% 110%, rgba(74,144,217,.06), transparent 60%)," +
            "#0A0E17",
        }}
      />

      {/* Aurora — amber */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: "-10%",
          left: "-5%",
          background: "radial-gradient(circle, #FF9D2E 0%, transparent 70%)",
          opacity: 0.2,
          filter: "blur(70px)",
          mixBlendMode: "screen",
          animation: "auroraPulse 8s ease-in-out infinite",
        }}
      />
      {/* Aurora — blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: "-10%",
          right: "-5%",
          background: "radial-gradient(circle, #4A90D9 0%, transparent 70%)",
          opacity: 0.15,
          filter: "blur(70px)",
          mixBlendMode: "screen",
          animation: "auroraPulse 10s ease-in-out infinite 2s",
        }}
      />
      {/* Aurora — amber */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: "40%",
          left: "30%",
          background: "radial-gradient(circle, #FF9D2E 0%, transparent 70%)",
          opacity: 0.1,
          filter: "blur(70px)",
          mixBlendMode: "screen",
          animation: "auroraPulse 12s ease-in-out infinite 4s",
        }}
      />

      {/* HUD grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#FF9D2E 1px, transparent 1px), linear-gradient(90deg, #FF9D2E 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          animation: "hudPan 60s linear infinite",
        }}
      />

      {/* Canvas scene */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}