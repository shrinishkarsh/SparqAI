import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Upload, Brain, Mail, Linkedin, FileSpreadsheet, Users, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().min(1, "Description is required"),
  productId: z.number().min(1, "Product selection is required"),
  channels: z.array(z.string()).min(1, "At least one channel is required"),
  listSource: z.enum(["upload", "ai_generated"]),
  strategy: z.string().min(1, "Strategy is required"),
  targetAudience: z.string().optional(),
});

const CHANNEL_OPTIONS = [
  { id: "email", label: "Email", icon: Mail, description: "Traditional email outreach" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, description: "LinkedIn connection requests and messages" },
];

const STRATEGY_OPTIONS = [
  { id: "cold_outreach", label: "Cold Outreach", description: "Direct outreach to cold prospects" },
  { id: "warm_introduction", label: "Warm Introduction", description: "Leveraging existing connections" },
  { id: "content_based", label: "Content-Based", description: "Lead with valuable content" },
  { id: "event_triggered", label: "Event-Triggered", description: "Based on specific triggers or events" },
];

interface CreateCampaignModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateCampaignModal({ trigger, open, onOpenChange }: CreateCampaignModalProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // Start at 0 for product selection
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [listSource, setListSource] = useState<"upload" | "ai_generated">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const modalOpen = open !== undefined ? open : isOpen;
  const setModalOpen = onOpenChange || setIsOpen;

  // Fetch company data
  const { data: company } = useQuery({
    queryKey: [`/api/companies/user/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: [`/api/products/user/${user?.id}`],
    enabled: !!user?.id,
  });

  // Check if user can create campaigns
  const canCreateCampaign = products && products.length > 0;

  const form = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      productId: 0,
      channels: [],
      listSource: "upload" as const,
      strategy: "",
      targetAudience: "",
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        userId: user?.id,
        companyId: company?.id,
        status: "draft",
      }),
    }),
    onSuccess: () => {
      toast({ title: "Campaign created successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      setModalOpen(false);
      setStep(0);
      form.reset();
      setSelectedChannels([]);
      setUploadedFile(null);
    },
    onError: () => {
      toast({ title: "Failed to create campaign", variant: "destructive" });
    },
  });

  const handleChannelToggle = (channelId: string) => {
    const updated = selectedChannels.includes(channelId)
      ? selectedChannels.filter(id => id !== channelId)
      : [...selectedChannels, channelId];
    setSelectedChannels(updated);
    form.setValue("channels", updated);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast({ 
          title: "Invalid file type", 
          description: "Please upload a CSV or Excel file",
          variant: "destructive" 
        });
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const onSubmit = (data: any) => {
    createCampaignMutation.mutate({
      ...data,
      channels: selectedChannels,
      listSource,
      totalContacts: uploadedFile ? 0 : undefined, // Will be populated after file processing
    });
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Select Product</h3>
              <p className="text-gray-600">Choose the product you want to promote in this campaign</p>
            </div>

            {productsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    You need to create products before starting campaigns
                  </p>
                  <Button variant="outline" onClick={() => {
                    setModalOpen(false);
                    window.location.href = '/products';
                  }}>
                    Go to Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-3">
                        {products.map((product: any) => (
                          <Card 
                            key={product.id} 
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              field.value === product.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}
                            onClick={() => field.onChange(product.id)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-base">{product.name}</CardTitle>
                                  <CardDescription>{product.category || product.price}</CardDescription>
                                </div>
                                <Badge variant="outline">{product.price}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {product.description}
                              </p>
                              {product.targetAudience && (
                                <div className="mt-2 pt-2 border-t">
                                  <p className="text-xs text-gray-500">
                                    <strong>Target:</strong> {product.targetAudience}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Campaign Basics</h3>
              <p className="text-gray-600">Let's start with the fundamental details</p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Q1 Enterprise Outreach" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your campaign objectives and approach..."
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
              name="strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outreach Strategy</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {STRATEGY_OPTIONS.map((strategy) => (
                          <SelectItem key={strategy.id} value={strategy.id}>
                            <div>
                              <div className="font-medium">{strategy.label}</div>
                              <div className="text-sm text-gray-600">{strategy.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Choose Channels</h3>
              <p className="text-gray-600">Select how you want to reach your prospects</p>
            </div>

            <div className="grid gap-4">
              {CHANNEL_OPTIONS.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedChannels.includes(channel.id);
                
                return (
                  <Card 
                    key={channel.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleChannelToggle(channel.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{channel.label}</h4>
                          <p className="text-sm text-gray-600">{channel.description}</p>
                        </div>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleChannelToggle(channel.id)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedChannels.length === 0 && (
              <p className="text-sm text-red-600 text-center">
                Please select at least one channel to continue
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Contact List</h3>
              <p className="text-gray-600">How do you want to build your prospect list?</p>
            </div>

            <div className="grid gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  listSource === "upload" ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => {
                  setListSource("upload");
                  form.setValue("listSource", "upload");
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      listSource === "upload" ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}>
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Upload Your List</h4>
                      <p className="text-sm text-gray-600">Upload a CSV or Excel file with your contacts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  listSource === "ai_generated" ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => {
                  setListSource("ai_generated");
                  form.setValue("listSource", "ai_generated");
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      listSource === "ai_generated" ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}>
                      <Brain className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">AI-Generated List</h4>
                      <p className="text-sm text-gray-600">Let AI find prospects based on your criteria</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {listSource === "upload" && (
              <div className="space-y-4">
                <Separator />
                <div>
                  <Label htmlFor="file-upload">Upload Contact List</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileSpreadsheet className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">CSV or Excel files only</p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  {uploadedFile && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-700">
                        ✓ {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {listSource === "ai_generated" && (
              <div className="space-y-4">
                <Separator />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience Criteria</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your ideal prospects: job titles, company size, industry, location, etc."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">AI will find prospects matching:</p>
                      <ul className="mt-1 list-disc list-inside text-xs space-y-1">
                        <li>Your target audience criteria</li>
                        <li>Your selected product's ideal customer profile</li>
                        <li>Your company's industry and focus</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.watch("productId") > 0;
      case 1:
        return form.watch("name") && form.watch("description") && form.watch("strategy");
      case 2:
        return selectedChannels.length > 0;
      case 3:
        return listSource === "ai_generated" || (listSource === "upload" && uploadedFile);
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0: return "Select Product";
      case 1: return "Campaign Basics";
      case 2: return "Choose Channels";
      case 3: return "Contact List";
      default: return "Create Campaign";
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a targeted outreach campaign in 4 simple steps
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[0, 1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNum <= step 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum + 1}
              </div>
              {stepNum < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  stepNum < step ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Show no products message when applicable */}
            {!productsLoading && products.length === 0 && step === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    You need to create products before starting campaigns. Each campaign must be tied to a specific product.
                  </p>
                  <Button 
                    type="button"
                    onClick={() => {
                      setModalOpen(false);
                      window.location.href = '/products';
                    }}
                  >
                    Go to Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              renderStepContent()
            )}

            <div className="flex justify-between pt-6 border-t">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              ) : (
                <div />
              )}

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                
                {step < 3 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!canProceed()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={!canProceed() || createCampaignMutation.isPending}
                  >
                    {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}