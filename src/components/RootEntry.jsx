import { Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import { useAuth } from '@/lib/AuthContext';

// True only when the app is running as an installed PWA (launched from the home screen),
// not in a normal browser tab.
function isInstalledApp() {
  if (typeof window === 'undefined') return false;
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches;
  const iosStandalone = window.navigator.standalone === true; // iOS Safari home-screen apps
  return standalone || iosStandalone;
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