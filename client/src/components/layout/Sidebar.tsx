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
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

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
  const { user, logout } = useAuth();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 relative">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <linearGradient id="sparqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="8" fill="url(#sparqGradient)" />
              
              {/* S letter with spark/lightning effect */}
              <path
                d="M24 12 C28 12, 30 14, 30 17 C30 19, 28 20, 26 20 L22 20 C20 20, 18 21, 18 23 C18 26, 20 28, 24 28 L28 28"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Lightning bolt accent */}
              <path
                d="M15 10 L12 16 L15 16 L12 20 L18 14 L15 14 L18 10 Z"
                fill="white"
                opacity="0.9"
              />
              
              {/* Spark dots */}
              <circle cx="32" cy="12" r="1" fill="white" opacity="0.8" />
              <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.7" />
              <circle cx="8" cy="25" r="1" fill="white" opacity="0.6" />
            </svg>
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">SparqAI</span>
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Pro
          </span>
        </div>
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
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              {user?.lastName?.charAt(0) || ''}
            </span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.username || 'User'
              }
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
