import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PublicNav } from '@/components/nav/PublicNav';
import { PublicFooter } from '@/components/nav/PublicFooter';

const customerSteps = [
  { n: '01', title: 'Create your POKIP account', body: 'Sign up for free. You get a POKIP Member ID and a digital membership card.' },
  { n: '02', title: 'Shop with participating merchants', body: 'Show your POKIP Member ID at checkout. The merchant awards you POKIP Points.' },
  { n: '03', title: 'Redeem in the POKIP Shop', body: 'Browse items from every merchant and redeem the ones you want with your points.' },
];

const merchantSteps = [
  { n: '01', title: 'Create your Merchant Profile', body: 'Add your business details, logo, and cover image. You get a unique Merchant ID.' },
  { n: '02', title: 'Award customers points', body: 'Look up a customer\'s POKIP Member ID and award points for their purchase.' },
  { n: '03', title: 'List items in the POKIP Shop', body: 'Publish items customers can redeem with points. Track redemptions from your dashboard.' },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">How POKIP works</h1>
          <p className="mt-4 text-muted-foreground">
            A simple loyalty programme connecting customers and merchants through POKIP Points.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">For customers</h2>
            <div className="mt-6 space-y-4">
              {customerSteps.map((s) => (
                <Card key={s.n} className="p-5 shadow-card">
                  <div className="flex items-start gap-4">
                    <span className="rounded-lg bg-pokip-blue-soft px-2.5 py-1 text-xs font-bold text-pokip-blue-deep">{s.n}</span>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button asChild className="mt-6">
              <Link to="/auth?mode=signup&role=customer">Create a Customer Account</Link>
            </Button>
          </div>

          <div>
            <h2 className="text-2xl font-bold">For merchants</h2>
            <div className="mt-6 space-y-4">
              {merchantSteps.map((s) => (
                <Card key={s.n} className="p-5 shadow-card">
                  <div className="flex items-start gap-4">
                    <span className="rounded-lg bg-pokip-blue px-2.5 py-1 text-xs font-bold text-white">{s.n}</span>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/auth?mode=signup&role=merchant">Create a Merchant Account</Link>
            </Button>
          </div>
        </div>

        <Card className="mt-16 border-pokip-blue/20 bg-pokip-blue-soft p-6">
          <h3 className="font-semibold text-pokip-blue-deep">About POKIP Points</h3>
          <p className="mt-2 text-sm text-pokip-blue-deep/80">
            POKIP Points are loyalty points. They are <strong>not cash</strong>, <strong>not cryptocurrency</strong>,
            not transferable between customers, and cannot be withdrawn or exchanged for money.
          </p>
        </Card>
      </section>

      <PublicFooter />
    </div>
  );
}