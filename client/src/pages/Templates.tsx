import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Mail, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  TrendingUp, 
  Eye, 
  Sparkles,
  BarChart3,
  Target,
  Clock,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  industry: string;
  openRate: number;
  replyRate: number;
  isActive: boolean;
  createdAt: string;
  userId: number;
}

export function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for templates
  const mockTemplates: EmailTemplate[] = [
    {
      id: 1,
      name: "SaaS Introduction Template",
      subject: "Quick question about {{company}}'s {{pain_point}}",
      body: "Hi {{firstName}},\n\nI noticed {{company}} is in the {{industry}} space and thought you might be interested in how we've helped similar companies reduce their {{pain_point}} by up to 40%.\n\nWould you be open to a brief 15-minute call this week to discuss how this might apply to {{company}}?\n\nBest regards,\n{{senderName}}",
      category: "cold_outreach",
      industry: "SaaS",
      openRate: 67,
      replyRate: 23,
      isActive: true,
      createdAt: "2024-01-15",
      userId: 1
    },
    {
      id: 2,
      name: "Follow-up After Demo",
      subject: "Following up on our demo - {{company}}",
      body: "Hi {{firstName}},\n\nThank you for taking the time to see our demo yesterday. I hope you found it valuable and that it addressed your questions about {{specific_topic}}.\n\nAs discussed, I've attached the ROI calculator and case study from {{similar_company}}. Based on what you shared, I believe you could see similar results within {{timeframe}}.\n\nWhen would be a good time to discuss next steps?\n\nBest regards,\n{{senderName}}",
      category: "follow_up",
      industry: "General",
      openRate: 78,
      replyRate: 45,
      isActive: true,
      createdAt: "2024-01-20",
      userId: 1
    },
    {
      id: 3,
      name: "Event Connection Request",
      subject: "Great meeting you at {{event_name}}",
      body: "Hi {{firstName}},\n\nIt was great meeting you at {{event_name}} yesterday. I really enjoyed our conversation about {{conversation_topic}}.\n\nAs promised, I'm sending over the resource we discussed about {{resource_topic}}. I think this could be particularly relevant for {{company}}'s {{specific_challenge}}.\n\nLet's continue our conversation - are you available for a quick call next week?\n\nBest regards,\n{{senderName}}",
      category: "networking",
      industry: "General",
      openRate: 85,
      replyRate: 52,
      isActive: true,
      createdAt: "2024-01-25",
      userId: 1
    }
  ];

  const { data: templates = mockTemplates } = useQuery({
    queryKey: ["/api/templates"],
    queryFn: async () => {
      // This would be the actual API call
      return mockTemplates;
    }
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cold_outreach", label: "Cold Outreach" },
    { value: "follow_up", label: "Follow-up" },
    { value: "networking", label: "Networking" },
    { value: "nurture", label: "Nurture" },
    { value: "closing", label: "Closing" }
  ];

  const CreateTemplateModal = () => (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Email Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Template Name</Label>
              <Input placeholder="Enter template name" />
            </div>
            <div>
              <Label>Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Subject Line</Label>
            <Input placeholder="Enter subject line with variables like {{firstName}}" />
          </div>
          <div>
            <Label>Email Body</Label>
            <Textarea 
              placeholder="Enter email body with variables like {{firstName}}, {{company}}, etc."
              rows={10}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Template Created",
                description: "Your email template has been created successfully.",
              });
              setIsCreateModalOpen(false);
            }}>
              Create Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-gray-600 mt-1">Create and manage professional email templates for your campaigns</p>
        </div>
        <CreateTemplateModal />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
          <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="outline">{template.category.replace('_', ' ')}</Badge>
                        {template.isActive && <Badge variant="default">Active</Badge>}
                      </div>
                      <CardDescription className="text-sm">
                        <strong>Subject:</strong> {template.subject}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-6 text-sm">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                        <span className="font-medium">{template.openRate}%</span>
                        <span className="text-gray-500 ml-1">Open Rate</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1 text-blue-500" />
                        <span className="font-medium">{template.replyRate}%</span>
                        <span className="text-gray-500 ml-1">Reply Rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-3">{template.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Top Performing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Event Connection</span>
                    <Badge variant="default">85% Open</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Follow-up Demo</span>
                    <Badge variant="default">78% Open</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SaaS Introduction</span>
                    <Badge variant="default">67% Open</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  Best Reply Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Event Connection</span>
                    <Badge variant="default">52% Reply</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Follow-up Demo</span>
                    <Badge variant="default">45% Reply</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SaaS Introduction</span>
                    <Badge variant="default">23% Reply</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-500" />
                  Usage Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Templates</span>
                    <span className="font-semibold">{templates.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Templates</span>
                    <span className="font-semibold">{templates.filter(t => t.isActive).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Open Rate</span>
                    <span className="font-semibold">77%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ab-testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                A/B Testing Hub
              </CardTitle>
              <CardDescription>
                Test different versions of your templates to optimize performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Start Your First A/B Test</h3>
                <p className="text-gray-600 mb-4">
                  Compare different subject lines, email content, and send times to find what works best
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create A/B Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}