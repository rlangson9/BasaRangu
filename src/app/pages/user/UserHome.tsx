import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Search, Plus, Filter, MapPin, Users, Clock, Star, Briefcase, Wrench, Package, MessageSquare } from "lucide-react";
import { toast } from "sonner";

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

// Mock data for service providers and errand runners
const mockProviders = [
  {
    id: "1",
    name: "John Doe",
    role: "provider",
    category: "Plumbing",
    skills: ["Plumbing", "Pipe Repair", "Leak Fixing"],
    rating: 4.8,
    reviews: 124,
    location: "Harare, Zimbabwe",
    distance: 2.5,
    avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20plumber%20portrait&image_size=square",
    available: true,
    hourlyRate: 5,
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "provider",
    category: "Cleaning",
    skills: ["Deep Cleaning", "Housekeeping", "Office Cleaning"],
    rating: 4.9,
    reviews: 98,
    location: "Harare, Zimbabwe",
    distance: 3.2,
    avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20cleaner%20portrait&image_size=square",
    available: true,
    hourlyRate: 4,
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "runner",
    category: "Delivery",
    skills: ["Package Delivery", "Shopping", "Errands"],
    rating: 4.7,
    reviews: 87,
    location: "Bulawayo, Zimbabwe",
    distance: 1.8,
    avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20delivery%20person%20portrait&image_size=square",
    available: true,
    hourlyRate: 3.5,
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "provider",
    category: "Electrical",
    skills: ["Wiring", "Installation", "Repair"],
    rating: 4.6,
    reviews: 65,
    location: "Mutare, Zimbabwe",
    distance: 4.1,
    avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20electrician%20portrait&image_size=square",
    available: true,
    hourlyRate: 5.5,
  },
  {
    id: "5",
    name: "David Brown",
    role: "runner",
    category: "Shopping",
    skills: ["Grocery Shopping", "Pharmacy Runs", "Specialty Items"],
    rating: 4.8,
    reviews: 43,
    location: "Gweru, Zimbabwe",
    distance: 2.9,
    avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20errand%20runner%20portrait&image_size=square",
    available: true,
    hourlyRate: 3,
  },
];

export function UserHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRadius, setSelectedRadius] = useState("5");
  const [location, setLocation] = useState("Harare, Zimbabwe");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

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
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      setTimeout(() => {
        setProviders(mockProviders);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast.error("Failed to load service providers");
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesCategory = selectedCategory === "All" || provider.category === selectedCategory;
    const matchesRole = selectedRole === "all" || provider.role === selectedRole;
    const matchesDistance = provider.distance <= parseInt(selectedRadius);
    const matchesSearch = !searchQuery || 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesRole && matchesDistance && matchesSearch && provider.available;
  });

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
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
              <p className="text-sm text-zinc-400">Hire skilled workers for any task</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/user/chat")}
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
              placeholder="Search for services or providers..."
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
            
            {/* Role */}
            <div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white text-sm">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="all" className="text-white">All Providers</SelectItem>
                  <SelectItem value="provider" className="text-white">Service Providers</SelectItem>
                  <SelectItem value="runner" className="text-white">Errand Runners</SelectItem>
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

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Post Job Button */}
        <Button
          onClick={() => navigate("/post-job")}
          className="w-full mb-6 bg-teal-500 hover:bg-teal-600 text-white h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post a Job
        </Button>

        {/* Available Workers */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">
            Available Service Providers ({filteredProviders.length})
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
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">No service providers available in your area</p>
            <Button
              onClick={() => navigate("/post-job")}
              className="mt-4 bg-teal-500 hover:bg-teal-600"
            >
              Post Your First Job
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div 
                key={provider.id} 
                className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-teal-500 transition-colors cursor-pointer"
                onClick={() => navigate(`/provider/detail/${provider.id}`)}
              >
                <div className="flex items-start gap-4">
                  <img 
                    src={provider.avatar} 
                    alt={provider.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-white">{provider.rating}</span>
                        <span className="text-xs text-zinc-400">({provider.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-xs rounded-full">
                        {provider.role === "provider" ? "Service Provider" : "Errand Runner"}
                      </span>
                      <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">
                        {provider.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <MapPin className="w-3 h-3" />
                        <span>{provider.distance} km</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {provider.skills.slice(0, 3).map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {provider.skills.length > 3 && (
                        <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                          +{provider.skills.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-lg font-semibold text-white">
                        ${provider.hourlyRate}/hr
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chat/provider-${provider.id}`);
                        }} className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
                          Chat Now
                        </Button>
                        <Button onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/job/new?provider=${provider.id}`);
                        }} className="bg-teal-500 hover:bg-teal-600">
                          Hire
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
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
      `}</style>
    </div>
  );
}
