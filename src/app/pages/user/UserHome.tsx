import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Search, Plus, Filter, MapPin, Clock, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { api, getAuthToken, getCurrentUser } from "../../services/api";
import { SmartFeed } from "../../components/SmartFeed";

const categories = [
  "All",
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Moving",
  "Repair",
  "Painting",
  "Gardening",
  "Delivery",
  "Shopping",
  "Other",
];

const radiusOptions = [
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "20", label: "20 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
];

export function UserHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRadius, setSelectedRadius] = useState("5");
  const [location, setLocation] = useState("Harare, Zimbabwe");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const zimbabweCities = [
    "Harare, Zimbabwe",
    "Bulawayo, Zimbabwe",
    "Mutare, Zimbabwe",
    "Gweru, Zimbabwe",
    "Kwekwe, Zimbabwe",
    "Chinhoyi, Zimbabwe",
    "Masvingo, Zimbabwe",
    "Victoria Falls, Zimbabwe",
    "Bindura, Zimbabwe",
    "Beitbridge, Zimbabwe",
  ];

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData || {});
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = getAuthToken();
      const response = await api.jobs.list({ status: "open" });
      setJobs(response.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    const matchesType = selectedType === "all" || job.type === selectedType;
    const matchesSearch =
      !searchQuery ||
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "service":
        return "Service";
      case "errand":
        return "Errand";
      case "recruitment":
        return "Job";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/basarangu.png"
                  alt="BasaRangu Logo"
                  className="w-10 h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <h1 className="text-2xl font-bold text-white">
                  {user.name || "BasaRangu"}
                </h1>
              </div>
              <p className="text-sm text-zinc-400">Find services & get help</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/user/chat")}
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <MessageSquare className="w-5 h-5" style={{ color: "#f58300" }} />
              </button>
              <RoleSwitcher />
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Filter className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {zimbabweCities.map((city) => (
                  <SelectItem key={city} value={city} className="text-white">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRadius} onValueChange={setSelectedRadius}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm">
                <SelectValue placeholder="Radius" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {radiusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-white">
                  All Types
                </SelectItem>
                <SelectItem value="service" className="text-white">
                  Services
                </SelectItem>
                <SelectItem value="errand" className="text-white">
                  Errands
                </SelectItem>
                <SelectItem value="recruitment" className="text-white">
                  Jobs
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-teal-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <Button
          onClick={() => navigate("/post-job")}
          className="w-full mb-6 bg-teal-500 hover:bg-teal-600 text-white h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post a Job
        </Button>

        {/* Smart Feed - Personalized Recommendations */}
        <div className="mb-8">
          <SmartFeed role="user" />
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">
            Available Jobs ({filteredJobs.length})
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800"
              />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">No jobs available</p>
            <Button
              onClick={() => navigate("/post-job")}
              className="mt-4 bg-teal-500 hover:bg-teal-600"
            >
              Post Your First Job
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-teal-500 transition-colors cursor-pointer"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          job.type === "service"
                            ? "bg-blue-500/20 text-blue-400"
                            : job.type === "errand"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {getTypeLabel(job.type)}
                      </span>
                      <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">
                        {job.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-teal-400">
                    ${job.budget || job.amount || 0}
                  </div>
                </div>

                <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location || location}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{job.distance || "2.5"} km</span>
                  </div>

                  {job.userName && (
                    <div className="flex items-center gap-2">
                      {job.userAvatar && (
                        <img
                          src={job.userAvatar}
                          alt={job.userName}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-sm text-zinc-400">{job.userName}</span>
                    </div>
                  )}
                </div>

                {job.applicants && job.applicants.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-800">
                    <span className="text-sm text-zinc-400">
                      {job.applicants.length} applicant(s)
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav role="user" />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
