import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import {
  Users,
  Briefcase,
  DollarSign,
  Activity,
  TrendingUp,
  Shield,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { projectId } from "../../../../utils/supabase/info";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalRevenue: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-500/10 text-teal-400"
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-800"
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Transactions</span>
            </button>
            <button
              onClick={() => navigate("/admin/disputes")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-800"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Disputes</span>
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
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-zinc-400">Monitor platform performance and metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                <div className="text-sm text-zinc-400">Total Users</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalJobs}</div>
                <div className="text-sm text-zinc-400">Total Jobs</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</div>
                <div className="text-sm text-zinc-400">Revenue</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.activeJobs}</div>
                <div className="text-sm text-zinc-400">Active Jobs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { type: "New User", desc: "John Doe registered as Service Provider", time: "2 min ago" },
              { type: "Job Posted", desc: "Plumbing repair job posted by Sarah", time: "15 min ago" },
              { type: "Payment", desc: "Transaction completed - $150", time: "1 hour ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                <div>
                  <div className="text-white font-medium">{activity.type}</div>
                  <div className="text-sm text-zinc-400">{activity.desc}</div>
                </div>
                <div className="text-sm text-zinc-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}