import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMerchantProfile } from '@/hooks/useMerchantProfile';
import { useMerchantItems } from '@/hooks/useMerchantItems';
import { useMerchantPurchases } from '@/hooks/useMerchantPurchases';
import { useMerchantPointAwards } from '@/hooks/usePointsAward';
import { Package, Sparkles, ScanLine, Plus } from 'lucide-react';

export default function MerchantHome() {
  const { merchant } = useMerchantProfile();
  const { items } = useMerchantItems(merchant?.id, merchant?.business_name);
  const { purchases } = useMerchantPurchases(merchant?.owner_uid);
  const { awards } = useMerchantPointAwards(merchant?.owner_uid);

  const active = items.filter(i => i.status === 'published').length;
  const drafts = items.filter(i => i.status === 'draft').length;
  const archived = items.filter(i => i.status === 'archived').length;
  const unredeemed = purchases.filter(p => !p.redeemed).length;
  const redeemed = purchases.filter(p => p.redeemed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{merchant?.business_name}</h1>
          <p className="text-sm text-muted-foreground">{merchant?.category} · /{merchant?.slug}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm"><Link to="/merchant/dashboard/items"><Plus className="w-4 h-4 mr-1" />Add item</Link></Button>
          <Button asChild size="sm" variant="outline"><Link to="/merchant/dashboard/points"><Sparkles className="w-4 h-4 mr-1" />Award points</Link></Button>
          <Button asChild size="sm" variant="outline"><Link to="/merchant/dashboard/redemptions"><ScanLine className="w-4 h-4 mr-1" />Verify code</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Published items" value={active} icon={<Package className="w-4 h-4" />} />
        <Stat label="Drafts" value={drafts} />
        <Stat label="Archived" value={archived} />
        <Stat label="Total purchases" value={purchases.length} />
        <Stat label="Unredeemed codes" value={unredeemed} highlight />
        <Stat label="Redeemed codes" value={redeemed} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent purchases</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {purchases.length === 0 && <EmptyState message="No purchases yet." />}
            {purchases.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.item_title}</div>
                  <div className="text-muted-foreground truncate">{p.customer_member_id || 'Member'} · {new Date(p.purchased_at).toLocaleString()}</div>
                </div>
                <Badge variant={p.redeemed ? 'secondary' : 'default'}>{p.redeemed ? 'Redeemed' : 'Open'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Recent point awards</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {awards.length === 0 && <EmptyState message="No points awarded yet." />}
            {awards.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="font-medium truncate">{a.customer_member_id}</div>
                  <div className="text-muted-foreground truncate">{new Date(a.created_at).toLocaleString()}{a.reference ? ` · ${a.reference}` : ''}</div>
                </div>
                <Badge>+{a.points}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const Stat = ({ label, value, icon, highlight }: { label: string; value: number; icon?: React.ReactNode; highlight?: boolean }) => (
  <Card className={highlight ? 'border-pokip-blue/40' : ''}>
    <CardContent className="p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </CardContent>
  </Card>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-sm text-muted-foreground italic">{message}</div>
);