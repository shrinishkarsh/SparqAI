import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import Contacts from "@/pages/Contacts";
import Setup from "@/pages/Setup";
import AIInsights from "@/pages/AIInsights";
import Sequences from "@/pages/Sequences";
import Integrations from "@/pages/Integrations";
import NotFound from "@/pages/not-found";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";

function Router() {
  const [currentUser] = useState({ id: 1, email: "alex@company.com", firstName: "Alex", lastName: "Johnson" });
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/insights" component={AIInsights} />
          <Route path="/sequences" component={Sequences} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/setup" component={Setup} />
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
