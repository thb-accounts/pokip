import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PokipLogo } from "@/components/brand/PokipLogo";
import { toast } from "sonner";
import type { UserRole } from "@/types/platform";
const friendly = (e: unknown) =>
  e instanceof Error
    ? e.message.replace("Firebase: ", "").replace(/\([^)]*\)/, "")
    : "Unable to continue. Please try again.";
export default function FirebaseAuth() {
  const [params] = useSearchParams(),
    nav = useNavigate(),
    [signup, setSignup] = useState(params.get("mode") === "signup"),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [role, setRole] = useState<UserRole>("customer"),
    [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (signup) {
        const c = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", c.user.uid), {
          uid: c.user.uid,
          email: c.user.email || email,
          displayName: "",
          role,
          status: "active",
          onboardingCompleted: false,
          membershipCode: `PK-${c.user.uid.slice(0, 8).toUpperCase()}`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        sendEmailVerification(c.user).catch(() => undefined);
        nav(
          role === "merchant" ? "/onboarding/merchant" : "/onboarding/customer",
        );
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        nav("/dashboard");
      }
    } catch (e) {
      toast.error(friendly(e));
    } finally {
      setBusy(false);
    }
  }
  async function reset() {
    if (!email) return toast.error("Enter your email address first.");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent.");
    } catch (e) {
      toast.error(friendly(e));
    }
  }
  return (
    <main className="min-h-screen bg-gradient-hero grid place-items-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="items-center">
          <Link to="/">
            <PokipLogo className="h-8 w-auto" />
          </Link>
          <CardTitle>
            {signup ? "Create your POKIP account" : "Welcome back"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {signup && (
              <fieldset>
                <Label>Account type</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["customer", "merchant"] as UserRole[]).map((r) => (
                    <Button
                      type="button"
                      key={r}
                      variant={role === r ? "default" : "outline"}
                      onClick={() => setRole(r)}
                      className="capitalize"
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </fieldset>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" disabled={busy}>
              {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 flex justify-between text-sm">
            <button
              onClick={() => setSignup(!signup)}
              className="text-pokip-blue-deep"
            >
              {signup
                ? "Already have an account? Sign in"
                : "Need an account? Sign up"}
            </button>
            {!signup && (
              <button onClick={reset} className="text-pokip-blue-deep">
                Forgot password?
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
