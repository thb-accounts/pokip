import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useFirebaseAuth } from './useFirebaseAuth';
import { assignUniqueMemberId } from '@/lib/memberId';
import type { UserProfile, UserRole } from '@/types/pokip';

interface EnsureOptions {
  role?: UserRole;
}

export const useProfile = () => {
  const { user } = useFirebaseAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (opts: EnsureOptions = {}) => {
    if (!user) return null;
    setLoading(true);
    try {
      const ref = doc(db, 'profiles', user.uid);
      const snap = await getDoc(ref);
      const now = new Date().toISOString();

      if (snap.exists()) {
        const data = snap.data() as Partial<UserProfile>;
        const patch: Partial<UserProfile> = {};
        if (!data.role) patch.role = 'customer';
        if (data.tokens == null) patch.tokens = 0;
        if (data.role !== 'merchant' && !data.member_id) {
          patch.member_id = await assignUniqueMemberId(user.uid);
        }
        if (Object.keys(patch).length > 0) {
          patch.updated_at = now;
          await updateDoc(ref, patch as any);
        }
        const merged = { id: snap.id, user_id: user.uid, ...(data as any), ...patch } as UserProfile;
        setProfile(merged);
        return merged;
      }

      const role: UserRole = opts.role ?? 'customer';
      const newProfile: UserProfile = {
        id: user.uid,
        user_id: user.uid,
        username: user.email || user.phoneNumber || null,
        display_name: user.displayName || null,
        role,
        tokens: 0,
        onboarding_completed: role === 'customer',
        created_at: now,
        updated_at: now,
      };
      if (role !== 'merchant') {
        newProfile.member_id = await assignUniqueMemberId(user.uid);
      }
      await setDoc(ref, newProfile);
      setProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateTokens = async (newTokenAmount: number) => {
    if (!user || !profile) return;
    const ref = doc(db, 'profiles', user.uid);
    await updateDoc(ref, { tokens: newTokenAmount, updated_at: new Date().toISOString() });
    setProfile(prev => (prev ? { ...prev, tokens: newTokenAmount } : null));
  };

  const updateProfile = async (patch: Partial<UserProfile>) => {
    if (!user || !profile) return;
    // Never allow role or member_id changes here
    const { role, member_id, id, user_id, created_at, ...safe } = patch as any;
    const ref = doc(db, 'profiles', user.uid);
    const updates = { ...safe, updated_at: new Date().toISOString() };
    await updateDoc(ref, updates);
    setProfile(prev => (prev ? { ...prev, ...updates } : null));
  };

  return {
    profile,
    loading,
    updateTokens,
    updateProfile,
    ensureProfile: fetchProfile,
    refetch: fetchProfile,
  };
};