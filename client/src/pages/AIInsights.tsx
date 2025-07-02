import { Header } from "@/components/layout/Header";
import { AIInsightsPanel } from "@/components/insights/AIInsightsPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Download, RefreshCw, TrendingUp, TrendingDown, Mail, MessageSquare, Users, Target, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const performanceData = [
  { date: '2025-01-01', sent: 45, opened: 28, replied: 12, meetings: 4 },
  { date: '2025-01-02', sent: 52, opened: 35, replied: 15, meetings: 6 },
  { date: '2025-01-03', sent: 48, opened: 31, replied: 18, meetings: 8 },
  { date: '2025-01-04', sent: 55, opened: 42, replied: 20, meetings: 7 },
  { date: '2025-01-05', sent: 60, opened: 45, replied: 22, meetings: 9 },
  { date: '2025-01-06', sent: 58, opened: 48, replied: 25, meetings: 11 },
  { date: '2025-01-07', sent: 62, opened: 52, replied: 28, meetings: 13 }
];

const channelData = [
  { name: 'Email', value: 65, color: '#3b82f6' },
  { name: 'LinkedIn', value: 25, color: '#10b981' },
  { name: 'Phone', value: 10, color: '#f59e0b' }
];

const industryData = [
  { industry: 'SaaS', responses: 45, meetings: 12 },
  { industry: 'Fintech', responses: 32, meetings: 8 },
  { industry: 'Healthcare', responses: 28, meetings: 6 },
  { industry: 'E-commerce', responses: 22, meetings: 4 },
  { industry: 'Manufacturing', responses: 18, meetings: 3 }
];

export default function AIInsights() {
  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/dashboard/stats/1'],
    refetchInterval: 30000,
  });

  return (
    <div className="flex-1">
      <Header
        title="Analytics & AI Insights"
        subtitle="Comprehensive performance analytics and AI-powered optimization recommendations"
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Outreach</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    +12.5% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14.2%</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    +2.1% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Meetings Booked</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">58</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    +18.3% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.6%</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    +0.8% from last month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Daily outreach and response metrics over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} name="Sent" />
                    <Line type="monotone" dataKey="opened" stroke="#10b981" strokeWidth={2} name="Opened" />
                    <Line type="monotone" dataKey="replied" stroke="#f59e0b" strokeWidth={2} name="Replied" />
                    <Line type="monotone" dataKey="meetings" stroke="#ef4444" strokeWidth={2} name="Meetings" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Channel Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Distribution</CardTitle>
                  <CardDescription>Outreach distribution by channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industry Performance</CardTitle>
                  <CardDescription>Response rates by target industry</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={industryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="industry" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="responses" fill="#3b82f6" name="Responses" />
                      <Bar dataKey="meetings" fill="#10b981" name="Meetings" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Detailed performance metrics for all active campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Enterprise SaaS Outreach</h3>
                        <p className="text-sm text-muted-foreground">Active • 156 contacts</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-semibold">156</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opened</p>
                        <p className="font-semibold">89 (57%)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Replied</p>
                        <p className="font-semibold">23 (15%)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Meetings</p>
                        <p className="font-semibold">8 (5%)</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Mid-Market Sales Leaders</h3>
                        <p className="text-sm text-muted-foreground">Active • 89 contacts</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-semibold">89</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opened</p>
                        <p className="font-semibold">52 (58%)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Replied</p>
                        <p className="font-semibold">12 (13%)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Meetings</p>
                        <p className="font-semibold">4 (4%)</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Performing Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Messages</CardTitle>
                <CardDescription>Top message templates by response rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">Email Template</Badge>
                      <span className="text-sm font-semibold text-green-600">18.5% response rate</span>
                    </div>
                    <p className="text-sm">"Hi {firstName}, I noticed {company} has been scaling rapidly. Many companies at your stage struggle with consistent lead generation..."</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">LinkedIn Message</Badge>
                      <span className="text-sm font-semibold text-green-600">15.2% response rate</span>
                    </div>
                    <p className="text-sm">"Quick question about {company} - what's your biggest challenge with lead generation right now?"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AIInsightsPanel userId={1} />
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            {/* Optimization Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                  Optimization Recommendations
                </CardTitle>
                <CardDescription>AI-powered suggestions to improve your outreach performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="default" className="bg-green-600">High Impact</Badge>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Optimize Send Times</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your emails sent between 9-11 AM have 23% higher open rates. Consider scheduling more campaigns during this window.
                    </p>
                    <Button size="sm" variant="outline">Apply Recommendation</Button>
                  </div>

                  <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">Medium Impact</Badge>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Personalize Subject Lines</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Subject lines mentioning the prospect's company name have 31% higher open rates in your campaigns.
                    </p>
                    <Button size="sm" variant="outline">Apply Recommendation</Button>
                  </div>

                  <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-950">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">Low Impact</Badge>
                      <TrendingDown className="h-4 w-4 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Follow-up Timing</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Consider reducing follow-up intervals from 5 days to 3 days for better engagement.
                    </p>
                    <Button size="sm" variant="outline">Apply Recommendation</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A/B Test Results */}
            <Card>
              <CardHeader>
                <CardTitle>A/B Test Results</CardTitle>
                <CardDescription>Current testing results and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Subject Line Test</h3>
                        <p className="text-sm text-muted-foreground">Testing personalized vs generic subject lines</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded">
                        <p className="text-sm font-medium">Variant A (Personalized)</p>
                        <p className="text-2xl font-bold text-green-600">24.3%</p>
                        <p className="text-xs text-muted-foreground">Open Rate</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-950 rounded">
                        <p className="text-sm font-medium">Variant B (Generic)</p>
                        <p className="text-2xl font-bold">18.7%</p>
                        <p className="text-xs text-muted-foreground">Open Rate</p>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <Badge variant="secondary">Personalized wins by 5.6%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}