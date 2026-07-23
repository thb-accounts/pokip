import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="max-w-lg text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-pokip-blue">POKIP</p>
        <h1 className="mb-4 text-5xl font-bold text-pokip-ink">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          We couldn't find that page. Head back home to keep earning and redeeming your points.
        </p>
        <a href="/" className="font-semibold text-pokip-blue underline underline-offset-4 hover:text-pokip-blue-deep">
          Return to POKIP home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
