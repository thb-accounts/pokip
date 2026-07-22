import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/types/platform";
type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
};
const C = createContext<AuthState | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [profile, setProfile] = useState<UserProfile | null>(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
    let stopProfile = () => {};
    const stop = onAuthStateChanged(auth, (u) => {
      setUser(u);
      stopProfile();
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }
      stopProfile = onSnapshot(
        doc(db, "users", u.uid),
        (snap) => {
          setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
          setLoading(false);
        },
        () => setLoading(false),
      );
    });
    return () => {
      stop();
      stopProfile();
    };
  }, []);
  return (
    <C.Provider value={{ user, profile, loading, logout: () => signOut(auth) }}>
      {children}
    </C.Provider>
  );
}
export const useAuth = () => {
  const v = useContext(C);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
};
