import { Header } from "@/components/layout/Header";
import { IntegrationsPanel } from "@/components/integrations/IntegrationsPanel";
import { Button } from "@/components/ui/button";
import { Settings, Plus, RefreshCw } from "lucide-react";

export default function Integrations() {
  return (
    <div className="flex-1">
      <Header
        title="Integrations"
        subtitle="Connect and manage your LinkedIn, Email, and CRM integrations"
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Test All Connections
          </Button>
          <Button className="sparq-gradient hover:sparq-gradient-hover text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </Header>

      <main className="flex-1 p-6">
        <IntegrationsPanel userId={1} />
      </main>
    </div>
  );
}