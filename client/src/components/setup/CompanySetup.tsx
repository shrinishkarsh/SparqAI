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
import { Building, Users, Target, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const companySetupSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url("Please enter a valid website URL"),
  description: z.string().min(10, "Please provide a detailed description (at least 10 characters)"),
  industry: z.string().min(1, "Please select an industry"),
  size: z.string().min(1, "Please select company size"),
  targetIcp: z.string().min(10, "Please describe your ideal customer profile (at least 10 characters)")
});

type CompanySetupForm = z.infer<typeof companySetupSchema>;

const INDUSTRIES = [
  "Technology/SaaS",
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Retail/E-commerce",
  "Real Estate",
  "Education",
  "Marketing/Advertising",
  "Consulting",
  "Other"
];

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees"
];

interface CompanySetupProps {
  initialData?: any;
  onComplete: (data: any) => void;
}

export function CompanySetup({ initialData, onComplete }: CompanySetupProps) {
  const [isGeneratingIcp, setIsGeneratingIcp] = useState(false);
  const { toast } = useToast();

  const form = useForm<CompanySetupForm>({
    resolver: zodResolver(companySetupSchema),
    defaultValues: {
      name: initialData?.name || "",
      website: initialData?.website || "",
      description: initialData?.description || "",
      industry: initialData?.industry || "",
      size: initialData?.size || "",
      targetIcp: initialData?.targetIcp || ""
    }
  });

  const createCompanyMutation = useMutation({
    mutationFn: (data: CompanySetupForm) => {
      if (initialData?.id) {
        return api.updateCompany(initialData.id, { ...data, userId: 1 });
      } else {
        return api.createCompany({ ...data, userId: 1 });
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Company profile saved!",
        description: "Your company information has been updated.",
      });
      onComplete(data);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save company profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const generateIcpMutation = useMutation({
    mutationFn: async () => {
      const description = form.getValues("description");
      const industry = form.getValues("industry");
      
      if (!description || !industry) {
        throw new Error("Please fill in company description and industry first");
      }
      
      return api.generateTargetAudience(description, industry);
    },
    onSuccess: (audiences) => {
      if (audiences && audiences.length > 0) {
        const icpDescription = audiences.slice(0, 3).join(", ");
        form.setValue("targetIcp", icpDescription);
        toast({
          title: "ICP Generated!",
          description: "Your ideal customer profile has been generated using AI.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate ICP. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: CompanySetupForm) => {
    createCompanyMutation.mutate(data);
  };

  const handleGenerateIcp = () => {
    setIsGeneratingIcp(true);
    generateIcpMutation.mutate();
    setIsGeneratingIcp(false);
  };

  useEffect(() => {
    if (initialData) {
      onComplete(initialData);
    }
  }, [initialData, onComplete]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourcompany.com" {...field} />
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
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what your company does, your products/services, and your mission..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRIES.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COMPANY_SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Target ICP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Ideal Customer Profile (ICP)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="targetIcp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe Your Ideal Customer</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., CTOs and IT Directors at mid-market SaaS companies (100-500 employees) who are responsible for security infrastructure and have budget authority for cybersecurity solutions..."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateIcp}
                disabled={isGeneratingIcp || generateIcpMutation.isPending || !form.getValues("description") || !form.getValues("industry")}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {generateIcpMutation.isPending ? "Generating..." : "Generate ICP with AI"}
              </Button>

              <p className="text-xs text-gray-500">
                Our AI will analyze your company description and industry to suggest ideal customer profiles.
              </p>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full sparq-gradient hover:sparq-gradient-hover text-white"
            disabled={createCompanyMutation.isPending}
          >
            {createCompanyMutation.isPending ? "Saving..." : "Save Company Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
