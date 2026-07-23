import { Navigate, useLocation } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export const FullscreenLoader = () => (
  <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pokip-blue mx-auto"></div>
      <p className="text-muted-foreground">Loading POKIP…</p>
    </div>
  </div>
);

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useFirebaseAuth();
  const location = useLocation();
  if (loading) return <FullscreenLoader />;
  if (!user) return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />;
  return <>{children}</>;
};