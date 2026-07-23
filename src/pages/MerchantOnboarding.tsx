import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMerchantProfile } from '@/hooks/useMerchantProfile';
import { normalizeSlug } from '@/lib/slug';
import { FullscreenLoader } from '@/components/guards/RequireAuth';

const schema = z.object({
  businessName: z.string().trim().min(2).max(80),
  contactName: z.string().trim().min(2).max(80),
  businessEmail: z.string().trim().email().max(200),
  phoneNumber: z.string().trim().max(30).optional().or(z.literal('')),
  category: z.string().trim().min(2).max(40),
  description: z.string().trim().min(10).max(600),
  location: z.string().trim().max(120).optional().or(z.literal('')),
  currency: z.string().trim().min(1).max(6),
  slug: z.string().trim().min(2).max(40),
  logoURL: z.string().trim().url().max(500).optional().or(z.literal('')),
});

export default function MerchantOnboarding() {
  const { user, loading: authLoading } = useFirebaseAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { merchant, loading: merchantLoading, createOrUpdate } = useMerchantProfile();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    businessName: '', contactName: '', businessEmail: '', phoneNumber: '',
    category: '', description: '', location: '', currency: 'USD', slug: '', logoURL: '',
    onlineOnly: false,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?role=merchant', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (merchant) {
      setForm({
        businessName: merchant.business_name,
        contactName: merchant.contact_name,
        businessEmail: merchant.business_email,
        phoneNumber: merchant.phone_number || '',
        category: merchant.category,
        description: merchant.description,
        location: merchant.location || '',
        currency: merchant.currency,
        slug: merchant.slug,
        logoURL: merchant.logo_url || '',
        onlineOnly: merchant.online_only,
      });
    } else if (profile) {
      setForm(f => ({
        ...f,
        contactName: profile.display_name || '',
        businessEmail: profile.username || '',
      }));
    }
  }, [merchant, profile]);

  if (authLoading || profileLoading || merchantLoading) return <FullscreenLoader />;
  if (!user || !profile) return null;
  if (profile.role !== 'merchant' && profile.role !== 'admin') {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || 'Please review the form');
      return;
    }
    setSubmitting(true);
    try {
      const slug = normalizeSlug(form.slug || form.businessName);
      await createOrUpdate({
        business_name: form.businessName.trim(),
        contact_name: form.contactName.trim(),
        business_email: form.businessEmail.trim(),
        phone_number: form.phoneNumber.trim() || undefined,
        category: form.category.trim(),
        description: form.description.trim(),
        logo_url: form.logoURL.trim() || undefined,
        location: form.location.trim() || undefined,
        online_only: form.onlineOnly,
        currency: form.currency.trim().toUpperCase(),
        slug,
      });
      toast.success('Merchant profile saved');
      navigate('/merchant/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err?.message || 'Could not save profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{merchant ? 'Edit merchant profile' : 'Set up your merchant profile'}</CardTitle>
            <p className="text-sm text-muted-foreground">Tell POKIP customers who you are. You can update these details any time.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Business name" required>
                <Input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} maxLength={80} required />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contact name" required>
                  <Input value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} maxLength={80} required />
                </Field>
                <Field label="Business email" required>
                  <Input type="email" value={form.businessEmail} onChange={e => setForm({ ...form, businessEmail: e.target.value })} maxLength={200} required />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone number">
                  <Input value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} maxLength={30} />
                </Field>
                <Field label="Category" required>
                  <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Cafe, Retail" maxLength={40} required />
                </Field>
              </div>
              <Field label="Description" required>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} maxLength={600} rows={4} required />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Location">
                  <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} maxLength={120} />
                </Field>
                <Field label="Currency" required>
                  <Input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} maxLength={6} required />
                </Field>
              </div>
              <Field label="Logo URL">
                <Input value={form.logoURL} onChange={e => setForm({ ...form, logoURL: e.target.value })} placeholder="https://..." maxLength={500} />
              </Field>
              <Field label="Public URL name (slug)" required>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: normalizeSlug(e.target.value) })} placeholder="your-shop" maxLength={40} required />
                <p className="text-xs text-muted-foreground mt-1">Lowercase letters, numbers and dashes only.</p>
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.onlineOnly} onCheckedChange={v => setForm({ ...form, onlineOnly: !!v })} />
                Online-only merchant
              </label>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Saving…' : merchant ? 'Save changes' : 'Create merchant profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="space-y-1">
    <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
    {children}
  </div>
);