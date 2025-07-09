import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export function QuickActivityForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "note",
    title: "",
    description: "",
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user?.id,
          createdAt: new Date(),
        }),
      });
    },
    onSuccess: () => {
      toast({ title: "Activity created successfully!" });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/activities`] });
      setFormData({ type: "note", title: "", description: "" });
      setIsOpen(false);
    },
    onError: () => {
      toast({ 
        title: "Failed to create activity", 
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast({ 
        title: "Please fill in all fields", 
        variant: "destructive" 
      });
      return;
    }
    createActivityMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <CardTitle>Quick Activity</CardTitle>
          </div>
          <Button
            size="sm"
            variant={isOpen ? "outline" : "default"}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Cancel" : <><PlusCircle className="h-4 w-4 mr-1" /> Add Activity</>}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isOpen ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Activity Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="E.g., Follow-up call with John"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add more details about this activity..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                type="submit" 
                disabled={createActivityMutation.isPending}
                className="sparq-gradient text-white"
              >
                {createActivityMutation.isPending ? "Creating..." : "Create Activity"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({ type: "note", title: "", description: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Track important activities and notes</p>
            <p className="text-xs mt-1">Click "Add Activity" to create a new entry</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}