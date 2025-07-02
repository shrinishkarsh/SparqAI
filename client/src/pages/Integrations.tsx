import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { IntegrationsPanel } from "@/components/integrations/IntegrationsPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, RefreshCw, CheckCircle, AlertCircle, Linkedin, Mail, Database, Zap, Shield, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: number;
  type: string;
  isConnected: boolean;
  credentials: any;
  settings: any;
  createdAt: string;
  updatedAt: string;
}

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['/api/integrations/user/1']
  });

  const testConnectionMutation = useMutation({
    mutationFn: async (integrationId: number) => {
      return apiRequest(`/api/integrations/${integrationId}/test`, {
        method: 'POST',
      });
    },
    onSuccess: (data, integrationId) => {
      toast({
        title: "Connection Test",
        description: data.success ? "Connection successful!" : "Connection failed. Please check your settings.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/user/1'] });
    },
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return apiRequest(`/api/integrations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      toast({
        title: "Integration Updated",
        description: "Your integration settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/user/1'] });
      setSelectedIntegration(null);
    },
  });

  const createIntegrationMutation = useMutation({
    mutationFn: async (integrationData: any) => {
      return apiRequest('/api/integrations', {
        method: 'POST',
        body: JSON.stringify(integrationData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Integration Added",
        description: "New integration has been successfully configured.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/user/1'] });
      setSelectedIntegration(null);
    },
  });

  const getIntegrationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-blue-600" />;
      case 'email':
        return <Mail className="h-5 w-5 text-green-600" />;
      case 'salesforce':
      case 'hubspot':
        return <Database className="h-5 w-5 text-orange-600" />;
      default:
        return <Zap className="h-5 w-5 text-gray-600" />;
    }
  };

  const getIntegrationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedin':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      case 'email':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      case 'salesforce':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      case 'hubspot':
        return 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="flex-1">
      <Header
        title="Integrations"
        subtitle="Connect and manage your LinkedIn, Email, and CRM integrations"
      >
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            onClick={() => {
              integrations?.forEach((integration: Integration) => {
                if (integration.isConnected) {
                  testConnectionMutation.mutate(integration.id);
                }
              });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Test All Connections
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="sparq-gradient hover:sparq-gradient-hover text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
                <DialogDescription>
                  Choose the type of integration you want to set up
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-3 mt-4">
                <Button
                  variant="outline"
                  className="justify-start h-12"
                  onClick={() => setSelectedIntegration('linkedin')}
                >
                  <Linkedin className="h-5 w-5 mr-3 text-blue-600" />
                  LinkedIn Sales Navigator
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12"
                  onClick={() => setSelectedIntegration('email')}
                >
                  <Mail className="h-5 w-5 mr-3 text-green-600" />
                  Email (SMTP/IMAP)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12"
                  onClick={() => setSelectedIntegration('salesforce')}
                >
                  <Database className="h-5 w-5 mr-3 text-blue-600" />
                  Salesforce CRM
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12"
                  onClick={() => setSelectedIntegration('hubspot')}
                >
                  <Database className="h-5 w-5 mr-3 text-orange-600" />
                  HubSpot CRM
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Header>

      <main className="flex-1 p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Integration Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations?.map((integration: Integration) => (
                <Card key={integration.id} className={`cursor-pointer transition-all hover:shadow-md ${getIntegrationColor(integration.type)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getIntegrationIcon(integration.type)}
                        <div>
                          <CardTitle className="text-lg capitalize">{integration.type}</CardTitle>
                          <CardDescription className="text-sm">
                            {integration.isConnected ? 'Connected' : 'Not Connected'}
                          </CardDescription>
                        </div>
                      </div>
                      {integration.isConnected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={integration.isConnected ? "default" : "secondary"}>
                          {integration.isConnected ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{new Date(integration.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedIntegration(integration.type)}
                          className="flex-1"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                        {integration.isConnected && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testConnectionMutation.mutate(integration.id)}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Integration Activity
                </CardTitle>
                <CardDescription>Recent activity across all integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">LinkedIn connection successful</p>
                      <p className="text-muted-foreground">Connected to LinkedIn Sales Navigator • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Email integration updated</p>
                      <p className="text-muted-foreground">SMTP settings configured successfully • 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Database className="h-4 w-4 text-orange-500" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">HubSpot sync completed</p>
                      <p className="text-muted-foreground">Synced 23 contacts to HubSpot • 6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="linkedin" className="space-y-6">
            <LinkedInIntegrationSettings integrations={integrations} />
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <EmailIntegrationSettings integrations={integrations} />
          </TabsContent>

          <TabsContent value="crm" className="space-y-6">
            <CRMIntegrationSettings integrations={integrations} />
          </TabsContent>
        </Tabs>

        {/* Configuration Modal */}
        <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {selectedIntegration && getIntegrationIcon(selectedIntegration)}
                <span className="ml-2 capitalize">{selectedIntegration} Configuration</span>
              </DialogTitle>
              <DialogDescription>
                Configure your {selectedIntegration} integration settings
              </DialogDescription>
            </DialogHeader>
            
            {selectedIntegration === 'linkedin' && <LinkedInConfigForm />}
            {selectedIntegration === 'email' && <EmailConfigForm />}
            {(selectedIntegration === 'salesforce' || selectedIntegration === 'hubspot') && <CRMConfigForm type={selectedIntegration} />}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

// LinkedIn Integration Settings Component
function LinkedInIntegrationSettings({ integrations }: { integrations: Integration[] }) {
  const linkedinIntegration = integrations?.find((i: Integration) => i.type === 'linkedin');
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Linkedin className="h-5 w-5 mr-2 text-blue-600" />
            LinkedIn Sales Navigator
          </CardTitle>
          <CardDescription>Manage your LinkedIn outreach and connection requests</CardDescription>
        </CardHeader>
        <CardContent>
          {linkedinIntegration?.isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Connection Limits</Label>
                  <div className="mt-1 text-2xl font-bold">50/day</div>
                  <p className="text-xs text-muted-foreground">Daily connection requests</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Messages Sent</Label>
                  <div className="mt-1 text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-accept">Auto-accept connections</Label>
                  <Switch id="auto-accept" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="follow-up">Automatic follow-up messages</Label>
                  <Switch id="follow-up" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-views">Track profile views</Label>
                  <Switch id="profile-views" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">LinkedIn Not Connected</h3>
              <p className="text-muted-foreground mb-4">Connect your LinkedIn account to start automated outreach</p>
              <Button>Connect LinkedIn</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Email Integration Settings Component
function EmailIntegrationSettings({ integrations }: { integrations: Integration[] }) {
  const emailIntegration = integrations?.find((i: Integration) => i.type === 'email');
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-green-600" />
            Email Integration
          </CardTitle>
          <CardDescription>Configure your email sending and tracking settings</CardDescription>
        </CardHeader>
        <CardContent>
          {emailIntegration?.isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Daily Limit</Label>
                  <div className="mt-1 text-2xl font-bold">200</div>
                  <p className="text-xs text-muted-foreground">Emails per day</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sent Today</Label>
                  <div className="mt-1 text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">23% of limit</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Open Rate</Label>
                  <div className="mt-1 text-2xl font-bold">24.5%</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-tracking">Email tracking</Label>
                  <Switch id="email-tracking" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-signature">Auto-add signature</Label>
                  <Switch id="auto-signature" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bounce-handling">Bounce handling</Label>
                  <Switch id="bounce-handling" defaultChecked />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Email Not Connected</h3>
              <p className="text-muted-foreground mb-4">Configure your SMTP settings to start sending emails</p>
              <Button>Configure Email</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// CRM Integration Settings Component
function CRMIntegrationSettings({ integrations }: { integrations: Integration[] }) {
  const salesforceIntegration = integrations?.find((i: Integration) => i.type === 'salesforce');
  const hubspotIntegration = integrations?.find((i: Integration) => i.type === 'hubspot');
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-600" />
            Salesforce CRM
          </CardTitle>
          <CardDescription>Sync contacts and activities with Salesforce</CardDescription>
        </CardHeader>
        <CardContent>
          {salesforceIntegration?.isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Contacts Synced</Label>
                  <div className="mt-1 text-2xl font-bold">1,456</div>
                  <p className="text-xs text-muted-foreground">Total synced contacts</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Sync</Label>
                  <div className="mt-1 text-2xl font-bold">2h ago</div>
                  <p className="text-xs text-muted-foreground">Auto-sync enabled</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sf-auto-sync">Auto-sync contacts</Label>
                  <Switch id="sf-auto-sync" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sf-activities">Sync activities</Label>
                  <Switch id="sf-activities" defaultChecked />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Salesforce Not Connected</h3>
              <p className="text-muted-foreground mb-4">Connect Salesforce to sync your contacts and activities</p>
              <Button>Connect Salesforce</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-orange-600" />
            HubSpot CRM
          </CardTitle>
          <CardDescription>Integrate with HubSpot for seamless contact management</CardDescription>
        </CardHeader>
        <CardContent>
          {hubspotIntegration?.isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Contacts Synced</Label>
                  <div className="mt-1 text-2xl font-bold">892</div>
                  <p className="text-xs text-muted-foreground">Total synced contacts</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Pipeline</Label>
                  <div className="mt-1 text-2xl font-bold">Sales</div>
                  <p className="text-xs text-muted-foreground">Default pipeline</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hs-auto-create">Auto-create contacts</Label>
                  <Switch id="hs-auto-create" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hs-sync-activities">Sync activities</Label>
                  <Switch id="hs-sync-activities" defaultChecked />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">HubSpot Not Connected</h3>
              <p className="text-muted-foreground mb-4">Connect HubSpot to manage your sales pipeline</p>
              <Button>Connect HubSpot</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Configuration Forms
function LinkedInConfigForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="linkedin-username">LinkedIn Username</Label>
        <Input id="linkedin-username" placeholder="your-linkedin-username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedin-password">Password</Label>
        <Input id="linkedin-password" type="password" placeholder="Your LinkedIn password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="connection-limit">Daily Connection Limit</Label>
        <Input id="connection-limit" type="number" defaultValue="50" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Configuration</Button>
      </div>
    </div>
  );
}

function EmailConfigForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="smtp-host">SMTP Host</Label>
        <Input id="smtp-host" placeholder="smtp.gmail.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtp-port">SMTP Port</Label>
        <Input id="smtp-port" type="number" defaultValue="587" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-username">Email Address</Label>
        <Input id="email-username" type="email" placeholder="your-email@domain.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-password">App Password</Label>
        <Input id="email-password" type="password" placeholder="App-specific password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="daily-limit">Daily Send Limit</Label>
        <Input id="daily-limit" type="number" defaultValue="200" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Configuration</Button>
      </div>
    </div>
  );
}

function CRMConfigForm({ type }: { type: string }) {
  return (
    <div className="space-y-4">
      {type === 'salesforce' ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="sf-username">Salesforce Username</Label>
            <Input id="sf-username" placeholder="username@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sf-password">Password</Label>
            <Input id="sf-password" type="password" placeholder="Your Salesforce password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sf-token">Security Token</Label>
            <Input id="sf-token" placeholder="Salesforce security token" />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="hs-api-key">HubSpot API Key</Label>
            <Input id="hs-api-key" placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hs-portal">Portal ID</Label>
            <Input id="hs-portal" placeholder="12345678" />
          </div>
        </>
      )}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Configuration</Button>
      </div>
    </div>
  );
}