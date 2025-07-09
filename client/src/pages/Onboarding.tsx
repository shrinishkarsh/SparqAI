import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Users, 
  Target, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Globe,
  DollarSign,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingData {
  // Company Information
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
  description: string;
  
  // Target Market & ICP
  targetMarket: string;
  idealCustomerProfile: string;
  valueProposition: string;
  
  // Business Goals
  primaryGoals: string[];
  monthlyLeadTarget: number;
  averageDealSize: string;
  salesCycleLength: string;
  
  // Current Process
  currentLeadGenMethods: string[];
  salesProcess: string;
  teamSize: number;
  
  // Geographic Focus
  geographicFocus: string;
  
  // Integration Preferences
  preferredChannels: string[];
  crmSystem: string;
  
  // Success Metrics
  currentConversionRate: number;
  targetConversionRate: number;
}

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing", 
  "Retail", "Real Estate", "Marketing", "Consulting", "Other"
];

const COMPANY_SIZES = [
  "1-10 employees", "11-50 employees", "51-200 employees", 
  "201-500 employees", "500+ employees"
];

const GOALS = [
  "Increase lead generation", "Improve conversion rates", "Scale outreach efforts",
  "Automate sales processes", "Expand to new markets", "Improve customer acquisition"
];

const LEAD_GEN_METHODS = [
  "Cold email", "LinkedIn outreach", "Content marketing", "Paid advertising",
  "Referrals", "Events & conferences", "Cold calling", "Social media"
];

const CHANNELS = [
  "Email", "LinkedIn", "Phone", "Direct mail", "Social media"
];

