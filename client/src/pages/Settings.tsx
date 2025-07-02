import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, CreditCard, HelpCircle, Save, Upload, Trash2, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['/api/users/1']
  });

  const { data: company } = useQuery({
    queryKey: ['/api/companies/user/1']
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: any) => {
      return apiRequest('/api/users/1', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users/1'] });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (updates: any) => {
      return apiRequest('/api/companies/1', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      toast({
        title: "Company Updated",
        description: "Your company profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/companies/user/1'] });
    },
  });

  return (
    <div className="flex-1">
      <Header
        title="Settings"
        subtitle="Manage your account, preferences, and integrations"
      >
        <Button className="sparq-gradient hover:sparq-gradient-hover text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </Header>

      <main className="flex-1 p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-lg">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button size="sm" variant="outline">
                      <Upload className="h-3 w-3 mr-2" />
                      Upload Photo
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-3 w-3 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      defaultValue={user?.firstName || ""}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      defaultValue={user?.lastName || ""}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || ""}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      defaultValue={user?.username || ""}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-3">
                  <Label>Account Status</Label>
                  <div className="flex items-center space-x-4">
                    <Badge variant="default">Active</Badge>
                    <Badge variant="secondary">Pro Plan</Badge>
                    <Badge variant="outline">Setup Complete</Badge>
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <Label>Preferences</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email updates about your campaigns</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-reports">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Get weekly performance summaries</p>
                      </div>
                      <Switch id="weekly-reports" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="ai-suggestions">AI Suggestions</Label>
                        <p className="text-sm text-muted-foreground">Receive AI-powered optimization recommendations</p>
                      </div>
                      <Switch id="ai-suggestions" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Manage your company information and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      defaultValue={company?.name || ""}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-website">Website</Label>
                    <Input
                      id="company-website"
                      defaultValue={company?.website || ""}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-industry">Industry</Label>
                    <Select defaultValue={company?.industry || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="e-commerce">E-commerce</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-size">Company Size</Label>
                    <Select defaultValue={company?.size || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">Company Description</Label>
                  <Textarea
                    id="company-description"
                    defaultValue={company?.description || ""}
                    placeholder="Describe your company and what you do..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-icp">Target ICP (Ideal Customer Profile)</Label>
                  <Textarea
                    id="target-icp"
                    defaultValue={company?.targetIcp || ""}
                    placeholder="Describe your ideal customer profile..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Campaign Updates</Label>
                          <p className="text-sm text-muted-foreground">When campaigns reach milestones or complete</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>New Replies</Label>
                          <p className="text-sm text-muted-foreground">When prospects reply to your outreach</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Meeting Scheduled</Label>
                          <p className="text-sm text-muted-foreground">When meetings are booked through your campaigns</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Weekly performance summary and insights</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-3">AI Insights</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Optimization Suggestions</Label>
                          <p className="text-sm text-muted-foreground">AI-powered recommendations to improve performance</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Performance Alerts</Label>
                          <p className="text-sm text-muted-foreground">Alerts when campaigns underperform or overperform</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-3">System Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Integration Errors</Label>
                          <p className="text-sm text-muted-foreground">When integrations fail or need attention</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>System Updates</Label>
                          <p className="text-sm text-muted-foreground">New features and platform updates</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and API access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Password</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button size="sm">Update Password</Button>
                    </div>
                  </div>

                  <Separator />

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
                        <p className="text-sm text-muted-foreground">
                          Used for AI-powered features like lead enrichment and content generation
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-3">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-3">Session Management</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">Chrome on macOS • Started 2 hours ago</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Sign Out All Other Sessions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription>Manage your subscription and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">Pro Plan</h3>
                      <p className="text-muted-foreground">Advanced features for growing teams</p>
                    </div>
                    <Badge variant="default">Current Plan</Badge>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-2xl font-bold">$99<span className="text-lg font-normal">/month</span></div>
                    <div className="text-sm text-muted-foreground">Billed monthly</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>✓ 10,000 contacts</div>
                    <div>✓ Unlimited campaigns</div>
                    <div>✓ AI-powered insights</div>
                    <div>✓ Advanced integrations</div>
                    <div>✓ Priority support</div>
                    <div>✓ Custom reporting</div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Contacts Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm text-muted-foreground">of 10,000</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '12.5%' }}></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Emails Sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8,459</div>
                      <div className="text-sm text-muted-foreground">this month</div>
                      <div className="text-sm text-green-600 mt-1">No limits</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">AI Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,847</div>
                      <div className="text-sm text-muted-foreground">of 5,000</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '57%' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Billing History */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Billing History</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Pro Plan - January 2025</p>
                        <p className="text-sm text-muted-foreground">Paid on Jan 1, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$99.00</p>
                        <Badge variant="default" className="text-xs">Paid</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Pro Plan - December 2024</p>
                        <p className="text-sm text-muted-foreground">Paid on Dec 1, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$99.00</p>
                        <Badge variant="default" className="text-xs">Paid</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button variant="outline">Update Payment Method</Button>
                  <Button variant="outline">Download Invoice</Button>
                  <Button variant="outline" className="text-red-600">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}