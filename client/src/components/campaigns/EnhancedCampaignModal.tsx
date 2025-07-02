import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, ArrowLeft, ArrowRight, Check, Target, Users, Mail, Search, Upload, Linkedin, Database, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EnhancedCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
}

export function EnhancedCampaignModal({ open, onOpenChange, userId }: EnhancedCampaignModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAudience: "",
    messageTemplate: "",
    sequences: [] as any[],
    status: "draft",
    leadSource: "",
    hasExistingLeads: false,
    targetIndustries: [] as string[],
    targetRoles: [] as string[],
    companySizes: [] as string[],
    leadGenerationMethod: "",
    scrapingCriteria: {
      location: "",
      keywords: "",
      excludeKeywords: ""
    }
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      return apiRequest('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          ...campaignData,
          userId,
          companyId: 1,
          stats: { sent: 0, opened: 0, replied: 0, meetings: 0, responseRate: 0 }
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns/user', userId] });
      onOpenChange(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: "",
      description: "",
      targetAudience: "",
      messageTemplate: "",
      sequences: [],
      status: "draft",
      leadSource: "",
      hasExistingLeads: false,
      targetIndustries: [],
      targetRoles: [],
      companySizes: [],
      leadGenerationMethod: "",
      scrapingCriteria: {
        location: "",
        keywords: "",
        excludeKeywords: ""
      }
    });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    createCampaignMutation.mutate(formData);
  };

  const addSequenceStep = () => {
    const newStep = {
      type: "email",
      delay: 0,
      subject: "",
      content: ""
    };
    setFormData(prev => ({
      ...prev,
      sequences: [...prev.sequences, newStep]
    }));
  };

  const removeSequenceStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.filter((_, i) => i !== index)
    }));
  };

  const updateSequenceStep = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.map((seq, i) => 
        i === index ? { ...seq, [field]: value } : seq
      )
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const industries = ["SaaS", "Fintech", "Healthcare", "E-commerce", "Manufacturing", "Consulting", "Real Estate", "Education", "Non-profit"];
  const roles = ["CEO", "CTO", "VP of Sales", "Sales Director", "Head of Marketing", "Product Manager", "Operations Director", "Business Development"];
  const companySizes = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create New Campaign
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Step {step} of 5</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-2 h-2 rounded-full ${
                      stepNum <= step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Tell us about your campaign goals and lead preferences"}
            {step === 2 && "Define your ideal customer profile and target audience"}
            {step === 3 && "Choose how you want to find and generate leads"}
            {step === 4 && "Set up your multi-channel outreach sequence"}
            {step === 5 && "Review and launch your campaign"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Step 1: Campaign Setup & Lead Questions */}
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Campaign Basics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name *</Label>
                    <Input
                      id="campaign-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Enterprise SaaS Outreach Q1 2025"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="campaign-description">Campaign Description</Label>
                    <Textarea
                      id="campaign-description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the goals and strategy for this campaign..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Lead Source
                  </CardTitle>
                  <CardDescription>What type of leads are you looking for?</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={formData.hasExistingLeads ? "existing" : "generate"}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, hasExistingLeads: value === "existing" }))}
                    className="grid grid-cols-1 gap-4"
                  >
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="existing" id="existing-leads" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="existing-leads" className="font-medium text-base">I have existing leads</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Upload your contact list or import from your CRM. Perfect if you already have a database of prospects.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="generate" id="generate-leads" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="generate-leads" className="font-medium text-base">I need help finding leads</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Let us scrape and find potential clients based on your target criteria. We'll use LinkedIn, company databases, and AI discovery.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What type of clients are you looking for?</CardTitle>
                  <CardDescription>Help us understand your ideal customer profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="Describe your ideal clients: industry, company size, job titles, pain points, etc. For example: 'VP of Sales at growing SaaS companies (50-200 employees) who are struggling with lead generation and looking to scale their sales operations...'"
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Target Audience Details */}
          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Target Industries</CardTitle>
                  <CardDescription>Which industries do you want to target?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {industries.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox
                          id={industry}
                          checked={formData.targetIndustries.includes(industry)}
                          onCheckedChange={() => setFormData(prev => ({
                            ...prev,
                            targetIndustries: toggleArrayItem(prev.targetIndustries, industry)
                          }))}
                        />
                        <Label htmlFor={industry} className="text-sm">{industry}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Roles & Job Titles</CardTitle>
                  <CardDescription>What roles and positions do you want to reach?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={formData.targetRoles.includes(role)}
                          onCheckedChange={() => setFormData(prev => ({
                            ...prev,
                            targetRoles: toggleArrayItem(prev.targetRoles, role)
                          }))}
                        />
                        <Label htmlFor={role} className="text-sm">{role}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Size Preference</CardTitle>
                  <CardDescription>What size companies do you want to target?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-3">
                    {companySizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={size}
                          checked={formData.companySizes.includes(size)}
                          onCheckedChange={() => setFormData(prev => ({
                            ...prev,
                            companySizes: toggleArrayItem(prev.companySizes, size)
                          }))}
                        />
                        <Label htmlFor={size} className="text-sm">{size}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Lead Generation Method */}
          {step === 3 && (
            <div className="space-y-6">
              {formData.hasExistingLeads ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Your Leads
                    </CardTitle>
                    <CardDescription>Import your existing contact list</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Contact List</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload a CSV file with your contacts including: Email, First Name, Last Name, Company, Job Title
                      </p>
                      <Button variant="outline" size="lg">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: CSV, Excel (.xlsx)
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <Label className="text-lg font-medium">Or Import from CRM</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <Button variant="outline" className="h-16 flex-col space-y-2">
                          <Database className="h-6 w-6" />
                          <span>Salesforce</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex-col space-y-2">
                          <Database className="h-6 w-6" />
                          <span>HubSpot</span>
                        </Button>
                        <Button variant="outline" className="h-16 flex-col space-y-2">
                          <Database className="h-6 w-6" />
                          <span>Pipedrive</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Search className="h-5 w-5 mr-2" />
                        How should we find your leads?
                      </CardTitle>
                      <CardDescription>Choose your preferred lead generation method</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup 
                        value={formData.leadGenerationMethod}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, leadGenerationMethod: value }))}
                        className="space-y-4"
                      >
                        <div className="flex items-start space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="linkedin-scraping" id="linkedin-scraping" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Linkedin className="h-5 w-5 text-blue-600" />
                              <Label htmlFor="linkedin-scraping" className="font-medium text-base">LinkedIn Lead Scraping</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Find prospects using LinkedIn Sales Navigator and advanced search filters. Best for B2B sales and specific role targeting.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="company-database" id="company-database" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Database className="h-5 w-5 text-green-600" />
                              <Label htmlFor="company-database" className="font-medium text-base">Company Database Search</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Search through our comprehensive database of 50M+ companies and contacts. Ideal for broad market research and industry targeting.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="ai-discovery" id="ai-discovery" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Sparkles className="h-5 w-5 text-purple-600" />
                              <Label htmlFor="ai-discovery" className="font-medium text-base">AI-Powered Discovery</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Let our AI analyze your target criteria and automatically discover the best prospects. Perfect for new markets or complex targeting.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Lead Search Criteria</CardTitle>
                      <CardDescription>Fine-tune your lead discovery parameters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Geographic Location</Label>
                          <Input
                            id="location"
                            value={formData.scrapingCriteria.location}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              scrapingCriteria: { ...prev.scrapingCriteria, location: e.target.value }
                            }))}
                            placeholder="e.g., San Francisco Bay Area, United States, Europe"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="keywords">Include Keywords</Label>
                          <Input
                            id="keywords"
                            value={formData.scrapingCriteria.keywords}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              scrapingCriteria: { ...prev.scrapingCriteria, keywords: e.target.value }
                            }))}
                            placeholder="e.g., SaaS, B2B, sales automation, growth"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="exclude-keywords">Exclude Keywords</Label>
                        <Input
                          id="exclude-keywords"
                          value={formData.scrapingCriteria.excludeKeywords}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            scrapingCriteria: { ...prev.scrapingCriteria, excludeKeywords: e.target.value }
                          }))}
                          placeholder="e.g., competitor names, irrelevant industries, nonprofit"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Outreach Sequence */}
          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Initial Message Template</CardTitle>
                  <CardDescription>Create your first outreach message</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.messageTemplate}
                    onChange={(e) => setFormData(prev => ({ ...prev, messageTemplate: e.target.value }))}
                    placeholder="Hi {{firstName}}, I noticed {{company}} has been scaling rapidly in the {{industry}} space. Many companies at your stage struggle with consistent lead generation and sales automation. 

