import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Filter, Plus, Briefcase, MapPin, DollarSign, Star } from "lucide-react";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";

const industries = ["All", "Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Other"];

export function RecruiterHome() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      // In real implementation, fetch job seekers from database
      // For now, showing dummy data
      setCandidates([
        {
          id: "1",
          name: "John Smith",
          title: "Software Engineer",
          experience: "5 years",
          education: "BS Computer Science",
          location: "San Francisco",
          salary: "100k-120k",
          rating: 4.8,
          verified: true,
        },
        {
          id: "2",
          name: "Sarah Johnson",
          title: "Marketing Manager",
          experience: "7 years",
          education: "MBA Marketing",
          location: "New York",
          salary: "90k-110k",
          rating: 4.9,
          verified: true,
        },
      ]);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header - Light Theme */}
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                  <img 
                    src="/basarangu.png" 
                    alt="BasaRangu Logo" 
                    className="w-10 h-auto"
                  />
                  <h1 className="text-2xl font-bold text-zinc-900">{user.name || 'BasaRangu'}</h1>
                </div>
              <p className="text-sm text-zinc-600">Find the perfect candidates</p>
            </div>
            <RoleSwitcher />
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search candidates by name, skills, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-50 border-zinc-300 text-zinc-900"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Filter className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Industry Tabs */}
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedIndustry === industry
                      ? "bg-teal-500 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {industry}
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
          Post a Job Opening
        </Button>

        {/* Candidates List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">
            Recommended Candidates ({candidates.length})
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-xl animate-pulse border border-zinc-200"
              />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600">No candidates available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-teal-400 cursor-pointer transition-all hover:shadow-md"
                onClick={() => navigate(`/recruiter/candidate/${candidate.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-zinc-900">{candidate.name}</h3>
                      {candidate.verified && (
                        <Badge className="bg-teal-50 text-teal-700 text-xs">Verified</Badge>
                      )}
                    </div>
                    <p className="text-base text-zinc-700 font-medium mb-1">{candidate.title}</p>
                    <p className="text-sm text-zinc-600">{candidate.education}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-bold">
                    {candidate.name.charAt(0)}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{candidate.experience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{candidate.salary}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium text-zinc-700">
                      {candidate.rating.toFixed(1)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/chat/candidate-${candidate.id}`);
                    }}
                  >
                    Chat Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav role="recruiter" />

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
