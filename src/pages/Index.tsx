import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TokenCounter } from '@/components/TokenCounter';
import { PublicNav } from '@/components/nav/PublicNav';
import { PublicFooter } from '@/components/nav/PublicFooter';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useProfile } from '@/hooks/useProfile';
import { useCustomerPurchases } from '@/hooks/useCustomerPurchases';
import { FullscreenLoader } from '@/components/guards/RequireAuth';
import { toast } from 'sonner';
import { Copy, ShoppingBag } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useFirebaseAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { purchases, loading: purchasesLoading } = useCustomerPurchases(user?.uid);

  useEffect(() => {
    if (!authLoading && profile && profile.role === 'merchant') {
      navigate('/merchant/dashboard', { replace: true });
    }
  }, [authLoading, profile, navigate]);

  if (authLoading || profileLoading) return <FullscreenLoader />;
  if (!user || !profile) return null;

  const copyMemberId = () => {
    if (!profile.member_id) return;
    navigator.clipboard.writeText(profile.member_id);
    toast.success('Member ID copied');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back{profile.display_name ? `, ${profile.display_name}` : ''}</h1>
            <p className="text-muted-foreground">Your POKIP membership at a glance.</p>
          </div>
          <div className="flex items-center gap-3">
            <TokenCounter tokens={profile.tokens || 0} />
            <Button variant="outline" onClick={async () => { await logout(); navigate('/'); }}>Sign out</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Your Member ID</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <code className="text-xl font-mono font-semibold text-pokip-blue">{profile.member_id || '—'}</code>
                <Button size="sm" variant="outline" onClick={copyMemberId} disabled={!profile.member_id}>
                  <Copy className="w-4 h-4 mr-1" />Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Share this ID with POKIP merchants so they can award you points.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Ready to redeem?</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Browse rewards from every POKIP merchant.</p>
              <Button asChild><Link to="/shop"><ShoppingBag className="w-4 h-4 mr-1" />Open POKIP Shop</Link></Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Your purchases</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {purchasesLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
            {!purchasesLoading && purchases.length === 0 && (
              <div className="text-sm text-muted-foreground italic">You haven't redeemed anything yet.</div>
            )}
            {purchases.map(p => (
              <div key={p.id} className="flex items-center justify-between border-b last:border-0 py-2 text-sm gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.item_title}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.merchant_name} · {new Date(p.purchased_at).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground truncate font-mono">{p.purchase_code}</div>
                </div>
                <Badge variant={p.redeemed ? 'secondary' : 'default'}>{p.redeemed ? 'Redeemed' : 'Ready'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}