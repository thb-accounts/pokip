import { db } from '@/lib/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import type { PokipItem, ShopPurchase, UserProfile } from '@/types/pokip';

function generatePurchaseCode(item: PokipItem) {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timePart = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const base = item.title.toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 10) || 'POKIP';
  return `${base}-${datePart}-${timePart}-${rand}`;
}

export const useShopPurchase = () => {
  const purchase = async (item: PokipItem, profile: UserProfile) => {
    if (!profile) throw new Error('Sign in to purchase');
    if (profile.tokens < item.token_price) throw new Error('Insufficient tokens');
    if (item.status !== 'published') throw new Error('Item is not available');

    const result = await runTransaction(db, async (tx) => {
      const itemRef = doc(db, 'merchant_items', item.id);
      const itemSnap = await tx.get(itemRef);
      if (!itemSnap.exists()) throw new Error('Item no longer exists');
      const live = itemSnap.data() as any;
      if (live.status !== 'published') throw new Error('Item is not available');
      if (!live.unlimited_stock && (live.stock_quantity ?? 0) <= 0) throw new Error('Item is out of stock');

      const profileRef = doc(db, 'profiles', profile.user_id);
      const profileSnap = await tx.get(profileRef);
      if (!profileSnap.exists()) throw new Error('Profile not found');
      const liveProfile = profileSnap.data() as any;
      if ((liveProfile.tokens ?? 0) < item.token_price) throw new Error('Insufficient tokens');

      const code = generatePurchaseCode(item);
      const purchaseRef = doc(db, 'shop_purchases', `${profile.user_id}_${item.id}_${Date.now()}`);
      const newTokens = (liveProfile.tokens ?? 0) - item.token_price;

      tx.update(profileRef, { tokens: newTokens, updated_at: new Date().toISOString() });
      if (!live.unlimited_stock) {
        tx.update(itemRef, { stock_quantity: (live.stock_quantity ?? 1) - 1, updated_at: new Date().toISOString() });
      }

      const shopPurchase: ShopPurchase = {
        id: purchaseRef.id,
        user_id: profile.user_id,
        customer_display_name: profile.display_name || profile.username || undefined,
        customer_member_id: profile.member_id,
        item_id: item.id,
        merchant_id: live.merchant_id,
        merchant_owner_uid: live.merchant_owner_uid,
        merchant_name: live.merchant_name,
        item_title: live.title,
        item_image_url: live.image_url,
        purchase_code: code,
        tokens_spent: item.token_price,
        redeemed: false,
        purchased_at: new Date().toISOString(),
      };
      tx.set(purchaseRef, shopPurchase);
      return { purchase: shopPurchase, newTokens };
    });
    return result;
  };
  return { purchase };
};