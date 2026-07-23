import { db } from '@/lib/firebase';
import { collection, doc, runTransaction, getDocs, query, where } from 'firebase/firestore';
import type { MerchantProfile, PointsAward } from '@/types/pokip';
import { useCallback, useEffect, useState } from 'react';

interface AwardInput {
  merchant: MerchantProfile;
  customerUid: string;
  customerMemberId: string;
  points: number;
  reference?: string;
  note?: string;
}

export const awardPoints = async ({ merchant, customerUid, customerMemberId, points, reference, note }: AwardInput) => {
  if (!Number.isFinite(points) || points <= 0 || Math.floor(points) !== points) {
    throw new Error('Points must be a positive whole number');
  }
  if (points > 100000) throw new Error('Points amount is too large');

  const now = new Date().toISOString();
  const awardRef = doc(collection(db, 'point_awards'));

  await runTransaction(db, async (tx) => {
    const profileRef = doc(db, 'profiles', customerUid);
    const profileSnap = await tx.get(profileRef);
    if (!profileSnap.exists()) throw new Error('Customer not found');
    const p = profileSnap.data() as any;
    if (p.role !== 'customer') throw new Error('Target account is not a customer');
    const newBalance = (p.tokens ?? 0) + points;
    tx.update(profileRef, { tokens: newBalance, updated_at: now });

    const award: PointsAward = {
      id: awardRef.id,
      customer_uid: customerUid,
      customer_member_id: customerMemberId,
      merchant_id: merchant.id,
      merchant_owner_uid: merchant.owner_uid,
      merchant_name: merchant.business_name,
      points,
      reference,
      note,
      created_at: now,
    };
    tx.set(awardRef, award);
  });

  return awardRef.id;
};

export const useMerchantPointAwards = (ownerUid?: string) => {
  const [awards, setAwards] = useState<PointsAward[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!ownerUid) { setAwards([]); setLoading(false); return; }
    setLoading(true);
    try {
      const q = query(collection(db, 'point_awards'), where('merchant_owner_uid', '==', ownerUid));
      const snap = await getDocs(q);
      const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as PointsAward[];
      rows.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      setAwards(rows);
    } finally { setLoading(false); }
  }, [ownerUid]);

  useEffect(() => { fetch(); }, [fetch]);
  return { awards, loading, refetch: fetch };
};