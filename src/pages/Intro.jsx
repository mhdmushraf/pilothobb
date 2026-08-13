import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlaneTakeoff, CalendarClock, FileDown, Radar, ArrowRight, ChevronLeft } from "lucide-react";

const WING = "/pilothobb-wing.png";

export const INTRO_SEEN_KEY = "ph_intro_seen";

function markSeen() {
  try { window.localStorage.setItem(INTRO_SEEN_KEY, "1"); } catch (e) { /* private mode */ }
}

const SLIDES = [
  {
    hero: true,
    title: "Welcome to PilotHobb",
    text: "Your digital pilot logbook — every flight, down to the tenth of an hour.",
  },
  {
    Icon: PlaneTakeoff,
    title: "Log flights in seconds",
    text: "Capture Hobbs, times, take-offs and landings — or Quick Log a flight from just your off and on times.",
  },
  {
    Icon: CalendarClock,
    title: "Stay current",
    text: "Track night and instrument recency, medicals and ratings — with clear alerts before anything lapses.",
  },
  {
    Icon: FileDown,
    title: "Your official logbook",
    text: "See the full SACAA-format logbook with running totals, and export a clean PDF or CSV anytime.",
  },
  {
    Icon: Radar,
    title: "Aircraft + Drone",
    text: "One logbook for manned flying and RPAS — mission type, operation category and battery cycles included.",
  },
];

