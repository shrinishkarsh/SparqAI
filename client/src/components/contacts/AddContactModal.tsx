import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Plus, User, Building, Sparkles, Mail, Linkedin, Clock, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().min(1, "Company is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  campaignId: z.number().min(1, "Campaign selection is required"),
  status: z.enum(["cold", "warm", "hot", "connected"]),
  notes: z.string().optional()
});

type ContactForm = z.infer<typeof contactSchema>;

interface AddContactModalProps {
  children: React.ReactNode;
}

export function AddContactModal({ children }: AddContactModalProps) {
  const [open, setOpen] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns } = useQuery({
    queryKey: ["/api/campaigns/user/1"],
    queryFn: () => api.getCampaignsByUserId(1),
  });

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      jobTitle: "",
      linkedinUrl: "",
      phone: "",
      companySize: "",
      industry: "",
      campaignId: 0,
      status: "cold",
      notes: ""
    }
  });

  const enrichLeadMutation = useMutation({
    mutationFn: async (data: { email: string; firstName: string; lastName: string; company?: string }) => {
      return api.enrichLead(data.email, data.firstName, data.lastName, data.company);
    },
    onSuccess: (data) => {
      if (data) {
        setEnrichedData(data);
        // Auto-fill form with enriched data
        if (data.company) form.setValue('company', data.company);
        if (data.industry) form.setValue('industry', data.industry);
        if (data.companySize) form.setValue('companySize', data.companySize);
        if (data.socialMediaPresence?.linkedin) {
          form.setValue('linkedinUrl', data.socialMediaPresence.linkedin);
        }
        
        toast({
          title: "Lead Enriched",
          description: "Contact information has been enhanced with AI data."
        });
      }
      setEnriching(false);
    },
    onError: (error: any) => {
      toast({
        title: "Enrichment Failed",
        description: error.message || "Could not enrich contact data",
        variant: "destructive"
      });
      setEnriching(false);
    }
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          ...data,
          enrichmentData: enrichedData
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create contact');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Contact Added",
        description: "New contact has been added to your campaign."
      });
      setOpen(false);
      form.reset();
      setEnrichedData(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create contact",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ContactForm) => {
    createContactMutation.mutate(data);
  };

  const handleEnrichLead = () => {
    const formData = form.getValues();
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please enter at least first name, last name, and email to enrich the lead.",
        variant: "destructive"
      });
      return;
    }

    setEnriching(true);
    enrichLeadMutation.mutate({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company || undefined
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Add New Contact
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="enrichment">AI Enrichment</TabsTrigger>
                <TabsTrigger value="campaign">Campaign Assignment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Corp" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="VP of Sales" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="enrichment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                        AI Lead Enrichment
                      </CardTitle>
                      <Button 
                        type="button"
                        onClick={handleEnrichLead}
                        disabled={enriching}
                        className="sparq-gradient hover:sparq-gradient-hover text-white"
                      >
                        {enriching ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Enriching...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Enrich Lead
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!enrichedData && !enriching && (
                      <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-medium text-gray-900 mb-2">AI-Powered Lead Enrichment</h3>
                        <p className="text-gray-600 mb-4">
                          Fill in the basic contact information and click "Enrich Lead" to automatically gather:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Company information
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Industry & company size
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Recent company news
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            Technology stack
                          </div>
                        </div>
                      </div>
                    )}

                    {enrichedData && (
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-medium text-green-800">Lead enrichment complete!</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Company</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded">{enrichedData.company}</p>
                          </div>
                          <div>
                            <Label>Industry</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded">{enrichedData.industry}</p>
                          </div>
                          <div>
                            <Label>Company Size</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded">{enrichedData.companySize}</p>
                          </div>
                          <div>
                            <Label>Revenue</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded">{enrichedData.revenue}</p>
                          </div>
                        </div>

                        {enrichedData.technologies && enrichedData.technologies.length > 0 && (
                          <div>
                            <Label>Technologies</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {enrichedData.technologies.map((tech: string, index: number) => (
                                <Badge key={index} variant="outline">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {enrichedData.recentNews && enrichedData.recentNews.length > 0 && (
                          <div>
                            <Label>Recent News</Label>
                            <div className="space-y-2 mt-1">
                              {enrichedData.recentNews.slice(0, 3).map((news: string, index: number) => (
                                <p key={index} className="text-sm bg-blue-50 p-2 rounded">{news}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="campaign" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Campaign Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="campaignId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign to Campaign</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a campaign" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {campaigns?.map((campaign: any) => (
                                <SelectItem key={campaign.id} value={campaign.id.toString()}>
                                  {campaign.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lead Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cold">Cold</SelectItem>
                                <SelectItem value="warm">Warm</SelectItem>
                                <SelectItem value="hot">Hot</SelectItem>
                                <SelectItem value="connected">Connected</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-500">201-500 employees</SelectItem>
                                <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                <SelectItem value="1000+">1000+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add any additional notes about this contact..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-6">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createContactMutation.isPending}
                className="sparq-gradient hover:sparq-gradient-hover text-white"
              >
                {createContactMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Adding Contact...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}