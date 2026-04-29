import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Users,
  Briefcase,
  DollarSign,
  Activity,
  Shield,
  LogOut,
  Search,
} from "lucide-react";
import { projectId } from "../../../../utils/supabase/info";

export function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  );

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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-500/10 text-teal-400"
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
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-zinc-400">View and manage all platform users</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-950 border-zinc-800 text-white"
            />
          </div>
        </div>

        <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Phone</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Roles</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Rating</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Wallet</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Status</th>
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-semibold">
                          {user.name?.charAt(0) || user.phone?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name || "Unnamed"}</div>
                          <div className="text-xs text-zinc-500">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{user.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role: string) => (
                          <Badge key={role} className="bg-teal-500/20 text-teal-400 text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {user.rating ? `${user.rating.toFixed(1)} ★` : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-zinc-300">${user.wallet || 0}</td>
                    <td className="px-6 py-4">
                      {user.verified ? (
                        <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                      ) : (
                        <Badge className="bg-zinc-700 text-zinc-400">Unverified</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300">
                        View Details
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
