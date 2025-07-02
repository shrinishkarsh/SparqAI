import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Send, Calendar, Brain } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const activities = [
  {
    id: 1,
    type: "response_received",
    title: "Lead response received",
    description: "Sarah Johnson from TechCorp replied to \"Enterprise Security Solutions\" campaign",
    time: new Date(Date.now() - 2 * 60 * 1000),
    icon: Check,
    iconColor: "bg-green-100 text-green-600"
  },
  {
    id: 2,
    type: "sequence_sent",
    title: "Campaign sequence sent",
    description: "Follow-up #2 sent to 47 prospects in \"Financial Services Outreach\"",
    time: new Date(Date.now() - 15 * 60 * 1000),
    icon: Send,
    iconColor: "bg-blue-100 text-blue-600"
  },
  {
    id: 3,
    type: "meeting_scheduled",
    title: "Meeting scheduled",
    description: "Demo call booked with Michael Chen from DataFlow Inc.",
    time: new Date(Date.now() - 60 * 60 * 1000),
    icon: Calendar,
    iconColor: "bg-purple-100 text-purple-600"
  },
  {
    id: 4,
    type: "ai_optimization",
    title: "AI optimization completed",
    description: "Email copy for \"Healthcare Solutions\" updated based on performance data",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: Brain,
    iconColor: "bg-orange-100 text-orange-600"
  }
];

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            >
              <div className={`w-8 h-8 ${activity.iconColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(activity.time, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
