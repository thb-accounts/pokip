import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { z } from 'zod';
import { Plus, Pencil, Archive, ArchiveRestore } from 'lucide-react';
import { useMerchantProfile } from '@/hooks/useMerchantProfile';
import { useMerchantItems } from '@/hooks/useMerchantItems';
import type { PokipItem } from '@/types/pokip';

const schema = z.object({
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().min(2).max(600),
  image_url: z.string().trim().url().max(500).optional().or(z.literal('')),
  token_price: z.number().int().min(0).max(1_000_000),
  cash_price: z.number().min(0).max(1_000_000).optional().nullable(),
  currency: z.string().trim().max(6).optional().or(z.literal('')),
  stock_quantity: z.number().int().min(0).max(1_000_000).optional(),
  unlimited_stock: z.boolean(),
});

const emptyForm = {
  title: '', description: '', image_url: '',
  token_price: 0, cash_price: '', currency: '',
  stock_quantity: 0, unlimited_stock: false,
  status: 'draft' as PokipItem['status'],
};

export default function MerchantItems() {
  const { merchant } = useMerchantProfile();
  const { items, loading, create, update, archive, publish, draft } = useMerchantItems(merchant?.id, merchant?.business_name);

  const [editing, setEditing] = useState<PokipItem | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (item: PokipItem) => {
    setEditing(item);
    setForm({
      title: item.title, description: item.description,
      image_url: item.image_url || '',
      token_price: item.token_price,
      cash_price: item.cash_price ?? '',
      currency: item.currency || merchant?.currency || '',
      stock_quantity: item.stock_quantity ?? 0,
      unlimited_stock: item.unlimited_stock,
      status: item.status,
    });
    setOpen(true);
  };

  const handleSave = async (nextStatus: PokipItem['status']) => {
    if (saving) return;
    const cashPrice = form.cash_price === '' || form.cash_price == null ? null : Number(form.cash_price);
    const parsed = schema.safeParse({
      title: form.title,
      description: form.description,
      image_url: form.image_url || '',
      token_price: Number(form.token_price),
      cash_price: cashPrice,
      currency: form.currency || '',
      stock_quantity: Number(form.stock_quantity || 0),
      unlimited_stock: !!form.unlimited_stock,
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message || 'Please review the form'); return; }
    setSaving(true);
    try {
      const payload = {
        ...parsed.data,
        image_url: parsed.data.image_url || undefined,
        currency: parsed.data.currency || undefined,
        cash_price: cashPrice,
        status: nextStatus,
      };
      if (editing) {
        await update(editing.id, payload as any);
        toast.success('Item updated');
      } else {
        await create(payload as any);
        toast.success(nextStatus === 'published' ? 'Item published' : 'Draft saved');
      }
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || 'Could not save item');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Items</h1>
          <p className="text-sm text-muted-foreground">Manage what appears in the POKIP Shop.</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" />New item</Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm">Loading items…</div>
      ) : items.length === 0 ? (
        <Card><CardContent className="p-8 text-center space-y-3">
          <div className="text-lg font-medium">No items yet</div>
          <p className="text-sm text-muted-foreground">Create your first item to publish it to the POKIP Shop.</p>
          <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" />New item</Button>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(item => (
            <Card key={item.id}>
              <CardHeader className="p-4 pb-2 flex-row items-start justify-between gap-2 space-y-0">
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{item.title}</CardTitle>
                  <div className="text-xs text-muted-foreground truncate">{item.token_price} pts{item.cash_price ? ` · ${item.currency ?? ''} ${item.cash_price}` : ''}</div>
                </div>
                <Badge variant={item.status === 'published' ? 'default' : item.status === 'draft' ? 'secondary' : 'outline'}>{item.status}</Badge>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-3">
                {item.image_url && <img src={item.image_url} alt="" className="w-full aspect-video object-cover rounded-md" />}
                <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                <div className="text-xs text-muted-foreground">{item.unlimited_stock ? 'Unlimited stock' : `${item.stock_quantity ?? 0} in stock`}</div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(item)}><Pencil className="w-3.5 h-3.5 mr-1" />Edit</Button>
                  {item.status !== 'published' && item.status !== 'archived' && (
                    <Button size="sm" onClick={() => publish(item.id).then(() => toast.success('Published'))}>Publish</Button>
                  )}
                  {item.status === 'published' && (
                    <Button size="sm" variant="outline" onClick={() => draft(item.id).then(() => toast.success('Unpublished'))}>Unpublish</Button>
                  )}
                  {item.status !== 'archived' ? (
                    <Button size="sm" variant="ghost" onClick={() => setArchivingId(item.id)}><Archive className="w-3.5 h-3.5 mr-1" />Archive</Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => draft(item.id).then(() => toast.success('Restored to draft'))}><ArchiveRestore className="w-3.5 h-3.5 mr-1" />Restore</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit item' : 'New item'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} maxLength={80} /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} maxLength={600} /></div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." maxLength={500} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Token price</Label><Input type="number" min={0} value={form.token_price} onChange={e => setForm({ ...form, token_price: e.target.value })} /></div>
              <div><Label>Cash price (optional)</Label><Input type="number" min={0} step="0.01" value={form.cash_price} onChange={e => setForm({ ...form, cash_price: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Currency</Label><Input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} maxLength={6} placeholder={merchant?.currency} /></div>
              <div><Label>Stock quantity</Label><Input type="number" min={0} value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} disabled={form.unlimited_stock} /></div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.unlimited_stock} onCheckedChange={v => setForm({ ...form, unlimited_stock: !!v })} />
              Unlimited stock
            </label>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={saving} onClick={() => handleSave('draft')}>Save draft</Button>
            <Button disabled={saving} onClick={() => handleSave('published')}>{saving ? 'Saving…' : 'Publish'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!archivingId} onOpenChange={(o) => !o && setArchivingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this item?</AlertDialogTitle>
            <AlertDialogDescription>Archived items are hidden from the POKIP Shop. You can restore them later.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (!archivingId) return;
              await archive(archivingId);
              setArchivingId(null);
              toast.success('Item archived');
            }}>Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}