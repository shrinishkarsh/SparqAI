import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Link, Settings as SettingsIcon, Linkedin, Mail, Database, CheckCircle, AlertCircle, Eye, EyeOff, CreditCard } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const currentUser = { id: 1, email: "alex@company.com", firstName: "Alex", lastName: "Johnson" };

const INTEGRATION_TYPES = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Connect your LinkedIn account for automated outreach',
    icon: Linkedin,
    color: 'text-blue-600 bg-blue-100',
    features: ['Send connection requests', 'Send messages', 'Lead research']
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Connect your email for automated email campaigns',
    icon: Mail,
    color: 'text-green-600 bg-green-100',
    features: ['Send personalized emails', 'Track opens and clicks', 'Schedule follow-ups']
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Sync leads and activities with your CRM system',
    icon: Database,
    color: 'text-purple-600 bg-purple-100',
    features: ['Sync contacts', 'Update lead status', 'Track activities']
  }
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("integrations");
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch integrations data
  const { data: integrations = [], isLoading: integrationsLoading } = useQuery({
    queryKey: ['/api/integrations', currentUser.id],
    queryFn: () => api.getIntegrationsByUserId(currentUser.id),
  });

  const connectIntegration = useMutation({
    mutationFn: (type: string) => api.createIntegration({
      type,
      userId: currentUser.id,
      isConnected: true,
      credentials: {},
      settings: {},
    }),
    onSuccess: () => {
      toast({ title: "Integration connected successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
    },
    onError: () => {
      toast({ title: "Failed to connect integration", variant: "destructive" });
    },
  });

  const disconnectIntegration = useMutation({
    mutationFn: (id: number) => api.updateIntegration(id, { isConnected: false }),
    onSuccess: () => {
      toast({ title: "Integration disconnected successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
    },
    onError: () => {
      toast({ title: "Failed to disconnect integration", variant: "destructive" });
    },
  });

  const getIntegrationByType = (type: string) => {
    return integrations.find((integration: any) => integration.type === type);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-600">Manage your integrations and account settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Connect Your Tools</h2>
              <p className="text-gray-600 mb-6">
                Connect your favorite tools to automate your outreach campaigns
              </p>
            </div>

            {integrationsLoading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {INTEGRATION_TYPES.map((integrationType) => {
                  const Icon = integrationType.icon;
                  const existingIntegration = getIntegrationByType(integrationType.id);
                  const isConnected = existingIntegration?.isConnected;

                  return (
                    <Card key={integrationType.id} className="transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${integrationType.color}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integrationType.name}</CardTitle>
                              <CardDescription>{integrationType.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {isConnected ? (
                              <Badge variant="default" className="bg-green-100 text-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Not Connected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">Features:</h4>
                            <div className="flex flex-wrap gap-2">
                              {integrationType.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              {isConnected 
                                ? `Connected on ${new Date(existingIntegration.createdAt).toLocaleDateString()}`
                                : "Ready to connect"
                              }
                            </div>
                            {isConnected ? (
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Configure
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => disconnectIntegration.mutate(existingIntegration.id)}
                                  disabled={disconnectIntegration.isPending}
                                >
                                  {disconnectIntegration.isPending ? "Disconnecting..." : "Disconnect"}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => connectIntegration.mutate(integrationType.id)}
                                disabled={connectIntegration.isPending}
                              >
                                {connectIntegration.isPending ? "Connecting..." : "Connect"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>
                  Overview of your connected services and their health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {integrations.filter((i: any) => i.isConnected).length}
                    </div>
                    <div className="text-sm text-gray-600">Connected Services</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {integrations.filter((i: any) => i.isConnected).length > 0 ? "100%" : "0%"}
                    </div>
                    <div className="text-sm text-gray-600">Health Status</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <div className="text-sm text-gray-600">Monitoring</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
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
                    <Input id="email" defaultValue={currentUser.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={`${currentUser.firstName} ${currentUser.lastName}`} />
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
                          defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}