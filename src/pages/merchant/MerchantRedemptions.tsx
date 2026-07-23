import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useMerchantProfile } from '@/hooks/useMerchantProfile';
import { useRedemption, RedemptionLookup } from '@/hooks/useRedemption';
import { useMerchantPurchases } from '@/hooks/useMerchantPurchases';
import { ScanLine, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function MerchantRedemptions() {
  const { merchant } = useMerchantProfile();
  const { lookup, redeem } = useRedemption();
  const { purchases, refetch } = useMerchantPurchases(merchant?.owner_uid);

  const [code, setCode] = useState('');
  const [result, setResult] = useState<RedemptionLookup | null>(null);
  const [busy, setBusy] = useState(false);

  const handleLookup = async () => {
    if (!merchant) return;
    setBusy(true); setResult(null);
    try {
      const r = await lookup(code, merchant);
      setResult(r);
    } catch (e: any) { toast.error(e?.message || 'Lookup failed'); }
    finally { setBusy(false); }
  };

  const handleRedeem = async () => {
    if (!merchant || !result || result.status !== 'ok') return;
    setBusy(true);
    try {
      await redeem(result.purchase.id, merchant);
      toast.success('Code redeemed');
      setResult({ status: 'already_redeemed', purchase: { ...result.purchase, redeemed: true } });
      await refetch();
    } catch (e: any) { toast.error(e?.message || 'Could not redeem'); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Redemptions</h1>
        <p className="text-sm text-muted-foreground">Verify purchase codes and mark them as redeemed in-store.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Verify a code</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Label>Purchase code</Label>
          <div className="flex gap-2">
            <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="ITEM-20260101-120000-ABC123" />
            <Button onClick={handleLookup} disabled={busy || code.trim().length < 4}><ScanLine className="w-4 h-4 mr-1" />Verify</Button>
          </div>

          {result && result.status === 'not_found' && (
            <ResultBanner tone="error" icon={<XCircle className="w-4 h-4" />} title="Code not found" message="Double-check the code with the customer." />
          )}
          {result && result.status === 'wrong_merchant' && (
            <ResultBanner tone="error" icon={<XCircle className="w-4 h-4" />} title="This code belongs to a different merchant" />
          )}
          {result && result.status === 'already_redeemed' && (
            <ResultBanner tone="warn" icon={<AlertTriangle className="w-4 h-4" />} title="Already redeemed" message={result.purchase.redeemed_at ? `Redeemed ${new Date(result.purchase.redeemed_at).toLocaleString()}` : undefined} />
          )}
          {result && result.status === 'ok' && (
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-pokip-blue"><CheckCircle2 className="w-4 h-4" /> Valid and unused</div>
              <div>
                <div className="font-semibold">{result.purchase.item_title}</div>
                <div className="text-xs text-muted-foreground">Purchased {new Date(result.purchase.purchased_at).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Member: {result.purchase.customer_member_id ?? '—'}</div>
                <div className="text-xs text-muted-foreground">Tokens spent: {result.purchase.tokens_spent}</div>
              </div>
              <Button onClick={handleRedeem} disabled={busy}>{busy ? 'Redeeming…' : 'Mark as redeemed'}</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Purchase history</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {purchases.length === 0 && <div className="text-sm text-muted-foreground italic">No purchases yet.</div>}
          {purchases.slice(0, 25).map(p => (
            <div key={p.id} className="flex items-center justify-between text-sm border-b last:border-0 py-2 gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{p.item_title}</div>
                <div className="text-xs text-muted-foreground truncate font-mono">{p.purchase_code}</div>
                <div className="text-xs text-muted-foreground truncate">{p.customer_member_id ?? '—'} · {new Date(p.purchased_at).toLocaleString()}</div>
              </div>
              <Badge variant={p.redeemed ? 'secondary' : 'default'}>{p.redeemed ? 'Redeemed' : 'Open'}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

const ResultBanner = ({ tone, icon, title, message }: { tone: 'error' | 'warn'; icon: React.ReactNode; title: string; message?: string }) => (
  <div className={`rounded-lg border p-3 text-sm flex items-start gap-2 ${tone === 'error' ? 'border-destructive/40 bg-destructive/5 text-destructive' : 'border-yellow-500/40 bg-yellow-500/5 text-yellow-700'}`}>
    {icon}
    <div>
      <div className="font-medium">{title}</div>
      {message && <div className="text-xs opacity-80">{message}</div>}
    </div>
  </div>
);