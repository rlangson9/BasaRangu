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

export function AdminJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/jobs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-500/10 text-teal-400"
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
          <h1 className="text-3xl font-bold text-white mb-2">Jobs & Errands</h1>
          <p className="text-zinc-400">Monitor all jobs and errands on the platform</p>
        </div>

        <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Job</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Budget</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Posted By</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-400">
                    Loading...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-400">
                    No jobs found
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{job.title}</div>
                      <div className="text-xs text-zinc-500">{job.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-blue-500/20 text-blue-400">{job.type}</Badge>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{job.category}</td>
                    <td className="px-6 py-4 text-zinc-300">${job.budget}</td>
                    <td className="px-6 py-4">
                      {job.status === "open" && (
                        <Badge className="bg-green-500/20 text-green-400">Open</Badge>
                      )}
                      {job.status === "in_progress" && (
                        <Badge className="bg-yellow-500/20 text-yellow-400">In Progress</Badge>
                      )}
                      {job.status === "completed" && (
                        <Badge className="bg-zinc-700 text-zinc-400">Completed</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{job.userName}</td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 text-zinc-300"
                        onClick={() => navigate(`/job/${job.id}`)}
                      >
                        View
                      </Button>
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
