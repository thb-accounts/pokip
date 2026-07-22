import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export default function Restricted() {
  return (
    <main className="min-h-screen grid place-items-center p-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">Account restricted</h1>
        <p className="mt-3 text-muted-foreground">
          This account has been suspended. Contact POKIP support if you believe
          this is an error.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}
