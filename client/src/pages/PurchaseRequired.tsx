import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";

export default function PurchaseRequired() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Purchase Required
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in SparqAI! The demo can be accessed upon purchase.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              Our team will contact you shortly to discuss your requirements and provide access to the platform.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-600 mt-3">
              <Mail className="h-4 w-4 mr-2" />
              <span>support@getsparq.ai</span>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}