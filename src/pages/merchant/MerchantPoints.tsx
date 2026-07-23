import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useMerchantProfile } from '@/hooks/useMerchantProfile';
import { useMemberLookup, MemberLookupResult } from '@/hooks/useMemberLookup';
import { awardPoints, useMerchantPointAwards } from '@/hooks/usePointsAward';
import { AlertTriangle, Search } from 'lucide-react';

export default function MerchantPoints() {
  const { merchant } = useMerchantProfile();
  const { lookup } = useMemberLookup();
  const { awards, refetch } = useMerchantPointAwards(merchant?.owner_uid);

  const [memberId, setMemberId] = useState('');
  const [customer, setCustomer] = useState<MemberLookupResult | null>(null);
  const [points, setPoints] = useState(10);
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLookup = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await lookup(memberId);
      if (!res) { toast.error('No customer found for that Member ID'); setCustomer(null); return; }
      setCustomer(res);
    } catch (e: any) { toast.error(e?.message || 'Lookup failed'); }
    finally { setBusy(false); }
  };

  const handleAward = async () => {
    if (!merchant || !customer || busy) return;
    setBusy(true);
    try {
      await awardPoints({
        merchant,
        customerUid: customer.uid,
        customerMemberId: customer.member_id,
        points: Math.floor(Number(points)),
        reference: reference.trim() || undefined,
        note: note.trim() || undefined,
      });
      toast.success(`Awarded ${points} points to ${customer.member_id}`);
      setCustomer(null); setMemberId(''); setPoints(10); setReference(''); setNote('');
      await refetch();
    } catch (e: any) { toast.error(e?.message || 'Could not award points'); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Award points</h1>
        <p className="text-sm text-muted-foreground">Look up a customer by their POKIP Member ID and add points to their balance.</p>
      </div>

      <Card className="border-yellow-500/40 bg-yellow-500/5">
        <CardContent className="p-4 flex gap-3 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-600 shrink-0" />
          <div>
            <div className="font-medium">Temporary client-side awarding</div>
            <p className="text-muted-foreground">Point awarding runs from the browser using Firestore transactions. This is safe for pilot use but should be moved to a trusted Cloud Function before production.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">1. Find customer</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Label>POKIP Member ID</Label>
            <div className="flex gap-2">
              <Input value={memberId} onChange={e => setMemberId(e.target.value)} placeholder="POKIP-M-482091" maxLength={40} />
              <Button onClick={handleLookup} disabled={busy || memberId.trim().length < 4}><Search className="w-4 h-4 mr-1" />Look up</Button>
            </div>
            {customer && (
              <div className="rounded-lg border p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-pokip-blue text-white grid place-items-center font-semibold">
                  {(customer.display_name || customer.member_id).slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{customer.display_name || 'POKIP member'}</div>
                  <div className="text-xs text-muted-foreground truncate">{customer.member_id} · Balance: {customer.tokens}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">2. Award points</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>Points</Label><Input type="number" min={1} step={1} value={points} onChange={e => setPoints(Number(e.target.value))} /></div>
            <div><Label>Reference (optional)</Label><Input value={reference} onChange={e => setReference(e.target.value)} maxLength={80} placeholder="Receipt no." /></div>
            <div><Label>Note (optional)</Label><Textarea rows={2} value={note} onChange={e => setNote(e.target.value)} maxLength={300} /></div>
            <Button className="w-full" disabled={!customer || busy || points <= 0} onClick={handleAward}>
              {busy ? 'Awarding…' : customer ? `Award ${points} points to ${customer.member_id}` : 'Look up a customer first'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent awards</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {awards.length === 0 && <div className="text-sm text-muted-foreground italic">No awards yet.</div>}
          {awards.slice(0, 20).map(a => (
            <div key={a.id} className="flex items-center justify-between text-sm border-b last:border-0 py-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{a.customer_member_id}</div>
                <div className="text-xs text-muted-foreground truncate">{new Date(a.created_at).toLocaleString()}{a.reference ? ` · ${a.reference}` : ''}</div>
              </div>
              <Badge>+{a.points}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}