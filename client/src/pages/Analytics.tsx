import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Mail, 
  MousePointer,
  Calendar,
  Target,
  Zap,
  DollarSign,
  MessageSquare,
  Eye,
  Clock
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "@/lib/api";

const currentUser = { id: 1, email: "alex@company.com", firstName: "Alex", lastName: "Johnson" };

// Animation hook for counting numbers
const useCountAnimation = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * easeOut));
      
      if (progress >= 1) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

// Sample data for charts
const campaignPerformanceData = [
  { month: 'Jan', sent: 1200, opened: 720, clicked: 144, replied: 48 },
  { month: 'Feb', sent: 1500, opened: 900, clicked: 180, replied: 60 },
  { month: 'Mar', sent: 1800, opened: 1080, clicked: 216, replied: 72 },
  { month: 'Apr', sent: 2200, opened: 1320, clicked: 264, replied: 88 },
  { month: 'May', sent: 2800, opened: 1680, clicked: 336, replied: 112 },
  { month: 'Jun', sent: 3200, opened: 1920, clicked: 384, replied: 128 },
];

const conversionFunnelData = [
  { stage: 'Leads Generated', count: 3200, percentage: 100 },
  { stage: 'Emails Sent', count: 2800, percentage: 87.5 },
  { stage: 'Emails Opened', count: 1680, percentage: 52.5 },
  { stage: 'Links Clicked', count: 336, percentage: 10.5 },
  { stage: 'Responses', count: 128, percentage: 4.0 },
  { stage: 'Meetings', count: 32, percentage: 1.0 },
];

const channelPerformanceData = [
  { name: 'Email', value: 65, color: '#3B82F6' },
  { name: 'LinkedIn', value: 25, color: '#10B981' },
  { name: 'CRM', value: 10, color: '#8B5CF6' },
];

const recentActivityData = [
  { time: '2 hours ago', activity: 'Email campaign "Q4 Outreach" completed', type: 'success' },
  { time: '4 hours ago', activity: 'New lead responded to LinkedIn campaign', type: 'info' },
  { time: '6 hours ago', activity: 'Email sequence paused due to low open rate', type: 'warning' },
  { time: '1 day ago', activity: '45 new contacts imported from CRM', type: 'info' },
  { time: '2 days ago', activity: 'Meeting scheduled with high-value prospect', type: 'success' },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch real data
  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/dashboard/stats', currentUser.id],
    queryFn: () => api.getDashboardStats(currentUser.id),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['/api/campaigns', currentUser.id],
    queryFn: () => api.getCampaignsByUserId(currentUser.id),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts', currentUser.id],
    queryFn: () => api.getContactsByUserId(currentUser.id),
  });

  // Animated counters
  const totalLeadsCount = useCountAnimation(dashboardStats?.totalLeads || 0);
  const activeCampaignsCount = useCountAnimation(dashboardStats?.activeCampaigns || 0);
  const responseRateCount = useCountAnimation(dashboardStats?.responseRate || 0, 1500);
  const openRateCount = useCountAnimation(dashboardStats?.openRate || 0, 1500);

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-gray-600">Track your campaign performance and optimize your outreach</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{totalLeadsCount.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <Target className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeCampaignsCount}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2 new this week
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{responseRateCount}%</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.4% improvement
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                  <Eye className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{openRateCount}%</div>
                  <div className="flex items-center text-xs text-red-600 mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -1.2% vs last month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Over Time</CardTitle>
                <CardDescription>Track your outreach effectiveness month by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={campaignPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="opened" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="clicked" stackId="3" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} />
                    <Area type="monotone" dataKey="replied" stackId="4" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.7} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Funnel and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>See how leads progress through your sales process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {conversionFunnelData.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                          <Badge variant="secondary">{stage.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress 
                        value={stage.percentage} 
                        className="h-2"
                        style={{
                          transition: 'all 1s ease-in-out',
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivityData.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          item.type === 'success' ? 'bg-green-500' :
                          item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{item.activity}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Breakdown</CardTitle>
                <CardDescription>Detailed metrics for each of your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={campaignPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="sent" fill="#3B82F6" name="Sent" />
                    <Bar dataKey="opened" fill="#10B981" name="Opened" />
                    <Bar dataKey="clicked" fill="#8B5CF6" name="Clicked" />
                    <Bar dataKey="replied" fill="#F59E0B" name="Replied" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.slice(0, 3).map((campaign, index) => (
                <Card key={campaign.id} className="transition-all duration-300 hover:shadow-md animate-slideUp" style={{ animationDelay: `${index * 150}ms` }}>
                  <CardHeader>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Emails Sent</span>
                        <span className="font-medium">{campaign.emailsSent || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Responses</span>
                        <span className="font-medium">{campaign.responses || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Meetings</span>
                        <span className="font-medium">{campaign.meetings || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Distribution</CardTitle>
                  <CardDescription>Performance breakdown by communication channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={channelPerformanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {channelPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-6 mt-4">
                    {channelPerformanceData.map((channel, index) => (
                      <div key={channel.name} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: channel.color }} />
                        <span className="text-sm">{channel.name}: {channel.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance Metrics</CardTitle>
                  <CardDescription>Compare effectiveness across channels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Email</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">65%</div>
                        <div className="text-xs text-gray-500">2,080 sent</div>
                      </div>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <span className="font-medium">LinkedIn</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">25%</div>
                        <div className="text-xs text-gray-500">800 connections</div>
                      </div>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MousePointer className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">CRM</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">10%</div>
                        <div className="text-xs text-gray-500">320 contacts</div>
                      </div>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    AI-Powered Insights
                  </CardTitle>
                  <CardDescription>Recommendations to improve your campaign performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Optimize Send Times</h4>
                    <p className="text-sm text-blue-700">Your emails perform 23% better when sent on Tuesday mornings between 9-11 AM.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Subject Line Performance</h4>
                    <p className="text-sm text-green-700">Subject lines with questions have a 15% higher open rate in your campaigns.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-2">Follow-up Timing</h4>
                    <p className="text-sm text-purple-700">Adding a 3-day follow-up sequence increases response rates by 31%.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Key metrics trending over the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={campaignPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="opened" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={2000}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="replied" 
                        stroke="#F59E0B" 
                        strokeWidth={3}
                        dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={2000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}