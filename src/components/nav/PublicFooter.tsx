import { Link } from 'react-router-dom';
import { PokipLogo } from '@/components/brand/PokipLogo';

export const PublicFooter = () => (
  <footer className="border-t border-border bg-muted/40">
    <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
      <div className="space-y-3">
        <PokipLogo className="h-6 w-auto" />
        <p className="text-sm text-muted-foreground">
          A multi-merchant loyalty programme. Earn POKIP Points when you shop with
          participating businesses, then redeem them in the POKIP Shop.
        </p>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold">Programme</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/shop" className="hover:text-foreground">POKIP Shop</Link></li>
          <li><Link to="/merchants" className="hover:text-foreground">Merchants</Link></li>
          <li><Link to="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold">Accounts</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/auth?mode=signup&role=customer" className="hover:text-foreground">Create Customer Account</Link></li>
          <li><Link to="/auth?mode=signup&role=merchant" className="hover:text-foreground">Create Merchant Account</Link></li>
          <li><Link to="/auth" className="hover:text-foreground">Log in</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold">About POKIP Points</h4>
        <p className="text-xs text-muted-foreground">
          POKIP Points are loyalty points. They are not cash, not cryptocurrency,
          are non-transferable, and cannot be withdrawn or exchanged for money.
        </p>
      </div>
    </div>
    <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} POKIP. All rights reserved.
    </div>
  </footer>
);