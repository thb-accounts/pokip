import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { UserRole } from "@/types/platform";
export function Guard({
  roles,
  children,
}: {
  roles?: UserRole[];
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const l = useLocation();
  if (loading)
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Loading your POKIP account…
      </div>
    );
  if (!user)
    return <Navigate to="/auth" replace state={{ from: l.pathname }} />;
  if (!profile) return <Navigate to="/onboarding/customer" replace />;
  if (profile.status === "suspended")
    return <Navigate to="/restricted" replace />;
  if (roles && !roles.includes(profile.role))
    return (
      <Navigate
        to={
          profile.role === "merchant"
            ? "/merchant/dashboard"
            : profile.role === "admin"
              ? "/admin"
              : "/dashboard"
        }
        replace
      />
    );
  if (!profile.onboardingCompleted && profile.role !== "admin")
    return (
      <Navigate
        to={
          profile.role === "merchant"
            ? "/onboarding/merchant"
            : "/onboarding/customer"
        }
        replace
      />
    );
  return <>{children}</>;
}
