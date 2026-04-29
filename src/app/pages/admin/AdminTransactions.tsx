import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Users,
  Briefcase,
  DollarSign,
  Activity,
  Shield,
  LogOut,
} from "lucide-react";
import { projectId } from "../../../../utils/supabase/info";

export function AdminTransactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // In real implementation, fetch from payments endpoint
      setTransactions([
        {
          id: "1",
          jobTitle: "Plumbing Repair",
          amount: 150,
          commission: 22.5,
          status: "released",
          date: Date.now() - 3600000,
        },
        {
          id: "2",
          jobTitle: "House Cleaning",
          amount: 80,
          commission: 12,
          status: "escrow",
          date: Date.now() - 7200000,
        },
      ]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-800">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-8 h-8 text-teal-500" />
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-zinc-500">ServiceHub</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => navigate("/admin")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-800"
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-800"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Users</span>
            </button>
            <button
              onClick={() => navigate("/admin/jobs")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-800"
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Jobs & Errands</span>
            </button>
            <button
              onClick={() => navigate("/admin/transactions")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-500/10 text-teal-400"
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Transactions</span>
            </button>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button
              onClick={logout}
              variant="outline"
              className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-zinc-400">Monitor all payments and platform revenue</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-white">$450.00</div>
            <div className="text-xs text-green-400 mt-1">+12.5% this month</div>
          </div>

          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-2">In Escrow</div>
            <div className="text-3xl font-bold text-white">$250.00</div>
            <div className="text-xs text-zinc-500 mt-1">3 pending jobs</div>
          </div>

          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-2">Platform Commission</div>
            <div className="text-3xl font-bold text-white">$67.50</div>
            <div className="text-xs text-zinc-500 mt-1">15% average</div>
          </div>
        </div>

        <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">
                  Transaction ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Job</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">
                  Commission
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400">
                    Loading...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                    <td className="px-6 py-4 text-zinc-300 font-mono text-sm">
                      {tx.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-white">{tx.jobTitle}</td>
                    <td className="px-6 py-4 text-white font-semibold">${tx.amount}</td>
                    <td className="px-6 py-4 text-teal-400 font-semibold">${tx.commission}</td>
                    <td className="px-6 py-4">
                      {tx.status === "released" ? (
                        <Badge className="bg-green-500/20 text-green-400">Released</Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-400">Escrow</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {new Date(tx.date).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
