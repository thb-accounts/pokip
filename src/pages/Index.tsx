import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ItemCard, Item } from '@/components/ItemCard';

import { TokenCounter } from '@/components/TokenCounter';
import { PurchaseReceipt } from '@/components/PurchaseReceipt';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useProfile } from '@/hooks/useProfile';

import { useStock } from '@/hooks/useStock';
import { usePurchase } from '@/hooks/usePurchase';
import { useToast } from "@/hooks/use-toast";
import { LogOut, Trophy } from 'lucide-react';

// Import images: Use format import (whatever) and then from '@/assets/imagefile.png';
import gamingChairImg from '@/assets/gaming-chair.jpg';
import gamingHeadsetImg from '@/assets/gaming-headset.jpg';
import gamingKeyboardImg from '@/assets/gaming-keyboard.jpg';
import gamingMouseImg from '@/assets/gaming-mouse.jpg';
import robuxCurrencyImg from '@/assets/robux-currency.jpg';
import bellCafeCookieImg from '@/assets/bell-cafe-cookie.jpg';
import advertisingImg from '@/assets/BIG.png'
import jassimsImg from '@/assets/jassimitem.png'

export default function Index() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useFirebaseAuth();
  const { profile, loading: profileLoading, updateTokens } = useProfile();
  
  const { stockData, userPurchases, loading: stockLoading, getStockForItem, hasUserPurchased, refetch: refetchStock } = useStock(user?.uid);
  const { purchaseItem } = usePurchase();
  const { toast } = useToast();
  
  const [receiptData, setReceiptData] = useState<{
    item: Item;
    purchaseCode: string;
    purchaseDate: Date;
  } | null>(null);

  if (authLoading || profileLoading || stockLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard... Enjoy TokenTrek Marketplace tho</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!user || !profile) {
    return null;
  }

  const items: Item[] = [
    {
      id: 'blank-item-18',
      name: 'Like Stanley Bottle',
      description: 'Contact Hammad to purchase. Hammad Abdullah is handling this listing.',
      cost: 2,
      image: jassimsImg,
      category: 'JASSIM ZEESHAN BUTT'
    },
    {
      id: 'blank-item-17',
      name: 'App or Website Development',
      description: 'Just buy this slot on TokenTrek, Hammad will contact you.',
      cost: 100,
      image: advertisingImg,
      category: 'Classroom Essentials'
    },
    {
      id: 'blank-item-16',
      name: 'Just buy this slot on TokenTrek, Hammad will contact you.',
      description: 'Just buy this slot on TokenTrek, Hammad will contact you.',
      cost: 0,
      image: advertisingImg,
      category: 'Classroom Essentials'
    },
    {
      id: 'blank-item-15',
      name: 'Just buy this slot on TokenTrek, Hammad will contact you.',
      description: 'Just buy this slot on TokenTrek, Hammad will contact you.',
      cost: 100,
      image: advertisingImg,
      category: ' Gaming Console'
    },
    {
      id: 'blank-item-14',
      name: 'Just buy this slot on TokenTrek, Hammad will contact you.',
      description: 'Just buy this slot on TokenTrek, Hammad will contact you.',
      cost: 0,
      image: advertisingImg,
      category: 'In-Game Currency'
    },
    {
      id: 'blank-item-13',
      name: 'Just buy this slot on TokenTrek, Hammad will contact you.',
      description: 'Just buy this slot on TokenTrek, Hammad will contact you.',
      cost: 0,
      image: advertisingImg,
      category: 'Food'
    },
    {
      id: 'blank-item-1',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-2',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized. just buy it',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-3',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized by you. Just buy it',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-4',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-5',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-6',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-7',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'Free TokenTrek Marketplace Advertisement Slot',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-8',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-9',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-10',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-11',
      name: 'Free TokenTrek Marketplace Advertisement Slot',
      description: 'This is a placeholder item that can be customized',
      cost: 0,
      image: advertisingImg,
      category: 'Placeholder'
    },
    {
      id: 'blank-item-12',
      name: 'VIP Slot',
      description: 'Get a VIP SLOT for your item. In school advertising.',
      cost: 60,
      image: advertisingImg,
      category: 'Placeholder'
    }
  ];

  const handlePurchase = async (item: Item) => {
    if (!profile || !user) return;

    try {
      const result = await purchaseItem(item, user?.uid, profile.tokens);
      
      await updateTokens(result.newTokenAmount);
      await refetchStock();

      setReceiptData({
        item,
        purchaseCode: result.purchaseCode,
        purchaseDate: new Date()
      });

      toast({
        title: "Purchase Successful!",
        description: `You've successfully purchased ${item.name}`,
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "There was an error processing your purchase.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              TokenTrek Marketplace
            </h1>
            <p className="text-muted-foreground mt-2">A THB Group brand.</p>
            <p className="text-muted-foreground mt-2"></p>
          </div>
          
          <div className="flex items-center gap-4">
            <TokenCounter tokens={profile?.tokens || 0} />
            <Button 
              variant="outline" 
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="marketplace">TokenTrek Mart - Student Items</TabsTrigger>
            <TabsTrigger value="tasks">TokenTrek Hub</TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplace" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">TokenTrek Student Items</h2>
              <p className="text-muted-foreground">Exchange your tokens for amazing rewards</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const stockInfo = getStockForItem(item.id);
                const userPurchased = hasUserPurchased(item.id);
                
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    userTokens={profile?.tokens || 0}
                    remainingStock={stockInfo?.remaining_stock || 0}
                    hasUserPurchased={userPurchased}
                    onPurchase={handlePurchase}
                  />
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-6">
            <Card className="bg-gradient-card border-border/20 shadow-card p-6">
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-neon-cyan" />
                  <h2 className="text-xl font-bold">TokenTrek Hub</h2>
                </div>
                <p className="text-muted-foreground">
                  TokenTrek Hub
                </p>
                <Button
                  variant="gaming"
                  size="lg"
                  onClick={() => window.open('https://fbjemr.mimo.run/tasks.html', '_blank')}
                  className="w-full"
                >
                  Go to Tasks
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Purchase Receipt Modal */}
      {receiptData && (
        <PurchaseReceipt
          item={receiptData.item}
          purchaseCode={receiptData.purchaseCode}
          purchaseDate={receiptData.purchaseDate}
          onClose={() => setReceiptData(null)}
        />
      )}
    </div>
  );
}