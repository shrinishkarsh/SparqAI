import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight, Zap, Target, BarChart3 } from "lucide-react";

export default function LoginPortal() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding and Features */}
        <div className="space-y-8">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-blue-600">
                  <defs>
                    <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                  <circle cx="20" cy="20" r="18" fill="url(#sparkGradient)" opacity="0.1" />
                  <path
                    d="M20 5L22.5 12.5L30 10L25 17.5L32.5 20L25 22.5L30 30L22.5 25L20 32.5L17.5 25L10 30L15 22.5L7.5 20L15 17.5L10 10L17.5 12.5L20 5Z"
                    fill="url(#sparkGradient)"
                    opacity="0.9"
                  />
                  <circle cx="32" cy="12" r="1" fill="white" opacity="0.8" />
                  <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.7" />
                  <circle cx="8" cy="25" r="1" fill="white" opacity="0.6" />
                </svg>
              </div>
              <span className="ml-3 text-3xl font-bold text-gray-900">SparqAI</span>
              <Sparkles className="h-6 w-6 text-blue-600 ml-2" />
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your AI-Powered
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Sales Development
                </span>
                Platform
              </h1>
              <p className="text-xl text-gray-600">
                Automate lead generation, enrich prospects, and scale your outreach with intelligent AI insights
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Automated multi-channel outreach campaigns</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-gray-700">AI-powered lead scoring and prioritization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">Real-time analytics and performance insights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome to SparqAI
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Sign in with your Replit account to get started
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleLogin}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Continue with Replit</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  New to SparqAI? Your account will be created automatically
                </p>
              </div>

              {/* Benefits */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">What you'll get:</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    5-step personalized onboarding
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                    AI-powered campaign builder
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    Advanced analytics dashboard
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}