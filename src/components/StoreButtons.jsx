import React from "react";

/*  ┌─────────────────────────────────────────────────────────────┐
    │  PASTE YOUR REAL STORE LINKS HERE WHEN THE APPS GO LIVE.      │
    │  Until a URL is set, the badge shows a "Soon" tag and is      │
    │  not clickable. One place controls every download button.    │
    └─────────────────────────────────────────────────────────────┘ */
export const APP_STORE_URL = "";   // e.g. "https://apps.apple.com/app/pilothobb/id0000000000"
export const PLAY_STORE_URL = "";  // e.g. "https://play.google.com/store/apps/details?id=com.pilothobb.app"

const AppleIcon = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.14 16.37 3.01 11.68 5.04 8.5c1.01-1.62 2.82-2.65 4.76-2.68 1.28-.03 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
  </svg>
);

const PlayIcon = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path d="M3 3.5v17l9-8.5-9-8.5z" fill="#34D399" />
    <path d="M3 3.5l9 8.5 3.5-3.3L4.5 3.5H3z" fill="#60A5FA" />
    <path d="M3 20.5l9-8.5 3.5 3.3L4.5 20.5H3z" fill="#F59E0B" />
    <path d="M12 12l3.5-3.3 3.2 1.9c.9.55.9 1.25 0 1.8l-3.2 1.9L12 12z" fill="#EF4444" />
  </svg>
);

function Badge({ href, sub, main, icon }) {
  const live = href && href !== "#";
  const base = "relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#191c1e] text-white transition-all";
  const inner = (
    <>
      {icon}
      <span className="text-left">
        <span className="block text-[10px] text-white/70 leading-none">{sub}</span>
        <span className="block text-[15px] font-semibold font-heading leading-tight">{main}</span>
      </span>
      {!live && <span className="ml-1 text-[9px] uppercase tracking-wider bg-white/15 px-1.5 py-0.5 rounded">Soon</span>}
    </>
  );
  return live ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} hover:-translate-y-0.5 shadow-lg`}>{inner}</a>
  ) : (
    <span className={`${base} opacity-90 cursor-default`} aria-disabled="true" title="Available at launch">{inner}</span>
  );
}

export default function StoreButtons({ className = "" }) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <Badge href={APP_STORE_URL} sub="Download on the" main="App Store" icon={AppleIcon} />
      <Badge href={PLAY_STORE_URL} sub="Get it on" main="Google Play" icon={PlayIcon} />
    </div>
  );
}
