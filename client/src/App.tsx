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
import NotFound from "@/pages/not-found";
import { Sidebar } from "@/components/layout/Sidebar";
import React, { useState } from "react";

function Router() {
  const [currentUser, setCurrentUser] = useState({ id: 1, email: "alex@company.com", firstName: "Alex", lastName: "Johnson", isSetupComplete: false });
  
  // Check user setup status on app load
  React.useEffect(() => {
    const checkUserSetup = async () => {
      try {
        const response = await fetch('/api/user/1');
        const userData = await response.json();
        setCurrentUser(prev => ({ ...prev, isSetupComplete: userData.isSetupComplete || false }));
      } catch (error) {
        console.error('Error checking user setup:', error);
      }
    };
    
    checkUserSetup();
  }, []);
  
  // Show onboarding if user hasn't completed setup
  if (!currentUser.isSetupComplete) {
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
          <Route path="/settings" component={Settings} />
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
