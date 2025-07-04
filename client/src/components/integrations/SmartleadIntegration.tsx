import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { CheckCircle, XCircle, Loader2, RefreshCw, Download, Users, BarChart } from "lucide-react";

export function SmartleadIntegration() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check Smartlead connection status
  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/smartlead/status"],
    queryFn: async () => {
      const response = await fetch("/api/smartlead/status");
      return await response.json();
    },
  });

  // Get analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/smartlead/analytics"],
    queryFn: async () => {
      const response = await fetch("/api/smartlead/analytics");
      return await response.json();
    },
    enabled: status?.connected,
  });

  // Initialize Smartlead API
  const initializeMutation = useMutation({
    mutationFn: async (apiKey: string) => {
      const response = await fetch("/api/smartlead/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to connect to Smartlead API");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Smartlead API connected successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/smartlead/status"] });
      setApiKey("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to connect to Smartlead API",
        variant: "destructive"
      });
    }
  });

  // Sync campaigns
  const syncCampaignsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/smartlead/sync-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sync campaigns");
      }
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Success",
        description: `${data.count || 0} campaigns synced successfully!`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/smartlead/analytics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sync campaigns",
        variant: "destructive"
      });
    }
  });

  const handleInitialize = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Smartlead API key",
        variant: "destructive"
      });
      return;
    }
    initializeMutation.mutate(apiKey.trim());
  };

  const handleSyncCampaigns = () => {
    syncCampaignsMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <img 
                src="https://smartlead.ai/favicon.ico" 
                alt="Smartlead" 
                className="w-6 h-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              Smartlead Integration
            </CardTitle>
            {statusLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Badge variant={status?.connected ? "default" : "secondary"}>
                {status?.connected ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {status?.connected ? "Connected" : "Not Connected"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {!status?.connected ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Connect your Smartlead account to sync campaigns, leads, and analytics data.
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="apiKey">Smartlead API Key</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter your Smartlead API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? "Hide" : "Show"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Get your API key from Smartlead Settings → API section
                  </p>
                </div>
                <Button 
                  onClick={handleInitialize}
                  disabled={initializeMutation.isPending}
                >
                  {initializeMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Connect to Smartlead
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Successfully connected to Smartlead API
              </p>
              
              {/* Analytics Summary */}
              {analyticsLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading analytics...
                </div>
              ) : analytics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analytics.totalCampaigns}</div>
                    <div className="text-xs text-gray-600">Total Campaigns</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analytics.activeCampaigns}</div>
                    <div className="text-xs text-gray-600">Active Campaigns</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{analytics.totalLeads}</div>
                    <div className="text-xs text-gray-600">Total Leads</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{analytics.avgReplyRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Avg Reply Rate</div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Actions */}
      {status?.connected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Synchronization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleSyncCampaigns}
                disabled={syncCampaignsMutation.isPending}
                className="flex items-center gap-2"
              >
                {syncCampaignsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Sync Campaigns
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/smartlead/analytics"] })}
              >
                <BarChart className="h-4 w-4" />
                Refresh Analytics
              </Button>
            </div>
            
            <Separator />
            
            <div className="text-sm space-y-2">
              <h4 className="font-medium">Sync Information:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Campaigns are synced with their current status and settings</li>
                <li>• Lead data includes contact information and engagement metrics</li>
                <li>• Analytics show real-time performance data from Smartlead</li>
                <li>• Data is updated automatically when campaigns are modified</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}