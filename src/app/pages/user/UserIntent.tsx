import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Search, Filter } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

interface JobIntent {
  id: string;
  title: string;
  category: string;
  location: string;
  budget: string;
  timeFrame: string;
  description: string;
  skills: string[];
  active: boolean;
}

export function UserIntent() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [intent, setIntent] = useState<JobIntent>({
    id: "",
    title: "",
    category: "",
    location: "",
    budget: "",
    timeFrame: "",
    description: "",
    skills: [],
    active: true
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading user data:", error);
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!intent.title || !intent.category || !intent.location || !intent.budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, this would save to an API
    const newIntent: JobIntent = {
      ...intent,
      id: Date.now().toString(),
      skills
    };

    // Save to localStorage for demo purposes
    const savedIntents = JSON.parse(localStorage.getItem("jobIntents") || "[]");
    savedIntents.push(newIntent);
    localStorage.setItem("jobIntents", JSON.stringify(savedIntents));

    toast.success("Job intent saved successfully");
    setActiveTab("active");
  };

  const getSavedIntents = () => {
    return JSON.parse(localStorage.getItem("jobIntents") || "[]");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-teal-400"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Job Intent</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex border-b border-zinc-800 mb-6">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-3 text-sm font-medium ${activeTab === "create" ? "text-teal-400 border-b-2 border-teal-400" : "text-zinc-400 hover:text-zinc-300"}`}
          >
            Create Intent
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-3 text-sm font-medium ${activeTab === "active" ? "text-teal-400 border-b-2 border-teal-400" : "text-zinc-400 hover:text-zinc-300"}`}
          >
            Active Intents
          </button>
        </div>

        {activeTab === "create" ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Create Job Intent</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Job Title
                  </label>
                  <Input
                    type="text"
                    value={intent.title}
                    onChange={(e) => setIntent({ ...intent, title: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="e.g., Plumbing Repair, House Cleaning"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Category
                  </label>
                  <Select
                    value={intent.category}
                    onValueChange={(value) => setIntent({ ...intent, category: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="gardening">Gardening</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="carpentry">Carpentry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={intent.location}
                    onChange={(e) => setIntent({ ...intent, location: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="e.g., Harare, Bulawayo, Mutare"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Budget
                  </label>
                  <Input
                    type="number"
                    value={intent.budget}
                    onChange={(e) => setIntent({ ...intent, budget: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="e.g., 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Time Frame
                  </label>
                  <Select
                    value={intent.timeFrame}
                    onValueChange={(value) => setIntent({ ...intent, timeFrame: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select time frame" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="asap">As Soon As Possible</SelectItem>
                      <SelectItem value="within_week">Within a Week</SelectItem>
                      <SelectItem value="within_month">Within a Month</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={intent.description}
                    onChange={(e) => setIntent({ ...intent, description: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Describe the job in detail..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                      className="bg-zinc-800 border-zinc-700 text-white flex-1"
                      placeholder="Add a skill"
                    />
                    <Button onClick={handleAddSkill} className="bg-teal-500 hover:bg-teal-600 text-white">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-zinc-400 hover:text-white"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="active" checked={intent.active} onCheckedChange={(checked) => setIntent({ ...intent, active: checked as boolean })} />
                  <label htmlFor="active" className="text-sm text-zinc-400">
                    Make this intent active
                  </label>
                </div>

                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                  Save Job Intent
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {getSavedIntents().length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No active job intents yet</p>
                <Button onClick={() => setActiveTab("create")} className="mt-4 bg-teal-500 hover:bg-teal-600 text-white">
                  Create Intent
                </Button>
              </div>
            ) : (
              getSavedIntents().map((jobIntent: JobIntent) => (
                <Card key={jobIntent.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{jobIntent.title}</h3>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 text-zinc-400">
                            <MapPin className="w-4 h-4" />
                            <span>{jobIntent.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-400">
                            <DollarSign className="w-4 h-4" />
                            <span>${jobIntent.budget}</span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-400">
                            <Clock className="w-4 h-4" />
                            <span>{jobIntent.timeFrame}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {jobIntent.skills.map((skill, index) => (
                            <Badge key={index} className="bg-zinc-800 text-zinc-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-zinc-400 text-sm mb-4">{jobIntent.description}</p>
                      </div>
                      <Badge className={jobIntent.active ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-zinc-400"}>
                        {jobIntent.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white">
                        Edit
                      </Button>
                      <Button className="bg-red-500/20 hover:bg-red-500/30 text-red-400">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav role="user" />
    </div>
  );
}
