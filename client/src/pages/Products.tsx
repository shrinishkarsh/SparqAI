import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, DollarSign, Users, TrendingUp, Sparkles, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  features: string[];
  targetAudience: string;
  useCases: string;
  monthlyRevenue: number;
  customerCount: number;
  churnRate: number;
}

export default function Products() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    features: "",
    targetAudience: "",
    useCases: "",
    monthlyRevenue: 0,
    customerCount: 0,
    churnRate: 0,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: [`/api/products/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: company } = useQuery({
    queryKey: [`/api/companies/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const companyData = Array.isArray(company) ? company[0] : company;
      return apiRequest("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          userId: user?.id,
          companyId: companyData?.id,
          features: productData.features.split(",").map((f: string) => f.trim()).filter(Boolean),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/user/${user?.id}`] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Product created successfully",
        description: "Your product has been added to the catalog.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to create product",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...productData }: any) => {
      return apiRequest(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          features: productData.features.split(",").map((f: string) => f.trim()).filter(Boolean),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/user/${user?.id}`] });
      setEditingProduct(null);
      resetForm();
      toast({
        title: "Product updated successfully",
        description: "Your product changes have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update product",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/products/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/user/${user?.id}`] });
      toast({
        title: "Product deleted successfully",
        description: "The product has been removed from your catalog.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete product",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      features: "",
      targetAudience: "",
      useCases: "",
      monthlyRevenue: 0,
      customerCount: 0,
      churnRate: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, ...formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price || "",
      features: product.features?.join(", ") || "",
      targetAudience: product.targetAudience || "",
      useCases: product.useCases || "",
      monthlyRevenue: product.monthlyRevenue || 0,
      customerCount: product.customerCount || 0,
      churnRate: product.churnRate || 0,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog to create targeted campaigns
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                Product information will be used to create personalized campaigns
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Enterprise CRM Suite"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., $199/month"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your product"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Key Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="e.g., AI-powered insights, Real-time analytics, Custom dashboards"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g., B2B SaaS companies, 50-500 employees"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="useCases">Use Cases</Label>
                <Textarea
                  id="useCases"
                  value={formData.useCases}
                  onChange={(e) => setFormData({ ...formData, useCases: e.target.value })}
                  placeholder="How customers typically use this product"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    value={formData.monthlyRevenue}
                    onChange={(e) => setFormData({ ...formData, monthlyRevenue: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerCount">Customer Count</Label>
                  <Input
                    id="customerCount"
                    type="number"
                    value={formData.customerCount}
                    onChange={(e) => setFormData({ ...formData, customerCount: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="churnRate">Churn Rate (%)</Label>
                  <Input
                    id="churnRate"
                    type="number"
                    step="0.1"
                    value={formData.churnRate}
                    onChange={(e) => setFormData({ ...formData, churnRate: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingProduct(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products && products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
            <p className="text-gray-500 mt-2 mb-4">
              Add your first product to start creating targeted campaigns
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product: Product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="secondary" className="mt-1">
                        {product.price}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        handleEdit(product);
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProductMutation.mutate(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                
                {product.features && product.features.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {product.targetAudience && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Target Audience:</p>
                    <p className="text-xs text-gray-600">{product.targetAudience}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <DollarSign className="h-4 w-4 text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-medium">${product.monthlyRevenue?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500">MRR</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-medium">{product.customerCount || 0}</p>
                    <p className="text-xs text-gray-500">Customers</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                    <p className="text-xs font-medium">{product.churnRate || 0}%</p>
                    <p className="text-xs text-gray-500">Churn</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-start gap-2">
          <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-900">
              How SparqOS uses your products:
            </p>
            <p className="text-sm text-purple-800 mt-1">
              Product information helps us create highly targeted campaigns that speak directly to your prospects' needs. 
              We analyze features, pricing, and use cases to craft compelling value propositions and personalized outreach messages 
              that resonate with each lead based on their specific requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}