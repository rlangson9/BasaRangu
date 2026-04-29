import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Download,
  MessageSquare,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router";

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface Resume {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  expectedSalary?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
}

interface ResumeViewerProps {
  open: boolean;
  onClose: () => void;
  resume: Resume | null;
}

export function ResumeViewer({ open, onClose, resume }: ResumeViewerProps) {
  const navigate = useNavigate();

  if (!resume) return null;

  const handleContactCandidate = () => {
    // Navigate to chat or create a chat
    navigate(`/chat/candidate-${resume.userId}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white text-zinc-900 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Candidate Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            {resume.avatar ? (
              <img
                src={resume.avatar}
                alt={resume.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl font-bold">
                {resume.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-zinc-900">{resume.name}</h2>
              <p className="text-lg text-zinc-600 mb-2">{resume.title}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {resume.location}
                </div>
                {resume.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{resume.rating.toFixed(1)}</span>
                    <span className="text-zinc-500">({resume.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </Button>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-700">{resume.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-700">{resume.phone}</span>
            </div>
          </div>

          {/* Expected Salary & Availability */}
          {(resume.expectedSalary || resume.availability) && (
            <div className="grid grid-cols-2 gap-4">
              {resume.expectedSalary && (
                <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                  <div className="flex items-center gap-2 text-sm text-zinc-600 mb-1">
                    <DollarSign className="w-4 h-4" />
                    Expected Salary
                  </div>
                  <div className="font-semibold text-zinc-900">{resume.expectedSalary}</div>
                </div>
              )}
              {resume.availability && (
                <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                  <div className="flex items-center gap-2 text-sm text-zinc-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    Availability
                  </div>
                  <div className="font-semibold text-zinc-900">{resume.availability}</div>
                </div>
              )}
            </div>
          )}

          {/* Professional Summary */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              Professional Summary
            </h3>
            <p className="text-zinc-700 leading-relaxed">{resume.summary}</p>
          </div>

          <Separator />

          {/* Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600" />
                Work Experience
              </h3>
              <div className="space-y-4">
                {resume.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-teal-500 pl-4">
                    <h4 className="font-semibold text-zinc-900">{exp.position}</h4>
                    <div className="text-sm text-teal-600 font-medium">{exp.company}</div>
                    <div className="text-sm text-zinc-500 mb-2">{exp.duration}</div>
                    <p className="text-sm text-zinc-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                Education
              </h3>
              <div className="space-y-3">
                {resume.education.map((edu, index) => (
                  <div key={index} className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                    <h4 className="font-semibold text-zinc-900">{edu.degree}</h4>
                    <div className="text-sm text-zinc-600">{edu.institution}</div>
                    <div className="text-sm text-zinc-500">{edu.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-teal-100 text-teal-700 border-teal-300"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-zinc-300 text-zinc-700 hover:bg-zinc-100"
            >
              Close
            </Button>
            <Button
              onClick={handleContactCandidate}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Candidate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
