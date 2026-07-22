import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
export default function Dashboard({
  merchant = false,
  admin = false,
}: {
  merchant?: boolean;
  admin?: boolean;
}) {
  const { profile, logout } = useAuth();
  const title = admin
    ? "Admin console"
    : merchant
      ? "Merchant dashboard"
      : "Your POKIP dashboard";
  const links = admin
    ? [
        ["Users", "/admin/users"],
        ["Merchants", "/admin/merchants"],
        ["Categories", "/admin/categories"],
        ["Transactions", "/admin/transactions"],
        ["Redemptions", "/admin/redemptions"],
        ["Settings", "/admin/settings"],
      ]
    : merchant
      ? [
          ["Shop items", "/merchant/dashboard/items"],
          ["Customers", "/merchant/dashboard/customers"],
          ["Award points", "/merchant/dashboard/points"],
          ["Redemptions", "/merchant/dashboard/redemptions"],
          ["Storefront", "/merchant/dashboard/storefront"],
          ["Settings", "/merchant/dashboard/settings"],
        ]
      : [
          ["Activity", "/dashboard/activity"],
          ["Rewards", "/dashboard/rewards"],
          ["Account", "/dashboard/account"],
        ];
  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="font-bold text-pokip-blue-deep">
            POKIP
          </Link>
          <Button variant="ghost" onClick={() => logout()}>
            Sign out
          </Button>
        </div>
      </header>
      <section className="container mx-auto px-4 py-10">
        <p className="text-muted-foreground">
          {profile?.displayName || profile?.email}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{title}</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(([label, to]) => (
            <Link key={to} to={to}>
              <Card className="h-full transition hover:shadow-card">
                <CardContent className="p-6">
                  <h2 className="font-semibold">{label}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Manage your POKIP {label.toLowerCase()}.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="font-semibold">Live activity</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your real balances, transactions, and redemptions will appear here
              as activity is recorded.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
