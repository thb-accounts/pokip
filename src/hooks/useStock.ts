import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface StockData {
  item_id: string;
  total_stock: number;
  remaining_stock: number;
}

interface UserPurchase {
  item_id: string;
  purchase_code: string;
  purchased_at: string;
}

export const useStock = (userId?: string | undefined) => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [userPurchases, setUserPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      // Fetch stock data
      const stockSnapshot = await getDocs(collection(db, 'item_stock'));
      const stock = stockSnapshot.docs.map(doc => ({ ...doc.data() })) as StockData[];
      setStockData(stock);

      // Fetch user purchases if user is logged in
      if (userId) {
        const purchasesQuery = query(collection(db, 'user_purchases'), where('user_id', '==', userId));
        const purchasesSnapshot = await getDocs(purchasesQuery);
        const purchases = purchasesSnapshot.docs.map(doc => doc.data()) as UserPurchase[];
        setUserPurchases(purchases);
      } else {
        setUserPurchases([]);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockForItem = (itemId: string) => {
    return stockData.find(s => s.item_id === itemId);
  };

  const hasUserPurchased = (itemId: string) => {
    return userPurchases.some(p => p.item_id === itemId);
  };

  return {
    stockData,
    userPurchases,
    loading,
    getStockForItem,
    hasUserPurchased,
    refetch: fetchData,
  };
};