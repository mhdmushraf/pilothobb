import React from "react";

// Branded animated boot/loading splash.
// Styles + keyframes live in index.html's <style id="ph-splash-css"> so this
// matches the instant pre-React splash exactly (seamless hand-off).
export default function Splash() {
  return (
    <div className="ph-splash">
      <div className="ph-splash__grid" />
      <div className="ph-splash__stage">
        <span className="ph-splash__halo" />
        <span className="ph-splash__ring" />
        <img className="ph-splash__wing" src="/pilothobb-wing.png" alt="PilotHobb" draggable={false} />
      </div>
      <div className="ph-splash__word">Pilot<b>Hobb</b></div>
      <div className="ph-splash__tag">Preflight check</div>
      <div className="ph-splash__dots"><i /><i /><i /></div>
    </div>
  );
}
