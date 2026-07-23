import { useMemo, useState } from 'react';
import { PublicNav } from '@/components/nav/PublicNav';
import { PublicFooter } from '@/components/nav/PublicFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useShopItems } from '@/hooks/useShopItems';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useProfile } from '@/hooks/useProfile';
import { useShopPurchase } from '@/hooks/useShopPurchase';
import { PurchaseReceipt } from '@/components/PurchaseReceipt';
import type { PokipItem } from '@/types/pokip';
import { Link, useNavigate } from 'react-router-dom';
import { Coins, ShoppingCart } from 'lucide-react';

export default function Shop() {
  const { items, loading, error } = useShopItems();
  const { user } = useFirebaseAuth();
  const { profile, updateTokens } = useProfile();
  const { purchase } = useShopPurchase();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [merchantFilter, setMerchantFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ code: string; item: PokipItem; date: Date } | null>(null);

  const merchants = useMemo(() => Array.from(new Set(items.map(i => i.merchant_name))).sort(), [items]);
  const filtered = useMemo(() => {
    let out = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    if (merchantFilter !== 'all') out = out.filter(i => i.merchant_name === merchantFilter);
    switch (sort) {
      case 'price_asc': out = [...out].sort((a, b) => a.token_price - b.token_price); break;
      case 'price_desc': out = [...out].sort((a, b) => b.token_price - a.token_price); break;
      default: break;
    }
    return out;
  }, [items, search, merchantFilter, sort]);

  const handleBuy = async (item: PokipItem) => {
    if (!user || !profile) { navigate('/auth?next=/shop'); return; }
    if (profile.role !== 'customer') { toast.error('Only customer accounts can redeem items'); return; }
    if (busyId) return;
    setBusyId(item.id);
    try {
      const res = await purchase(item, profile);
      await updateTokens(res.newTokens);
      setReceipt({ code: res.purchase.purchase_code, item, date: new Date(res.purchase.purchased_at) });
      toast.success('Purchase complete');
    } catch (e: any) { toast.error(e?.message || 'Purchase failed'); }
    finally { setBusyId(null); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">POKIP Shop</h1>
          <p className="text-muted-foreground">Redeem your points across every POKIP merchant.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_200px_180px]">
          <Input placeholder="Search items…" value={search} onChange={e => setSearch(e.target.value)} maxLength={80} />
          <Select value={merchantFilter} onValueChange={setMerchantFilter}>
            <SelectTrigger><SelectValue placeholder="Merchant" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All merchants</SelectItem>
              {merchants.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: low to high</SelectItem>
              <SelectItem value="price_desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading shop…</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="p-10 text-center space-y-3">
            <div className="text-lg font-medium">Nothing here yet</div>
            <p className="text-sm text-muted-foreground">The Shop will fill up as merchants publish items. Are you a business?</p>
            <Button asChild><Link to="/auth?role=merchant">Become a POKIP merchant</Link></Button>
          </CardContent></Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(item => {
              const inStock = item.unlimited_stock || (item.stock_quantity ?? 0) > 0;
              return (
                <Card key={item.id} className="overflow-hidden">
                  {item.image_url && <img src={item.image_url} alt="" className="w-full aspect-video object-cover" />}
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">{item.merchant_name}</div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-pokip-blue font-semibold"><Coins className="w-4 h-4" />{item.token_price}</div>
                      {item.cash_price != null && <div className="text-xs text-muted-foreground">{item.currency ?? ''} {item.cash_price}</div>}
                      <Badge variant={inStock ? 'secondary' : 'outline'}>{item.unlimited_stock ? 'In stock' : inStock ? `${item.stock_quantity} left` : 'Out of stock'}</Badge>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleBuy(item)}
                      disabled={!inStock || busyId === item.id || (profile ? profile.tokens < item.token_price : false)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {busyId === item.id ? 'Processing…' : !user ? 'Sign in to redeem' : profile && profile.tokens < item.token_price ? 'Not enough points' : 'Redeem'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <PublicFooter />

      {receipt && (
        <PurchaseReceipt
          item={{ id: receipt.item.id, name: receipt.item.title, description: receipt.item.description, cost: receipt.item.token_price, image: receipt.item.image_url || '', category: receipt.item.merchant_name }}
          purchaseCode={receipt.code}
          purchaseDate={receipt.date}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}