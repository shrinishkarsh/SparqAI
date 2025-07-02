import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { CampaignChart } from "@/components/charts/CampaignChart";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ActiveCampaigns } from "@/components/dashboard/ActiveCampaigns";
import { EnhancedCampaignModal } from "@/components/campaigns/EnhancedCampaignModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Users, MessageSquare, Target, Calendar, ArrowUp } from "lucide-react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats/1"],
    queryFn: () => api.getDashboardStats(1),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's your AI SDR performance overview."
      >
        <Button 
          className="sparq-gradient hover:sparq-gradient-hover text-white"
          onClick={() => setShowCreateCampaign(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </Header>

      <main className="flex-1 p-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Leads Generated"
            value={stats?.totalLeads?.toLocaleString() || "0"}
            change="+18.2% from last month"
            changeType="positive"
            icon={Users}
            iconColor="bg-blue-100 text-blue-600"
          />
          <MetricsCard
            title="Response Rate"
            value={`${stats?.responseRate || 0}%`}
            change="+3.1% from last week"
            changeType="positive"
            icon={MessageSquare}
            iconColor="bg-green-100 text-green-600"
          />
          <MetricsCard
            title="Active Campaigns"
            value={stats?.activeCampaigns || 0}
            change="3 launching today"
            changeType="neutral"
            icon={Target}
            iconColor="bg-blue-100 text-blue-600"
          />
          <MetricsCard
            title="Meetings Booked"
            value={stats?.meetingsBooked || 0}
            change="12 this week"
            changeType="neutral"
            icon={Calendar}
            iconColor="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CampaignChart />
          <InsightsPanel />
        </div>

        {/* Recent Activity & Active Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ActivityFeed />
          <ActiveCampaigns />
        </div>

        {/* Setup Progress Card */}
        <Card className="mt-6 sparq-gradient text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Complete Your Setup</h3>
                <p className="text-blue-100 mt-1">Get the most out of SparqAI by completing these steps</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">75%</div>
                <div className="text-blue-100 text-sm">Complete</div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Company Profile</span>
                  <ArrowUp className="h-4 w-4 text-green-300" />
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-full"></div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Integrations</span>
                  <ArrowUp className="h-4 w-4 text-green-300" />
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-full"></div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">First Campaign</span>
                  <ArrowUp className="h-4 w-4 text-orange-300" />
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <EnhancedCampaignModal
        open={showCreateCampaign}
        onOpenChange={setShowCreateCampaign}
        userId={1}
      />
    </div>
  );
}
