import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import {
  Building,
  Users,
  Briefcase,
  Settings,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  BarChart,
} from "lucide-react";

export function RecruiterMe() {
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
    { icon: Building, label: "Company Profile", path: "/recruiter/company" },
    { icon: Briefcase, label: "Job Management", path: "/recruiter/jobs" },
    { icon: Users, label: "Hired Candidates", value: "12", path: "/recruiter/hired" },
    { icon: BarChart, label: "Hiring Data & Analytics", path: "/recruiter/analytics" },
    { icon: Settings, label: "Settings", path: "/recruiter/settings" },
    { icon: FileText, label: "Terms & Privacy", path: "/terms" },
    { icon: HelpCircle, label: "Customer Service", path: "/support" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900">Company</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
              <Building className="w-10 h-10 text-teal-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-zinc-900 mb-1">
                {user.companyName || "Tech Company Inc."}
              </h2>
              <p className="text-sm text-zinc-600 mb-2">{user.phone}</p>
              <div className="flex items-center gap-2">
                {user.verified && (
                  <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Verified Company
                  </span>
                )}
                <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-full">
                  {user.industry || "Technology"}
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => navigate("/recruiter/company")}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            Edit Company Profile
          </Button>

          {/* Promotional Banner */}
          <div className="mt-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg">Want better candidates?</h3>
              <p className="text-teal-100 text-xs mt-1">Upgrade to Premium for access to top talent and enhanced recruitment tools</p>
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
                className="w-full bg-white rounded-xl p-4 border border-zinc-200 flex items-center gap-4 hover:border-teal-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <span className="flex-1 text-left text-zinc-900 font-medium">{item.label}</span>
                {item.value && <span className="text-zinc-600 text-sm">{item.value}</span>}
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </button>
            );
          })}
        </div>

        <Button
          onClick={logout}
          variant="outline"
          className="w-full mt-6 border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      <BottomNav role="recruiter" />
    </div>
  );
}
