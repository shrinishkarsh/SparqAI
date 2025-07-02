import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Mail, Linkedin, Clock, Edit, Play, Pause, Trash2, Sparkles, Eye, Copy } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SequencesPanelProps {
  userId: number;
  campaignId?: number;
}

export function SequencesPanel({ userId, campaignId }: SequencesPanelProps) {
  const [createSequenceOpen, setCreateSequenceOpen] = useState(false);
  const [editSequenceOpen, setEditSequenceOpen] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<any>(null);
  const [sequenceType, setSequenceType] = useState<'email' | 'linkedin'>('email');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns } = useQuery({
    queryKey: ["/api/campaigns/user", userId],
    queryFn: () => api.getCampaignsByUserId(userId),
  });

  // Mock sequences data since it's part of campaigns
  const emailSequences = [
    {
      id: 1,
      name: "Enterprise Outreach Email Sequence",
      type: "email",
      status: "active",
      steps: [
        { step: 1, delay: 0, subject: "Quick question about {{company}}'s growth plans", template: "Hi {{firstName}},\n\nI noticed {{company}} has been expanding rapidly..." },
        { step: 2, delay: 3, subject: "Following up on my previous email", template: "Hi {{firstName}},\n\nI wanted to follow up on my previous email..." },
        { step: 3, delay: 7, subject: "Last attempt - {{company}} + SparqAI", template: "Hi {{firstName}},\n\nThis will be my last email..." }
      ],
      stats: { sent: 245, opened: 98, replied: 23, meetings: 8 }
    },
    {
      id: 2,
      name: "SaaS Startup Sequence",
      type: "email",
      status: "paused",
      steps: [
        { step: 1, delay: 0, subject: "Love what you're building at {{company}}", template: "Hi {{firstName}},\n\nI've been following {{company}} and love what you're building..." },
        { step: 2, delay: 5, subject: "Quick question about your sales process", template: "Hi {{firstName}},\n\nHope you're doing well..." }
      ],
      stats: { sent: 89, opened: 34, replied: 7, meetings: 2 }
    }
  ];

  const linkedinSequences = [
    {
      id: 3,
      name: "LinkedIn Connection + Message",
      type: "linkedin",
      status: "active",
      steps: [
        { step: 1, delay: 0, type: "connection", template: "Hi {{firstName}}, I'd love to connect and discuss growth opportunities for {{company}}." },
        { step: 2, delay: 2, type: "message", template: "Thanks for connecting! I noticed {{company}} is scaling fast. Would love to chat about how we're helping similar companies..." }
      ],
      stats: { sent: 156, connected: 78, replied: 15, meetings: 5 }
    }
  ];

  const allSequences = [...emailSequences, ...linkedinSequences];

  const createSequenceMutation = useMutation({
    mutationFn: async (data: any) => {
      // This would create a new sequence
      console.log('Creating sequence:', data);
      return { id: Date.now(), ...data };
    },
    onSuccess: () => {
      toast({
        title: "Sequence Created",
        description: "Your new sequence has been created successfully."
      });
      setCreateSequenceOpen(false);
    }
  });

  return (
    <div className="space-y-6">
      {/* Sequences Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
              Sequences Dashboard
            </CardTitle>
            <Dialog open={createSequenceOpen} onOpenChange={setCreateSequenceOpen}>
              <DialogTrigger asChild>
                <Button className="sparq-gradient hover:sparq-gradient-hover text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Sequence
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Sequence</DialogTitle>
                </DialogHeader>
                <CreateSequenceForm 
                  type={sequenceType}
                  onTypeChange={setSequenceType}
                  onSubmit={(data) => createSequenceMutation.mutate(data)}
                  isLoading={createSequenceMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{emailSequences.length}</p>
              <p className="text-sm text-gray-600">Email Sequences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Linkedin className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{linkedinSequences.length}</p>
              <p className="text-sm text-gray-600">LinkedIn Sequences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Play className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {allSequences.filter(s => s.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Pause className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {allSequences.filter(s => s.status === 'paused').length}
              </p>
              <p className="text-sm text-gray-600">Paused</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sequences List */}
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Sequences
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center">
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn Sequences
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4">
          {emailSequences.map(sequence => (
            <SequenceCard 
              key={sequence.id} 
              sequence={sequence} 
              onEdit={setSelectedSequence}
              onEditOpen={setEditSequenceOpen}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="linkedin" className="space-y-4">
          {linkedinSequences.map(sequence => (
            <SequenceCard 
              key={sequence.id} 
              sequence={sequence} 
              onEdit={setSelectedSequence}
              onEditOpen={setEditSequenceOpen}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Edit Sequence Dialog */}
      <Dialog open={editSequenceOpen} onOpenChange={setEditSequenceOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sequence: {selectedSequence?.name}</DialogTitle>
          </DialogHeader>
          {selectedSequence && (
            <EditSequenceForm 
              sequence={selectedSequence}
              onSubmit={(data) => {
                console.log('Updating sequence:', data);
                setEditSequenceOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SequenceCardProps {
  sequence: any;
  onEdit: (sequence: any) => void;
  onEditOpen: (open: boolean) => void;
}

function SequenceCard({ sequence, onEdit, onEditOpen }: SequenceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const Icon = sequence.type === 'email' ? Mail : Linkedin;
  const iconColor = sequence.type === 'email' ? 'text-blue-600' : 'text-purple-600';
  const bgColor = sequence.type === 'email' ? 'bg-blue-100' : 'bg-purple-100';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mr-4`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
              <h3 className="font-medium">{sequence.name}</h3>
              <p className="text-sm text-gray-600">{sequence.steps.length} steps • {sequence.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(sequence.status)}>
              {sequence.status}
            </Badge>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                onEdit(sequence);
                onEditOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Sent</p>
            <p className="text-lg font-semibold">{sequence.stats.sent}</p>
          </div>
          {sequence.type === 'email' && (
            <>
              <div>
                <p className="text-sm text-gray-600">Opened</p>
                <p className="text-lg font-semibold">{sequence.stats.opened}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Replied</p>
                <p className="text-lg font-semibold">{sequence.stats.replied}</p>
              </div>
            </>
          )}
          {sequence.type === 'linkedin' && (
            <>
              <div>
                <p className="text-sm text-gray-600">Connected</p>
                <p className="text-lg font-semibold">{sequence.stats.connected}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Replied</p>
                <p className="text-lg font-semibold">{sequence.stats.replied}</p>
              </div>
            </>
          )}
          <div>
            <p className="text-sm text-gray-600">Meetings</p>
            <p className="text-lg font-semibold">{sequence.stats.meetings}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Sequence Steps:</h4>
          <div className="flex space-x-2">
            {sequence.steps.map((step: any, index: number) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                  {step.step}
                </div>
                {step.delay > 0 && (
                  <div className="mx-2 text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {step.delay}d
                  </div>
                )}
                {index < sequence.steps.length - 1 && (
                  <div className="w-4 h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CreateSequenceFormProps {
  type: 'email' | 'linkedin';
  onTypeChange: (type: 'email' | 'linkedin') => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

function CreateSequenceForm({ type, onTypeChange, onSubmit, isLoading }: CreateSequenceFormProps) {
  const [name, setName] = useState('');
  const [steps, setSteps] = useState([
    { step: 1, delay: 0, subject: '', template: '', type: type === 'linkedin' ? 'connection' : undefined }
  ]);

  const addStep = () => {
    setSteps([...steps, { 
      step: steps.length + 1, 
      delay: 3, 
      subject: '', 
      template: '',
      type: type === 'linkedin' ? 'message' : undefined
    }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: string, value: any) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      type,
      steps,
      status: 'draft'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sequenceName">Sequence Name</Label>
          <Input
            id="sequenceName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Enterprise Outreach Sequence"
          />
        </div>
        <div>
          <Label htmlFor="sequenceType">Sequence Type</Label>
          <Select value={type} onValueChange={(value: 'email' | 'linkedin') => onTypeChange(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email Sequence</SelectItem>
              <SelectItem value="linkedin">LinkedIn Sequence</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Sequence Steps</h3>
          <Button variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-1" />
            Add Step
          </Button>
        </div>

        {steps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Step {step.step}</h4>
                {steps.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeStep(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {index > 0 && (
                  <div>
                    <Label>Delay (days)</Label>
                    <Input
                      type="number"
                      value={step.delay}
                      onChange={(e) => updateStep(index, 'delay', parseInt(e.target.value))}
                    />
                  </div>
                )}
                
                {type === 'linkedin' && (
                  <div>
                    <Label>Action Type</Label>
                    <Select 
                      value={step.type} 
                      onValueChange={(value) => updateStep(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="connection">Connection Request</SelectItem>
                        <SelectItem value="message">Direct Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {type === 'email' && (
                <div>
                  <Label>Subject Line</Label>
                  <Input
                    value={step.subject}
                    onChange={(e) => updateStep(index, 'subject', e.target.value)}
                    placeholder="e.g., Quick question about {{company}}"
                  />
                </div>
              )}

              <div>
                <Label>Message Template</Label>
                <Textarea
                  value={step.template}
                  onChange={(e) => updateStep(index, 'template', e.target.value)}
                  placeholder="Hi {{firstName}}, ..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use variables: {`{{firstName}}, {{lastName}}, {{company}}, {{jobTitle}}`}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Save as Draft</Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !name}
          className="sparq-gradient hover:sparq-gradient-hover text-white"
        >
          {isLoading ? 'Creating...' : 'Create Sequence'}
        </Button>
      </div>
    </div>
  );
}

interface EditSequenceFormProps {
  sequence: any;
  onSubmit: (data: any) => void;
}

function EditSequenceForm({ sequence, onSubmit }: EditSequenceFormProps) {
  const [name, setName] = useState(sequence.name);
  const [steps, setSteps] = useState(sequence.steps);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="editSequenceName">Sequence Name</Label>
        <Input
          id="editSequenceName"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Sequence Steps</h3>
        {steps.map((step: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <h4 className="font-medium">Step {step.step}</h4>
            </CardHeader>
            <CardContent className="space-y-4">
              {sequence.type === 'email' && step.subject && (
                <div>
                  <Label>Subject Line</Label>
                  <Input value={step.subject} readOnly />
                </div>
              )}
              <div>
                <Label>Message Template</Label>
                <Textarea value={step.template} readOnly className="min-h-[80px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Save Changes</Button>
        <Button className="sparq-gradient hover:sparq-gradient-hover text-white">
          Update Sequence
        </Button>
      </div>
    </div>
  );
}