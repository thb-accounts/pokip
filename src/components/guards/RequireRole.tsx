import { Navigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { FullscreenLoader } from './RequireAuth';
import type { UserRole } from '@/types/pokip';

export const RequireRole = ({ role, children }: { role: UserRole; children: React.ReactNode }) => {
  const { user, loading: authLoading } = useFirebaseAuth();
  const { profile, loading: profileLoading } = useProfile();
  if (authLoading || profileLoading) return <FullscreenLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!profile) return <FullscreenLoader />;
  if (profile.role !== role && profile.role !== 'admin') {
    return <Navigate to={profile.role === 'merchant' ? '/merchant/dashboard' : '/dashboard'} replace />;
  }
  return <>{children}</>;
};