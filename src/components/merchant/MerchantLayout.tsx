import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PokipLogo } from '@/components/brand/PokipLogo';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useMerchantProfile } from '@/hooks/useMerchantProfile';
import { FullscreenLoader } from '@/components/guards/RequireAuth';
import { LayoutDashboard, Package, Sparkles, ScanLine, Settings, LogOut } from 'lucide-react';
import { useEffect } from 'react';

const navItems = [
  { to: '/merchant/dashboard', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/merchant/dashboard/items', label: 'Items', icon: Package },
  { to: '/merchant/dashboard/points', label: 'Award points', icon: Sparkles },
  { to: '/merchant/dashboard/redemptions', label: 'Redemptions', icon: ScanLine },
  { to: '/merchant/dashboard/settings', label: 'Settings', icon: Settings },
];

export const MerchantLayout = () => {
  const { logout } = useFirebaseAuth();
  const { merchant, loading } = useMerchantProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !merchant) navigate('/merchant/onboarding', { replace: true });
  }, [loading, merchant, navigate]);

  if (loading || !merchant) return <FullscreenLoader />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <PokipLogo variant="mark" className="h-8 w-8 rounded-lg" />
            <div className="min-w-0">
              <div className="text-sm text-muted-foreground truncate">Merchant dashboard</div>
              <div className="font-semibold truncate">{merchant.business_name}</div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={async () => { await logout(); navigate('/'); }} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            {navItems.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition ${
                    isActive ? 'bg-pokip-blue text-white' : 'text-muted-foreground hover:bg-muted'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MerchantLayout;