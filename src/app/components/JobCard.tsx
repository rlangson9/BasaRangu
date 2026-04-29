import { useNavigate } from "react-router";
import { MapPin, DollarSign, Clock, Star, Users, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    category: string;
    type: "service" | "errand" | "recruitment";
    budget: number;
    location: string;
    userName: string;
    userAvatar?: string;
    userRating?: number;
    companyVerified?: boolean;
    createdAt: number;
    status: string;
    applicants?: any[];
  };
  variant?: "default" | "recruiter";
}

export function JobCard({ job, variant = "default" }: JobCardProps) {
  const navigate = useNavigate();

  const isRecruiterStyle = variant === "recruiter";
  const timeAgo = getTimeAgo(job.createdAt);

  return (
    <div
      onClick={() => navigate(`/job/${job.id}`)}
      className={cn(
        "rounded-xl p-4 border cursor-pointer transition-all hover:shadow-lg",
        isRecruiterStyle
          ? "bg-white border-zinc-200 hover:border-teal-400"
          : "bg-zinc-900 border-zinc-800 hover:border-teal-500"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3
            className={cn(
              "font-semibold text-lg mb-1",
              isRecruiterStyle ? "text-zinc-900" : "text-white"
            )}
          >
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                isRecruiterStyle ? "bg-teal-50 text-teal-700" : "bg-teal-500/20 text-teal-400"
              )}
            >
              {job.category}
            </Badge>
            {job.type === "recruitment" && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  isRecruiterStyle ? "bg-blue-50 text-blue-700" : "bg-blue-500/20 text-blue-400"
                )}
              >
                Full-time
              </Badge>
            )}
          </div>
        </div>
        {job.userAvatar ? (
          <img
            src={job.userAvatar}
            alt={job.userName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold",
              isRecruiterStyle ? "bg-teal-100 text-teal-700" : "bg-teal-500/20 text-teal-400"
            )}
          >
            {job.userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <p
        className={cn(
          "text-sm mb-4 line-clamp-2",
          isRecruiterStyle ? "text-zinc-600" : "text-zinc-400"
        )}
      >
        {job.description}
      </p>

      <div
        className={cn(
          "flex items-center gap-4 text-sm mb-4",
          isRecruiterStyle ? "text-zinc-600" : "text-zinc-400"
        )}
      >
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          <span className="font-semibold">${job.budget}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{timeAgo}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-sm font-medium",
                isRecruiterStyle ? "text-zinc-700" : "text-zinc-300"
              )}
            >
              {job.userName}
            </span>
            {job.companyVerified && (
              <span className={cn(
                "flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full",
                isRecruiterStyle ? "bg-teal-50 text-teal-700" : "bg-teal-500/20 text-teal-400"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                Verified
              </span>
            )}
            {job.userRating && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs text-zinc-500">{job.userRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {job.applicants && job.applicants.length > 0 && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                isRecruiterStyle ? "text-zinc-500" : "text-zinc-500"
              )}
            >
              <Users className="w-4 h-4" />
              <span>{job.applicants.length} applicants</span>
            </div>
          )}
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 px-2",
              isRecruiterStyle
                ? "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/chat/${job.id}`);
            }}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            className={cn(
              isRecruiterStyle
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-teal-500 hover:bg-teal-600 text-white"
            )}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/job/${job.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
