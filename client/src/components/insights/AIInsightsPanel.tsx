import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock, Target, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { AiInsight } from "@/lib/types";

interface AIInsightsPanelProps {
  userId: number;
  campaignId?: number;
}

export function AIInsightsPanel({ userId, campaignId }: AIInsightsPanelProps) {
  const { data: campaigns } = useQuery({
    queryKey: ["/api/campaigns/user", userId],
    queryFn: () => api.getCampaignsByUserId(userId),
  });

  const { data: contacts } = useQuery({
    queryKey: ["/api/contacts/user", userId],
    queryFn: () => api.getContactsByUserId(userId),
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/ai-insights", userId, campaignId],
    queryFn: async () => {
      const campaignData = campaignId 
        ? campaigns?.find((c: any) => c.id === campaignId)
        : campaigns?.[0];
      
      if (!campaignData) return [];
      
      return api.getAiInsights(campaignData, contacts || []);
    },
    enabled: !!campaigns && !!contacts,
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="h-4 w-4" />;
      case 'timing':
        return <Clock className="h-4 w-4" />;
      case 'targeting':
        return <Target className="h-4 w-4" />;
      case 'content':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'optimization':
        return 'text-green-600';
      case 'timing':
        return 'text-blue-600';
      case 'targeting':
        return 'text-purple-600';
      case 'content':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  if (insightsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Analyzing campaigns...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const highImpactInsights = insights?.filter((i: AiInsight) => i.impact === 'high') || [];
  const mediumImpactInsights = insights?.filter((i: AiInsight) => i.impact === 'medium') || [];
  const lowImpactInsights = insights?.filter((i: AiInsight) => i.impact === 'low') || [];

  return (
    <div className="space-y-6">
      {/* Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            AI Insights Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{highImpactInsights.length}</p>
              <p className="text-sm text-gray-600">High Impact</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{mediumImpactInsights.length}</p>
              <p className="text-sm text-gray-600">Medium Impact</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lightbulb className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{lowImpactInsights.length}</p>
              <p className="text-sm text-gray-600">Low Impact</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Sparkles className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">AI Analysis Complete</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {insights?.length || 0} insights generated based on your campaign performance and contact engagement patterns.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights by Category */}
      <Tabs defaultValue="high" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="high" className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            High Impact
          </TabsTrigger>
          <TabsTrigger value="medium" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Medium Impact
          </TabsTrigger>
          <TabsTrigger value="low" className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-1" />
            Low Impact
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center">
            <Sparkles className="h-4 w-4 mr-1" />
            All Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="high" className="space-y-4">
          {highImpactInsights.length > 0 ? (
            highImpactInsights.map((insight: AiInsight, index: number) => (
              <InsightCard key={index} insight={insight} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No High Impact Issues Found</h3>
                <p className="text-gray-600">Your campaigns are performing well with no critical issues to address.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="medium" className="space-y-4">
          {mediumImpactInsights.length > 0 ? (
            mediumImpactInsights.map((insight: AiInsight, index: number) => (
              <InsightCard key={index} insight={insight} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No medium impact insights available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="low" className="space-y-4">
          {lowImpactInsights.length > 0 ? (
            lowImpactInsights.map((insight: AiInsight, index: number) => (
              <InsightCard key={index} insight={insight} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No low impact insights available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {insights?.length ? (
            insights.map((insight: AiInsight, index: number) => (
              <InsightCard key={index} insight={insight} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No Insights Available</h3>
                <p className="text-gray-600">Start running campaigns to get AI-powered recommendations.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface InsightCardProps {
  insight: AiInsight;
}

function InsightCard({ insight }: InsightCardProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="h-4 w-4" />;
      case 'timing':
        return <Clock className="h-4 w-4" />;
      case 'targeting':
        return <Target className="h-4 w-4" />;
      case 'content':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'optimization':
        return 'text-green-600';
      case 'timing':
        return 'text-blue-600';
      case 'targeting':
        return 'text-purple-600';
      case 'content':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${getTypeColor(insight.type)}`}>
              {getTypeIcon(insight.type)}
            </div>
            <div>
              <h3 className="font-medium">{insight.title}</h3>
              <p className="text-sm text-gray-600 capitalize">{insight.type} recommendation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getImpactColor(insight.impact)}>
              {insight.impact} impact
            </Badge>
            <div className="text-right">
              <p className="text-sm text-gray-500">Confidence</p>
              <div className="flex items-center space-x-2">
                <Progress value={insight.confidence * 100} className="w-16 h-2" />
                <span className="text-xs font-medium">{Math.round(insight.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Analysis</h4>
            <p className="text-gray-700">{insight.description}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Recommended Action</h4>
            <p className="text-gray-700">{insight.recommendation}</p>
          </div>
          <div className="flex justify-end">
            <Button size="sm" className="sparq-gradient hover:sparq-gradient-hover text-white">
              Apply Recommendation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}