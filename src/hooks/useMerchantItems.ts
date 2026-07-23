import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where,
} from 'firebase/firestore';
import { useFirebaseAuth } from './useFirebaseAuth';
import type { PokipItem } from '@/types/pokip';

export type ItemInput = Omit<PokipItem, 'id' | 'merchant_id' | 'merchant_owner_uid' | 'merchant_name' | 'created_at' | 'updated_at'>;

export const useMerchantItems = (merchantId?: string, merchantName?: string) => {
  const { user } = useFirebaseAuth();
  const [items, setItems] = useState<PokipItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user || !merchantId) { setItems([]); setLoading(false); return; }
    setLoading(true);
    try {
      const q = query(
        collection(db, 'merchant_items'),
        where('merchant_owner_uid', '==', user.uid),
      );
      const snap = await getDocs(q);
      const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as PokipItem[];
      rows.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      setItems(rows);
    } finally {
      setLoading(false);
    }
  }, [user, merchantId]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (input: ItemInput) => {
    if (!user || !merchantId) throw new Error('Merchant profile required');
    const now = new Date().toISOString();
    const payload = {
      ...input,
      merchant_id: merchantId,
      merchant_owner_uid: user.uid,
      merchant_name: merchantName || 'Merchant',
      created_at: now,
      updated_at: now,
    };
    const ref = await addDoc(collection(db, 'merchant_items'), payload);
    await fetch();
    return { id: ref.id, ...payload } as PokipItem;
  };

  const update = async (id: string, patch: Partial<ItemInput> & { status?: PokipItem['status'] }) => {
    if (!user) throw new Error('Not authenticated');
    const ref = doc(db, 'merchant_items', id);
    const clean: any = { ...patch, updated_at: new Date().toISOString() };
    delete clean.merchant_id;
    delete clean.merchant_owner_uid;
    await updateDoc(ref, clean);
    await fetch();
  };

  const archive = async (id: string) => update(id, { status: 'archived' });
  const publish = async (id: string) => update(id, { status: 'published' });
  const draft = async (id: string) => update(id, { status: 'draft' });
  const remove = async (id: string) => { await deleteDoc(doc(db, 'merchant_items', id)); await fetch(); };

  return { items, loading, refetch: fetch, create, update, archive, publish, draft, remove };
};