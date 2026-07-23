import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { PokipItem } from '@/types/pokip';

export const useShopItems = () => {
  const [items, setItems] = useState<PokipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'merchant_items'), where('status', '==', 'published'));
      const snap = await getDocs(q);
      const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as PokipItem[];
      rows.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      setItems(rows);
    } catch (e: any) {
      setError(e?.message || 'Failed to load shop');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loading, error, refetch: fetch };
};