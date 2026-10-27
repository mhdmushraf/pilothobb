import React from "react";

// Official Google Play "triangle" mark in its real four-colour gradient, for Play Store download badges.
export default function GooglePlayBadgeIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="gpBlueGreen" x1="61%" y1="4.3%" x2="26.3%" y2="71.7%">
          <stop offset="0%" stopColor="#00A0FF" />
          <stop offset="66%" stopColor="#00A1FF" />
          <stop offset="86%" stopColor="#00BEFF" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>
        <linearGradient id="gpYellow" x1="107.6%" y1="50%" x2="-130.5%" y2="50%">
          <stop offset="0%" stopColor="#FFE000" />
          <stop offset="41%" stopColor="#FFBD00" />
          <stop offset="78%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF9C00" />
        </linearGradient>
        <linearGradient id="gpRed" x1="86.2%" y1="17.8%" x2="-50%" y2="194.4%">
          <stop offset="0%" stopColor="#FF3A44" />
          <stop offset="100%" stopColor="#C31162" />
        </linearGradient>
        <linearGradient id="gpGreen" x1="-18.8%" y1="-54.3%" x2="42.1%" y2="34.8%">
          <stop offset="0%" stopColor="#32A071" />
          <stop offset="7%" stopColor="#2DA771" />
          <stop offset="48%" stopColor="#15CF74" />
          <stop offset="80%" stopColor="#06E775" />
          <stop offset="100%" stopColor="#00F076" />
        </linearGradient>
      </defs>
      <path d="M38 14c-5 5-8 12-8 22v420c0 10 3 17 8 22l3 2 236-235v-6L41 12l-3 2z" fill="url(#gpBlueGreen)" />
      <path d="M356 324l-79-79v-6l79-79 2 1 94 53c27 15 27 40 0 55l-94 54-2 1z" fill="url(#gpYellow)" />
      <path d="M358 323L277 242 38 482c9 10 24 11 41 1l279-160" fill="url(#gpRed)" />
      <path d="M358 161L79 1C62-9 47-8 38 2l239 240 81-81z" fill="url(#gpGreen)" />
    </svg>
  );
}
