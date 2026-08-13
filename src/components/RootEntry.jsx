import { Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import { useAuth } from '@/lib/AuthContext';

// True when the app is running as the installed app — either an installed PWA
// (home-screen) or inside the native App Store / Play Store wrapper (WKWebView /
// Android TWA), as opposed to a normal browser tab.
function isInstalledApp() {
  if (typeof window === 'undefined') return false;

  // 1) Installed PWA display modes (Android/desktop home-screen, iOS Safari A2HS)
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches;
  const iosStandalone = window.navigator.standalone === true;

  const ua = window.navigator.userAgent || '';

  // 2) iOS native wrapper (PWABuilder / Capacitor): iOS WebKit with NO Safari
  //    chrome and not another in-app browser. Safari itself always includes
  //    "Safari"; a WKWebView-hosted app does not.
  const isIOS = /iPhone|iPad|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const iosWebView =
    isIOS && /AppleWebKit/.test(ua) && !/Safari/.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);

  // 3) Android TWA (Trusted Web Activity) launched from the Play Store app
  const androidTwa =
    (typeof document !== 'undefined' && document.referrer.startsWith('android-app://')) ||
    /wv/.test(ua); // Android WebView flag

  return standalone || iosStandalone || iosWebView || androidTwa;
}

function hasSeenIntro() {
  try { return window.localStorage.getItem('ph_intro_seen') === '1'; } catch (e) { return false; }
}

export default function RootEntry() {
  const { isAuthenticated } = useAuth();
  if (isInstalledApp()) {
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    // First launch of the installed app → show the swipe intro, then login.
    return <Navigate to={hasSeenIntro() ? '/login' : '/intro'} replace />;
  }
  return <Landing />; // browsers (mobile + desktop) see the marketing site
}