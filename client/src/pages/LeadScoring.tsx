import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Target, 
  Star, 
  Zap, 
  Users, 
  Building,
  Mail,
  Calendar,
  Award,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface LeadScore {
  id: number;
  contactId: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
  industry: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  lastActivity: string;
  engagement: number;
  demographics: number;
  behavioral: number;
  firmographic: number;
  factors: ScoreFactor[];
}

interface ScoreFactor {
  category: string;
  factor: string;
  points: number;
  weight: number;
}

export function LeadScoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [sortOrder, setSortOrder] = useState("desc");

  // Mock lead scoring data
  const mockLeadScores: LeadScore[] = [
    {
      id: 1,
      contactId: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@techcorp.com",
      company: "TechCorp Solutions",
      title: "VP of Engineering",
      industry: "Technology",
      score: 92,
      grade: 'A',
      lastActivity: "2024-01-15T10:30:00Z",
      engagement: 88,
      demographics: 95,
      behavioral: 90,
      firmographic: 96,
      factors: [
        { category: "Demographics", factor: "Senior Executive Title", points: 25, weight: 0.3 },
        { category: "Firmographic", factor: "Target Industry", points: 20, weight: 0.25 },
        { category: "Behavioral", factor: "High Email Engagement", points: 15, weight: 0.2 },
        { category: "Firmographic", factor: "Company Size (500-1000)", points: 15, weight: 0.15 },
        { category: "Behavioral", factor: "Multiple Touchpoints", points: 12, weight: 0.1 }
      ]
    },
    {
      id: 2,
      contactId: 2,
      firstName: "Michael",
      lastName: "Chen",
      email: "m.chen@innovate.io",
      company: "InnovateCorp",
      title: "CTO",
      industry: "SaaS",
      score: 87,
      grade: 'A',
      lastActivity: "2024-01-14T14:20:00Z",
      engagement: 85,
      demographics: 92,
      behavioral: 82,
      firmographic: 89,
      factors: [
        { category: "Demographics", factor: "C-Level Executive", points: 30, weight: 0.35 },
        { category: "Firmographic", factor: "High Growth Company", points: 18, weight: 0.2 },
        { category: "Behavioral", factor: "Opened Multiple Emails", points: 15, weight: 0.18 },
        { category: "Firmographic", factor: "Recent Funding", points: 14, weight: 0.15 },
        { category: "Behavioral", factor: "Website Visits", points: 10, weight: 0.12 }
      ]
    },
    {
      id: 3,
      contactId: 3,
      firstName: "Lisa",
      lastName: "Rodriguez",
      email: "l.rodriguez@startup.co",
      company: "StartupCo",
      title: "Marketing Director",
      industry: "Marketing",
      score: 74,
      grade: 'B',
      lastActivity: "2024-01-13T09:15:00Z",
      engagement: 78,
      demographics: 72,
      behavioral: 75,
      firmographic: 71,
      factors: [
        { category: "Demographics", factor: "Director Level", points: 20, weight: 0.25 },
        { category: "Behavioral", factor: "Good Email Open Rate", points: 18, weight: 0.22 },
        { category: "Firmographic", factor: "Growing Company", points: 16, weight: 0.2 },
        { category: "Behavioral", factor: "Social Media Engagement", points: 12, weight: 0.18 },
        { category: "Demographics", factor: "Target Function", points: 8, weight: 0.15 }
      ]
    },
    {
      id: 4,
      contactId: 4,
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@enterprise.com",
      company: "Enterprise Solutions",
      title: "IT Manager",
      industry: "Enterprise",
      score: 61,
      grade: 'C',
      lastActivity: "2024-01-12T16:45:00Z",
      engagement: 65,
      demographics: 60,
      behavioral: 58,
      firmographic: 62,
      factors: [
        { category: "Demographics", factor: "Manager Level", points: 15, weight: 0.25 },
        { category: "Firmographic", factor: "Large Enterprise", points: 15, weight: 0.25 },
        { category: "Behavioral", factor: "Low Engagement", points: 10, weight: 0.2 },
        { category: "Firmographic", factor: "Relevant Industry", points: 12, weight: 0.18 },
        { category: "Demographics", factor: "IT Function", points: 9, weight: 0.12 }
      ]
    }
  ];

  const { data: leadScores = mockLeadScores } = useQuery({
    queryKey: ["/api/lead-scoring"],
    queryFn: async () => {
      // This would be the actual API call
      return mockLeadScores;
    }
  });

  const filteredAndSortedLeads = leadScores
    .filter(lead => {
      const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = gradeFilter === "all" || lead.grade === gradeFilter;
      return matchesSearch && matchesGrade;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof LeadScore];
      const bValue = b[sortBy as keyof LeadScore];
      const multiplier = sortOrder === "desc" ? -1 : 1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * multiplier;
      }
      return String(aValue).localeCompare(String(bValue)) * multiplier;
    });

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageScore = leadScores.reduce((sum, lead) => sum + lead.score, 0) / leadScores.length;
  const gradeDistribution = leadScores.reduce((acc, lead) => {
    acc[lead.grade] = (acc[lead.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Lead Scoring</h1>
          <p className="text-gray-600 mt-1">AI-powered lead prioritization and scoring system</p>
        </div>
        <Button>
          <Target className="h-4 w-4 mr-2" />
          Configure Scoring
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{Math.round(averageScore)}</span>
              <TrendingUp className="h-5 w-5 ml-2 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">A-Grade Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{gradeDistribution.A || 0}</span>
              <Star className="h-5 w-5 ml-2 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Top priority contacts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Hot Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{leadScores.filter(l => l.score >= 80).length}</span>
              <Zap className="h-5 w-5 ml-2 text-orange-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Score 80+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Scored</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{leadScores.length}</span>
              <Users className="h-5 w-5 ml-2 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Leads analyzed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scoring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scoring">Lead Scores</TabsTrigger>
          <TabsTrigger value="analysis">Score Analysis</TabsTrigger>
          <TabsTrigger value="model">Scoring Model</TabsTrigger>
        </TabsList>

        <TabsContent value="scoring" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="A">Grade A</SelectItem>
                    <SelectItem value="B">Grade B</SelectItem>
                    <SelectItem value="C">Grade C</SelectItem>
                    <SelectItem value="D">Grade D</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="firstName">Name</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="lastActivity">Last Activity</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                >
                  {sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lead Scores List */}
          <div className="space-y-4">
            {filteredAndSortedLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-gray-700">
                          {lead.firstName[0]}{lead.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{lead.firstName} {lead.lastName}</h3>
                        <p className="text-gray-600">{lead.title} at {lead.company}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </span>
                          <Badge className={getGradeColor(lead.grade)}>
                            Grade {lead.grade}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Last active: {new Date(lead.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium">Engagement</Label>
                      <Progress value={lead.engagement} className="mt-1" />
                      <span className="text-xs text-gray-500">{lead.engagement}%</span>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Demographics</Label>
                      <Progress value={lead.demographics} className="mt-1" />
                      <span className="text-xs text-gray-500">{lead.demographics}%</span>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Behavioral</Label>
                      <Progress value={lead.behavioral} className="mt-1" />
                      <span className="text-xs text-gray-500">{lead.behavioral}%</span>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Firmographic</Label>
                      <Progress value={lead.firmographic} className="mt-1" />
                      <span className="text-xs text-gray-500">{lead.firmographic}%</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2">Top Scoring Factors</h4>
                    <div className="space-y-1">
                      {lead.factors.slice(0, 3).map((factor, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{factor.factor}</span>
                          <span className="font-medium text-green-600">+{factor.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Grade A (80-100)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${(gradeDistribution.A || 0) / leadScores.length * 100}%`}}></div>
                      </div>
                      <span className="text-sm">{gradeDistribution.A || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Grade B (60-79)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(gradeDistribution.B || 0) / leadScores.length * 100}%`}}></div>
                      </div>
                      <span className="text-sm">{gradeDistribution.B || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Grade C (40-59)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(gradeDistribution.C || 0) / leadScores.length * 100}%`}}></div>
                      </div>
                      <span className="text-sm">{gradeDistribution.C || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Grade D (0-39)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: `${(gradeDistribution.D || 0) / leadScores.length * 100}%`}}></div>
                      </div>
                      <span className="text-sm">{gradeDistribution.D || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">High-Quality Pipeline</h4>
                    <p className="text-sm text-green-700">
                      {Math.round(((gradeDistribution.A || 0) + (gradeDistribution.B || 0)) / leadScores.length * 100)}% of leads are Grade A or B
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Engagement Leader</h4>
                    <p className="text-sm text-blue-700">
                      C-Level executives show 40% higher engagement rates
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Industry Focus</h4>
                    <p className="text-sm text-purple-700">
                      Technology and SaaS companies have the highest conversion rates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="model" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scoring Model Configuration</CardTitle>
              <CardDescription>
                Customize how leads are scored based on different criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Scoring Weights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>Demographics (Title, Seniority)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">30%</span>
                        <Progress value={30} className="w-24" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-green-500" />
                        <span>Firmographic (Company Size, Industry)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">25%</span>
                        <Progress value={25} className="w-24" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-purple-500" />
                        <span>Behavioral (Email Opens, Clicks, Replies)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">25%</span>
                        <Progress value={25} className="w-24" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span>Engagement (Recent Activity, Frequency)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">20%</span>
                        <Progress value={20} className="w-24" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Award className="h-4 w-4 mr-2" />
                    Update Scoring Model
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}