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
import Shop from "./pages/Shop";
import MerchantOnboarding from "./pages/MerchantOnboarding";
import { MerchantLayout } from "./components/merchant/MerchantLayout";
import MerchantHome from "./pages/merchant/MerchantHome";
import MerchantItems from "./pages/merchant/MerchantItems";
import MerchantPoints from "./pages/merchant/MerchantPoints";
import MerchantRedemptions from "./pages/merchant/MerchantRedemptions";
import MerchantSettings from "./pages/merchant/MerchantSettings";
import { RequireAuth } from "./components/guards/RequireAuth";
import { RequireRole } from "./components/guards/RequireRole";

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
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/merchants"
            element={
              <ShopComingSoon
                title="Merchant storefronts"
                body="Every participating merchant will have a public storefront here. Coming with the next phase."
              />
            }
          />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/auth" element={<FirebaseAuth />} />
          <Route
            path="/merchant/onboarding"
            element={<RequireAuth><MerchantOnboarding /></RequireAuth>}
          />
          <Route
            path="/merchant/dashboard"
            element={<RequireRole role="merchant"><MerchantLayout /></RequireRole>}
          >
            <Route index element={<MerchantHome />} />
            <Route path="items" element={<MerchantItems />} />
            <Route path="points" element={<MerchantPoints />} />
            <Route path="redemptions" element={<MerchantRedemptions />} />
            <Route path="settings" element={<MerchantSettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
