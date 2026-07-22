import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const reserved = new Set([
  "admin",
  "auth",
  "dashboard",
  "shop",
  "merchants",
  "merchant",
  "onboarding",
]);
export default function Onboarding({
  merchant = false,
}: {
  merchant?: boolean;
}) {
  const { user, profile } = useAuth(),
    nav = useNavigate(),
    [name, setName] = useState(""),
    [description, setDescription] = useState(""),
    [slug, setSlug] = useState(""),
    [category, setCategory] = useState(""),
    [online, setOnline] = useState(false),
    [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    setBusy(true);
    try {
      if (merchant) {
        const normalized = slugify(slug || name);
        if (normalized.length < 3 || reserved.has(normalized))
          throw new Error("Choose a valid, unique business URL.");
        const ref = doc(db, "merchants", user.uid);
        await setDoc(ref, {
          id: user.uid,
          ownerUid: user.uid,
          businessName: name,
          slug: normalized,
          description,
          categoryId: category || "other",
          onlineOnly: online,
          currency: "USD",
          status: "active",
          pointsRule: { pointsPerCurrencyUnit: 1 },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await updateDoc(doc(db, "users", user.uid), {
        displayName: name,
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      });
      nav(merchant ? "/merchant/dashboard" : "/dashboard");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not save onboarding.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-gradient-hero grid place-items-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>
            {merchant ? "Build your storefront" : "Complete your profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4">
            {" "}
            <div>
              <Label>{merchant ? "Business name" : "Full name"}</Label>
              <Input
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (merchant) setSlug(slugify(e.target.value));
                }}
              />
            </div>
            {merchant && (
              <>
                <div>
                  <Label>Public merchant URL</Label>
                  <Input
                    required
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    pokip.app/merchant/{slug || "your-store"}
                  </p>
                </div>
                <div>
                  <Label>Business category</Label>
                  <Input
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Coffee, Beauty, Retail"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={online}
                    onChange={(e) => setOnline(e.target.checked)}
                  />{" "}
                  Online-only business
                </label>
              </>
            )}
            <Button disabled={busy}>
              {busy ? "Saving…" : "Finish onboarding"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
