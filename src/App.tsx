import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import HowItWorks from "./pages/HowItWorks";
import ShopComingSoon from "./pages/ShopComingSoon";
import Dashboard from "./pages/Index";
import FirebaseAuth from "./pages/FirebaseAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route
            path="/shop"
            element={
              <ShopComingSoon
                title="The POKIP Shop is opening soon"
                body="Merchant items will appear here as merchants list them. Create an account so you're ready to redeem when it launches."
              />
            }
          />
          <Route
            path="/merchants"
            element={
              <ShopComingSoon
                title="Merchant storefronts"
                body="Every participating merchant will have a public storefront here. Coming with the next phase."
              />
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<FirebaseAuth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
