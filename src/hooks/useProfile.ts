import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useFirebaseAuth } from './useFirebaseAuth';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  tokens: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useFirebaseAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() } as Profile);
      } else {
        // Create new profile
        const newProfile = {
          user_id: user.uid,
          username: user.email || null,
          tokens: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await setDoc(docRef, newProfile);
        setProfile({ id: user.uid, ...newProfile });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTokens = async (newTokenAmount: number) => {
    if (!user || !profile) return;

    try {
      const docRef = doc(db, 'profiles', user.uid);
      await updateDoc(docRef, { 
        tokens: newTokenAmount,
        updated_at: new Date().toISOString()
      });
      
      setProfile(prev => prev ? { ...prev, tokens: newTokenAmount } : null);
    } catch (error) {
      console.error('Error updating tokens:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    updateTokens,
    refetch: fetchProfile,
  };
};