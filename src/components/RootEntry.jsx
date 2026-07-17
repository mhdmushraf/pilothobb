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

export default function RootEntry() {
  const { isAuthenticated } = useAuth();
  if (isInstalledApp()) {
    return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
  }
  return <Landing />; // browsers (mobile + desktop) see the marketing site
}