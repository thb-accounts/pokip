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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Bruh. Why are you in the desert now? Go back home. You don't need to go here bruv, there is absolutely nothing here...</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home. Now.
        </a>
      </div>
    </div>
  );
};

export default NotFound;
