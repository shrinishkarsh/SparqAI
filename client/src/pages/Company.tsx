import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Building2, Globe, Users, Target, TrendingUp, MapPin, Briefcase, Zap, DollarSign, Edit, Save, X, Mail, Linkedin, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Company() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  
  const { data: company, isLoading } = useQuery({
    queryKey: [`/api/companies/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      const companyData = Array.isArray(company) ? company[0] : company;
      return apiRequest(`/api/companies/${companyData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/companies/user/${user?.id}`] });
      setIsEditing(false);
      toast({
        title: "Company information updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update company",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No company information found</h3>
          <p className="text-gray-500 mt-2">Please complete the onboarding process to set up your company profile.</p>
        </div>
      </div>
    );
  }

  const companyData = Array.isArray(company) ? company[0] : company;

  const handleEdit = () => {
    setEditedData({
      name: companyData.name || "",
      website: companyData.website || "",
      description: companyData.description || "",
      industry: companyData.industry || "",
      size: companyData.size || "",
      geographicFocus: companyData.geographicFocus || "",
      targetMarket: companyData.targetMarket || "",
      idealCustomerProfile: companyData.idealCustomerProfile || "",
      valueProposition: companyData.valueProposition || "",
      companyGoals: companyData.companyGoals || "",
      salesProcess: companyData.salesProcess || "",
      revenueModel: companyData.revenueModel || "",
      competitiveAdvantage: companyData.competitiveAdvantage || "",
      preferredChannels: companyData.preferredChannels || [],
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleSave = () => {
    updateCompanyMutation.mutate(editedData);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Profile</h2>
          <p className="text-muted-foreground">
            Your company information that SparqOS uses to craft personalized campaigns
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Information
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateCompanyMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateCompanyMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Information Card */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
            <CardDescription>Core details about your company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditing ? (
              <>
                <div>
                  <h4 className="text-lg font-semibold">{companyData.name}</h4>
                  {companyData.website && (
                    <a 
                      href={companyData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <Globe className="h-4 w-4" />
                      {companyData.website}
                    </a>
                  )}
                </div>
                
                {companyData.description && (
                  <div>
                    <p className="text-sm text-gray-600">{companyData.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {companyData.industry && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {companyData.industry}
                    </Badge>
                  )}
                  {companyData.size && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {companyData.size}
                    </Badge>
                  )}
                  {companyData.geographicFocus && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {companyData.geographicFocus}
                    </Badge>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      value={editedData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editedData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editedData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your company's mission and services"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={editedData.industry}
                      onValueChange={(value) => handleInputChange("industry", value)}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Select
                      value={editedData.size}
                      onValueChange={(value) => handleInputChange("size", value)}
                    >
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="geographicFocus">Geographic Focus</Label>
                    <Input
                      id="geographicFocus"
                      value={editedData.geographicFocus}
                      onChange={(e) => handleInputChange("geographicFocus", e.target.value)}
                      placeholder="e.g., North America"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Target Market Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Target Market
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isEditing ? (
              <>
                {companyData.targetMarket && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Market Focus</p>
                    <p className="text-sm text-gray-600">{companyData.targetMarket}</p>
                  </div>
                )}
                {companyData.idealCustomerProfile && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Ideal Customer</p>
                    <p className="text-sm text-gray-600">{companyData.idealCustomerProfile}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="targetMarket">Market Focus</Label>
                  <Textarea
                    id="targetMarket"
                    value={editedData.targetMarket}
                    onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                    placeholder="Describe your target market"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idealCustomerProfile">Ideal Customer Profile</Label>
                  <Textarea
                    id="idealCustomerProfile"
                    value={editedData.idealCustomerProfile}
                    onChange={(e) => handleInputChange("idealCustomerProfile", e.target.value)}
                    placeholder="Describe your ideal customer"
                    rows={2}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Value Proposition Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Value Proposition
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              companyData.valueProposition ? (
                <p className="text-sm text-gray-600">{companyData.valueProposition}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">Not specified</p>
              )
            ) : (
              <div className="space-y-2">
                <Label htmlFor="valueProposition">Your Unique Value</Label>
                <Textarea
                  id="valueProposition"
                  value={editedData.valueProposition}
                  onChange={(e) => handleInputChange("valueProposition", e.target.value)}
                  placeholder="What makes your company unique?"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Goals Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Business Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              companyData.companyGoals ? (
                <p className="text-sm text-gray-600">{companyData.companyGoals}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">Not specified</p>
              )
            ) : (
              <div className="space-y-2">
                <Label htmlFor="companyGoals">Goals & Objectives</Label>
                <Textarea
                  id="companyGoals"
                  value={editedData.companyGoals}
                  onChange={(e) => handleInputChange("companyGoals", e.target.value)}
                  placeholder="What are your key business goals?"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales Process Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-indigo-600" />
              Sales Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isEditing ? (
              <>
                {companyData.salesProcess && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Process Overview</p>
                    <p className="text-sm text-gray-600">{companyData.salesProcess}</p>
                  </div>
                )}
                {companyData.revenueModel && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Revenue Model</p>
                    <p className="text-sm text-gray-600">{companyData.revenueModel}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="salesProcess">Sales Process</Label>
                  <Textarea
                    id="salesProcess"
                    value={editedData.salesProcess}
                    onChange={(e) => handleInputChange("salesProcess", e.target.value)}
                    placeholder="Describe your sales process"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenueModel">Revenue Model</Label>
                  <Input
                    id="revenueModel"
                    value={editedData.revenueModel}
                    onChange={(e) => handleInputChange("revenueModel", e.target.value)}
                    placeholder="e.g., Subscription, One-time, Usage-based"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Competitive Advantage Card */}
        {(companyData.competitiveAdvantage || isEditing) && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Competitive Advantage
              </CardTitle>
              <CardDescription>What sets your company apart</CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <p className="text-sm text-gray-600">{companyData.competitiveAdvantage}</p>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="competitiveAdvantage">Your Competitive Edge</Label>
                  <Textarea
                    id="competitiveAdvantage"
                    value={editedData.competitiveAdvantage}
                    onChange={(e) => handleInputChange("competitiveAdvantage", e.target.value)}
                    placeholder="What gives you an edge over competitors?"
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preferred Channels Card */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-600" />
              Preferred Channels
            </CardTitle>
            <CardDescription>Outreach channels for campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="flex flex-wrap gap-2">
                {companyData.preferredChannels && companyData.preferredChannels.length > 0 ? (
                  companyData.preferredChannels.map((channel: string) => (
                    <Badge key={channel} variant="secondary" className="flex items-center gap-1">
                      {channel === 'email' && <Mail className="h-3 w-3" />}
                      {channel === 'linkedin' && <Linkedin className="h-3 w-3" />}
                      {channel === 'phone' && <Phone className="h-3 w-3" />}
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No channels selected</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Label>Select Preferred Channels</Label>
                <div className="space-y-2">
                  {['email', 'linkedin', 'phone'].map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel}
                        checked={editedData.preferredChannels?.includes(channel) || false}
                        onCheckedChange={(checked) => {
                          const channels = editedData.preferredChannels || [];
                          if (checked) {
                            handleInputChange("preferredChannels", [...channels, channel]);
                          } else {
                            handleInputChange("preferredChannels", channels.filter((c: string) => c !== channel));
                          }
                        }}
                      />
                      <Label htmlFor={channel} className="flex items-center gap-2 cursor-pointer">
                        {channel === 'email' && <Mail className="h-4 w-4" />}
                        {channel === 'linkedin' && <Linkedin className="h-4 w-4" />}
                        {channel === 'phone' && <Phone className="h-4 w-4" />}
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>How SparqOS uses this information:</strong> Your company profile helps us create highly targeted campaigns, 
          personalize outreach messages, and ensure all communications align with your brand voice and business objectives.
          The more complete your profile, the better we can optimize your sales development efforts.
        </p>
      </div>
    </div>
  );
}