import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { MapPin, Briefcase, Star, MessageSquare, Clock } from "lucide-react";
import { projectId } from "../../../../utils/supabase/info";
import { toast } from "sonner";

export function RecruiterHired() {
  const navigate = useNavigate();
  const [hiredCandidates, setHiredCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHiredCandidates();
  }, []);

  const fetchHiredCandidates = async () => {
    try {
      // In real implementation, fetch hired candidates from database
      // For now, showing dummy data
      setHiredCandidates([
        {
          id: "1",
          name: "John Smith",
          title: "Software Engineer",
          jobTitle: "Senior Frontend Developer",
          hiredDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Harare, Zimbabwe",
          rating: 4.8,
          status: "Active",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20software%20engineer%20portrait&image_size=square",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          title: "Marketing Manager",
          jobTitle: "Marketing Director",
          hiredDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Bulawayo, Zimbabwe",
          rating: 4.9,
          status: "Active",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20marketing%20manager%20portrait&image_size=square",
        },
        {
          id: "3",
          name: "David Brown",
          title: "Graphic Designer",
          jobTitle: "Senior Graphic Designer",
          hiredDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Mutare, Zimbabwe",
          rating: 4.7,
          status: "On Leave",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20graphic%20designer%20portrait&image_size=square",
        },
      ]);
    } catch (error) {
      console.error("Error fetching hired candidates:", error);
      toast.error("Failed to load hired candidates");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900">Hired Candidates</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-xl animate-pulse border border-zinc-200"
              />
            ))}
          </div>
        ) : hiredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600">No hired candidates yet</p>
            <Button
              onClick={() => navigate("/recruiter")}
              className="mt-4 bg-teal-500 hover:bg-teal-600"
            >
              Find Candidates
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {hiredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-teal-400 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {candidate.avatar ? (
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-bold">
                      {candidate.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-zinc-900">{candidate.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium text-zinc-700">{candidate.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                        {candidate.title}
                      </span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {candidate.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-1 text-sm text-zinc-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{candidate.jobTitle}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-zinc-600">
                        <Clock className="w-4 h-4" />
                        <span>Hired: {formatDate(candidate.hiredDate)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-zinc-600">
                        <MapPin className="w-4 h-4" />
                        <span>{candidate.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={() => navigate(`/chat/candidate-${candidate.id}`)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav role="recruiter" />
    </div>
  );
}
