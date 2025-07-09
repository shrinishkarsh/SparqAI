import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserPlus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export function QuickContactForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    source: "manual",
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user?.id,
          status: "active",
        }),
      });
    },
    onSuccess: () => {
      toast({ title: "Contact added successfully!" });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/contacts`] });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        title: "",
        source: "manual",
      });
      setIsOpen(false);
    },
    onError: () => {
      toast({ 
        title: "Failed to add contact", 
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({ 
        title: "Please fill in required fields", 
        variant: "destructive" 
      });
      return;
    }
    createContactMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <CardTitle>Quick Add Contact</CardTitle>
          </div>
          <Button
            size="sm"
            variant={isOpen ? "outline" : "default"}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Cancel" : <><UserPlus className="h-4 w-4 mr-1" /> Add Contact</>}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isOpen ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="VP of Sales"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="source">Source</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger id="source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                type="submit" 
                disabled={createContactMutation.isPending}
                className="sparq-gradient text-white"
              >
                {createContactMutation.isPending ? "Adding..." : "Add Contact"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    company: "",
                    title: "",
                    source: "manual",
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <UserPlus className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Quickly add new contacts to your database</p>
            <p className="text-xs mt-1">Click "Add Contact" to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}