Our AI-powered platform has helped similar companies like {{competitor}} increase their qualified leads by 3x while reducing manual work by 70%.

Would you be open to a 15-minute conversation about how we could help {{company}} achieve similar results?

Best regards,
[Your Name]"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Available variables: {{firstName}}, {{lastName}}, {{company}}, {{jobTitle}}, {{industry}}, {{competitor}}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Follow-up Sequence
                    <Button size="sm" variant="outline" onClick={addSequenceStep}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Follow-up
                    </Button>
                  </CardTitle>
                  <CardDescription>Set up automated follow-up messages to increase response rates</CardDescription>
                </CardHeader>
                <CardContent>
                  {formData.sequences.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-muted-foreground mb-4">No follow-up messages added yet</p>
                      <Button onClick={addSequenceStep}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Follow-up
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.sequences.map((seq, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium flex items-center">
                              {seq.type === 'email' && <Mail className="h-4 w-4 mr-2 text-green-600" />}
                              {seq.type === 'linkedin' && <Linkedin className="h-4 w-4 mr-2 text-blue-600" />}
                              Follow-up {index + 1}
                            </h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeSequenceStep(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Channel</Label>
                              <Select
                                value={seq.type}
                                onValueChange={(value) => updateSequenceStep(index, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="linkedin">LinkedIn Message</SelectItem>
                                  <SelectItem value="phone">Phone Call</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Days After Previous</Label>
                              <Input
                                type="number"
                                value={seq.delay}
                                onChange={(e) => updateSequenceStep(index, 'delay', parseInt(e.target.value))}
                                min="1"
                                max="30"
                              />
                            </div>
                          </div>

                          {seq.type === 'email' && (
                            <div className="space-y-2">
                              <Label>Subject Line</Label>
                              <Input
                                value={seq.subject}
                                onChange={(e) => updateSequenceStep(index, 'subject', e.target.value)}
                                placeholder="Follow-up: {{company}} lead generation discussion"
                              />
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <Label>Message Content</Label>
                            <Textarea
                              value={seq.content}
                              onChange={(e) => updateSequenceStep(index, 'content', e.target.value)}
                              placeholder="Hi {{firstName}}, following up on my previous message about helping {{company}} with lead generation..."
                              rows={4}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Review & Launch */}
          {step === 5 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium">Campaign Name</Label>
                        <p className="text-sm text-muted-foreground">{formData.name}</p>
                      </div>
                      
                      <div>
                        <Label className="font-medium">Lead Source</Label>
                        <p className="text-sm text-muted-foreground">
                          {formData.hasExistingLeads ? "Existing Leads (Upload)" : formData.leadGenerationMethod === "linkedin-scraping" ? "LinkedIn Scraping" : formData.leadGenerationMethod === "company-database" ? "Company Database" : "AI Discovery"}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="font-medium">Target Industries</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.targetIndustries.slice(0, 3).map(industry => (
                            <Badge key={industry} variant="outline" className="text-xs">{industry}</Badge>
                          ))}
                          {formData.targetIndustries.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{formData.targetIndustries.length - 3} more</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium">Target Roles</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.targetRoles.slice(0, 2).map(role => (
                            <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                          ))}
                          {formData.targetRoles.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{formData.targetRoles.length - 2} more</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="font-medium">Company Sizes</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.companySizes.map(size => (
                            <Badge key={size} variant="outline" className="text-xs">{size}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="font-medium">Total Sequence Steps</Label>
                        <p className="text-sm text-muted-foreground">{formData.sequences.length + 1} (Initial + {formData.sequences.length} follow-ups)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Outreach Sequence Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Initial Outreach</div>
                        <div className="text-sm text-muted-foreground">First contact message • Immediate</div>
                      </div>
                    </div>
                    
                    {formData.sequences.map((seq, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 2}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center">
                            {seq.type === 'email' && <Mail className="h-4 w-4 mr-2 text-green-600" />}
                            {seq.type === 'linkedin' && <Linkedin className="h-4 w-4 mr-2 text-blue-600" />}
                            <span className="capitalize">{seq.type} Follow-up</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {seq.delay === 1 ? '1 day' : `${seq.delay} days`} after previous step
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Message Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="text-sm whitespace-pre-wrap">
                      {formData.messageTemplate || "No message template provided"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            
            {step === 5 ? (
              <Button
                onClick={handleSubmit}
                disabled={createCampaignMutation.isPending}
                className="sparq-gradient hover:sparq-gradient-hover text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                {createCampaignMutation.isPending ? "Creating Campaign..." : "Create Campaign"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={step === 1 && !formData.name}
                className="sparq-gradient hover:sparq-gradient-hover text-white"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}