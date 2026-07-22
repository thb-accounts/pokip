import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MerchantProfile, ShopListing } from "@/types/platform";
import { PublicNav } from "@/components/nav/PublicNav";
import { PublicFooter } from "@/components/nav/PublicFooter";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="container mx-auto min-h-[65vh] px-4 py-12">
        {children}
      </main>
      <PublicFooter />
    </>
  );
}
export function Merchants() {
  const [data, setData] = useState<MerchantProfile[]>([]),
    [search, setSearch] = useState("");
  useEffect(() => {
    getDocs(
      query(
        collection(db, "merchants"),
        where("status", "==", "active"),
        orderBy("businessName"),
        limit(50),
      ),
    )
      .then((s) => setData(s.docs.map((d) => d.data() as MerchantProfile)))
      .catch(() => setData([]));
  }, []);
  const items = data.filter(
    (x) =>
      x.businessName.toLowerCase().includes(search.toLowerCase()) ||
      x.categoryId.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Shell>
      <h1 className="text-3xl font-bold">Discover merchants</h1>
      <p className="mt-2 text-muted-foreground">
        Find active POKIP businesses and their rewards.
      </p>
      <Input
        className="my-7 max-w-md"
        placeholder="Search merchants or categories"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <Link key={m.id} to={"/merchant/" + m.slug}>
            <Card className="h-full hover:shadow-card">
              <CardContent className="p-5">
                <Badge>{m.categoryId}</Badge>
                <h2 className="mt-3 text-lg font-bold">{m.businessName}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {m.description}
                </p>
                <p className="mt-4 text-sm">
                  {m.onlineOnly ? "Online" : "In store"}
                  {m.location ? ` · ${m.location}` : ""}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {!items.length && (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No active merchants match your search yet.
        </p>
      )}
    </Shell>
  );
}
export function Shop() {
  const [data, setData] = useState<ShopListing[]>([]),
    [search, setSearch] = useState("");
  useEffect(() => {
    getDocs(
      query(
        collection(db, "listings"),
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(48),
      ),
    )
      .then((s) =>
        setData(s.docs.map((d) => ({ id: d.id, ...d.data() }) as ShopListing)),
      )
      .catch(() => setData([]));
  }, []);
  const items = data.filter((x) =>
    x.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Shell>
      <h1 className="text-3xl font-bold">POKIP Shop</h1>
      <p className="mt-2 text-muted-foreground">
        Explore rewards and offers from local merchants.
      </p>
      <Input
        className="my-7 max-w-md"
        placeholder="Search listings"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x) => (
          <Link key={x.id} to={"/shop/" + x.id}>
            <Card className="h-full">
              <CardContent className="p-5">
                <Badge>{x.type}</Badge>
                <h2 className="mt-3 font-bold">{x.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {x.merchantName || x.merchantSlug}
                </p>
                <p className="mt-4 font-semibold">
                  {x.pointsPrice
                    ? `${x.pointsPrice} points`
                    : x.cashPrice
                      ? `${x.currency || "USD"} ${x.cashPrice}`
                      : "View offer"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {!items.length && (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No published listings are available yet.
        </p>
      )}
    </Shell>
  );
}
export function Storefront() {
  const { slug } = useParams(),
    [m, setM] = useState<MerchantProfile | null>(null);
  useEffect(() => {
    getDocs(
      query(
        collection(db, "merchants"),
        where("slug", "==", slug),
        where("status", "==", "active"),
        limit(1),
      ),
    ).then((s) => setM(s.empty ? null : (s.docs[0].data() as MerchantProfile)));
  }, [slug]);
  return (
    <Shell>
      {m ? (
        <>
          <Badge>{m.categoryId}</Badge>
          <h1 className="mt-3 text-4xl font-bold">{m.businessName}</h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            {m.description}
          </p>
          <p className="mt-5">
            {m.onlineOnly
              ? "Online business"
              : m.location || "Physical location"}
          </p>
          {m.website && (
            <a className="mt-4 block text-pokip-blue-deep" href={m.website}>
              Visit website
            </a>
          )}
          <section className="mt-10 rounded-2xl bg-pokip-blue-soft p-6">
            <h2 className="font-bold">Earning points</h2>
            <p>
              {m.pointsRule?.pointsPerCurrencyUnit || 1} point(s) per currency
              unit.
            </p>
            {m.redemptionTerms && (
              <p className="mt-3 text-sm">{m.redemptionTerms}</p>
            )}
          </section>
        </>
      ) : (
        <p className="text-center text-muted-foreground">
          Merchant not found or unavailable.
        </p>
      )}
    </Shell>
  );
}
