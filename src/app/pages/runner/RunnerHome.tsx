import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Search, Filter, MapPin, Clock, Package, User, Bike, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const errandTypes = ["All", "Delivery", "Shopping", "Pickup", "Drop-off", "Document", "Other"];

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

// Mock data for errands
const mockErrands = [
  {
    id: "6",
    title: "Grocery Shopping",
    description: "Buy groceries from Pick n Pay and deliver to my home",
    category: "Shopping",
    budget: 5,
    location: "Harare, Zimbabwe",
    distance: 2.5,
    postedBy: "John Smith",
    urgency: "Urgent",
    pickupLocation: "Pick n Pay, Borrowdale",
    dropoffLocation: "123 Samora Machel Ave",
    createdAt: "2024-01-15T10:00:00Z",
    status: "open",
  },
  {
    id: "7",
    title: "Document Delivery",
    description: "Deliver important documents to Harare CBD",
    category: "Document",
    budget: 3,
    location: "Harare, Zimbabwe",
    distance: 3.2,
    postedBy: "Jane Doe",
    urgency: "Normal",
    pickupLocation: "Westgate Mall",
    dropoffLocation: "456 First Street",
    createdAt: "2024-01-14T09:30:00Z",
    status: "open",
  },
  {
    id: "8",
    title: "Package Delivery",
    description: "Deliver a small package to Bulawayo",
    category: "Delivery",
    budget: 12,
    location: "Bulawayo, Zimbabwe",
    distance: 1.8,
    postedBy: "Mike Johnson",
    urgency: "Urgent",
    pickupLocation: "Bulawayo Central Post Office",
    dropoffLocation: "789 Main Street",
    createdAt: "2024-01-13T14:00:00Z",
    status: "open",
  },
  {
    id: "9",
    title: "Pharmacy Run",
    description: "Pick up medication from pharmacy and deliver",
    category: "Pickup",
    budget: 4,
    location: "Mutare, Zimbabwe",
    distance: 4.1,
    postedBy: "Sarah Williams",
    urgency: "Urgent",
    pickupLocation: "Mutare Pharmacy",
    dropoffLocation: "321 Herbert Chitepo St",
    createdAt: "2024-01-12T11:00:00Z",
    status: "open",
  },
  {
    id: "10",
    title: "Restaurant Delivery",
    description: "Pick up food from Mugg & Bean and deliver",
    category: "Delivery",
    budget: 3.5,
    location: "Gweru, Zimbabwe",
    distance: 2.9,
    postedBy: "David Brown",
    urgency: "Normal",
    pickupLocation: "Mugg & Bean, Gweru",
    dropoffLocation: "654 Robert Mugabe Way",
    createdAt: "2024-01-11T16:30:00Z",
    status: "open",
  },
];

export function RunnerHome() {
  const navigate = useNavigate();
  const [errands, setErrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRadius, setSelectedRadius] = useState("5");
  const [location, setLocation] = useState("Harare, Zimbabwe");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchErrands();
  }, []);

  const fetchErrands = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      setTimeout(() => {
        setErrands(mockErrands);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching errands:", error);
      toast.error("Failed to load errands");
      setLoading(false);
    }
  };

  const filteredErrands = errands.filter((errand) => {
    const matchesType = selectedType === "All" || errand.category === selectedType;
    const matchesDistance = errand.distance <= parseInt(selectedRadius);
    const matchesLocation = errand.location.includes(location.split(",")[0]);
    const matchesSearch = !searchQuery || 
      errand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      errand.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesDistance && matchesLocation && matchesSearch;
  });

  // Sort errands based on selected criteria
  const sortedErrands = [...filteredErrands].sort((a, b) => {
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
              <p className="text-sm text-zinc-400">Find errands matching your skills</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/runner/tasks")}
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
              placeholder="Search errands..."
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

          {/* Errand Type Tabs */}
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2">
              {errandTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedType === type
                      ? "bg-teal-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">
            {sortedErrands.length} Errands Available
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
        ) : sortedErrands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">No errands available matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedErrands.map((errand) => (
              <div key={errand.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-teal-500 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">{errand.title}</h3>
                  {errand.urgency === "Urgent" && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{errand.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                    {errand.category}
                  </span>
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                    ${errand.budget}
                  </span>
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                    {errand.pickupLocation}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-500">{errand.postedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-500">{errand.distance} km</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    onClick={() => navigate(`/job/${errand.id}`)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
                    View Details
                  </Button>
                  <Button 
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${errand.id}`);
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

      <BottomNav role="runner" />

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
