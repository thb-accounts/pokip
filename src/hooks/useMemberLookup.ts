import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { lookupUidByMemberId, normalizeMemberId } from '@/lib/memberId';
import type { UserProfile } from '@/types/pokip';

export interface MemberLookupResult {
  uid: string;
  member_id: string;
  display_name: string | null;
  username: string | null;
  tokens: number;
}

export const useMemberLookup = () => {
  const lookup = async (memberId: string): Promise<MemberLookupResult | null> => {
    const normalized = normalizeMemberId(memberId);
    if (!normalized) return null;
    const uid = await lookupUidByMemberId(normalized);
    if (!uid) return null;
    const snap = await getDoc(doc(db, 'profiles', uid));
    if (!snap.exists()) return null;
    const p = snap.data() as UserProfile;
    if (p.role !== 'customer') return null;
    return {
      uid,
      member_id: p.member_id || normalized,
      display_name: p.display_name || null,
      username: p.username || null,
      tokens: p.tokens || 0,
    };
  };
  return { lookup };
};