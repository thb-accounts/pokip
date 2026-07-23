import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useFirebaseAuth } from './useFirebaseAuth';
import { claimSlug, normalizeSlug } from '@/lib/slug';
import type { MerchantProfile } from '@/types/pokip';

export const useMerchantProfile = () => {
  const { user } = useFirebaseAuth();
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setMerchant(null); setLoading(false); return null; }
    setLoading(true);
    try {
      const ref = doc(db, 'merchant_profiles', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = { id: snap.id, ...(snap.data() as any) } as MerchantProfile;
        setMerchant(data);
        return data;
      }
      setMerchant(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const createOrUpdate = async (
    input: Omit<MerchantProfile, 'id' | 'owner_uid' | 'status' | 'created_at' | 'updated_at'>
  ) => {
    if (!user) throw new Error('Not authenticated');
    const now = new Date().toISOString();
    const slug = normalizeSlug(input.slug);
    await claimSlug(slug, user.uid, merchant?.slug);
    const ref = doc(db, 'merchant_profiles', user.uid);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      const patch = { ...input, slug, updated_at: now };
      await updateDoc(ref, patch as any);
      const merged = { ...(existing.data() as any), ...patch, id: user.uid } as MerchantProfile;
      setMerchant(merged);
      return merged;
    }
    const created: MerchantProfile = {
      id: user.uid,
      owner_uid: user.uid,
      ...input,
      slug,
      status: 'active',
      created_at: now,
      updated_at: now,
    };
    await setDoc(ref, created);
    setMerchant(created);
    return created;
  };

  return { merchant, loading, refetch: fetch, createOrUpdate };
};