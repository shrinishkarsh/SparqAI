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
  ChevronUp
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartLine },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone, badge: "3" },
  { name: "Contacts", href: "/contacts", icon: Users, count: "2,847" },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Insights", href: "/insights", icon: Brain, indicator: true },
  { name: "Sequences", href: "/sequences", icon: Workflow },
];

const integrations = [
  { name: "LinkedIn", icon: Linkedin, connected: true },
  { name: "Email", icon: Mail, connected: true },
  { name: "CRM", icon: Database, connected: false, status: "Setup" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 sparq-gradient rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
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
                {item.indicator && (
                  <span className="ml-auto w-2 h-2 bg-green-400 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Integration Section */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Integrations
          </h3>
          <div className="mt-2 space-y-1">
            {integrations.map((integration) => (
              <Link
                key={integration.name}
                href="#"
                className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg"
              >
                <integration.icon
                  className={cn(
                    "mr-3 h-4 w-4",
                    integration.name === "LinkedIn" ? "text-blue-600" : "text-gray-400"
                  )}
                />
                {integration.name}
                {integration.connected ? (
                  <span className="ml-auto w-2 h-2 bg-green-400 rounded-full"></span>
                ) : (
                  <span className="ml-auto text-xs text-gray-500">
                    {integration.status}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-8">
          <div className="space-y-1">
            <Link
              href="/settings"
              className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            >
              <Settings className="text-gray-400 mr-3 h-4 w-4" />
              Settings
            </Link>
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
            <span className="text-sm font-medium text-gray-700">AJ</span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Alex Johnson</p>
            <p className="text-xs text-gray-500 truncate">alex@company.com</p>
          </div>
          <button className="flex-shrink-0 text-gray-400 hover:text-gray-600">
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
