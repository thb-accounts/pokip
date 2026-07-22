import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { Item } from '@/components/ItemCard';

export const usePurchase = () => {
  const generatePurchaseCode = (item: Item) => {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timePart = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    return `${item.name.toUpperCase().replace(/\s+/g, '')}-${datePart}-${timePart}-${randomPart}`;
  };

  const purchaseItem = async (item: Item, userId: string | undefined, userTokens: number) => {
    if (!userId) {
      throw new Error('User must be logged in to purchase items');
    }

    if (userTokens < item.cost) {
      throw new Error('Insufficient tokens');
    }

    try {
      return await runTransaction(db, async (transaction) => {
        // Check stock
        const stockRef = doc(db, 'item_stock', item.id);
        const stockDoc = await transaction.get(stockRef);
        
        if (!stockDoc.exists()) {
          throw new Error('Item not found');
        }

        const stockData = stockDoc.data();
        if (stockData.remaining_stock <= 0) {
          throw new Error('Item is out of stock');
        }

        // Check if user already purchased this item
        const purchaseRef = doc(db, 'user_purchases', `${userId}_${item.id}`);
        const existingPurchase = await transaction.get(purchaseRef);
        
        if (existingPurchase.exists()) {
          throw new Error('You have already purchased this item');
        }

        const purchaseCode = generatePurchaseCode(item);
        const newTokenAmount = userTokens - item.cost;

        // Update user tokens
        const profileRef = doc(db, 'profiles', userId);
        transaction.update(profileRef, { 
          tokens: newTokenAmount,
          updated_at: new Date().toISOString()
        });

        // Update stock
        transaction.update(stockRef, { 
          remaining_stock: stockData.remaining_stock - 1 
        });

        // Record the purchase
        transaction.set(purchaseRef, {
          user_id: userId,
          item_id: item.id,
          purchase_code: purchaseCode,
          tokens_spent: item.cost,
          purchased_at: new Date().toISOString(),
        });

        return {
          success: true,
          purchaseCode,
          newTokenAmount,
        };
      });
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  };

  return {
    purchaseItem,
  };
};