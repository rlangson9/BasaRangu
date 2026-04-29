import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Camera, CheckCircle2, Bike } from "lucide-react";

export function RunnerProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Harare, Zimbabwe",
    bio: "",
    avatar: "",
    skills: [],
    hourlyRate: 0,
    experience: "",
    verified: false,
    vehicle: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing user data from localStorage
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (existingUser) {
      setUser({
        name: existingUser.name || "",
        phone: existingUser.phone || "",
        email: existingUser.email || "",
        address: existingUser.address || "",
        city: existingUser.city || "Harare, Zimbabwe",
        bio: existingUser.bio || "",
        avatar: existingUser.avatar || "",
        skills: existingUser.skills || [],
        hourlyRate: existingUser.hourlyRate || 0,
        experience: existingUser.experience || "",
        verified: existingUser.verified || false,
        vehicle: existingUser.vehicle || "",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would save to an API
      // For now, save to localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        ...user,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully");
      navigate("/runner/me");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the image
    // For now, use a placeholder
    setUser({
      ...user,
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20errand%20runner%20portrait&image_size=square",
    });
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map(skill => skill.trim()).filter(skill => skill);
    setUser({ ...user, skills });
  };

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

  const experienceLevels = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years",
  ];

  const vehicleOptions = [
    "None",
    "Bicycle",
    "Motorcycle",
    "Car",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-teal-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <div className="flex-1" />
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-500">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Bike className="w-10 h-10" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-2 cursor-pointer">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            
            {user.verified && (
              <div className="flex items-center gap-1 text-teal-400 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Runner</span>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Address
                </label>
                <Input
                  type="text"
                  value={user.address}
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  className="w-full bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  City
                </label>
                <Select value={user.city} onValueChange={(value) => setUser({ ...user, city: value })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select city" />
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
            </div>
          </div>

          {/* Runner Information */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-lg font-semibold text-white mb-4">Runner Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  About Me
                </label>
                <Textarea
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  placeholder="Tell us about your experience and services..."
                  className="w-full bg-zinc-800 border-zinc-700 text-white"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Skills (comma separated)
                </label>
                <Input
                  type="text"
                  value={user.skills.join(", ")}
                  onChange={handleSkillChange}
                  placeholder="e.g., Delivery, Shopping, Document Pickup"
                  className="w-full bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Hourly Rate ($)
                </label>
                <Input
                  type="number"
                  value={user.hourlyRate}
                  onChange={(e) => setUser({ ...user, hourlyRate: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Experience Level
                </label>
                <Select value={user.experience} onValueChange={(value) => setUser({ ...user, experience: value })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level} className="text-white">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Vehicle
                </label>
                <Select value={user.vehicle} onValueChange={(value) => setUser({ ...user, vehicle: value })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {vehicleOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-white">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
