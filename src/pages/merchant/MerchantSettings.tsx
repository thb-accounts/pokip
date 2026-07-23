import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMerchantProfile } from '@/hooks/useMerchantProfile';

export default function MerchantSettings() {
  const { merchant } = useMerchantProfile();
  if (!merchant) return null;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your merchant profile.</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Merchant profile</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row k="Business name" v={merchant.business_name} />
          <Row k="Contact name" v={merchant.contact_name} />
          <Row k="Business email" v={merchant.business_email} />
          <Row k="Phone" v={merchant.phone_number || '—'} />
          <Row k="Category" v={merchant.category} />
          <Row k="Location" v={merchant.location || '—'} />
          <Row k="Currency" v={merchant.currency} />
          <Row k="Online only" v={merchant.online_only ? 'Yes' : 'No'} />
          <Row k="Public slug" v={`/${merchant.slug}`} />
          <Button asChild className="mt-3"><Link to="/merchant/onboarding">Edit profile</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between gap-4 border-b last:border-0 py-2">
    <span className="text-muted-foreground">{k}</span>
    <span className="font-medium text-right truncate max-w-[60%]">{v}</span>
  </div>
);