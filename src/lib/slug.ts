import { db } from '@/lib/firebase';
import { doc, getDoc, runTransaction } from 'firebase/firestore';

const RESERVED_SLUGS = new Set([
  'admin', 'merchant', 'merchants', 'dashboard', 'shop', 'auth',
  'how-it-works', 'api', 'settings', 'account', 'login', 'signup',
  'pokip', 'system', 'null', 'undefined',
]);

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

export function isSlugReserved(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}

export async function isSlugAvailable(slug: string, ownerUid?: string): Promise<boolean> {
  if (!slug || isSlugReserved(slug)) return false;
  const snap = await getDoc(doc(db, 'merchant_slugs', slug));
  if (!snap.exists()) return true;
  const data = snap.data() as any;
  return ownerUid ? data.owner_uid === ownerUid : false;
}

/** Claim slug atomically for the given owner. Releases previous slug if provided. */
export async function claimSlug(slug: string, ownerUid: string, previousSlug?: string): Promise<void> {
  const normalized = normalizeSlug(slug);
  if (!normalized || isSlugReserved(normalized)) {
    throw new Error('This URL name is not available');
  }
  const ref = doc(db, 'merchant_slugs', normalized);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists() && (snap.data() as any).owner_uid !== ownerUid) {
      throw new Error('This URL name is already taken');
    }
    tx.set(ref, { owner_uid: ownerUid, slug: normalized, updated_at: new Date().toISOString() });
    if (previousSlug && previousSlug !== normalized) {
      const prevRef = doc(db, 'merchant_slugs', previousSlug);
      const prevSnap = await tx.get(prevRef);
      if (prevSnap.exists() && (prevSnap.data() as any).owner_uid === ownerUid) {
        tx.delete(prevRef);
      }
    }
  });
}