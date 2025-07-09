import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Globe, Users, Target, TrendingUp, MapPin, Briefcase, Zap, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Company() {
  const { user } = useAuth();
  
  const { data: company, isLoading } = useQuery({
    queryKey: [`/api/companies/user/${user?.id}`],
    enabled: !!user?.id,
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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Company Profile</h2>
        <p className="text-muted-foreground">
          Your company information that SparqOS uses to craft personalized campaigns
        </p>
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
            {companyData.valueProposition ? (
              <p className="text-sm text-gray-600">{companyData.valueProposition}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">Not specified</p>
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
            {companyData.companyGoals ? (
              <p className="text-sm text-gray-600">{companyData.companyGoals}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">Not specified</p>
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
          </CardContent>
        </Card>

        {/* Competitive Advantage Card */}
        {companyData.competitiveAdvantage && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Competitive Advantage
              </CardTitle>
              <CardDescription>What sets your company apart</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{companyData.competitiveAdvantage}</p>
            </CardContent>
          </Card>
        )}
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