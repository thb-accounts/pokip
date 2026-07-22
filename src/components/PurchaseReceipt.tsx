import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Copy, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Item } from './ItemCard';

interface PurchaseReceiptProps {
  item: Item;
  purchaseCode: string;
  purchaseDate: Date;
  onClose: () => void;
}

export const PurchaseReceipt = ({ item, purchaseCode, purchaseDate, onClose }: PurchaseReceiptProps) => {
  const { toast } = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(purchaseCode);
    toast({
      title: "Code Copied!",
      description: "Redemption code copied to clipboard",
    });
  };

  const downloadReceipt = () => {
    // This would trigger a screenshot or download in a real app
    toast({
      title: "Screenshot Ready!",
      description: "Take a screenshot of this receipt for your records",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gradient-card border-neon-cyan/30 shadow-glow border-2">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <Badge variant="outline" className="border-neon-cyan text-neon-cyan text-lg px-4 py-2">
              ✓ Purchase Successful
            </Badge>
            <h2 className="text-3xl font-bold text-neon-cyan">TokenTrek Receipt</h2>
          </div>

          {/* Item Details */}
          <div className="space-y-4">
            <div className="text-center">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg mx-auto border-2 border-neon-cyan/30"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-center">{item.name}</h3>
              <p className="text-muted-foreground text-center text-sm">{item.description}</p>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm">Date</span>
              </div>
              <span className="font-mono text-sm">{formatDate(purchaseDate)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm">Time</span>
              </div>
              <span className="font-mono text-sm">{formatTime(purchaseDate)}</span>
            </div>
          </div>

          {/* Redemption Code */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="text-center">
              <span className="text-sm text-muted-foreground uppercase tracking-wider">
                Redemption Code
              </span>
            </div>
            
            <div className="bg-card border-2 border-neon-cyan/30 rounded-lg p-6 text-center">
              <code className="text-3xl font-mono font-bold text-neon-cyan tracking-wider break-all">
                {purchaseCode}
              </code>
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              Present this code to redeem your item
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={copyCode}
              className="flex-1 gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Code
            </Button>
            
            <Button
              variant="gaming"
              onClick={downloadReceipt}
              className="flex-1 gap-2"
            >
              <Download className="w-4 h-4" />
              Screenshot
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};