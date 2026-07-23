import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, runTransaction } from 'firebase/firestore';
import type { MerchantProfile, ShopPurchase } from '@/types/pokip';

export type RedemptionLookup =
  | { status: 'ok'; purchase: ShopPurchase }
  | { status: 'not_found' }
  | { status: 'wrong_merchant'; purchase: ShopPurchase }
  | { status: 'already_redeemed'; purchase: ShopPurchase };

export const useRedemption = () => {
  const lookup = async (code: string, merchant: MerchantProfile): Promise<RedemptionLookup> => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return { status: 'not_found' };
    const q = query(collection(db, 'shop_purchases'), where('purchase_code', '==', normalized));
    const snap = await getDocs(q);
    if (snap.empty) return { status: 'not_found' };
    const d = snap.docs[0];
    const purchase = { id: d.id, ...(d.data() as any) } as ShopPurchase;
    if (purchase.merchant_owner_uid !== merchant.owner_uid) return { status: 'wrong_merchant', purchase };
    if (purchase.redeemed) return { status: 'already_redeemed', purchase };
    return { status: 'ok', purchase };
  };

  const redeem = async (purchaseId: string, merchant: MerchantProfile) => {
    return runTransaction(db, async (tx) => {
      const ref = doc(db, 'shop_purchases', purchaseId);
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error('Purchase not found');
      const p = snap.data() as any;
      if (p.merchant_owner_uid !== merchant.owner_uid) throw new Error('This code belongs to another merchant');
      if (p.redeemed) throw new Error('This code has already been redeemed');
      const now = new Date().toISOString();
      tx.update(ref, {
        redeemed: true,
        redeemed_at: now,
        redeemed_by_uid: merchant.owner_uid,
        redeemed_by_merchant_id: merchant.id,
      });
      return { ...p, id: purchaseId, redeemed: true, redeemed_at: now } as ShopPurchase;
    });
  };

  return { lookup, redeem };
};