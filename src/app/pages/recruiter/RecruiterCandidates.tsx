import { useState } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Search, Briefcase, MapPin, Star } from "lucide-react";

export function RecruiterCandidates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const candidates = [
    {
      id: "1",
      userId: "user-001",
      name: "Emily Chen",
      title: "Product Designer",
      experience: [
        {
          company: "Tech Innovate Inc.",
          position: "Senior Product Designer",
          duration: "2021 - Present",
          description: "Leading design for core product features, managing a team of 3 designers, and establishing design system standards."
        },
        {
          company: "Design Studio Co.",
          position: "UI/UX Designer",
          duration: "2019 - 2021",
          description: "Created user-centered designs for mobile and web applications, conducted user research and usability testing."
        }
      ],
      education: [
        {
          institution: "University of Washington",
          degree: "Bachelor of Fine Arts in Design",
          year: "2019"
        }
      ],
      location: "Seattle, WA",
      email: "emily.chen@example.com",
      phone: "+1 (206) 555-0123",
      skills: ["UI/UX", "Figma", "Design Systems", "Prototyping", "User Research"],
      summary: "Passionate product designer with 4+ years of experience creating intuitive digital experiences. Specialized in mobile-first design and building scalable design systems.",
      expectedSalary: "$85,000 - $100,000/year",
      availability: "Immediately",
      rating: 4.7,
      reviewCount: 23,
    },
    {
      id: "2",
      userId: "user-002",
      name: "Michael Brown",
      title: "Data Analyst",
      experience: [
        {
          company: "Analytics Corp",
          position: "Data Analyst",
          duration: "2020 - Present",
          description: "Analyzing business data to drive strategic decisions, creating dashboards and reports, optimizing data pipelines."
        }
      ],
      education: [
        {
          institution: "Boston University",
          degree: "Master of Science in Data Science",
          year: "2020"
        }
      ],
      location: "Boston, MA",
      email: "m.brown@example.com",
      phone: "+1 (617) 555-0456",
      skills: ["Python", "SQL", "Tableau", "Data Visualization", "Machine Learning"],
      summary: "Results-driven data analyst with expertise in turning complex data into actionable insights. Proficient in statistical analysis and data visualization.",
      expectedSalary: "$70,000 - $85,000/year",
      availability: "2 weeks notice",
      rating: 4.9,
      reviewCount: 31,
    },
  ];

  const handleViewProfile = (candidate: any) => {
    navigate(`/recruiter/candidate/${candidate.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-zinc-900">Browse Candidates</h1>
            <RoleSwitcher />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search by skills, experience, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-50 border-zinc-300 text-zinc-900"
            />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-teal-400 cursor-pointer transition-all"
              onClick={() => handleViewProfile(candidate)}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-bold">
                  {candidate.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-zinc-900 mb-1">{candidate.name}</h3>
                  <p className="text-base text-zinc-700 mb-2">{candidate.title}</p>

                  <div className="flex items-center gap-4 text-sm text-zinc-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{candidate.experience.map(exp => exp.duration).join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span>{candidate.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} className="bg-teal-50 text-teal-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav role="recruiter" />
    </div>
  );
}