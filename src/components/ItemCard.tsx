import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Coins } from 'lucide-react';

export interface Item {
  id: string;
  name: string;
  description: string;
  cost: number;
  image: string;
  category: string;
}

interface ItemCardProps {
  item: Item;
  userTokens: number;
  remainingStock: number;
  hasUserPurchased: boolean;
  onPurchase: (item: Item) => void;
}

export const ItemCard = ({ item, userTokens, remainingStock, hasUserPurchased, onPurchase }: ItemCardProps) => {
  const canAfford = userTokens >= item.cost;
  const isOutOfStock = remainingStock <= 0;
  const canPurchase = canAfford && !hasUserPurchased && !isOutOfStock;

  return (
    <Card className="bg-gradient-card border-border/20 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
      <div className="aspect-video bg-gradient-gaming relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <div className="absolute top-3 right-3 space-y-1">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {item.category}
            </span>
          </div>
          <div className={`backdrop-blur-sm rounded-lg px-2 py-1 border ${
            isOutOfStock 
              ? 'bg-destructive/20 border-destructive/30' 
              : 'bg-neon-cyan/20 border-neon-cyan/30'
          }`}>
            <span className={`text-xs font-semibold ${
              isOutOfStock ? 'text-destructive' : 'text-neon-cyan'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `${remainingStock} out of 4 remaining`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-neon-cyan transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-neon-cyan" />
            <span className="font-bold text-neon-cyan">{item.cost.toLocaleString()}</span>
          </div>
          
          <Button
            variant={canPurchase ? "gaming" : "outline"}
            size="sm"
            onClick={() => onPurchase(item)}
            disabled={!canPurchase}
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Out of Stock' : 
             hasUserPurchased ? 'Already Purchased' :
             !canAfford ? 'Insufficient Tokens' : 'Buy Now'}
          </Button>
        </div>
      </div>
    </Card>
  );
};