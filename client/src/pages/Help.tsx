import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  BookOpen, 
  Video, 
  Search, 
  ChevronRight,
  HelpCircle,
  FileText,
  Users,
  Settings,
  Zap,
  Target,
  BarChart3,
  Send,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium"
  });
  const { toast } = useToast();

  const supportTicketMutation = useMutation({
    mutationFn: async (data: typeof contactForm) => {
      const response = await fetch("/api/support/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit ticket");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Support ticket submitted",
        description: data.message || "We'll get back to you within 24 hours.",
      });
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "medium"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit ticket",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    supportTicketMutation.mutate(contactForm);
  };

  const faqItems = [
    {
      question: "How do I set up my first campaign?",
      answer: "Navigate to the Campaigns page and click 'New Campaign'. Follow the step-by-step wizard to define your target audience, create your email sequence, and launch your campaign."
    },
    {
      question: "How do I connect my email account?",
      answer: "Go to Integrations > Email and follow the setup instructions. We support Gmail, Outlook, and other major email providers with secure OAuth authentication."
    },
    {
      question: "Can I import existing contacts?",
      answer: "Yes! Use the import feature in the Contacts section. You can upload CSV files or connect your CRM to automatically sync contacts."
    },
    {
      question: "How do I track campaign performance?",
      answer: "Visit the Analytics page to see detailed metrics including open rates, click rates, replies, and conversions. You can also view individual campaign performance in the Campaigns section."
    },
    {
      question: "What integrations are available?",
      answer: "SparqAI integrates with LinkedIn, popular email providers, CRM systems, and other sales tools. Check the Integrations page for the full list."
    },
    {
      question: "How do I manage my subscription?",
      answer: "Go to Settings > Billing to view your current plan, update payment methods, or upgrade your subscription."
    }
  ];

  const quickLinks = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough for new users",
      icon: BookOpen,
      link: "#getting-started"
    },
    {
      title: "Campaign Creation",
      description: "Learn to create effective campaigns",
      icon: Target,
      link: "#campaigns"
    },
    {
      title: "Contact Management",
      description: "Import and organize your leads",
      icon: Users,
      link: "#contacts"
    },
    {
      title: "Analytics & Reporting",
      description: "Track your performance metrics",
      icon: BarChart3,
      link: "#analytics"
    },
    {
      title: "Integration Setup",
      description: "Connect your favorite tools",
      icon: Zap,
      link: "#integrations"
    },
    {
      title: "Account Settings",
      description: "Manage your profile and preferences",
      icon: Settings,
      link: "#settings"
    }
  ];

  const videoTutorials = [
    {
      title: "SparqAI Platform Overview",
      duration: "5:30",
      description: "Get familiar with the main features and interface"
    },
    {
      title: "Creating Your First Campaign",
      duration: "8:15",
      description: "Step-by-step guide to campaign setup"
    },
    {
      title: "Email Integration Setup",
      duration: "6:45",
      description: "Connect your email accounts securely"
    },
    {
      title: "Advanced Analytics Deep Dive",
      duration: "12:20",
      description: "Understanding your campaign metrics"
    }
  ];

  const filteredFAQ = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-lg text-gray-600">
            Get the help you need to succeed with SparqAI
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{link.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find answers to common questions about SparqAI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQ.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                  {filteredFAQ.length === 0 && searchQuery && (
                    <div className="text-center py-8 text-gray-500">
                      No FAQ items found matching your search.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </CardTitle>
                <CardDescription>
                  Learn SparqAI with our step-by-step video guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videoTutorials.map((video, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{video.title}</h3>
                        <Badge variant="outline">{video.duration}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Video className="h-4 w-4 mr-2" />
                        Watch Tutorial
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a href="#" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">User Guide</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">API Documentation</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Integration Guides</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>
                    Send us a message and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <Input
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input
                          required
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <Input
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Describe your issue or question in detail..."
                        rows={5}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={supportTicketMutation.isPending}>
                      <Send className="h-4 w-4 mr-2" />
                      {supportTicketMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Other Ways to Reach Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">support@sparqai.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-gray-600">Available 9 AM - 6 PM EST</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Phone className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Low Priority</span>
                        <Badge variant="outline">72 hours</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Medium Priority</span>
                        <Badge variant="outline">24 hours</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">High Priority</span>
                        <Badge variant="outline">8 hours</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Urgent</span>
                        <Badge className="bg-red-100 text-red-800">2 hours</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                  <CardDescription>
                    Tips and strategies for effective outreach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900">Email Deliverability Guide</h4>
                      <p className="text-sm text-gray-600">Improve your email open rates</p>
                    </a>
                    <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900">Writing Effective Subject Lines</h4>
                      <p className="text-sm text-gray-600">Boost engagement with better subjects</p>
                    </a>
                    <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900">Personalization Strategies</h4>
                      <p className="text-sm text-gray-600">Make your outreach more personal</p>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community</CardTitle>
                  <CardDescription>
                    Connect with other SparqAI users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900">User Forum</h4>
                      <p className="text-sm text-gray-600">Ask questions and share tips</p>
                    </a>
                    <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900">Success Stories</h4>
                      <p className="text-sm text-gray-600">Learn from successful campaigns</p>
                    </a>
                    <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900">Feature Requests</h4>
                      <p className="text-sm text-gray-600">Suggest new features</p>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}