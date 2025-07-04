import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X
} from "lucide-react";
import { formatDistance } from "date-fns";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  category: 'campaign' | 'lead' | 'system' | 'integration' | 'performance';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      category: 'campaign',
      title: 'Campaign Performance Update',
      message: 'Your "Enterprise SaaS Outreach" campaign has achieved 45% open rate - 15% above target!',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      actionUrl: '/campaigns/1',
      metadata: { campaignId: 1, openRate: 45 }
    },
    {
      id: '2',
      type: 'info',
      category: 'lead',
      title: 'New High-Quality Lead',
      message: 'Sarah Johnson from TechCorp Solutions has been scored as Grade A (92 points)',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      actionUrl: '/lead-scoring',
      metadata: { leadId: 1, score: 92 }
    },
    {
      id: '3',
      type: 'warning',
      category: 'integration',
      title: 'LinkedIn Integration Issue',
      message: 'Your LinkedIn integration needs to be re-authorized. Some automation may be affected.',
      timestamp: '2024-01-15T08:45:00Z',
      isRead: false,
      actionUrl: '/integrations',
      metadata: { integration: 'linkedin' }
    }
  ];

  const { data: notificationsData = mockNotifications } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      return mockNotifications;
    },
    refetchInterval: 30000
  });

  useEffect(() => {
    setNotifications(notificationsData);
  }, [notificationsData]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  if (!isOpen) {
    return (
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsOpen(true)}
          className="relative"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] mx-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2">{unreadCount} new</Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.isRead 
                      ? 'bg-white border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex items-center space-x-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            {formatDistance(new Date(notification.timestamp), new Date(), { addSuffix: true })}
                          </p>
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">You're all caught up!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}