import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Clock, Target, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultInsights = [
  {
    id: 1,
    icon: Lightbulb,
    title: "Best Performing Subject Line",
    description: "\"Quick question about [Company]'s growth strategy\" has 31% higher open rates",
    color: "from-blue-50 to-purple-50 border-blue-100",
    iconColor: "bg-blue-100 text-blue-600",
    actionable: true
  },
  {
    id: 2,
    icon: Clock,
    title: "Optimal Send Time",
    description: "Tuesday 10:00 AM shows 43% better response rates for your ICP",
    color: "from-green-50 to-emerald-50 border-green-100",
    iconColor: "bg-green-100 text-green-600",
    actionable: true
  },
  {
    id: 3,
    icon: Target,
    title: "Lead Quality Score",
    description: "Mid-market SaaS companies (100-500 employees) convert 2.3x better",
    color: "from-orange-50 to-amber-50 border-orange-100",
    iconColor: "bg-orange-100 text-orange-600",
    actionable: false
  }
];

export function InsightsPanel() {
  const { toast } = useToast();
  const [insights, setInsights] = useState(defaultInsights);
  const [appliedInsights, setAppliedInsights] = useState<number[]>([]);

  const applyInsight = (insightId: number) => {
    setAppliedInsights([...appliedInsights, insightId]);
    toast({
      title: "Insight Applied",
      description: "Your campaigns will now use this optimization",
    });
  };

  const dismissInsight = (insightId: number) => {
    setInsights(insights.filter(i => i.id !== insightId));
    toast({
      title: "Insight Dismissed",
      description: "You can always find more insights in Analytics",
    });
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI Insights</CardTitle>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => {
            const isApplied = appliedInsights.includes(insight.id);
            return (
              <div key={insight.id} className={`p-4 bg-gradient-to-br ${insight.color} rounded-lg border relative`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${insight.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <insight.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    {insight.actionable && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant={isApplied ? "secondary" : "default"}
                          className={isApplied ? "bg-green-100 text-green-700" : ""}
                          onClick={() => applyInsight(insight.id)}
                          disabled={isApplied}
                        >
                          {isApplied ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Applied
                            </>
                          ) : (
                            "Apply"
                          )}
                        </Button>
                        {!isApplied && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissInsight(insight.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {insights.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">All insights have been reviewed</p>
            <p className="text-xs mt-1">Check back later for new recommendations</p>
          </div>
        )}

        <Button 
          className="w-full mt-4 sparq-gradient hover:sparq-gradient-hover text-white"
          onClick={() => window.location.href = '/analytics'}
        >
          View All Insights
        </Button>
      </CardContent>
    </Card>
  );
}
