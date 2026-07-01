import React, { useState, useEffect, useRef } from "react";

const DIGIT_SIZE = 52;

function DrumDigit({ value }) {
  return (
    <div
      className="overflow-hidden bg-cockpit-panel-light border border-cockpit-border rounded-lg flex items-center justify-center"
      style={{ height: DIGIT_SIZE + 14, width: DIGIT_SIZE * 0.7, padding: "7px 4px" }}
    >
      <div className="overflow-hidden" style={{ height: DIGIT_SIZE }}>
        <div
          className="flex flex-col"
          style={{ transform: `translateY(-${value * DIGIT_SIZE}px)` }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              className="block text-center text-cockpit-amber font-mono font-bold"
              style={{
                height: DIGIT_SIZE,
                lineHeight: `${DIGIT_SIZE}px`,
                fontSize: DIGIT_SIZE * 0.7,
              }}
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HobbsCounter({ target = 159.3, duration = 2200 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(target * eased);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  const wholePart = Math.floor(value);
  const decimalPart = Math.floor((value - wholePart) * 10);
  const chars = (String(wholePart).padStart(3, "0") + "." + String(decimalPart)).split("");

  return (
    <div ref={ref} className="inline-flex items-center gap-1.5">
      {chars.map((c, i) =>
        c === "." ? (
          <span
            key={`dot-${i}`}
            className="font-mono font-bold text-cockpit-amber"
            style={{ fontSize: DIGIT_SIZE * 0.7, lineHeight: `${DIGIT_SIZE + 14}px` }}
          >
            .
          </span>
        ) : (
          <DrumDigit key={i} value={parseInt(c)} />
        )
      )}
      <span className="ml-3 text-cockpit-muted text-sm font-body font-medium uppercase tracking-wider">
        hrs
      </span>
    </div>
  );
}