import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  ChartLine, 
  Megaphone, 
  Users, 
  BarChart3, 
  Brain, 
  Workflow,
  Linkedin,
  Mail,
  Database,
  Settings,
  HelpCircle,
  Zap,
  ChevronUp,
  Link as LinkIcon,
  LogOut,
  FileText,
  Target,
  Star
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartLine },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone, badge: "3" },
  { name: "Contacts", href: "/contacts", icon: Users, count: "2,847" },
  { name: "Integrations", href: "/integrations", icon: LinkIcon },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <img 
            src="@assets/design-a-bold-modern-tech-logo-for-sparq_14j9N13HTGSD3AzvAiwyqw_jl3gu8UgQQin7SY_z4jhiQ_1751562267235.jpeg" 
            alt="SparqAI Logo" 
            className="w-10 h-10 object-cover rounded-lg"
          />
          <span className="ml-3 text-xl font-bold text-gray-900">SparqAI</span>
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Pro
          </span>
        </div>
        <NotificationCenter />
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "sparq-accent-light text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-4 w-4",
                    isActive ? "text-blue-500" : "text-gray-400"
                  )}
                />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="ml-auto text-gray-500 text-xs">
                    {item.count}
                  </span>
                )}

              </Link>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8">
          <div className="space-y-1">
            <Link
              href="/help"
              className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            >
              <HelpCircle className="text-gray-400 mr-3 h-4 w-4" />
              Help & Support
            </Link>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.firstName?.charAt(0) || 'U'}
              {user?.lastName?.charAt(0) || ''}
            </span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : 'User'
              }
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
