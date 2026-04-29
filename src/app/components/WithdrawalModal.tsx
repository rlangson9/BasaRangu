import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface WithdrawalModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess: () => void;
}

export function WithdrawalModal({ open, onClose, availableBalance, onSuccess }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || !bankName || !accountNumber || !accountName) {
      toast.error("Please fill in all fields");
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawalAmount > availableBalance) {
      toast.error("Insufficient funds");
      return;
    }

    setWithdrawing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Withdrawal request submitted successfully!");
      onSuccess();
      onClose();
      setAmount("");
      setBankName("");
      setAccountNumber("");
      setAccountName("");
    } catch (error) {
      toast.error("Failed to process withdrawal");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Withdraw to Bank</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter your bank details to withdraw funds
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-zinc-800 rounded-lg p-4 mb-4">
            <div className="text-sm text-zinc-400 mb-1">Available Balance</div>
            <div className="text-2xl font-bold text-teal-400">${availableBalance}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-zinc-300">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName" className="text-zinc-300">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="e.g., CBZ Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName" className="text-zinc-300">Account Name</Label>
            <Input
              id="accountName"
              placeholder="Your full name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="text-zinc-300">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="Your account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="flex-1 bg-teal-500 hover:bg-teal-600"
          >
            {withdrawing ? "Processing..." : "Withdraw"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
