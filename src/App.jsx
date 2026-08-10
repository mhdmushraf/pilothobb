import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Marketing pages
import MarketingLayout from '@/components/MarketingLayout';
import Landing from '@/pages/Landing';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Faq from '@/pages/Faq';
import Rpas from '@/pages/Rpas';
import Security from '@/pages/Security';
import Download from '@/pages/Download';
import Changelog from '@/pages/Changelog';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import RootEntry from '@/components/RootEntry';

// App pages
import AppLayout from '@/components/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Logbook from '@/pages/Logbook';
import AddFlight from '@/pages/AddFlight';
import Fleet from '@/pages/Fleet';
import Documents from '@/pages/Documents';
import Career from '@/pages/Career';
import Settings from '@/pages/Settings';
import More from '@/pages/More';
import Tracking from '@/pages/Tracking';
import Onboarding from '@/pages/Onboarding';
import Analytics from '@/pages/Analytics';
import Currency from '@/pages/Currency';
import Schedule from '@/pages/Schedule';
import Checklists from '@/pages/Checklists';
import ExportData from '@/pages/ExportData';
import FlightMap from '@/pages/FlightMap';
import MaintenanceLog from '@/pages/MaintenanceLog';
import PilotNotes from '@/pages/PilotNotes';
import Aerodromes from '@/pages/Aerodromes';
import Goals from '@/pages/Goals';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cockpit-bg">
        <div className="w-8 h-8 border-4 border-cockpit-border border-t-cockpit-amber rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Landing (standalone light marketing page) */}
      <Route path="/" element={<RootEntry />} />

      {/* Marketing (public) */}
      <Route element={<MarketingLayout />}>
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/rpas" element={<Rpas />} />
        <Route path="/security" element={<Security />} />
        <Route path="/download" element={<Download />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* App (protected) */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logbook" element={<Logbook />} />
          <Route path="/add-flight" element={<AddFlight />} />
          <Route path="/edit-flight/:id" element={<AddFlight />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/career" element={<Career />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/more" element={<More />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/export" element={<ExportData />} />
          <Route path="/flight-map" element={<FlightMap />} />
          <Route path="/maintenance-log" element={<MaintenanceLog />} />
          <Route path="/pilot-notes" element={<PilotNotes />} />
          <Route path="/aerodromes" element={<Aerodromes />} />
          <Route path="/goals" element={<Goals />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App