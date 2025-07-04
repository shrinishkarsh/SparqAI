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
import Landing from "@/pages/Landing";
import Help from "@/pages/Help";
import { Templates } from "@/pages/Templates";
import { LeadScoring } from "@/pages/LeadScoring";
import { SequenceBuilder } from "@/pages/SequenceBuilder";
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
  
  // Redirect to Replit Auth if not authenticated
  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
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
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/sequences" component={Sequences} />
          <Route path="/sequence-builder" component={SequenceBuilder} />
          <Route path="/templates" component={Templates} />
          <Route path="/lead-scoring" component={LeadScoring} />
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
