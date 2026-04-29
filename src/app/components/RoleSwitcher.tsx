import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Briefcase, Wrench, Bike, Building, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { toast } from "sonner";

const roleIcons = {
  user: Briefcase,
  provider: Wrench,
  runner: Bike,
  recruiter: Building,
  admin: Shield,
};

const roleLabels = {
  user: "Service Seeker",
  provider: "Service Provider",
  runner: "Errand Runner",
  recruiter: "Recruiter",
  admin: "Admin",
};

export function RoleSwitcher() {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<string>("user");
  const [availableRoles, setAvailableRoles] = useState<string[]>(["user"]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentRole(user.activeRole || "user");
    setAvailableRoles(user.roles || ["user", "provider", "runner", "recruiter"]); // Add all roles for demonstration
  }, []);

  const switchRole = async (role: string) => {
    try {
      // In a real app, this would call the API
      // For now, just update localStorage locally
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...user,
        activeRole: role,
        roles: ["user", "provider", "runner", "recruiter"], // Add all roles for demonstration
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("activeRole", role);
      setCurrentRole(role);
      toast.success(`Switched to ${roleLabels[role as keyof typeof roleLabels]}`);
      navigate(`/${role}`);
    } catch (error) {
      console.error("Error switching role:", error);
      toast.error("Failed to switch role");
    }
  };

  const Icon = roleIcons[currentRole as keyof typeof roleIcons] || Briefcase;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
          <Icon className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
        <div className="px-2 py-1.5 text-sm font-semibold text-zinc-300">Switch Role</div>
        {Object.entries(roleLabels).map(([role, label]) => {
          const RoleIcon = roleIcons[role as keyof typeof roleIcons];
          const isActive = role === currentRole;
          const isAvailable = availableRoles.includes(role);

          return (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role)}
              disabled={!isAvailable && role !== currentRole}
              className={`flex items-center gap-3 ${
                isActive ? "bg-teal-500/10 text-teal-500" : "text-zinc-300"
              }`}
            >
              <RoleIcon className="w-4 h-4" />
              <span>{label}</span>
              {isActive && <span className="ml-auto text-xs">Active</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
