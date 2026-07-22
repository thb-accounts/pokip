import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import HowItWorks from "./pages/HowItWorks";
import FirebaseAuth from "./pages/FirebaseAuth";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Restricted from "./pages/Restricted";
import { Merchants, Shop, Storefront } from "./pages/Marketplace";
import { AuthProvider } from "./features/auth/AuthProvider";
import { Guard } from "./features/auth/Guards";
const q = new QueryClient();
const customer = (
    <Guard roles={["customer"]}>
      <Dashboard />
    </Guard>
  ),
  merchant = (
    <Guard roles={["merchant"]}>
      <Dashboard merchant />
    </Guard>
  ),
  admin = (
    <Guard roles={["admin"]}>
      <Dashboard admin />
    </Guard>
  );
export default () => (
  <QueryClientProvider client={q}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:itemId" element={<Shop />} />
            <Route path="/merchants" element={<Merchants />} />
            <Route path="/merchant/:slug" element={<Storefront />} />
            <Route path="/auth" element={<FirebaseAuth />} />
            <Route path="/restricted" element={<Restricted />} />
            <Route
              path="/onboarding/customer"
              element={
                <Guard>
                  <Onboarding />
                </Guard>
              }
            />
            <Route
              path="/onboarding/merchant"
              element={
                <Guard>
                  <Onboarding merchant />
                </Guard>
              }
            />
            <Route path="/dashboard/*" element={customer} />
            <Route path="/merchant/dashboard/*" element={merchant} />
            <Route path="/admin/*" element={admin} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
