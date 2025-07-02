import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Target, MessageSquare, Clock, Brain, Sparkles, Rocket } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const campaignSetupSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().min(10, "Please provide a detailed description"),
  targetAudience: z.string().min(1, "Please select target audience"),
  messageTone: z.enum(["professional", "casual", "friendly"]),
  messageTemplate: z.string().min(10, "Please provide a message template"),
  workingHours: z.string().min(1, "Please select working hours"),
  personalizationLevel: z.enum(["basic", "standard", "advanced"])
});

type CampaignSetupForm = z.infer<typeof campaignSetupSchema>;

const MESSAGE_TONES = [
  { value: "professional", label: "Professional", description: "Formal and business-focused" },
  { value: "casual", label: "Casual", description: "Relaxed and conversational" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" }
];

const WORKING_HOURS = [
  "9:00 AM - 5:00 PM",
  "8:00 AM - 6:00 PM", 
  "10:00 AM - 4:00 PM",
  "9:00 AM - 6:00 PM",
  "8:00 AM - 8:00 PM"
];

const PERSONALIZATION_LEVELS = [
  { 
    value: "basic", 
    label: "Basic", 
    description: "Company name and contact name personalization",
    features: ["{{firstName}}", "{{company}}", "Basic templates"]
  },
  { 
    value: "standard", 
    label: "Standard (Industry & Role)", 
    description: "Includes industry insights and role-specific messaging",
    features: ["Industry insights", "Role-based content", "Company size targeting"]
  },
  { 
    value: "advanced", 
    label: "Advanced (AI-Powered)", 
    description: "AI-generated personalized insights for each prospect",
    features: ["AI insights", "Recent news", "Competitor analysis", "Custom pain points"]
  }
];

interface CampaignSetupProps {
  companyData?: any;
  onComplete: (data: any) => void;
}

export function CampaignSetup({ companyData, onComplete }: CampaignSetupProps) {
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<CampaignSetupForm>({
    resolver: zodResolver(campaignSetupSchema),
    defaultValues: {
      name: "",
      description: "",
      targetAudience: "",
      messageTone: "professional",
      messageTemplate: "",
      workingHours: "9:00 AM - 5:00 PM",
      personalizationLevel: "standard"
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: (data: CampaignSetupForm) => {
      const campaignData = {
        userId: 1,
        companyId: companyData?.id || 1,
        ...data,
        status: "draft",
        sequences: [
          { step: 1, type: "email", template: data.messageTemplate, delay: 0 },
          { step: 2, type: "linkedin", template: "LinkedIn connection request", delay: 3 },
          { step: 3, type: "email", template: "Follow-up email", delay: 7 }
        ],
        stats: { sent: 0, opened: 0, replied: 0, meetings: 0 }
      };
      return api.createCampaign(campaignData);
    },
    onSuccess: (data) => {
      toast({
        title: "Campaign Created!",
        description: "Your first campaign has been created successfully.",
      });
      onComplete(data);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  });

  const generateCopyMutation = useMutation({
    mutationFn: async () => {
      const formData = form.getValues();
      
      if (!formData.targetAudience || !formData.messageTone) {
        throw new Error("Please fill in target audience and message tone first");
      }
      
      return api.generateEmailCopy({
        recipientName: "{{firstName}}",
        recipientTitle: "{{jobTitle}}",
        company: "{{company}}",
        industry: companyData?.industry || "Technology",
        campaignType: formData.name || "Outreach",
        tone: formData.messageTone,
        objective: formData.description,
        personalizedInsight: `Targeting ${formData.targetAudience}`
      });
    },
    onSuccess: (data) => {
      setGeneratedCopy(data);
      form.setValue("messageTemplate", data.body);
      toast({
        title: "Email Copy Generated!",
        description: "AI has generated personalized email copy for your campaign.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate email copy. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: CampaignSetupForm) => {
    createCampaignMutation.mutate(data);
  };

  const handleGenerateCopy = () => {
    setIsGeneratingCopy(true);
    generateCopyMutation.mutate();
    setIsGeneratingCopy(false);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Campaign Basics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
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
                      <Input placeholder="e.g., Enterprise Security Outreach Q1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the goal of this campaign, what you're offering, and what success looks like..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., IT Directors, CTOs, CISOs at mid-market companies"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Message Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                Message Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="messageTone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Tone</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        {MESSAGE_TONES.map((tone) => (
                          <div key={tone.value} className="flex items-center space-x-2 border border-gray-200 rounded-lg p-4">
                            <RadioGroupItem value={tone.value} id={tone.value} />
                            <Label htmlFor={tone.value} className="flex-1 cursor-pointer">
                              <div className="font-medium">{tone.label}</div>
                              <div className="text-sm text-gray-500">{tone.description}</div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Hours</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select working hours" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WORKING_HOURS.map((hours) => (
                          <SelectItem key={hours} value={hours}>
                            {hours}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Personalization Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-orange-600" />
                Personalization Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="personalizationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-4"
                      >
                        {PERSONALIZATION_LEVELS.map((level) => (
                          <div key={level.value} className="flex items-start space-x-3 border border-gray-200 rounded-lg p-4">
                            <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
                            <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{level.label}</span>
                                {level.value === "advanced" && (
                                  <Badge className="sparq-accent-light">Recommended</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">{level.description}</div>
                              <div className="flex flex-wrap gap-1">
                                {level.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Message Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                  Email Template
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateCopy}
                  disabled={isGeneratingCopy || generateCopyMutation.isPending || !form.getValues("targetAudience")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generateCopyMutation.isPending ? "Generating..." : "Generate with AI"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedCopy && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">Generated Subject Line:</h4>
                  <p className="text-blue-800 text-sm mb-3">"{generatedCopy.subject}"</p>
                  <p className="text-xs text-blue-600">The email body has been populated below. You can edit it as needed.</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="messageTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Template</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Hi {{firstName}},

I noticed {{company}} has been growing rapidly in the {{industry}} space. 

I'm reaching out because..."
                        className="min-h-[200px] font-mono text-sm"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Available Variables:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <Badge variant="outline">{"{{firstName}}"}</Badge>
                  <Badge variant="outline">{"{{lastName}}"}</Badge>
                  <Badge variant="outline">{"{{company}}"}</Badge>
                  <Badge variant="outline">{"{{jobTitle}}"}</Badge>
                  <Badge variant="outline">{"{{industry}}"}</Badge>
                  <Badge variant="outline">{"{{companySize}}"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full sparq-gradient hover:sparq-gradient-hover text-white"
            disabled={createCampaignMutation.isPending}
          >
            <Rocket className="h-4 w-4 mr-2" />
            {createCampaignMutation.isPending ? "Creating Campaign..." : "Create First Campaign"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
