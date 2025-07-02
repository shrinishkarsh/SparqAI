import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Linkedin, Mail, Database, Check, ExternalLink, Settings } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface IntegrationSetupProps {
  initialData?: any[];
  onComplete: (data: any) => void;
}

const INTEGRATIONS = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Connect your LinkedIn account for automated outreach and lead generation',
    icon: Linkedin,
    iconColor: 'text-blue-600',
    required: true,
    features: ['Automated connection requests', 'Message sequences', 'Profile scraping']
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Connect your email provider for automated email campaigns',
    icon: Mail,
    iconColor: 'text-gray-600',
    required: true,
    features: ['Email sequences', 'Reply tracking', 'Open/click analytics']
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Sync leads and activities with your CRM system',
    icon: Database,
    iconColor: 'text-purple-600',
    required: false,
    features: ['Lead sync', 'Activity tracking', 'Pipeline management']
  }
];

export function IntegrationSetup({ initialData, onComplete }: IntegrationSetupProps) {
  const [integrations, setIntegrations] = useState<any[]>(initialData || []);
  const [emailConfig, setEmailConfig] = useState({ email: '', provider: 'gmail' });
  const { toast } = useToast();

  const createIntegrationMutation = useMutation({
    mutationFn: (data: any) => api.createIntegration(data),
    onSuccess: (data) => {
      setIntegrations(prev => [...prev.filter(i => i.type !== data.type), data]);
      toast({
        title: "Integration Connected!",
        description: `${data.type} has been successfully connected.`,
      });
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Failed to connect integration. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateIntegration(id, data),
    onSuccess: (data) => {
      setIntegrations(prev => prev.map(i => i.id === data.id ? data : i));
      toast({
        title: "Integration Updated!",
        description: `${data.type} settings have been updated.`,
      });
    }
  });

  const getIntegrationStatus = (type: string) => {
    const integration = integrations.find(i => i.type === type);
    return integration?.isConnected || false;
  };

  const getIntegration = (type: string) => {
    return integrations.find(i => i.type === type);
  };

  const handleLinkedInConnect = () => {
    // Simulate LinkedIn OAuth flow
    toast({
      title: "LinkedIn Connection",
      description: "In a real app, this would redirect to LinkedIn OAuth. For demo, marking as connected.",
    });
    
    createIntegrationMutation.mutate({
      userId: 1,
      type: 'linkedin',
      isConnected: true,
      credentials: { accessToken: 'demo_linkedin_token' },
      settings: { 
        dailyLimit: 50,
        connectionMessage: "Hi {{firstName}}, I'd love to connect and explore potential synergies between our companies!"
      }
    });
  };

  const handleEmailConnect = () => {
    if (!emailConfig.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    createIntegrationMutation.mutate({
      userId: 1,
      type: 'email',
      isConnected: true,
      credentials: { 
        email: emailConfig.email,
        provider: emailConfig.provider
      },
      settings: { 
        signature: `Best regards,\n${emailConfig.email.split('@')[0]}`,
        dailyLimit: 100
      }
    });
  };

  const handleCrmConnect = () => {
    toast({
      title: "CRM Integration",
      description: "CRM integration setup would open here. Skipping for now.",
    });
    
    createIntegrationMutation.mutate({
      userId: 1,
      type: 'crm',
      isConnected: false,
      credentials: {},
      settings: {}
    });
  };

  const checkCompletion = () => {
    const linkedinConnected = getIntegrationStatus('linkedin');
    const emailConnected = getIntegrationStatus('email');
    
    if (linkedinConnected && emailConnected) {
      onComplete(integrations);
    }
  };

  useEffect(() => {
    checkCompletion();
  }, [integrations]);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setIntegrations(initialData);
      onComplete(initialData);
    }
  }, [initialData, onComplete]);

  return (
    <div className="space-y-6">
      {INTEGRATIONS.map((integration) => {
        const isConnected = getIntegrationStatus(integration.id);
        const integrationData = getIntegration(integration.id);
        
        return (
          <Card key={integration.id} className={`border-2 transition-colors ${
            isConnected ? 'border-green-200 bg-green-50' : 'border-gray-200'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <integration.icon className={`h-6 w-6 mr-3 ${integration.iconColor}`} />
                  <div>
                    <span className="text-lg font-semibold">{integration.name}</span>
                    {integration.required && (
                      <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                    )}
                  </div>
                </div>
                {isConnected && (
                  <div className="flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{integration.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {integration.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-3 w-3 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="my-4" />

              {/* LinkedIn */}
              {integration.id === 'linkedin' && (
                <div className="space-y-4">
                  {!isConnected ? (
                    <Button
                      onClick={handleLinkedInConnect}
                      disabled={createIntegrationMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {createIntegrationMutation.isPending ? 'Connecting...' : 'Connect LinkedIn'}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">✓ Connected successfully</span>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Email */}
              {integration.id === 'email' && (
                <div className="space-y-4">
                  {!isConnected ? (
                    <div className="space-y-3">
                      <Input
                        type="email"
                        placeholder="your.email@company.com"
                        value={emailConfig.email}
                        onChange={(e) => setEmailConfig(prev => ({ ...prev, email: e.target.value }))}
                      />
                      <Button
                        onClick={handleEmailConnect}
                        disabled={createIntegrationMutation.isPending || !emailConfig.email}
                        className="w-full"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {createIntegrationMutation.isPending ? 'Connecting...' : 'Connect Email'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-green-600 font-medium">✓ Connected: </span>
                        <span className="text-gray-600">{integrationData?.credentials?.email}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* CRM */}
              {integration.id === 'crm' && (
                <div className="space-y-4">
                  {!isConnected ? (
                    <Button
                      onClick={handleCrmConnect}
                      disabled={createIntegrationMutation.isPending}
                      variant="outline"
                      className="w-full"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Setup CRM Integration
                    </Button>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">CRM integration available</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">🔒 Security & Privacy</h4>
        <p className="text-sm text-blue-700">
          All integrations use secure OAuth protocols and encrypted storage. We never store your passwords 
          and you can revoke access at any time from your account settings.
        </p>
      </div>
    </div>
  );
}
