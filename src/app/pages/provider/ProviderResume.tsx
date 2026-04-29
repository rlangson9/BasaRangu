import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  ArrowLeft,
  Save,
  Download,
  Send,
  Plus,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface ResumeData {
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: string[];
  certifications: string[];
}

export function ProviderResume() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(true);
  const [user, setUser] = useState<any>({});
  const resumeRef = useRef<HTMLDivElement>(null);

  const [resumeData, setResumeData] = useState<ResumeData>({
    summary: "",
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    certifications: [],
  });

  const [newLanguage, setNewLanguage] = useState("");
  const [newCertification, setNewCertification] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);

    const savedResume = localStorage.getItem(`resume_${userData.id || "user"}`);
    if (savedResume) {
      setResumeData(JSON.parse(savedResume));
    }
  }, []);

  const saveResume = () => {
    localStorage.setItem(`resume_${user.id || "user"}`, JSON.stringify(resumeData));
    toast.success("Resume saved successfully!");
    setIsEditing(false);
  };

  const downloadPDF = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData.isVip) {
      toast.error("PDF download requires VIP subscription");
      navigate("/user/vip");
      return;
    }
    
    if (!resumeRef.current) {
      toast.error("Unable to download resume");
      return;
    }

    const element = resumeRef.current;
    const options = {
      margin: 10,
      filename: `${user.name || 'resume'}_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    toast.success("Generating PDF...");
    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => {
        toast.success("Resume downloaded successfully!");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF");
      });
  };

  const sendResume = () => {
    toast.success("Resume share link copied to clipboard!");
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experiences: [
        ...resumeData.experiences,
        {
          id: Date.now().toString(),
          jobTitle: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      educations: [
        ...resumeData.educations,
        {
          id: Date.now().toString(),
          degree: "",
          school: "",
          startDate: "",
          endDate: "",
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      educations: resumeData.educations.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({
      ...resumeData,
      educations: resumeData.educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [
        ...resumeData.skills,
        {
          id: Date.now().toString(),
          name: "",
          level: "Intermediate",
        },
      ],
    });
  };

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((skill) => skill.id !== id),
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setResumeData({
        ...resumeData,
        languages: [...resumeData.languages, newLanguage.trim()],
      });
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setResumeData({
      ...resumeData,
      languages: resumeData.languages.filter((_, i) => i !== index),
    });
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setResumeData({
        ...resumeData,
        certifications: [...resumeData.certifications, newCertification.trim()],
      });
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-teal-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">My Resume</h1>
            <div className="flex-1" />
            {isEditing ? (
              <Button
                onClick={saveResume}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-zinc-700 hover:bg-zinc-600 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <Button
              onClick={sendResume}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={downloadPDF}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {isEditing ? (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-4">Professional Summary</h2>
              <Textarea
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                placeholder="Write a brief professional summary..."
                className="w-full bg-zinc-800 border-zinc-700 text-white"
                rows={4}
              />
            </div>

            {/* Experience */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Work Experience</h2>
                <Button
                  onClick={addExperience}
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-4">
                {resumeData.experiences.map((exp) => (
                  <div key={exp.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-medium text-white">Experience</h3>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <Input
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(exp.id, "jobTitle", e.target.value)}
                        placeholder="Job Title"
                        className="bg-zinc-700 border-zinc-600 text-white"
                      />
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="Company Name"
                        className="bg-zinc-700 border-zinc-600 text-white"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                      </div>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        className="bg-zinc-700 border-zinc-600 text-white"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Education</h2>
                <Button
                  onClick={addEducation}
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-4">
                {resumeData.educations.map((edu) => (
                  <div key={edu.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-medium text-white">Education</h3>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Degree"
                        className="bg-zinc-700 border-zinc-600 text-white"
                      />
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                        placeholder="School/University"
                        className="bg-zinc-700 border-zinc-600 text-white"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          className="bg-zinc-700 border-zinc-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Skills</h2>
                <Button
                  onClick={addSkill}
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {resumeData.skills.map((skill) => (
                  <div key={skill.id} className="flex gap-3 items-center">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                      placeholder="Skill"
                      className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
                      className="px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-4">Languages</h2>
              <div className="flex gap-3 mb-4">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addLanguage()}
                  placeholder="Add a language..."
                  className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                />
                <Button
                  onClick={addLanguage}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-800 text-white rounded-full flex items-center gap-2"
                  >
                    {lang}
                    <button
                      onClick={() => removeLanguage(index)}
                      className="text-zinc-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-4">Certifications</h2>
              <div className="flex gap-3 mb-4">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCertification()}
                  placeholder="Add a certification..."
                  className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                />
                <Button
                  onClick={addCertification}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {resumeData.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 bg-zinc-800 text-white rounded-lg flex items-center justify-between"
                  >
                    {cert}
                    <button
                      onClick={() => removeCertification(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Resume Preview */
          <div className="bg-white rounded-xl overflow-hidden">
            <div ref={resumeRef} className="p-8 relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <img 
                  src="/basarangu.png" 
                  alt="BasaRangu" 
                  className="w-64 h-auto"
                />
              </div>
              
              {/* Header */}
              <div className="text-center mb-8 relative z-10">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                  {user.name || "Your Name"}
                </h1>
                <div className="text-zinc-600 space-x-4">
                  <span>{user.email || "email@example.com"}</span>
                  <span>•</span>
                  <span>{user.phone || "+263 77 123 4567"}</span>
                  {user.city && (
                    <>
                      <span>•</span>
                      <span>{user.city}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <section className="mb-8 relative z-10">
                  <h2 className="text-xl font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 mb-4">
                    Professional Summary
                  </h2>
                  <p className="text-zinc-700 leading-relaxed">{resumeData.summary}</p>
                </section>
              )}

              {/* Experience */}
              {resumeData.experiences.length > 0 && (
                <section className="mb-8 relative z-10">
                  <h2 className="text-xl font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 mb-4">
                    Work Experience
                  </h2>
                  {resumeData.experiences.map((exp) => (
                    <div key={exp.id} className="mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-zinc-900">{exp.jobTitle}</h3>
                          <p className="text-teal-600 font-medium">{exp.company}</p>
                        </div>
                        <span className="text-zinc-500 text-sm">
                          {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : ""}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-zinc-700 mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Education */}
              {resumeData.educations.length > 0 && (
                <section className="mb-8 relative z-10">
                  <h2 className="text-xl font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 mb-4">
                    Education
                  </h2>
                  {resumeData.educations.map((edu) => (
                    <div key={edu.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-zinc-900">{edu.degree}</h3>
                          <p className="text-zinc-700">{edu.school}</p>
                        </div>
                        <span className="text-zinc-500 text-sm">
                          {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <section className="mb-8 relative z-10">
                  <h2 className="text-xl font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 mb-4">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm"
                      >
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {resumeData.languages.length > 0 && (
                <section className="mb-8 relative z-10">
                  <h2 className="text-xl font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 mb-4">
                    Languages
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {resumeData.certifications.length > 0 && (
                <section className="relative z-10">
                  <h2 className="text-xl font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 mb-4">
                    Certifications
                  </h2>
                  <ul className="list-disc list-inside text-zinc-700 space-y-1">
                    {resumeData.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
