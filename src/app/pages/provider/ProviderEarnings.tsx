import { useState, useEffect } from "react";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { WithdrawalModal } from "../../components/WithdrawalModal";

export function ProviderEarnings() {
  const [user, setUser] = useState<any>({});
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    pending: 0,
    available: 0,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    const wallet = userData.wallet || 50;
    setEarnings({
      total: wallet,
      thisMonth: 45,
      pending: 12,
      available: wallet,
    });
  }, []);

  const handleWithdrawalSuccess = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const newWallet = Math.max(0, (userData.wallet || 50) - 10);
    userData.wallet = newWallet;
    localStorage.setItem("user", JSON.stringify(userData));
    setEarnings({
      total: newWallet,
      thisMonth: 45,
      pending: 12,
      available: newWallet,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Earnings</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Main Balance Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 mb-6">
          <div className="text-white/80 text-sm mb-2">Available Balance</div>
          <div className="text-4xl font-bold text-white mb-6">${earnings.available}</div>
          <Button 
            className="w-full bg-white text-teal-600 hover:bg-zinc-100"
            onClick={() => setShowWithdrawalModal(true)}>
            Withdraw to Bank
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span className="text-xs text-zinc-400">This Month</span>
            </div>
            <div className="text-2xl font-bold text-white">${earnings.thisMonth}</div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-zinc-400">Pending</span>
            </div>
            <div className="text-2xl font-bold text-white">${earnings.pending}</div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-zinc-400">Total Earned</span>
            </div>
            <div className="text-2xl font-bold text-white">${earnings.total}</div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">Recent Transactions</h2>
        </div>

        <div className="space-y-3">
          {[
            { title: "Plumbing Repair", amount: 150, date: "2 hours ago", status: "completed" },
            { title: "House Cleaning", amount: 80, date: "1 day ago", status: "completed" },
            { title: "Electrical Work", amount: 220, date: "3 days ago", status: "pending" },
          ].map((transaction, i) => (
            <div
              key={i}
              className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-white mb-1">{transaction.title}</h3>
                <p className="text-sm text-zinc-400">{transaction.date}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-teal-400">+${transaction.amount}</div>
                <div
                  className={`text-xs ${
                    transaction.status === "completed" ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {transaction.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WithdrawalModal
        open={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        availableBalance={earnings.available}
        onSuccess={handleWithdrawalSuccess}
      />

      <BottomNav role="provider" />
    </div>
  );
}
