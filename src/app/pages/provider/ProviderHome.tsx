import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Search, Filter, MapPin, Clock, Briefcase, Star, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
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

// Mock data for jobs
const mockJobs = [
  {
    id: "1",
    title: "Plumbing Repair",
    description: "Fix leaky faucet and pipes in kitchen",
    category: "Plumbing",
    budget: 15,
    location: "Harare, Zimbabwe",
    distance: 2.5,
    postedBy: "John Smith",
    experience: "1-3 years",
    urgency: "Urgent",
    createdAt: "2024-01-15T10:00:00Z",
    status: "open",
  },
  {
    id: "2",
    title: "House Cleaning",
    description: "Deep cleaning for 3-bedroom house",
    category: "Cleaning",
    budget: 20,
    location: "Harare, Zimbabwe",
    distance: 3.2,
    postedBy: "Jane Doe",
    experience: "Any",
    urgency: "Normal",
    createdAt: "2024-01-14T09:30:00Z",
    status: "open",
  },
  {
    id: "3",
    title: "Electrical Installation",
    description: "Install new lighting fixtures and switches",
    category: "Electrical",
    budget: 25,
    location: "Bulawayo, Zimbabwe",
    distance: 1.8,
    postedBy: "Mike Johnson",
    experience: "3-5 years",
    urgency: "Urgent",
    createdAt: "2024-01-13T14:00:00Z",
    status: "open",
  },
  {
    id: "4",
    title: "Garden Maintenance",
    description: "Trim hedges, mow lawn, and plant flowers",
    category: "Gardening",
    budget: 12,
    location: "Mutare, Zimbabwe",
    distance: 4.1,
    postedBy: "Sarah Williams",
    experience: "Any",
    urgency: "Normal",
    createdAt: "2024-01-12T11:00:00Z",
    status: "open",
  },
  {
    id: "5",
    title: "Furniture Assembly",
    description: "Assemble new bedroom furniture",
    category: "Carpentry",
    budget: 8,
    location: "Gweru, Zimbabwe",
    distance: 2.9,
    postedBy: "David Brown",
    experience: "1-3 years",
    urgency: "Normal",
    createdAt: "2024-01-11T16:30:00Z",
    status: "open",
  },
];

export function ProviderHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRadius, setSelectedRadius] = useState("5");
  const [location, setLocation] = useState("Harare, Zimbabwe");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      setTimeout(() => {
        setJobs(mockJobs);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    const matchesDistance = job.distance <= parseInt(selectedRadius);
    const matchesLocation = job.location.includes(location.split(",")[0]);
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDistance && matchesLocation && matchesSearch;
  });

  // Sort jobs based on selected criteria
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return a.distance - b.distance;
      case "budget":
        return b.budget - a.budget;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

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
                />
                <h1 className="text-2xl font-bold text-white">{user.name || 'BasaRangu'}</h1>
              </div>
              <p className="text-sm text-zinc-400">Find work matching your skills</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/provider/jobs")}
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
              <RoleSwitcher />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Filter className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Location */}
            <div>
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
            </div>
            
            {/* Radius */}
            <div>
              <Select value={selectedRadius} onValueChange={setSelectedRadius}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm">
                  <SelectValue placeholder="Radius" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {radiusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort By */}
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="relevance" className="text-white">Relevance</SelectItem>
                  <SelectItem value="distance" className="text-white">Distance</SelectItem>
                  <SelectItem value="budget" className="text-white">Budget</SelectItem>
                  <SelectItem value="newest" className="text-white">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Tabs */}
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
        {/* Smart Feed - Personalized Job Recommendations */}
        <div className="mb-8">
          <SmartFeed role="provider" />
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">
            {sortedJobs.length} Jobs Available
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
        ) : sortedJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">No jobs available matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedJobs.map((job) => (
              <div key={job.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-teal-500 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                  {job.urgency === "Urgent" && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                    {job.category}
                  </span>
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                    ${job.budget}
                  </span>
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                    {job.experience} experience
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-500">{job.postedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-500">{job.distance} km</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
                    View Details
                  </Button>
                  <Button 
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${job.id}`);
                    }}
                    className="flex-1 bg-teal-500 hover:bg-teal-600">
                    Apply now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav role="provider" />

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
