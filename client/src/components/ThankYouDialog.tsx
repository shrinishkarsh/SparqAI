import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ThankYouDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ThankYouDialog({ open, onClose }: ThankYouDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <DialogTitle>Thank You!</DialogTitle>
          <DialogDescription className="text-base">
            Thanks for filling in the form. Our team will contact you shortly.
          </DialogDescription>
          <p className="text-sm text-gray-600">
            SparqAI platform can be accessed upon purchase.
          </p>
          <Button onClick={onClose} className="w-full">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}