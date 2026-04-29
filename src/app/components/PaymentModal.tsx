import { useState } from "react";
import { X, CreditCard, Wallet as WalletIcon, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [amount, setAmount] = useState<string>("100");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet"> ("card");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess(amountValue);
      onClose();
      toast.success(`Successfully added $${amountValue.toFixed(2)} to your wallet`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="bg-zinc-900 border-zinc-800 w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Add Funds</CardTitle>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="10"
                  step="10"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Payment Method
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${paymentMethod === "card" ? "bg-teal-500 text-white" : "bg-zinc-800 border border-zinc-700 text-zinc-400"}`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${paymentMethod === "wallet" ? "bg-teal-500 text-white" : "bg-zinc-800 border border-zinc-700 text-zinc-400"}`}
                  >
                    <WalletIcon className="w-5 h-5" />
                    <span>Wallet</span>
                  </button>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Expiry Date"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white"
              disabled={loading}
            >
              {loading ? "Processing..." : "Add Funds"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
