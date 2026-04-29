import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import {
  Wallet,
  Settings,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
  Star,
  Bike,
  FileUser,
} from "lucide-react";

export function RunnerMe() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { icon: FileUser, label: "My Resume", path: "/runner/resume" },
    { icon: Wallet, label: "Wallet & Earnings", value: `$${user.wallet || 0}`, path: "/runner/earnings" },
    { icon: Bike, label: "Errand Dashboard", path: "/runner/tasks" },
    { icon: Star, label: "Reviews & Ratings", value: `${user.rating || 0} ★`, path: "/runner/reviews" },
    { icon: Settings, label: "Settings", path: "/runner/settings" },
    { icon: Shield, label: "Verification", path: "/runner/verification" },
    { icon: FileText, label: "Terms & Privacy", path: "/terms" },
    { icon: HelpCircle, label: "Customer Service", path: "/support" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Me</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "R"}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                {user.name || "Errand Runner"}
              </h2>
              <p className="text-sm text-zinc-400 mb-2">{user.phone}</p>
              <div className="flex items-center gap-2">
                {user.verified && (
                  <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-xs rounded-full">
                    Verified
                  </span>
                )}
                <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">
                  Errand Runner
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => navigate("/runner/profile")}
            className="w-full border border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
          >
            Edit Profile
          </Button>

          {/* Promotional Banner */}
          <div className="mt-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg">Want more errands?</h3>
              <p className="text-teal-100 text-xs mt-1">Upgrade to Premium for higher errand priority and exclusive tasks</p>
            </div>
            <Button onClick={() => navigate("/user/vip")} className="bg-white text-teal-700 hover:bg-teal-50">
            Upgrade Now
          </Button>
          </div>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => item.path && navigate(item.path)}
                className="w-full bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center gap-4 hover:border-teal-500 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-teal-400" />
                </div>
                <span className="flex-1 text-left text-white font-medium">{item.label}</span>
                {item.value && <span className="text-zinc-400 text-sm">{item.value}</span>}
                <ChevronRight className="w-5 h-5 text-zinc-600" />
              </button>
            );
          })}
        </div>

        <Button
          onClick={logout}
          variant="outline"
          className="w-full mt-6 border-red-500/20 text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      <BottomNav role="runner" />
    </div>
  );
}
