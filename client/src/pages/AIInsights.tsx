import { Header } from "@/components/layout/Header";
import { AIInsightsPanel } from "@/components/insights/AIInsightsPanel";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, RefreshCw } from "lucide-react";

export default function AIInsights() {
  return (
    <div className="flex-1">
      <Header
        title="AI Insights"
        subtitle="Get AI-powered recommendations to optimize your campaigns"
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="sparq-gradient hover:sparq-gradient-hover text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Insights
          </Button>
        </div>
      </Header>

      <main className="flex-1 p-6">
        <AIInsightsPanel userId={1} />
      </main>
    </div>
  );
}