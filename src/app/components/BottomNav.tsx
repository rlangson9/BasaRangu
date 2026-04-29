import { useNavigate, useLocation } from "react-router";
import { Home, Briefcase, MessageSquare, User, ClipboardList, TrendingUp } from "lucide-react";
import { cn } from "./ui/utils";

interface BottomNavProps {
  role: "user" | "provider" | "runner" | "recruiter";
  unreadCount?: number;
}

export function BottomNav({ role, unreadCount = 0 }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = {
    user: [
      { icon: Home, label: "Home", path: "/user" },
      { icon: Briefcase, label: "My Jobs", path: "/user/jobs" },
      { icon: MessageSquare, label: "Chat", path: "/user/chat", badge: unreadCount },
      { icon: User, label: "Me", path: "/user/me" },
    ],
    provider: [
      { icon: Home, label: "Jobs", path: "/provider" },
      { icon: ClipboardList, label: "My Work", path: "/provider/jobs" },
      { icon: TrendingUp, label: "Earnings", path: "/provider/earnings" },
      { icon: User, label: "Me", path: "/provider/me" },
    ],
    runner: [
      { icon: Home, label: "Errands", path: "/runner" },
      { icon: ClipboardList, label: "My Tasks", path: "/runner/tasks" },
      { icon: TrendingUp, label: "Earnings", path: "/runner/earnings" },
      { icon: User, label: "Me", path: "/runner/me" },
    ],
    recruiter: [
      { icon: Home, label: "Talent", path: "/recruiter" },
      { icon: Briefcase, label: "Jobs", path: "/recruiter/jobs" },
      { icon: MessageSquare, label: "Chat", path: "/recruiter/chat", badge: unreadCount },
      { icon: User, label: "Me", path: "/recruiter/me" },
    ],
  };

  const items = navItems[role];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 safe-area-bottom z-50">
      <div className="max-w-screen-xl mx-auto grid grid-cols-4 h-16">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors relative",
                isActive ? "text-teal-500" : "text-zinc-400"
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
