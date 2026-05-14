import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Briefcase, MapPin, DollarSign, Star, Mail, Calendar, Bookmark, Share2, FileText, GraduationCap, Award, Phone } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

export function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      const mockCandidates = [
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
          email: "john.smith@example.com",
          phone: "+1 (555) 123-4567",
          resumeUrl: "https://example.com/resumes/john-smith-resume.pdf",
          skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
          bio: "Experienced software engineer with 5 years of experience building web applications. Proficient in React, TypeScript, and Node.js. Passionate about creating scalable and maintainable code.",
          experienceHistory: [
            {
              company: "Tech Company Inc.",
              position: "Senior Software Engineer",
              period: "2021 - Present",
              description: "Led the development of a new web application using React and Node.js. Mentored junior engineers and implemented best practices for code quality."
            },
            {
              company: "Startup Co.",
              position: "Software Engineer",
              period: "2019 - 2021",
              description: "Developed frontend features using React and Redux. Collaborated with designers to implement responsive UIs."
            }
          ],
          educationHistory: [
            {
              institution: "University of California",
              degree: "BS Computer Science",
              period: "2015 - 2019",
              description: "Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development."
            }
          ],
          certifications: [
            {
              name: "AWS Certified Solutions Architect",
              issuer: "Amazon Web Services",
              date: "2022"
            },
            {
              name: "Google Cloud Professional Developer",
              issuer: "Google Cloud",
              date: "2021"
            }
          ],
          projects: [
            {
              name: "E-commerce Platform",
              description: "Built a full-stack e-commerce platform using React, Node.js, and MongoDB. Implemented features like product search, cart functionality, and payment processing.",
              technologies: ["React", "Node.js", "MongoDB", "Stripe"]
            },
            {
              name: "Task Management App",
              description: "Created a task management application with real-time updates using Socket.io. Implemented features like task assignment, deadlines, and progress tracking.",
              technologies: ["React", "Node.js", "Socket.io", "PostgreSQL"]
            }
          ]
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
          email: "sarah.johnson@example.com",
          phone: "+1 (555) 987-6543",
          resumeUrl: "https://example.com/resumes/sarah-johnson-resume.pdf",
          skills: ["Digital Marketing", "SEO", "Social Media", "Content Marketing", "Analytics"],
          bio: "Marketing professional with 7 years of experience in digital marketing strategies. Expert in SEO, social media, and content marketing. Proven track record of increasing brand awareness and driving sales.",
          experienceHistory: [
            {
              company: "Marketing Agency",
              position: "Senior Marketing Manager",
              period: "2020 - Present",
              description: "Managed marketing campaigns for clients across various industries. Developed SEO strategies that increased organic traffic by 40% for key clients."
            },
            {
              company: "Retail Brand",
              position: "Marketing Specialist",
              period: "2017 - 2020",
              description: "Created social media campaigns that increased engagement by 60%. Managed content calendar and collaborated with design team on creative assets."
            }
          ],
          educationHistory: [
            {
              institution: "New York University",
              degree: "MBA Marketing",
              period: "2015 - 2017",
              description: "Specialized in digital marketing and brand management. Graduated with distinction."
            },
            {
              institution: "Boston College",
              degree: "BS Business Administration",
              period: "2011 - 2015",
              description: "Focused on marketing and management courses. Active member of the marketing club."
            }
          ],
          certifications: [
            {
              name: "Google Ads Certification",
              issuer: "Google",
              date: "2023"
            },
            {
              name: "HubSpot Inbound Marketing Certification",
              issuer: "HubSpot",
              date: "2022"
            }
          ],
          projects: [
            {
              name: "Brand Launch Campaign",
              description: "Led the launch campaign for a new product line, resulting in 25% increase in sales within the first quarter. Coordinated with design, content, and social media teams to execute a cohesive strategy.",
              technologies: ["Google Ads", "Facebook Ads", "Content Marketing"]
            },
            {
              name: "SEO Optimization Project",
              description: "Implemented SEO strategies for a client website, resulting in a 40% increase in organic traffic and top 3 rankings for key search terms.",
              technologies: ["SEO", "Content Marketing", "Analytics"]
            }
          ]
        }
      ];
      
      const foundCandidate = mockCandidates.find(c => c.id === id);
      setTimeout(() => {
        setCandidate(foundCandidate);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching candidate:", error);
    }
  };

  const handleInviteInterview = () => {
    toast.success("Interview Invitation Sent!", {
      description: `An interview invitation has been sent to ${candidate.name}. They will receive an email notification.`,
      duration: 4000,
    });
  };

  const handleChatNow = () => {
    navigate(`/chat/candidate-${candidate.id}`);
  };

  const handleShortlist = () => {
    setIsShortlisted(!isShortlisted);
    if (isShortlisted) {
      toast.info("Removed from Shortlist", {
        description: `${candidate.name} has been removed from your shortlist.`,
        duration: 3000,
      });
    } else {
      toast.success("Added to Shortlist!", {
        description: `${candidate.name} has been added to your shortlist. You can view all shortlisted candidates in your dashboard.`,
        duration: 4000,
      });
    }
  };

  const handleViewResume = () => {
    setShowResume(!showResume);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-600">Loading...</div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-600">Candidate not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-zinc-600 hover:text-teal-500"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-zinc-900">Candidate Profile</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Candidate Header */}
        <div className="bg-white rounded-xl p-6 border border-zinc-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-3xl font-bold">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-zinc-900">{candidate.name}</h2>
                </div>
                <p className="text-lg text-zinc-700 mb-2">{candidate.title}</p>
                <div className="flex items-center gap-1 text-zinc-600 mb-2">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span>{candidate.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleChatNow}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Chat Now
              </Button>
              <Button 
                onClick={handleInviteInterview}
                className="bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Invite to Interview
              </Button>
              <Button 
                onClick={handleShortlist}
                className={`${isShortlisted ? 'bg-yellow-600 border-yellow-600 text-white' : 'bg-[#c28e00] border-[#c28e00] text-white'} hover:opacity-90`}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isShortlisted ? 'fill-white' : ''}`} />
                {isShortlisted ? 'Shortlisted' : 'Shortlist'}
              </Button>
              <Button 
                onClick={handleViewResume}
                className="bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                {showResume ? 'Hide Resume' : 'View Resume'}
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-200 pt-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-700">{candidate.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-700">{candidate.experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-700">{candidate.salary}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-700">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-700">{candidate.phone}</span>
            </div>
          </div>

          {/* Resume View */}
          {showResume && (
            <div className="mt-6 border-t border-zinc-200 pt-4">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Online Resume</h3>
              <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-700">{candidate.name}'s Resume</span>
                  <Button 
                    onClick={() => window.open(candidate.resumeUrl, '_blank')}
                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm"
                  >
                    Download PDF
                  </Button>
                </div>
                <div className="bg-white rounded-lg p-6 border border-zinc-200 min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <p className="text-zinc-600 mb-2">Resume Preview</p>
                    <p className="text-sm text-zinc-500 mb-4">{candidate.name} - {candidate.title}</p>
                    <div className="grid grid-cols-2 gap-4 text-left text-sm">
                      <div>
                        <p className="font-medium text-zinc-900">Experience</p>
                        <p className="text-zinc-600">{candidate.experience}</p>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">Education</p>
                        <p className="text-zinc-600">{candidate.education}</p>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">Location</p>
                        <p className="text-zinc-600">{candidate.location}</p>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">Salary Range</p>
                        <p className="text-zinc-600">{candidate.salary}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-left">
                      <p className="font-medium text-zinc-900 mb-2">Key Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 4).map((skill: string, index: number) => (
                          <Badge key={index} className="bg-zinc-100 text-zinc-700 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl p-6 border border-zinc-200 mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill: string, index: number) => (
              <Badge key={index} className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-xl p-6 border border-zinc-200 mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">About</h3>
          <p className="text-zinc-700 leading-relaxed">{candidate.bio}</p>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-xl p-6 border border-zinc-200 mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Experience</h3>
          <div className="space-y-4">
            {candidate.experienceHistory.map((exp: any, index: number) => (
              <div key={index} className="border-l-2 border-teal-500 pl-4 py-2">
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium text-zinc-900">{exp.position}</h4>
                  <span className="text-sm text-zinc-600">{exp.period}</span>
                </div>
                <p className="text-sm text-zinc-700 mb-2">{exp.company}</p>
                <p className="text-sm text-zinc-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl p-6 border border-zinc-200 mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Education</h3>
          <div className="space-y-4">
            {candidate.educationHistory.map((edu: any, index: number) => (
              <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium text-zinc-900">{edu.degree}</h4>
                  <span className="text-sm text-zinc-600">{edu.period}</span>
                </div>
                <p className="text-sm text-zinc-700 mb-2">{edu.institution}</p>
                <p className="text-sm text-zinc-600">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-xl p-6 border border-zinc-200 mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Certifications</h3>
          <div className="space-y-3">
            {candidate.certifications.map((cert: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-zinc-900">{cert.name}</h4>
                  <p className="text-sm text-zinc-600">{cert.issuer}</p>
                </div>
                <span className="text-sm text-zinc-600">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl p-6 border border-zinc-200 mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Projects</h3>
          <div className="space-y-4">
            {candidate.projects.map((project: any, index: number) => (
              <div key={index} className="border border-zinc-200 rounded-lg p-4">
                <h4 className="font-medium text-zinc-900 mb-2">{project.name}</h4>
                <p className="text-sm text-zinc-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech: string, techIndex: number) => (
                    <Badge key={techIndex} className="bg-zinc-100 text-zinc-700 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav role="recruiter" />
    </div>
  );
}
