import { Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import { useAuth } from '@/lib/AuthContext';

export default function RootEntry() {
  const { isAuthenticated } = useAuth();
  // synchronous width check avoids a flash of the Landing page on phones
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) {
    return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
  }
  return <Landing />;
}