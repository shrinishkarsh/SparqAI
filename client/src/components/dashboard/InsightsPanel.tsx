import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Clock, Target } from "lucide-react";

const insights = [
  {
    icon: Lightbulb,
    title: "Best Performing Subject Line",
    description: "\"Quick question about [Company]'s growth strategy\" has 31% higher open rates",
    color: "from-blue-50 to-purple-50 border-blue-100",
    iconColor: "bg-blue-100 text-blue-600"
  },
  {
    icon: Clock,
    title: "Optimal Send Time",
    description: "Tuesday 10:00 AM shows 43% better response rates for your ICP",
    color: "from-green-50 to-emerald-50 border-green-100",
    iconColor: "bg-green-100 text-green-600"
  },
  {
    icon: Target,
    title: "Lead Quality Score",
    description: "Mid-market SaaS companies (100-500 employees) convert 2.3x better",
    color: "from-orange-50 to-amber-50 border-orange-100",
    iconColor: "bg-orange-100 text-orange-600"
  }
];

export function InsightsPanel() {
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
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 bg-gradient-to-br ${insight.color} rounded-lg border`}>
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${insight.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <insight.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-4 sparq-gradient hover:sparq-gradient-hover text-white">
          View All Insights
        </Button>
      </CardContent>
    </Card>
  );
}
