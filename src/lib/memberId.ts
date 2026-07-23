import { db } from '@/lib/firebase';
import { doc, getDoc, runTransaction } from 'firebase/firestore';

const RESERVED_PREFIXES = ['ADMIN', 'STAFF', 'POKIP', 'SYSTEM'];

/** Generate a random 6-digit numeric suffix. */
function generateSuffix(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatMemberId(suffix: string): string {
  return `POKIP-M-${suffix}`;
}

export function normalizeMemberId(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

/** Reserve a unique member id in Firestore and return it. */
export async function assignUniqueMemberId(uid: string): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const suffix = generateSuffix();
    if (RESERVED_PREFIXES.includes(suffix)) continue;
    const memberId = formatMemberId(suffix);
    const key = normalizeMemberId(memberId);
    const ref = doc(db, 'member_ids', key);
    try {
      const created = await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (snap.exists()) return false;
        tx.set(ref, { uid, member_id: memberId, created_at: new Date().toISOString() });
        return true;
      });
      if (created) return memberId;
    } catch (e) {
      // retry
    }
  }
  throw new Error('Could not allocate a unique Member ID');
}

export async function lookupUidByMemberId(memberId: string): Promise<string | null> {
  const key = normalizeMemberId(memberId);
  const snap = await getDoc(doc(db, 'member_ids', key));
  if (!snap.exists()) return null;
  return (snap.data() as any).uid ?? null;
}
