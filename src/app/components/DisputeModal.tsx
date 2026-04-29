import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { AlertTriangle, FileText, Image as ImageIcon } from "lucide-react";
import { projectId } from "../../../utils/supabase/info";
import { toast } from "sonner";

interface DisputeModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  onSuccess?: () => void;
}

export function DisputeModal({ open, onClose, jobId, onSuccess }: DisputeModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason || !description) {
      toast.error("Please select a reason and provide details");
      return;
    }

    if (description.length < 20) {
      toast.error("Please provide more details (minimum 20 characters)");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/disputes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            jobId,
            reason,
            description,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Dispute submitted successfully. Our team will review it within 24 hours.");
        onSuccess?.();
        onClose();
        setReason("");
        setDescription("");
      } else {
        toast.error(data.error || "Failed to submit dispute");
      }
    } catch (error) {
      console.error("Dispute submission error:", error);
      toast.error("Failed to submit dispute");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            File a Dispute
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Warning Banner */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="text-sm text-red-400">
              ⚠️ Disputes should only be filed for genuine issues. 
              False claims may result in account suspension.
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <Label className="text-zinc-300 mb-3 block">Dispute Reason</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              <div className="space-y-2">
                <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer ${reason === "incomplete" ? "border-teal-500 bg-teal-500/10" : "border-zinc-700 bg-zinc-800"}`}>
                  <RadioGroupItem value="incomplete" id="incomplete" />
                  <Label htmlFor="incomplete" className="cursor-pointer flex-1">
                    <div className="font-semibold">Incomplete Work</div>
                    <div className="text-xs text-zinc-500">Service provider didn't complete the job</div>
                  </Label>
                </div>

                <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer ${reason === "quality" ? "border-teal-500 bg-teal-500/10" : "border-zinc-700 bg-zinc-800"}`}>
                  <RadioGroupItem value="quality" id="quality" />
                  <Label htmlFor="quality" className="cursor-pointer flex-1">
                    <div className="font-semibold">Poor Quality</div>
                    <div className="text-xs text-zinc-500">Work quality below expectations</div>
                  </Label>
                </div>

                <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer ${reason === "noshow" ? "border-teal-500 bg-teal-500/10" : "border-zinc-700 bg-zinc-800"}`}>
                  <RadioGroupItem value="noshow" id="noshow" />
                  <Label htmlFor="noshow" className="cursor-pointer flex-1">
                    <div className="font-semibold">No Show</div>
                    <div className="text-xs text-zinc-500">Provider didn't show up</div>
                  </Label>
                </div>

                <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer ${reason === "damage" ? "border-teal-500 bg-teal-500/10" : "border-zinc-700 bg-zinc-800"}`}>
                  <RadioGroupItem value="damage" id="damage" />
                  <Label htmlFor="damage" className="cursor-pointer flex-1">
                    <div className="font-semibold">Property Damage</div>
                    <div className="text-xs text-zinc-500">Provider caused damage during service</div>
                  </Label>
                </div>

                <div className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer ${reason === "other" ? "border-teal-500 bg-teal-500/10" : "border-zinc-700 bg-zinc-800"}`}>
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer flex-1">
                    <div className="font-semibold">Other</div>
                    <div className="text-xs text-zinc-500">Another issue not listed above</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          <div>
            <Label className="text-zinc-300 mb-2 block">
              Detailed Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Please provide detailed information about the issue. Include dates, what happened, and what you expected..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white min-h-32"
              maxLength={1000}
            />
            <div className="text-xs text-zinc-500 mt-1 text-right">
              {description.length}/1000 characters
            </div>
          </div>

          {/* Upload Evidence (UI Only - Backend implementation needed) */}
          <div>
            <Label className="text-zinc-300 mb-2 block">Evidence (Optional)</Label>
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
              <div className="flex justify-center gap-4 mb-2">
                <ImageIcon className="w-8 h-8 text-zinc-500" />
                <FileText className="w-8 h-8 text-zinc-500" />
              </div>
              <div className="text-sm text-zinc-500">
                Upload photos or documents to support your dispute
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                disabled
              >
                Choose Files
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-sm text-zinc-400">
              <div className="font-semibold text-white mb-1">What happens next?</div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Admin team reviews within 24 hours</li>
                <li>Both parties may be contacted for details</li>
                <li>Escrow payment held until resolution</li>
                <li>Decision is final and binding</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !reason || !description}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {submitting ? "Submitting..." : "Submit Dispute"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
