import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { ShopPurchase } from '@/types/pokip';

export const useMerchantPurchases = (ownerUid?: string) => {
  const [purchases, setPurchases] = useState<ShopPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!ownerUid) { setPurchases([]); setLoading(false); return; }
    setLoading(true);
    try {
      const q = query(collection(db, 'shop_purchases'), where('merchant_owner_uid', '==', ownerUid));
      const snap = await getDocs(q);
      const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as ShopPurchase[];
      rows.sort((a, b) => (b.purchased_at || '').localeCompare(a.purchased_at || ''));
      setPurchases(rows);
    } finally { setLoading(false); }
  }, [ownerUid]);

  useEffect(() => { fetch(); }, [fetch]);
  return { purchases, loading, refetch: fetch };
};