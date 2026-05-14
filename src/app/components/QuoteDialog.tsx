import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DollarSign, FileText, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  jobId: string;
  onQuoteSent?: (quote: any) => void;
}

interface QuoteData {
  amount: number;
  description: string;
  estimatedTime: string;
  includesWarranty: boolean;
  paymentTerms: "full" | "partial" | "milestone";
}

export function QuoteDialog({ open, onOpenChange, jobTitle, jobId, onQuoteSent }: QuoteDialogProps) {
  const [sending, setSending] = useState(false);
  const [quote, setQuote] = useState<QuoteData>({
    amount: 0,
    description: "",
    estimatedTime: "",
    includesWarranty: true,
    paymentTerms: "full",
  });

  const handleSendQuote = async () => {
    if (quote.amount <= 0) {
      toast.error("Please enter a valid quote amount");
      return;
    }

    if (!quote.description.trim()) {
      toast.error("Please provide a quote description");
      return;
    }

    setSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const quoteData = {
        id: `quote-${Date.now()}`,
        jobId,
        jobTitle,
        ...quote,
        createdAt: Date.now(),
        status: "pending"
      };

      toast.success("Quote sent successfully!", {
        description: `Your quote of $${quote.amount} has been sent to the client.`,
        duration: 4000,
      });

      onQuoteSent?.(quoteData);
      onOpenChange(false);
      
      setQuote({
        amount: 0,
        description: "",
        estimatedTime: "",
        includesWarranty: true,
        paymentTerms: "full",
      });
    } catch (error) {
      toast.error("Failed to send quote. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            Send Formal Quote
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Provide a detailed quote for "{jobTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Quote Amount ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="number"
                placeholder="0.00"
                value={quote.amount || ""}
                onChange={(e) => setQuote({ ...quote, amount: parseFloat(e.target.value) || 0 })}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Description
            </label>
            <Textarea
              placeholder="Describe what's included in your quote..."
              value={quote.description}
              onChange={(e) => setQuote({ ...quote, description: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Estimated Time
            </label>
            <Input
              placeholder="e.g., 2-3 hours, 1-2 days"
              value={quote.estimatedTime}
              onChange={(e) => setQuote({ ...quote, estimatedTime: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Payment Terms
            </label>
            <div className="flex gap-2">
              {[
                { value: "full", label: "Full Payment" },
                { value: "partial", label: "50% Deposit" },
                { value: "milestone", label: "Milestone" },
              ].map((term) => (
                <button
                  key={term.value}
                  onClick={() => setQuote({ ...quote, paymentTerms: term.value as any })}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    quote.paymentTerms === term.value
                      ? "bg-teal-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {term.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="warranty"
              checked={quote.includesWarranty}
              onChange={(e) => setQuote({ ...quote, includesWarranty: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-teal-500 focus:ring-teal-500"
            />
            <label htmlFor="warranty" className="text-sm text-zinc-300">
              Includes warranty/guarantee
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendQuote}
            disabled={sending || quote.amount <= 0}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            {sending ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Quote
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AcceptOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: {
    amount: number;
    message?: string;
    fromName: string;
  };
  onAccept?: () => void;
  onDecline?: () => void;
}

export function AcceptOfferDialog({ open, onOpenChange, offer, onAccept, onDecline }: AcceptOfferDialogProps) {
  const [accepting, setAccepting] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Offer accepted!", {
        description: `You've accepted the offer of $${offer.amount} from ${offer.fromName}.`,
        duration: 4000,
      });
      onAccept?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to accept offer");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Job Offer
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            You've received a job offer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Offer Amount</div>
            <div className="text-2xl font-bold text-green-400">
              ${offer.amount}
            </div>
          </div>

          {offer.message && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-sm text-zinc-400 mb-1">Message from {offer.fromName}</div>
              <div className="text-sm text-zinc-200">{offer.message}</div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast.info("Offer declined");
              onDecline?.();
              onOpenChange(false);
            }}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            disabled={accepting}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {accepting ? "Accepting..." : "Accept Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EscrowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  amount: number;
  onInitiate?: () => void;
}

export function EscrowDialog({ open, onOpenChange, jobTitle, amount, onInitiate }: EscrowDialogProps) {
  const [initiating, setInitiating] = useState(false);
  const [escrowTerms, setEscrowTerms] = useState(false);

  const handleInitiate = async () => {
    if (!escrowTerms) {
      toast.error("Please accept the escrow terms");
      return;
    }

    setInitiating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Escrow initiated!", {
        description: `$${amount} has been secured in escrow. The provider will be notified.`,
        duration: 5000,
      });
      onInitiate?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to initiate escrow");
    } finally {
      setInitiating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Initiate Escrow Payment
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Secure your payment for "{jobTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Escrow Amount</div>
            <div className="text-2xl font-bold text-amber-400">
              ${amount}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="text-sm text-blue-400 font-medium mb-2">How Escrow Works</div>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• Payment is held securely until job is completed</li>
              <li>• Funds are released to provider after you confirm completion</li>
              <li>• Dispute resolution available if needed</li>
            </ul>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="escrow-terms"
              checked={escrowTerms}
              onChange={(e) => setEscrowTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-zinc-600 bg-zinc-800 text-teal-500 focus:ring-teal-500"
            />
            <label htmlFor="escrow-terms" className="text-sm text-zinc-300">
              I understand and agree to the escrow terms. Payment will be held until I confirm job completion.
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInitiate}
            disabled={initiating || !escrowTerms}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {initiating ? (
              "Processing..."
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Secure ${amount} in Escrow
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
