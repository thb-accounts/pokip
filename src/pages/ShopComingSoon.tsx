import { Store } from 'lucide-react';
import { PublicNav } from '@/components/nav/PublicNav';
import { PublicFooter } from '@/components/nav/PublicFooter';
import { Card } from '@/components/ui/card';

export default function ShopComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Card className="max-w-xl p-10 text-center shadow-card">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pokip-blue-soft text-pokip-blue-deep">
            <Store className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{body}</p>
        </Card>
      </section>
      <PublicFooter />
    </div>
  );
}