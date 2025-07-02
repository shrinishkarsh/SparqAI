import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Plus, Target, Mail, Linkedin, Users, Sparkles, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  objective: z.string().min(1, "Campaign objective is required"),
  tone: z.enum(["professional", "casual", "friendly"]),
  channels: z.array(z.string()).min(1, "At least one channel is required"),
  sequences: z.object({
    emailCount: z.number().min(1).max(10),
    linkedinCount: z.number().min(0).max(5),
    delayDays: z.number().min(1).max(30)
  })
});

type CampaignForm = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  children: React.ReactNode;
}

export function CreateCampaignModal({ children }: CreateCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      targetAudience: "",
      objective: "",
      tone: "professional",
      channels: [],
      sequences: {
        emailCount: 3,
        linkedinCount: 2,
        delayDays: 3
      }
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignForm) => {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          companyId: 1,
          name: data.name,
          targetAudience: data.targetAudience,
          objective: data.objective,
          tone: data.tone,
          channels: data.channels,
          sequences: data.sequences,
          status: 'launching'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign Created",
        description: "Your AI-powered campaign is being set up and will launch shortly."
      });
      setOpen(false);
      form.reset();
      setCurrentStep(0);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: CampaignForm) => {
    createCampaignMutation.mutate(data);
  };

  const steps = [
    { id: 'basics', title: 'Campaign Basics', icon: Target },
    { id: 'audience', title: 'Target Audience', icon: Users },
    { id: 'channels', title: 'Channels & Sequences', icon: Mail },
    { id: 'review', title: 'Review & Launch', icon: Sparkles }
  ];

  const toggleChannel = (channel: string) => {
    const current = form.getValues('channels');
    const updated = current.includes(channel) 
      ? current.filter(c => c !== channel)
      : [...current, channel];
    form.setValue('channels', updated);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            Create AI-Powered Campaign
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-green-100 border-green-500 text-green-600'
                    : isActive 
                      ? 'bg-blue-100 border-blue-500 text-blue-600'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Campaign Basics */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Campaign Basics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Q1 2025 Enterprise Outreach" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Objective</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what you want to achieve with this campaign..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Communication Tone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="friendly">Friendly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Target Audience */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Target Audience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe Your Ideal Customer Profile</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g., VP of Sales at SaaS companies with 50-200 employees, $10M+ ARR, based in North America..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Channels & Sequences */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Outreach Channels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          form.watch('channels').includes('email')
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleChannel('email')}
                      >
                        <div className="flex items-center">
                          <Mail className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <h3 className="font-medium">Email Sequences</h3>
                            <p className="text-sm text-gray-500">Automated email outreach</p>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          form.watch('channels').includes('linkedin')
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleChannel('linkedin')}
                      >
                        <div className="flex items-center">
                          <Linkedin className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <h3 className="font-medium">LinkedIn Outreach</h3>
                            <p className="text-sm text-gray-500">Connection requests & messages</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="emailCount">Email Sequence Steps</Label>
                        <Input
                          id="emailCount"
                          type="number"
                          min="1"
                          max="10"
                          value={form.watch('sequences.emailCount')}
                          onChange={(e) => form.setValue('sequences.emailCount', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedinCount">LinkedIn Steps</Label>
                        <Input
                          id="linkedinCount"
                          type="number"
                          min="0"
                          max="5"
                          value={form.watch('sequences.linkedinCount')}
                          onChange={(e) => form.setValue('sequences.linkedinCount', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="delayDays">Delay Between Steps (Days)</Label>
                        <Input
                          id="delayDays"
                          type="number"
                          min="1"
                          max="30"
                          value={form.watch('sequences.delayDays')}
                          onChange={(e) => form.setValue('sequences.delayDays', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Review & Launch */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Review & Launch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Campaign Details</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-gray-500">Name:</span> {form.watch('name')}</div>
                          <div><span className="text-gray-500">Tone:</span> {form.watch('tone')}</div>
                          <div><span className="text-gray-500">Channels:</span> {form.watch('channels').join(', ')}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Sequence Configuration</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-gray-500">Email Steps:</span> {form.watch('sequences.emailCount')}</div>
                          <div><span className="text-gray-500">LinkedIn Steps:</span> {form.watch('sequences.linkedinCount')}</div>
                          <div><span className="text-gray-500">Delay:</span> {form.watch('sequences.delayDays')} days</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Sparkles className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">AI Features Enabled</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Your campaign will use AI to generate personalized copy, enrich leads, 
                            and optimize send times for maximum engagement.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="sparq-gradient hover:sparq-gradient-hover text-white"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={createCampaignMutation.isPending}
                  className="sparq-gradient hover:sparq-gradient-hover text-white"
                >
                  {createCampaignMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Creating Campaign...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Launch Campaign
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}