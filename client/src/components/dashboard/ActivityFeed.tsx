import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Send, Calendar, Brain, Activity, Mail, Phone, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export function ActivityFeed() {
  const { user } = useAuth();
  
  // Fetch actual activities
  const { data: activities = [], isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/activities`],
    enabled: !!user?.id,
  });

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, { icon: any; color: string }> = {
      response_received: { icon: Check, color: "bg-green-100 text-green-600" },
      sequence_sent: { icon: Send, color: "bg-blue-100 text-blue-600" },
      meeting_scheduled: { icon: Calendar, color: "bg-purple-100 text-purple-600" },
      ai_optimization: { icon: Brain, color: "bg-orange-100 text-orange-600" },
      note: { icon: MessageSquare, color: "bg-gray-100 text-gray-600" },
      call: { icon: Phone, color: "bg-green-100 text-green-600" },
      email: { icon: Mail, color: "bg-blue-100 text-blue-600" },
      meeting: { icon: Calendar, color: "bg-purple-100 text-purple-600" },
      task: { icon: Activity, color: "bg-yellow-100 text-yellow-600" },
    };
    return iconMap[type] || { icon: Activity, color: "bg-gray-100 text-gray-600" };
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => window.location.href = '/activities'}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No activities yet</p>
            <p className="text-xs mt-1">Activities will appear here as you use the platform</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 10).map((activity: any) => {
              const { icon: Icon, color } = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
