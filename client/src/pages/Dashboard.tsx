import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { CampaignChart } from "@/components/charts/CampaignChart";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ActiveCampaigns } from "@/components/dashboard/ActiveCampaigns";
import { QuickActivityForm } from "@/components/dashboard/QuickActivityForm";
import { QuickContactForm } from "@/components/dashboard/QuickContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, Target, Calendar, ArrowUp } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: [`/api/dashboard/stats/${user?.id}`],
    queryFn: () => api.getDashboardStats(user?.id || ''),
    enabled: !!user?.id,
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
      />

      <main className="flex-1 p-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Leads Generated"
            value={stats?.totalLeads?.toLocaleString() || "0"}
            change={stats?.isSmartleadData ? "Live from Smartlead" : "+18.2% from last month"}
            changeType={stats?.isSmartleadData ? "neutral" : "positive"}
            icon={Users}
            iconColor="bg-blue-100 text-blue-600"
          />
          <MetricsCard
            title="Response Rate"
            value={`${stats?.responseRate || 0}%`}
            change={stats?.isSmartleadData ? "Live from Smartlead" : "+3.1% from last week"}
            changeType={stats?.isSmartleadData ? "neutral" : "positive"}
            icon={MessageSquare}
            iconColor="bg-green-100 text-green-600"
          />
          <MetricsCard
            title="Active Campaigns"
            value={stats?.activeCampaigns || 0}
            change={stats?.isSmartleadData ? "Live from Smartlead" : "3 launching today"}
            changeType="neutral"
            icon={Target}
            iconColor="bg-blue-100 text-blue-600"
          />
          <MetricsCard
            title="Meetings Booked"
            value={stats?.meetingsBooked || 0}
            change={stats?.isSmartleadData ? "Live from Smartlead" : "12 this week"}
            changeType="neutral"
            icon={Calendar}
            iconColor="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Additional Smartlead Metrics */}
        {stats?.isSmartleadData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Open Rate"
              value={`${stats?.openRate || 0}%`}
              change="From all campaigns"
              changeType="neutral"
              icon={MessageSquare}
              iconColor="bg-orange-100 text-orange-600"
            />
            <MetricsCard
              title="Click Rate"
              value={`${stats?.clickRate || 0}%`}
              change="From all campaigns"
              changeType="neutral"
              icon={MessageSquare}
              iconColor="bg-purple-100 text-purple-600"
            />
            <MetricsCard
              title="Total Sent"
              value={stats?.totalSent?.toLocaleString() || "0"}
              change="All campaigns"
              changeType="neutral"
              icon={Target}
              iconColor="bg-green-100 text-green-600"
            />
            <MetricsCard
              title="Total Replies"
              value={stats?.totalReplies?.toLocaleString() || "0"}
              change="All campaigns"
              changeType="neutral"
              icon={MessageSquare}
              iconColor="bg-blue-100 text-blue-600"
            />
          </div>
        )}

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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <QuickActivityForm />
          <QuickContactForm />
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


    </div>
  );
}
