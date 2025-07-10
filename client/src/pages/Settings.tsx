import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, CreditCard, Sparkles, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and configuration</p>
        </div>

        <div className="space-y-6">{/* Account Settings Section */}

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={user?.email || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user ? `${user.firstName || ''} ${user.lastName || ''}` : ''} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-3">API Configuration</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>OpenAI API Key</Label>
                      <div className="flex space-x-2">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          placeholder="Enter your OpenAI API key"
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Required for AI-powered features like content generation and lead enrichment
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email notifications for campaign responses</Label>
                        <p className="text-sm text-gray-600">Get notified when prospects respond to your campaigns</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS alerts for hot leads</Label>
                        <p className="text-sm text-gray-600">Receive SMS alerts for high-priority prospects</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Weekly performance reports</Label>
                        <p className="text-sm text-gray-600">Weekly summary of your campaign performance</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-3">Data & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow data collection for analytics</Label>
                        <p className="text-sm text-gray-600">Help us improve the platform with anonymous usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Share anonymized campaign insights</Label>
                        <p className="text-sm text-gray-600">Contribute to industry benchmarks (data is anonymized)</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Pro Plan</h3>
                      <p className="text-sm text-gray-600">Advanced AI features and unlimited campaigns</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">$99</div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <h4 className="font-medium">Campaigns</h4>
                      <p className="text-2xl font-bold text-blue-600">Unlimited</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <h4 className="font-medium">Contacts</h4>
                      <p className="text-2xl font-bold text-green-600">50,000</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <h4 className="font-medium">AI Credits</h4>
                      <p className="text-2xl font-bold text-purple-600">10,000</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Update Payment Method
                    </Button>
                    <Button variant="outline">View Usage</Button>
                    <Button variant="outline">Download Invoice</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Angel Zone Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Angel Zone
                </CardTitle>
                <CardDescription>
                  Special features and early access for our valued users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-purple-900">Early Access Program</h3>
                      <Badge className="bg-purple-600 text-white">BETA</Badge>
                    </div>
                    <p className="text-sm text-purple-700 mb-4">
                      Get exclusive access to new features before they're released to the public
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">AI Lead Scoring 2.0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Multi-channel Sequences</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Advanced Analytics Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">AI Voice Cloning</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <h3 className="font-medium text-purple-900 mb-2">Priority Support</h3>
                    <p className="text-sm text-purple-700 mb-3">
                      As an angel user, you get priority support with guaranteed response times
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Response Time</p>
                        <p className="text-xs text-purple-600">Under 2 hours</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-purple-600 text-purple-600 hover:bg-purple-100">
                        Contact Support
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-purple-900">Referral Program</h3>
                        <p className="text-sm text-purple-700">Earn rewards for each successful referral</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">$50</p>
                        <p className="text-xs text-purple-600">per referral</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Get Referral Link
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-red-800">Export Account Data</h4>
                      <p className="text-sm text-red-600">Download all your account data and campaign history</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-red-800">Delete Account</h4>
                      <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}