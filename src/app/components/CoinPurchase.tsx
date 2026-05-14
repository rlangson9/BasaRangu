import { useState, useEffect } from "react";
import { Coins, Zap, Check, X, CreditCard, Smartphone, ArrowRight, Shield, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { api, getAuthToken } from "../services/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  discount: number;
}

interface CoinPurchaseProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newBalance: number) => void;
}

export function CoinPurchase({ isOpen, onClose, onSuccess }: CoinPurchaseProps) {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  useEffect(() => {
    if (isOpen) {
      loadPackages();
    }
  }, [isOpen]);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (token) {
        const data = await api.coins.getPackages(token);
        if (data.success) {
          setPackages(data.packages);
        }
      }
    } catch (error) {
      toast.error("Failed to load coin packages");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error("Please select a package");
      return;
    }

    setPurchasing(true);
    try {
      const token = getAuthToken();
      if (token) {
        const data = await api.coins.purchase(token, selectedPackage, paymentMethod);
        if (data.success) {
          toast.success("Purchase successful!", {
            description: `You've received ${packages.find(p => p.id === selectedPackage)?.coins} coins!`,
          });
          onSuccess?.(data.balance);
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Purchase failed");
    } finally {
      setPurchasing(false);
    }
  };

  const getIcon = (coins: number) => {
    if (coins >= 1000) return <Zap className="w-6 h-6 text-yellow-400" />;
    if (coins >= 250) return <Gift className="w-6 h-6 text-purple-400" />;
    return <Coins className="w-6 h-6 text-amber-400" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-8 h-8 text-amber-400" />
            <DialogTitle className="text-2xl font-bold">Get Coins</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400">
            Purchase coins to make audio and video calls. Secure payments, instant delivery.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 bg-zinc-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-zinc-300">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-zinc-300">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-zinc-300">No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-zinc-300">Bulk Discounts</span>
              </div>
            </div>

            {/* Coin Packages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    selectedPackage === pkg.id
                      ? "border-teal-500 bg-teal-500/10"
                      : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  {pkg.discount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-xs font-bold text-white px-2 py-1 rounded-full">
                      -{pkg.discount}%
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center">
                    {getIcon(pkg.coins)}
                    <div className="mt-2 text-2xl font-bold text-white">{pkg.coins}</div>
                    <div className="text-sm text-zinc-400 mb-2">coins</div>
                    <div className="text-lg font-semibold text-teal-400">${pkg.price}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <div className="text-sm font-medium text-zinc-300 mb-3">Payment Method</div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-teal-500 bg-teal-500/10"
                      : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("mobile")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    paymentMethod === "mobile"
                      ? "border-teal-500 bg-teal-500/10"
                      : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Mobile Money</span>
                </button>
              </div>
            </div>

            {/* Purchase Button */}
            <Button
              onClick={handlePurchase}
              disabled={purchasing || !selectedPackage}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg"
            >
              {purchasing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Purchase Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CoinBalance({ balance, onPurchaseClick }: { balance: number; onPurchaseClick: () => void }) {
  return (
    <button
      onClick={onPurchaseClick}
      className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 hover:bg-amber-500/30 transition-colors"
    >
      <Coins className="w-5 h-5 text-amber-400" />
      <span className="text-amber-400 font-bold">{balance}</span>
      <span className="text-amber-300 text-sm">coins</span>
    </button>
  );
}

export function CoinBalanceWithDialog({ balance, onSuccess }: { balance: number; onSuccess?: (newBalance: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CoinBalance balance={balance} onPurchaseClick={() => setIsOpen(true)} />
      <CoinPurchase 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onSuccess={onSuccess}
      />
    </>
  );
}