const CRM_SYSTEMS = [
  "HubSpot", "Salesforce", "Pipedrive", "Zoho", "Monday.com", "Other", "None"
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: "",
    companySize: "",
    industry: "",
    website: "",
    description: "",
    targetMarket: "",
    idealCustomerProfile: "",
    valueProposition: "",
    primaryGoals: [],
    monthlyLeadTarget: 100,
    averageDealSize: "",
    salesCycleLength: "",
    currentLeadGenMethods: [],
    salesProcess: "",
    teamSize: 1,
    geographicFocus: "",
    preferredChannels: [],
    crmSystem: "",
    currentConversionRate: 0,
    targetConversionRate: 0,
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayField = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof OnboardingData] as string[]), value]
        : (prev[field as keyof OnboardingData] as string[]).filter(item => item !== value)
    }));
  };

  const submitOnboarding = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Create company
      const companyResponse = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.companyName,
          userId: user.id, // Use string ID as expected by schema
          size: formData.companySize,
          industry: formData.industry,
          website: formData.website,
          description: formData.description,
          targetMarket: formData.targetMarket,
          idealCustomerProfile: formData.idealCustomerProfile,
          valueProposition: formData.valueProposition,
          salesProcess: formData.salesProcess,
          geographicFocus: formData.geographicFocus,
          targetIcp: formData.idealCustomerProfile,
          companyGoals: formData.primaryGoals.join(', '), // Convert array to string
          revenueModel: formData.averageDealSize, // Using average deal size for revenue model
          competitiveAdvantage: '', // Not collected during onboarding
          preferredChannels: formData.preferredChannels,
        }),
      });

      if (!companyResponse.ok) {
        throw new Error('Failed to create company');
      }

      const company = await companyResponse.json();

      // Update user as setup complete
      const userResponse = await fetch(`/api/users/${user.id}/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSetupComplete: true }),
      });

      if (!userResponse.ok) {
        throw new Error('Failed to complete setup');
      }

      return company;
    },
    onSuccess: () => {
      toast({ title: "Welcome to SparqOS!", description: "Your account setup is complete." });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setLocation('/');
    },
    onError: (error) => {
      console.error('Onboarding error:', error);
      toast({ title: "Setup failed. Please try again.", variant: "destructive" });
    },
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.companySize && formData.industry;
      case 2:
        return formData.targetMarket && formData.idealCustomerProfile && formData.valueProposition;
      case 3:
        return formData.primaryGoals.length > 0 && formData.monthlyLeadTarget > 0;
      case 4:
        return formData.currentLeadGenMethods.length > 0 && formData.teamSize > 0;
      case 5:
        return formData.preferredChannels.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Tell us about your company</h2>
              <p className="text-gray-600">This helps us personalize your SparqOS experience</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData("companyName", e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <Label htmlFor="companySize">Company Size *</Label>
                <Select value={formData.companySize} onValueChange={(value) => updateFormData("companySize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateFormData("website", e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Brief description of what your company does"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Define your target market</h2>
              <p className="text-gray-600">Help us understand who you're trying to reach</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="targetMarket">Target Market *</Label>
                <Textarea
                  id="targetMarket"
                  value={formData.targetMarket}
                  onChange={(e) => updateFormData("targetMarket", e.target.value)}
                  placeholder="Describe your target market (e.g., B2B SaaS companies with 50-200 employees)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="idealCustomerProfile">Ideal Customer Profile *</Label>
                <Textarea
                  id="idealCustomerProfile"
                  value={formData.idealCustomerProfile}
                  onChange={(e) => updateFormData("idealCustomerProfile", e.target.value)}
                  placeholder="Describe your ideal customer (job titles, pain points, characteristics)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="valueProposition">Value Proposition *</Label>
                <Textarea
                  id="valueProposition"
                  value={formData.valueProposition}
                  onChange={(e) => updateFormData("valueProposition", e.target.value)}
                  placeholder="What unique value do you provide to customers?"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="geographicFocus">Geographic Focus</Label>
                <Input
                  id="geographicFocus"
                  value={formData.geographicFocus}
                  onChange={(e) => updateFormData("geographicFocus", e.target.value)}
                  placeholder="e.g., North America, Global, US & Canada"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Set your goals</h2>
              <p className="text-gray-600">Define what success looks like for your outreach</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Primary Goals *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {GOALS.map(goal => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.primaryGoals.includes(goal)}
                        onCheckedChange={(checked) => handleArrayField("primaryGoals", goal, checked as boolean)}
                      />
                      <Label htmlFor={goal} className="text-sm">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyLeadTarget">Monthly Lead Target *</Label>
                  <Input
                    id="monthlyLeadTarget"
                    type="number"
                    value={formData.monthlyLeadTarget}
                    onChange={(e) => updateFormData("monthlyLeadTarget", parseInt(e.target.value) || 0)}
                    placeholder="100"
                  />
                </div>

                <div>
                  <Label htmlFor="averageDealSize">Average Deal Size</Label>
                  <Input
                    id="averageDealSize"
                    value={formData.averageDealSize}
                    onChange={(e) => updateFormData("averageDealSize", e.target.value)}
                    placeholder="$5,000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="salesCycleLength">Typical Sales Cycle Length</Label>
                <Select value={formData.salesCycleLength} onValueChange={(value) => updateFormData("salesCycleLength", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales cycle length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="2-3 months">2-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentConversionRate">Current Conversion Rate (%)</Label>
                  <Input
                    id="currentConversionRate"
                    type="number"
                    value={formData.currentConversionRate}
                    onChange={(e) => updateFormData("currentConversionRate", parseFloat(e.target.value) || 0)}
                    placeholder="2.5"
                  />
                </div>

                <div>
                  <Label htmlFor="targetConversionRate">Target Conversion Rate (%)</Label>
                  <Input
                    id="targetConversionRate"
                    type="number"
                    value={formData.targetConversionRate}
                    onChange={(e) => updateFormData("targetConversionRate", parseFloat(e.target.value) || 0)}
                    placeholder="5.0"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Current process & team</h2>
              <p className="text-gray-600">Tell us about your existing sales and marketing setup</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Current Lead Generation Methods *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {LEAD_GEN_METHODS.map(method => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={method}
                        checked={formData.currentLeadGenMethods.includes(method)}
                        onCheckedChange={(checked) => handleArrayField("currentLeadGenMethods", method, checked as boolean)}
                      />
                      <Label htmlFor={method} className="text-sm">{method}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="salesProcess">Sales Process Description</Label>
                <Textarea
                  id="salesProcess"
                  value={formData.salesProcess}
                  onChange={(e) => updateFormData("salesProcess", e.target.value)}
                  placeholder="Describe your current sales process from lead to close"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="teamSize">Sales/Marketing Team Size *</Label>
                <Input
                  id="teamSize"
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => updateFormData("teamSize", parseInt(e.target.value) || 1)}
                  placeholder="3"
                />
              </div>

              <div>
                <Label htmlFor="crmSystem">Current CRM System</Label>
                <Select value={formData.crmSystem} onValueChange={(value) => updateFormData("crmSystem", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your CRM system" />
                  </SelectTrigger>
                  <SelectContent>
                    {CRM_SYSTEMS.map(crm => (
                      <SelectItem key={crm} value={crm}>{crm}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Communication preferences</h2>
              <p className="text-gray-600">Choose your preferred outreach channels</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Preferred Outreach Channels *</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {CHANNELS.map(channel => (
                    <div key={channel} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={channel}
                          checked={formData.preferredChannels.includes(channel)}
                          onCheckedChange={(checked) => handleArrayField("preferredChannels", channel, checked as boolean)}
                        />
                        <Label htmlFor={channel} className="font-medium">{channel}</Label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {channel === "Email" ? "High volume" : 
                         channel === "LinkedIn" ? "Professional" : 
                         channel === "Phone" ? "Personal" : "Targeted"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-4 bg-blue-50 border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">🎯 Recommended Setup</h3>
                <p className="text-sm text-blue-700">
                  Based on your selections, we recommend starting with Email and LinkedIn for maximum reach, 
                  then adding other channels as you scale.
                </p>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 relative">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <defs>
                  <linearGradient id="sparqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <rect width="40" height="40" rx="8" fill="url(#sparqGradient)" />
                <path
                  d="M24 12 C28 12, 30 14, 30 17 C30 19, 28 20, 26 20 L22 20 C20 20, 18 21, 18 23 C18 26, 20 28, 24 28 L28 28"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M15 10 L12 16 L15 16 L12 20 L18 14 L15 14 L18 10 Z"
                  fill="white"
                  opacity="0.9"
                />
                <circle cx="32" cy="12" r="1" fill="white" opacity="0.8" />
                <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.7" />
                <circle cx="8" cy="25" r="1" fill="white" opacity="0.6" />
              </svg>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">SparqOS</span>
            <Sparkles className="h-5 w-5 text-blue-600 ml-2" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SparqOS</h1>
          <p className="text-gray-600">Let's set up your account for maximum outreach success</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={() => submitOnboarding.mutate()}
              disabled={!isStepValid() || submitOnboarding.isPending}
              className="flex items-center gap-2 sparq-gradient text-white"
            >
              {submitOnboarding.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete Setup
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}