import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Package, Building2, CreditCard, Eye, EyeOff, Trash2, Edit3 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const currentUser = { id: 1, email: "alex@company.com", firstName: "Alex", lastName: "Johnson" };

const companySetupSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
  industry: z.string().min(1, "Industry is required"),
  size: z.string().min(1, "Company size is required"),
  targetMarket: z.string().min(1, "Target market is required"),
  valueProposition: z.string().min(1, "Value proposition is required"),
  idealCustomerProfile: z.string().min(1, "Ideal customer profile is required"),
  companyGoals: z.string().min(1, "Company goals are required"),
  salesProcess: z.string().min(1, "Sales process is required"),
  competitiveAdvantage: z.string().min(1, "Competitive advantage is required"),
  revenueModel: z.string().min(1, "Revenue model is required"),
  geographicFocus: z.string().min(1, "Geographic focus is required"),
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  competitiveAdvantage: z.string().min(1, "Competitive advantage is required"),
  features: z.array(z.string()).default([]),
  useCases: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  salesPoints: z.array(z.string()).default([]),
  documentationUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export default function Settings() {
  const [activeTab, setActiveTab] = useState("company");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch company data
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['/api/companies', currentUser.id],
    queryFn: () => api.getCompanyByUserId(currentUser.id),
  });

  // Fetch products data
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', currentUser.id],
    queryFn: () => api.getProductsByUserId(currentUser.id),
  });

  // Company form
  const companyForm = useForm({
    resolver: zodResolver(companySetupSchema),
    defaultValues: {
      name: company?.name || "",
      website: company?.website || "",
      description: company?.description || "",
      industry: company?.industry || "",
      size: company?.size || "",
      targetMarket: company?.targetMarket || "",
      valueProposition: company?.valueProposition || "",
      idealCustomerProfile: company?.idealCustomerProfile || "",
      companyGoals: company?.companyGoals || "",
      salesProcess: company?.salesProcess || "",
      competitiveAdvantage: company?.competitiveAdvantage || "",
      revenueModel: company?.revenueModel || "",
      geographicFocus: company?.geographicFocus || "",
    },
  });

  // Product form
  const productForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      targetAudience: "",
      competitiveAdvantage: "",
      features: [],
      useCases: [],
      benefits: [],
      salesPoints: [],
      documentationUrl: "",
    },
  });

  // Company mutation
  const companyMutation = useMutation({
    mutationFn: (data: any) => {
      if (company?.id) {
        return api.updateCompany(company.id, data);
      } else {
        return api.createCompany({ ...data, userId: currentUser.id });
      }
    },
    onSuccess: () => {
      toast({ title: "Company settings saved successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
    },
    onError: () => {
      toast({ title: "Failed to save company settings", variant: "destructive" });
    },
  });

  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: (data: any) => api.createProduct({
      ...data,
      userId: currentUser.id,
      companyId: company?.id,
    }),
    onSuccess: () => {
      toast({ title: "Product created successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductModalOpen(false);
      productForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateProduct(id, data),
    onSuccess: () => {
      toast({ title: "Product updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductModalOpen(false);
      setEditingProduct(null);
      productForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => api.deleteProduct(id),
    onSuccess: () => {
      toast({ title: "Product deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  // Update company form when data loads
  if (company && !companyForm.getValues().name) {
    companyForm.reset({
      name: company.name || "",
      website: company.website || "",
      description: company.description || "",
      industry: company.industry || "",
      size: company.size || "",
      targetMarket: company.targetMarket || "",
      valueProposition: company.valueProposition || "",
      idealCustomerProfile: company.idealCustomerProfile || "",
      companyGoals: company.companyGoals || "",
      salesProcess: company.salesProcess || "",
      competitiveAdvantage: company.competitiveAdvantage || "",
      revenueModel: company.revenueModel || "",
      geographicFocus: company.geographicFocus || "",
    });
  }

  const onCompanySubmit = (data: any) => {
    companyMutation.mutate(data);
  };

  const onProductSubmit = (data: any) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || "",
      targetAudience: product.targetAudience || "",
      competitiveAdvantage: product.competitiveAdvantage || "",
      features: product.features || [],
      useCases: product.useCases || [],
      benefits: product.benefits || [],
      salesPoints: product.salesPoints || [],
      documentationUrl: product.documentationUrl || "",
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-600">Manage your company setup, products, and billing settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Setup
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Company Setup Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Complete your company profile to help AI understand your business and optimize targeting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="saas">SaaS</SelectItem>
                                  <SelectItem value="fintech">Fintech</SelectItem>
                                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                                  <SelectItem value="healthcare">Healthcare</SelectItem>
                                  <SelectItem value="education">Education</SelectItem>
                                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                  <SelectItem value="consulting">Consulting</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-10">1-10 employees</SelectItem>
                                  <SelectItem value="11-50">11-50 employees</SelectItem>
                                  <SelectItem value="51-200">51-200 employees</SelectItem>
                                  <SelectItem value="201-500">201-500 employees</SelectItem>
                                  <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                  <SelectItem value="1000+">1000+ employees</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={companyForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what your company does..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="targetMarket"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Market</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Who is your target market?"
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="valueProposition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Value Proposition</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What value do you provide?"
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="idealCustomerProfile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ideal Customer Profile</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your ideal customer..."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="companyGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Goals</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What are your main goals?"
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="salesProcess"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sales Process</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your sales process..."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="competitiveAdvantage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Competitive Advantage</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What makes you different?"
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="revenueModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Revenue Model</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How do you make money?"
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="geographicFocus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Geographic Focus</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What regions do you target?"
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={companyMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      {companyMutation.isPending ? "Saving..." : "Save Company Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  Configure your AI and integration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">API Keys</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>OpenAI API Key</Label>
                      <div className="flex space-x-2">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-3">Notification Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Email notifications for responses</Label>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>SMS alerts for hot leads</Label>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Products</h2>
                <p className="text-gray-600">Manage your products to create targeted campaigns</p>
              </div>
              <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>
                      Add detailed information about your product to create targeted campaigns
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter product name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Software, Hardware, Service" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., $99/month, Custom pricing" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="documentationUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Documentation URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://docs.example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your product and its main functionality..."
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
                          control={productForm.control}
                          name="targetAudience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Audience</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Who is this product for?"
                                  className="min-h-[80px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="competitiveAdvantage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Competitive Advantage</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="What makes this product unique?"
                                  className="min-h-[80px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsProductModalOpen(false);
                            setEditingProduct(null);
                            productForm.reset();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        >
                          {createProductMutation.isPending || updateProductMutation.isPending ? "Saving..." : 
                           editingProduct ? "Update Product" : "Create Product"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Card key={product.id} className="relative">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription>{product.category}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {product.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Price:</span>
                          <span>{product.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Status:</span>
                          <Badge variant={product.isActive ? "default" : "secondary"}>
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      {product.targetAudience && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-gray-500">
                            <strong>Target:</strong> {product.targetAudience}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!productsLoading && products.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first product to start building targeted campaigns
                  </p>
                  <Button onClick={() => setIsProductModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Manage your SparqAI subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Pro Plan</h3>
                      <p className="text-sm text-gray-600">Advanced AI features and unlimited campaigns</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">$99</div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Campaigns</h4>
                      <p className="text-2xl font-bold text-blue-600">Unlimited</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Contacts</h4>
                      <p className="text-2xl font-bold text-green-600">50,000</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">AI Credits</h4>
                      <p className="text-2xl font-bold text-purple-600">10,000</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">View Usage</Button>
                    <Button variant="outline">Download Invoice</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Update your payment method and billing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Billing Email</Label>
                    <Input defaultValue="alex@company.com" />
                  </div>
                  <div>
                    <Label>Billing Address</Label>
                    <Input defaultValue="123 Business St, City, State 12345" />
                  </div>
                </div>

                <Button>Update Billing Information</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage & Analytics</CardTitle>
                <CardDescription>Track your monthly usage and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-600">Messages Sent</h4>
                    <p className="text-2xl font-bold">2,847</p>
                    <p className="text-sm text-green-600">+12% from last month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-600">AI Credits Used</h4>
                    <p className="text-2xl font-bold">3,241</p>
                    <p className="text-sm text-gray-600">68% remaining</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-600">Responses</h4>
                    <p className="text-2xl font-bold">426</p>
                    <p className="text-sm text-green-600">15% response rate</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-600">Meetings</h4>
                    <p className="text-2xl font-bold">87</p>
                    <p className="text-sm text-green-600">3.1% conversion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}