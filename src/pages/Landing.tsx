import { Link } from 'react-router-dom';
import { ArrowRight, Store, Sparkles, ShieldCheck, Gift, Users, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PublicNav } from '@/components/nav/PublicNav';
import { PublicFooter } from '@/components/nav/PublicFooter';
import { PointsBadge } from '@/components/brand/PointsBadge';
import { PokipLogo } from '@/components/brand/PokipLogo';

const perks = [
  { icon: Store, title: 'Shop with any merchant', body: 'Earn POKIP Points every time you buy from a participating business.' },
  { icon: Gift, title: 'Redeem real items', body: 'Turn your points into items from local merchants in the POKIP Shop.' },
  { icon: ShieldCheck, title: 'Safe & simple', body: 'Points are recorded server-side. Never transferable, never withdrawable.' },
];

const merchantPerks = [
  { icon: Users, title: 'Reward every customer', body: 'Look up a POKIP Member ID and award points in seconds.' },
  { icon: ScanLine, title: 'Sell in the POKIP Shop', body: 'List your own items and let members redeem them with points.' },
  { icon: Sparkles, title: 'Grow loyalty', body: 'Analytics, redemptions, and a business profile that customers can browse.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:py-24 md:items-center">
          <div className="space-y-6">
            <PointsBadge points={0} size="sm" className="!bg-white shadow-sm" />
            <h1 className="text-4xl font-bold tracking-tight text-pokip-ink md:text-6xl">
              Loyalty points that go
              <span className="block bg-gradient-brand bg-clip-text text-transparent">further.</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              POKIP is a multi-merchant loyalty programme. Earn <strong>POKIP Points</strong> when
              you shop with participating businesses, then redeem them for real items in the POKIP Shop.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-brand">
                <Link to="/auth?mode=signup&role=customer">
                  Create a Customer Account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/auth?mode=signup&role=merchant">Create a Merchant Account</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              POKIP Points are loyalty points — not cash, not cryptocurrency, non-transferable.
            </p>
          </div>

          <div className="relative">
            <Card className="relative mx-auto max-w-sm overflow-hidden border-0 bg-gradient-brand p-6 text-white shadow-brand">
              <div className="flex items-center justify-between">
                <PokipLogo variant="mark" className="h-10 w-10 rounded-xl bg-white/10 p-1.5" />
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                  Digital Membership
                </span>
              </div>
              <div className="mt-10 space-y-1">
                <p className="text-xs uppercase tracking-widest text-white/70">POKIP Member</p>
                <p className="text-xl font-semibold">Alex Rahman</p>
                <p className="font-mono text-sm text-white/70">POKIP-M-482091</p>
              </div>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/70">Balance</p>
                  <p className="text-3xl font-bold">4,820 pts</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-silver ring-2 ring-white/40" aria-hidden />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer perks */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">One card. Every participating merchant.</h2>
          <p className="mt-3 text-muted-foreground">
            Your POKIP Member ID works everywhere. Show it at checkout, collect points, and spend them
            in the POKIP Shop whenever you're ready.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {perks.map((p) => (
            <Card key={p.title} className="p-6 shadow-card transition-shadow hover:shadow-brand">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pokip-blue-soft text-pokip-blue-deep">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Merchant section */}
      <section className="border-y border-border bg-muted/40">
        <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-pokip-blue-deep ring-1 ring-pokip-blue/20">
              For merchants
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Bring your customers back.</h2>
            <p className="mt-3 text-muted-foreground">
              Join POKIP as a merchant — no application, no approval queue. Award points to
              customers and list items in the POKIP Shop from your own dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/auth?mode=signup&role=merchant">Create a Merchant Account</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/how-it-works">Learn more <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-1">
            {merchantPerks.map((p) => (
              <Card key={p.title} className="flex items-start gap-4 p-5 shadow-card">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pokip-blue text-white">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}