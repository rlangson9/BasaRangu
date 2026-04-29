import { useState, useEffect } from "react";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { DollarSign, TrendingUp, Package, CheckCircle } from "lucide-react";
import { WithdrawalModal } from "../../components/WithdrawalModal";

export function RunnerEarnings() {
  const [user, setUser] = useState<any>({});
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [earnings, setEarnings] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    available: 0,
    tasksCompleted: 0,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    const wallet = userData.wallet || 30;
    setEarnings({
      total: wallet,
      today: 45,
      thisWeek: 280,
      available: wallet,
      tasksCompleted: 12,
    });
  }, []);

  const handleWithdrawalSuccess = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const newWallet = Math.max(0, (userData.wallet || 30) - 10);
    userData.wallet = newWallet;
    localStorage.setItem("user", JSON.stringify(userData));
    setEarnings({
      total: newWallet,
      today: 45,
      thisWeek: 280,
      available: newWallet,
      tasksCompleted: 12,
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
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 mb-6">
          <div className="text-white/80 text-sm mb-2">Available Balance</div>
          <div className="text-4xl font-bold text-white mb-6">${earnings.available}</div>
          <Button 
            className="w-full bg-white text-teal-600 hover:bg-zinc-100"
            onClick={() => setShowWithdrawalModal(true)}>
            Withdraw to Bank
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-teal-400" />
              <span className="text-xs text-zinc-400">Today</span>
            </div>
            <div className="text-2xl font-bold text-white">${earnings.today}</div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span className="text-xs text-zinc-400">This Week</span>
            </div>
            <div className="text-2xl font-bold text-white">${earnings.thisWeek}</div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-zinc-400">Tasks Done</span>
            </div>
            <div className="text-2xl font-bold text-white">{earnings.tasksCompleted}</div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-zinc-400">Total Earned</span>
            </div>
            <div className="text-2xl font-bold text-white">${earnings.total}</div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">Recent Earnings</h2>
        </div>

        <div className="space-y-3">
          {[
            { title: "Grocery Delivery", amount: 25, date: "1 hour ago" },
            { title: "Document Pickup", amount: 20, date: "3 hours ago" },
            { title: "Package Drop-off", amount: 15, date: "5 hours ago" },
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

      <BottomNav role="runner" />
    </div>
  );
}
