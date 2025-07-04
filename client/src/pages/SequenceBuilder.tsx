import { useState, useCallback } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Mail, 
  Clock, 
  ArrowRight, 
  Settings, 
  Play, 
  Pause, 
  Copy, 
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Target,
  Zap,
  BarChart3,
  Users,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SequenceStep {
  id: string;
  type: 'email' | 'delay' | 'condition' | 'action';
  name: string;
  subject?: string;
  content?: string;
  delay?: number;
  delayUnit?: 'hours' | 'days';
  condition?: {
    type: 'opened' | 'replied' | 'clicked' | 'no_response';
    action: 'continue' | 'branch' | 'stop';
  };
  position: { x: number; y: number };
  isActive: boolean;
}

interface EmailSequence {
  id: number;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  steps: SequenceStep[];
  stats: {
    totalContacts: number;
    opened: number;
    replied: number;
    clicked: number;
    converted: number;
  };
  createdAt: string;
  lastModified: string;
}

export function SequenceBuilder() {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draggedStep, setDraggedStep] = useState<SequenceStep | null>(null);
  const { toast } = useToast();

  // Mock sequence data
  const mockSequences: EmailSequence[] = [
    {
      id: 1,
      name: "SaaS Onboarding Sequence",
      description: "Welcome new SaaS trial users and guide them through key features",
      status: 'active',
      steps: [
        {
          id: '1',
          type: 'email',
          name: 'Welcome Email',
          subject: 'Welcome to {{company_name}}!',
          content: 'Hi {{first_name}}, welcome to our platform! Here\'s how to get started...',
          position: { x: 100, y: 100 },
          isActive: true
        },
        {
          id: '2',
          type: 'delay',
          name: '2 Day Wait',
          delay: 2,
          delayUnit: 'days',
          position: { x: 100, y: 200 },
          isActive: true
        },
        {
          id: '3',
          type: 'email',
          name: 'Feature Introduction',
          subject: 'Unlock the power of {{feature_name}}',
          content: 'Based on your trial activity, here are the features that could help you most...',
          position: { x: 100, y: 300 },
          isActive: true
        }
      ],
      stats: {
        totalContacts: 245,
        opened: 187,
        replied: 34,
        clicked: 89,
        converted: 23
      },
      createdAt: '2024-01-10',
      lastModified: '2024-01-15'
    }
  ];

  const addStep = (type: SequenceStep['type']) => {
    if (!selectedSequence) return;

    const newStep: SequenceStep = {
      id: Date.now().toString(),
      type,
      name: `New ${type}`,
      position: { x: 100, y: selectedSequence.steps.length * 100 + 100 },
      isActive: true
    };

    if (type === 'email') {
      newStep.subject = 'Enter subject line';
      newStep.content = 'Enter email content';
    } else if (type === 'delay') {
      newStep.delay = 1;
      newStep.delayUnit = 'days';
    }

    setSelectedSequence({
      ...selectedSequence,
      steps: [...selectedSequence.steps, newStep]
    });
  };

  const deleteStep = (stepId: string) => {
    if (!selectedSequence) return;

    setSelectedSequence({
      ...selectedSequence,
      steps: selectedSequence.steps.filter(step => step.id !== stepId)
    });
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'delay': return <Clock className="h-4 w-4" />;
      case 'condition': return <Target className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CreateSequenceModal = () => (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Sequence
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Email Sequence</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Sequence Name</Label>
            <Input placeholder="Enter sequence name" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Describe the purpose and goals of this sequence" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target Audience</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_signups">New Signups</SelectItem>
                  <SelectItem value="trial_users">Trial Users</SelectItem>
                  <SelectItem value="cold_leads">Cold Leads</SelectItem>
                  <SelectItem value="existing_customers">Existing Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Campaign Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="nurture">Nurture</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Sequence Created",
                description: "Your email sequence has been created successfully.",
              });
              setIsCreateModalOpen(false);
            }}>
              Create Sequence
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Email Sequences</h1>
          <p className="text-gray-600 mt-1">Build automated email sequences to nurture leads and drive conversions</p>
        </div>
        <CreateSequenceModal />
      </div>

      <Tabs defaultValue="sequences" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
          <TabsTrigger value="builder">Sequence Builder</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sequences" className="space-y-4">
          <div className="grid gap-4">
            {mockSequences.map((sequence) => (
              <Card key={sequence.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{sequence.name}</CardTitle>
                        <Badge className={getStatusColor(sequence.status)}>
                          {sequence.status}
                        </Badge>
                      </div>
                      <CardDescription>{sequence.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedSequence(sequence)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-1" />
                        Clone
                      </Button>
                      <Button size="sm" variant="outline">
                        {sequence.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{sequence.stats.totalContacts}</div>
                      <div className="text-sm text-gray-500">Total Contacts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((sequence.stats.opened / sequence.stats.totalContacts) * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((sequence.stats.clicked / sequence.stats.totalContacts) * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Click Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round((sequence.stats.replied / sequence.stats.totalContacts) * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Reply Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {Math.round((sequence.stats.converted / sequence.stats.totalContacts) * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Conversion</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{sequence.steps.length} steps</span>
                    <span>Last modified: {new Date(sequence.lastModified).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          {selectedSequence ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sequence Canvas */}
              <div className="lg:col-span-3">
                <Card className="h-[600px]">
                  <CardHeader>
                    <CardTitle>Sequence Builder - {selectedSequence.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-full bg-gray-50 rounded-lg p-4 overflow-auto">
                      {selectedSequence.steps.map((step, index) => (
                        <div
                          key={step.id}
                          className="absolute bg-white rounded-lg border shadow-sm p-3 min-w-48"
                          style={{ left: step.position.x, top: step.position.y }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStepIcon(step.type)}
                              <span className="font-medium text-sm">{step.name}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteStep(step.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {step.type === 'email' && (
                            <div className="text-xs text-gray-600">
                              <div className="font-medium">{step.subject}</div>
                              <div className="truncate mt-1">{step.content}</div>
                            </div>
                          )}
                          
                          {step.type === 'delay' && (
                            <div className="text-xs text-gray-600">
                              Wait {step.delay} {step.delayUnit}
                            </div>
                          )}

                          {index < selectedSequence.steps.length - 1 && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step Palette */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addStep('email')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addStep('delay')}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Delay
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addStep('condition')}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Condition
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addStep('action')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Action
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sequence Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Test Sequence
                    </Button>
                    <Button variant="outline" className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Select a Sequence to Edit</h3>
                <p className="text-gray-600 mb-4">
                  Choose a sequence from the list above or create a new one to start building.
                </p>
                <Button onClick={() => setSelectedSequence(mockSequences[0])}>
                  Edit Sample Sequence
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Total Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sequences Active</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Contacts</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Open Rate</span>
                    <span className="font-semibold text-green-600">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Best Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SaaS Onboarding</span>
                    <Badge variant="default">76% Open</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Lead Nurture</span>
                    <Badge variant="default">68% Open</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Re-engagement</span>
                    <Badge variant="default">54% Open</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-500" />
                  Engagement Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">This Week</span>
                    <span className="font-semibold text-blue-600">+12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">This Month</span>
                    <span className="font-semibold text-green-600">+28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Quarter</span>
                    <span className="font-semibold text-purple-600">+45%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}