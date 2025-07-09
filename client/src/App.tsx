import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import Contacts from "@/pages/Contacts";
import Setup from "@/pages/Setup";
import Analytics from "@/pages/Analytics";
import Sequences from "@/pages/Sequences";
import Integrations from "@/pages/Integrations";
import Settings from "@/pages/Settings";
import Onboarding from "@/pages/Onboarding";
import Auth from "@/pages/Auth";
import LoginPortal from "@/pages/LoginPortal";
import Help from "@/pages/Help";
import Company from "@/pages/Company";
import Products from "@/pages/Products";

import NotFound from "@/pages/not-found";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <Auth />;
  }
  
  // Show onboarding if user hasn't completed setup
  if (user && !user.isSetupComplete) {
    return <Onboarding />;
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/company" component={Company} />
          <Route path="/products" component={Products} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/analytics" component={Analytics} />

          <Route path="/settings" component={Settings} />
          <Route path="/help" component={Help} />
          <Route path="/setup" component={Setup} />
          <Route path="/onboarding" component={Onboarding} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
