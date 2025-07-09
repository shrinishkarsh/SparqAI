import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export function ActiveCampaigns() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch actual campaigns
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/campaigns`],
    enabled: !!user?.id,
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/campaigns`] });
      toast({ title: "Campaign status updated" });
    },
    onError: () => {
      toast({ 
        title: "Failed to update campaign", 
        variant: "destructive" 
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'running': return 'bg-blue-400';
      case 'paused': return 'bg-yellow-400';
      case 'draft': return 'bg-gray-400';
      default: return 'bg-orange-400 animate-pulse';
    }
  };

  const toggleCampaignStatus = (campaign: any) => {
    const newStatus = campaign.status === 'active' || campaign.status === 'running' 
      ? 'paused' 
      : 'active';
    updateCampaignMutation.mutate({ id: campaign.id, status: newStatus });
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Campaigns</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => window.location.href = '/campaigns'}
          >
            Manage All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No active campaigns yet</p>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => window.location.href = '/campaigns'}
            >
              Create your first campaign
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.slice(0, 3).map((campaign: any) => (
              <div
                key={campaign.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors duration-150"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${getStatusColor(campaign.status)} rounded-full`}></div>
                    <h4 className="text-sm font-semibold text-gray-900">{campaign.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {campaign.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCampaignStatus(campaign)}
                      disabled={updateCampaignMutation.isPending}
                    >
                      {campaign.status === 'active' || campaign.status === 'running' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{campaign.totalContacts || 0}</p>
                    <p className="text-xs text-gray-600">Contacts</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">
                      {campaign.stats?.responseRate ? `${campaign.stats.responseRate}%` : '--'}
                    </p>
                    <p className="text-xs text-gray-600">Response</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">
                      {campaign.stats?.meetings || '--'}
                    </p>
                    <p className="text-xs text-gray-600">Meetings</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
