import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Settings, Plus, Linkedin, Mail, Database, AlertCircle, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface IntegrationsPanelProps {
  userId: number;
}

export function IntegrationsPanel({ userId }: IntegrationsPanelProps) {
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ["/api/integrations/user", userId],
    queryFn: () => api.getIntegrationsByUserId(userId),
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/integrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update integration');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Integration Updated",
        description: "Integration settings have been saved successfully."
      });
      setSettingsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update integration",
        variant: "destructive"
      });
    }
  });

  const createIntegrationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create integration');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Integration Added",
        description: "New integration has been configured successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create integration",
        variant: "destructive"
      });
    }
  });

  const integrationTypes = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Connect LinkedIn for automated connection requests and messaging',
      icon: Linkedin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      features: ['Auto connection requests', 'Personalized messages', 'Profile enrichment']
    },
    {
      id: 'email',
      name: 'Email (SMTP)',
      description: 'Configure email servers for automated email sequences',
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      features: ['Custom email sequences', 'A/B testing', 'Delivery tracking']
    },
    {
      id: 'crm',
      name: 'CRM Integration',
      description: 'Sync leads and activities with your CRM system',
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      features: ['Lead sync', 'Activity tracking', 'Pipeline updates']
    }
  ];

  const getIntegrationStatus = (type: string) => {
    const integration = integrations?.find((i: any) => i.type === type);
    return integration?.isConnected ? 'connected' : 'disconnected';
  };

  const getIntegration = (type: string) => {
    return integrations?.find((i: any) => i.type === type);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            Integration Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {integrationTypes.map(type => {
              const status = getIntegrationStatus(type.id);
              const Icon = type.icon;
              
              return (
                <div key={type.id} className="text-center p-4 border rounded-lg">
                  <div className={`w-12 h-12 ${type.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`h-6 w-6 ${type.color}`} />
                  </div>
                  <h3 className="font-medium">{type.name}</h3>
                  <Badge 
                    variant={status === 'connected' ? 'outline' : 'secondary'}
                    className={status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {status === 'connected' ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integration Cards */}
      <div className="grid gap-6">
        {integrationTypes.map(type => {
          const integration = getIntegration(type.id);
          const Icon = type.icon;
          const isConnected = integration?.isConnected;
          
          return (
            <Card key={type.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${type.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className={`h-5 w-5 ${type.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isConnected ? (
                      <>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                        <Dialog open={settingsOpen && selectedIntegration?.id === integration?.id} onOpenChange={setSettingsOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedIntegration(integration)}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Settings
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <Icon className={`h-5 w-5 mr-2 ${type.color}`} />
                                {type.name} Settings
                              </DialogTitle>
                            </DialogHeader>
                            <IntegrationSettings 
                              integration={integration}
                              type={type}
                              onSave={(data) => updateIntegrationMutation.mutate({ id: integration.id, data })}
                              isLoading={updateIntegrationMutation.isPending}
                            />
                          </DialogContent>
                        </Dialog>
                      </>
                    ) : (
                      <Button 
                        className="sparq-gradient hover:sparq-gradient-hover text-white"
                        size="sm"
                        onClick={() => {
                          // Simulate connection process
                          createIntegrationMutation.mutate({
                            type: type.id,
                            isConnected: true,
                            credentials: {},
                            settings: {}
                          });
                        }}
                        disabled={createIntegrationMutation.isPending}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                {isConnected && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">
                        Active and ready for campaign automation
                      </span>
                    </div>
                  </div>
                )}
                
                {!isConnected && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        Connect this integration to unlock automated outreach features
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

interface IntegrationSettingsProps {
  integration: any;
  type: any;
  onSave: (data: any) => void;
  isLoading: boolean;
}

function IntegrationSettings({ integration, type, onSave, isLoading }: IntegrationSettingsProps) {
  const [settings, setSettings] = useState(integration?.settings || {});
  const [credentials, setCredentials] = useState(integration?.credentials || {});

  const handleSave = () => {
    onSave({
      settings,
      credentials,
      isConnected: integration.isConnected
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4">
          {type.id === 'linkedin' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Connection Requests</Label>
                  <p className="text-sm text-gray-600">Automatically send connection requests to prospects</p>
                </div>
                <Switch 
                  checked={settings.autoConnect || false}
                  onCheckedChange={(checked) => setSettings({...settings, autoConnect: checked})}
                />
              </div>
              
              <div>
                <Label htmlFor="dailyLimit">Daily Connection Limit</Label>
                <Input
                  id="dailyLimit"
                  type="number"
                  value={settings.dailyLimit || 50}
                  onChange={(e) => setSettings({...settings, dailyLimit: parseInt(e.target.value)})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="connectionMessage">Default Connection Message</Label>
                <Textarea
                  id="connectionMessage"
                  value={settings.connectionMessage || ''}
                  onChange={(e) => setSettings({...settings, connectionMessage: e.target.value})}
                  placeholder="Hi [firstName], I'd love to connect..."
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          {type.id === 'email' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="smtpServer">SMTP Server</Label>
                <Input
                  id="smtpServer"
                  value={settings.smtpServer || ''}
                  onChange={(e) => setSettings({...settings, smtpServer: e.target.value})}
                  placeholder="smtp.gmail.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.smtpPort || 587}
                  onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable TLS</Label>
                  <p className="text-sm text-gray-600">Use TLS encryption for secure email delivery</p>
                </div>
                <Switch 
                  checked={settings.useTLS || true}
                  onCheckedChange={(checked) => setSettings({...settings, useTLS: checked})}
                />
              </div>
            </div>
          )}
          
          {type.id === 'crm' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="crmUrl">CRM API URL</Label>
                <Input
                  id="crmUrl"
                  value={settings.apiUrl || ''}
                  onChange={(e) => setSettings({...settings, apiUrl: e.target.value})}
                  placeholder="https://api.salesforce.com"
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-sync Leads</Label>
                  <p className="text-sm text-gray-600">Automatically sync new leads to CRM</p>
                </div>
                <Switch 
                  checked={settings.autoSync || true}
                  onCheckedChange={(checked) => setSettings({...settings, autoSync: checked})}
                />
              </div>
              
              <div>
                <Label htmlFor="leadStage">Default Lead Stage</Label>
                <Input
                  id="leadStage"
                  value={settings.defaultStage || 'New Lead'}
                  onChange={(e) => setSettings({...settings, defaultStage: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="credentials" className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Secure Credential Storage</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your credentials are encrypted and stored securely. Only use this for testing purposes.
                </p>
              </div>
            </div>
          </div>
          
          {type.id === 'linkedin' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkedinEmail">LinkedIn Email</Label>
                <Input
                  id="linkedinEmail"
                  type="email"
                  value={credentials.email || ''}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedinPassword">LinkedIn Password</Label>
                <Input
                  id="linkedinPassword"
                  type="password"
                  value={credentials.password || ''}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          {type.id === 'email' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="emailUsername">Email Username</Label>
                <Input
                  id="emailUsername"
                  value={credentials.username || ''}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="emailPassword">Email Password</Label>
                <Input
                  id="emailPassword"
                  type="password"
                  value={credentials.password || ''}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          {type.id === 'crm' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="crmApiKey">API Key</Label>
                <Input
                  id="crmApiKey"
                  type="password"
                  value={credentials.apiKey || ''}
                  onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="crmApiSecret">API Secret</Label>
                <Input
                  id="crmApiSecret"
                  type="password"
                  value={credentials.apiSecret || ''}
                  onChange={(e) => setCredentials({...credentials, apiSecret: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm">
          Test Connection
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="sparq-gradient hover:sparq-gradient-hover text-white"
          size="sm"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}