export default function Intro() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [drag, setDrag] = useState(0); // live px offset during swipe
  const startX = useRef(null);
  const last = SLIDES.length - 1;

  const finish = () => { markSeen(); navigate("/login", { replace: true }); };
  const go = (n) => setI(Math.max(0, Math.min(last, n)));
  const next = () => (i === last ? finish() : go(i + 1));

  const onStart = (x) => { startX.current = x; };
  const onMove = (x) => {
    if (startX.current == null) return;
    let d = x - startX.current;
    // resist over-drag at the ends
    if ((i === 0 && d > 0) || (i === last && d < 0)) d *= 0.35;
    setDrag(d);
  };
  const onEnd = () => {
    if (startX.current == null) return;
    if (drag < -60 && i < last) go(i + 1);
    else if (drag > 60 && i > 0) go(i - 1);
    startX.current = null;
    setDrag(0);
  };

  return (
    <div className="ph-intro">
      <div className="ph-intro__grid" />

      {/* top bar */}
      <div className="ph-intro__top">
        <button
          type="button"
          onClick={() => go(i - 1)}
          className="ph-intro__back"
          style={{ opacity: i === 0 ? 0 : 1, pointerEvents: i === 0 ? "none" : "auto" }}
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <img src={WING} alt="PilotHobb" className="ph-intro__wing-sm" draggable={false} />
        <button
          type="button"
          onClick={finish}
          className="ph-intro__skip"
          style={{ opacity: i === last ? 0 : 1, pointerEvents: i === last ? "none" : "auto" }}
        >
          Skip
        </button>
      </div>

      {/* swipe area */}
      <div
        className="ph-intro__viewport"
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => startX.current != null && onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      >
        <div
          className="ph-intro__track"
          style={{
            transform: `translateX(calc(${-i * 100}% + ${drag}px))`,
            transition: startX.current == null ? "transform .4s cubic-bezier(.2,.8,.2,1)" : "none",
          }}
        >
          {SLIDES.map((s, idx) => (
            <div className="ph-intro__slide" key={idx}>
              <div className="ph-intro__art">
                {s.hero ? (
                  <div className="ph-intro__herowrap">
                    <span className="ph-intro__halo" />
                    <img src={WING} alt="PilotHobb" className="ph-intro__wing-lg" draggable={false} />
                  </div>
                ) : (
                  <div className="ph-intro__badge">
                    <s.Icon className="w-11 h-11" strokeWidth={1.6} />
                  </div>
                )}
              </div>
              <h2 className="ph-intro__title">{s.title}</h2>
              <p className="ph-intro__text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="ph-intro__dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => go(idx)}
            className={`ph-intro__dot ${idx === i ? "is-active" : ""}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="ph-intro__cta">
        <button type="button" onClick={next} className="ph-intro__btn">
          {i === last ? "Get started" : "Next"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        .ph-intro{
          position:fixed; inset:0; z-index:40; display:flex; flex-direction:column;
          background: radial-gradient(130% 120% at 50% 12%, #6E66F2 0%, #4F46E5 48%, #3A2FBE 100%);
          color:#fff; overflow:hidden;
          padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
          font-family:'General Sans',ui-sans-serif,system-ui,sans-serif;
          -webkit-user-select:none; user-select:none;
        }
        .ph-intro__grid{
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
          background-size:46px 46px;
          -webkit-mask-image: radial-gradient(circle at 50% 34%, #000 0%, transparent 70%);
          mask-image: radial-gradient(circle at 50% 34%, #000 0%, transparent 70%);
        }
        .ph-intro__top{
          position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between;
          padding:14px 18px 6px;
        }
        .ph-intro__wing-sm{ height:24px; width:auto; opacity:.95; filter: brightness(0) invert(1); }
        .ph-intro__back{ width:34px; height:34px; display:flex; align-items:center; justify-content:center;
          border-radius:50%; color:#fff; background:rgba(255,255,255,.12); transition:opacity .2s; }
        .ph-intro__skip{ color:rgba(255,255,255,.82); font-size:14px; font-weight:500; padding:6px 8px; transition:opacity .2s; }

        .ph-intro__viewport{ position:relative; z-index:2; flex:1; overflow:hidden; }
        .ph-intro__track{ display:flex; height:100%; will-change:transform; }
        .ph-intro__slide{
          min-width:100%; height:100%; display:flex; flex-direction:column;
          align-items:center; justify-content:center; text-align:center;
          padding: 8px 34px 0;
        }
        .ph-intro__art{ margin-bottom:38px; display:flex; align-items:center; justify-content:center; }
        .ph-intro__herowrap{ position:relative; width:180px; height:180px; display:flex; align-items:center; justify-content:center; }
        .ph-intro__halo{
          position:absolute; inset:0; border-radius:50%;
          background: radial-gradient(circle, rgba(255,255,255,.40) 0%, rgba(255,255,255,0) 62%);
          animation: phHalo 2.8s ease-in-out infinite;
        }
        .ph-intro__wing-lg{ width:110px; height:auto; position:relative; z-index:2;
          filter: brightness(0) invert(1) drop-shadow(0 10px 26px rgba(0,0,0,.30)); animation: phFloat 3.6s ease-in-out infinite; }
        .ph-intro__badge{
          width:120px; height:120px; border-radius:32px; display:flex; align-items:center; justify-content:center;
          color:#fff; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22);
          box-shadow: 0 12px 34px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.28);
          backdrop-filter: blur(6px);
        }
        .ph-intro__title{ font-family:'Clash Display','General Sans',sans-serif; font-weight:700; font-size:27px; line-height:1.15; margin:0 0 12px; }
        .ph-intro__text{ font-size:15.5px; line-height:1.55; color:rgba(255,255,255,.82); max-width:20rem; margin:0 auto; }

        .ph-intro__dots{ position:relative; z-index:2; display:flex; gap:8px; justify-content:center; padding:6px 0 2px; }
        .ph-intro__dot{ width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.32); transition:all .25s; }
        .ph-intro__dot.is-active{ width:22px; border-radius:5px; background:#7FE8D6; }

        .ph-intro__cta{ position:relative; z-index:2; padding:16px 24px 26px; }
        .ph-intro__btn{
          width:100%; height:54px; border-radius:16px; display:flex; align-items:center; justify-content:center; gap:8px;
          background:#fff; color:#3A2FBE; font-weight:700; font-size:16px;
          box-shadow: 0 10px 26px rgba(0,0,0,.22); transition: transform .12s ease, filter .12s ease;
        }
        .ph-intro__btn:active{ transform: scale(.98); filter:brightness(.97); }

        @keyframes phHalo { 0%,100%{ transform:scale(.92); opacity:.5;} 50%{ transform:scale(1.1); opacity:.9;} }
        @keyframes phFloat { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-10px);} }
        @media (prefers-reduced-motion: reduce){
          .ph-intro__halo,.ph-intro__wing-lg{ animation:none !important; }
        }
      `}</style>
    </div>
  );
}
