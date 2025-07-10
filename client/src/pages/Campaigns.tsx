import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Play, Pause, CheckCircle, Circle, Download, Workflow } from "lucide-react";
import { api } from "@/lib/api";
import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal";
import { SequencesPanel } from "@/components/sequences/SequencesPanel";
import { useAuth } from "@/hooks/useAuth";

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const { user } = useAuth();
  
  const { data: campaigns, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/campaigns`],
    enabled: !!user?.id,
  });

  // Fetch real Smartlead campaigns
  const { data: smartleadCampaigns, isLoading: smartleadLoading } = useQuery({
    queryKey: ["/api/smartlead/campaigns"],
    queryFn: async () => {
      const response = await fetch("/api/smartlead/campaigns");
      if (!response.ok) throw new Error("Failed to fetch Smartlead campaigns");
      return await response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4 text-green-600" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'launching':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeCampaigns = campaigns?.filter((c: any) => c.status === 'active').length || 0;
  const pausedCampaigns = campaigns?.filter((c: any) => c.status === 'paused').length || 0;
  const completedCampaigns = campaigns?.filter((c: any) => c.status === 'completed').length || 0;

  return (
    <div className="flex-1">
      <Header
        title="Campaigns & Sequences"
        subtitle="Manage your AI-powered outreach campaigns and email sequences"
      >
        <div className="flex items-center space-x-3">
          {activeTab === "campaigns" && (
            <CreateCampaignModal>
              <Button className="sparq-gradient hover:sparq-gradient-hover text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </CreateCampaignModal>
          )}
          {activeTab === "sequences" && (
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          )}
        </div>
      </Header>

      <main className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="sequences">
              <Workflow className="h-4 w-4 mr-2" />
              Sequences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                      <p className="text-2xl font-bold text-gray-900">{campaigns?.length || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Play className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-green-600">{activeCampaigns}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Play className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paused</p>
                      <p className="text-2xl font-bold text-orange-600">{pausedCampaigns}</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Pause className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-600">{completedCampaigns}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Smartlead Campaigns */}
            {smartleadCampaigns && smartleadCampaigns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Live Smartlead Campaigns</span>
                    <Badge variant="secondary">Connected</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {smartleadCampaigns.slice(0, 3).map((campaign: any) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-gray-600">
                            ID: {campaign.id} • Created: {new Date(campaign.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge 
                            className={
                              campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              campaign.status === 'PAUSED' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {campaign.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Campaigns Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Campaigns</CardTitle>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search campaigns..."
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Target Audience</TableHead>
                      <TableHead>Response Rate</TableHead>
                      <TableHead>Meetings</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns?.map((campaign: any) => (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(campaign.status)}
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {campaign.targetAudience || 'Not specified'}
                        </TableCell>
                        <TableCell>
                          {campaign.stats?.responseRate ? 
                            `${campaign.stats.responseRate}%` : 
                            '0%'
                          }
                        </TableCell>
                        <TableCell>{campaign.stats?.meetings || 0}</TableCell>
                        <TableCell className="text-gray-500">
                          {new Date(campaign.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              Pause
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sequences" className="space-y-6">
            <SequencesPanel userId={1} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}