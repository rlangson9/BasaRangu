import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Camera, Building } from "lucide-react";

export function RecruiterCompanyProfile() {
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    companyName: "",
    phone: "",
    email: "",
    address: "",
    city: "Harare, Zimbabwe",
    bio: "",
    logo: "",
    industry: "",
    website: "",
    size: "",
    verified: false,
    verificationDocument: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing company data from localStorage
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (existingUser) {
      setCompany({
        companyName: existingUser.companyName || "",
        phone: existingUser.phone || "",
        email: existingUser.email || "",
        address: existingUser.address || "",
        city: existingUser.city || "Harare, Zimbabwe",
        bio: existingUser.bio || "",
        logo: existingUser.logo || "",
        industry: existingUser.industry || "",
        website: existingUser.website || "",
        size: existingUser.size || "",
        verified: existingUser.verified || false,
        verificationDocument: existingUser.verificationDocument || "",
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
        ...company,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Company profile updated successfully");
      navigate("/recruiter/me");
    } catch (error) {
      console.error("Error updating company profile:", error);
      toast.error("Failed to update company profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the image
    // For now, use a placeholder
    setCompany({
      ...company,
      logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20company%20logo&image_size=square",
    });
  };

  const handleVerificationDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the document
    // For now, use a placeholder
    setCompany({
      ...company,
      verificationDocument: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=company%20registration%20document&image_size=landscape_4_3",
    });
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

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Agriculture",
    "Hospitality",
    "Other",
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501+ employees",
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-900 hover:text-teal-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-zinc-900">Edit Company Profile</h1>
            <div className="flex-1" />
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-500">
                {company.logo ? (
                  <img 
                    src={company.logo} 
                    alt="Company Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <Building className="w-10 h-10" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-2 cursor-pointer">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleLogoChange}
                />
              </label>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-xl p-6 border border-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Company Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Company Name
                </label>
                <Input
                  type="text"
                  value={company.companyName}
                  onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                  className="w-full bg-white border-zinc-300 text-zinc-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={company.phone}
                  onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  className="w-full bg-white border-zinc-300 text-zinc-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={company.email}
                  onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  className="w-full bg-white border-zinc-300 text-zinc-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Website
                </label>
                <Input
                  type="url"
                  value={company.website}
                  onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  className="w-full bg-white border-zinc-300 text-zinc-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Address
                </label>
                <Input
                  type="text"
                  value={company.address}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  className="w-full bg-white border-zinc-300 text-zinc-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  City
                </label>
                <Select value={company.city} onValueChange={(value) => setCompany({ ...company, city: value })}>
                  <SelectTrigger className="bg-white border-zinc-300 text-zinc-900">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-200">
                    {zimbabweCities.map((city) => (
                      <SelectItem key={city} value={city} className="text-zinc-900">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Industry
                </label>
                <Select value={company.industry} onValueChange={(value) => setCompany({ ...company, industry: value })}>
                  <SelectTrigger className="bg-white border-zinc-300 text-zinc-900">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-200">
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry} className="text-zinc-900">
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Company Size
                </label>
                <Select value={company.size} onValueChange={(value) => setCompany({ ...company, size: value })}>
                  <SelectTrigger className="bg-white border-zinc-300 text-zinc-900">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-200">
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size} className="text-zinc-900">
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  About Company
                </label>
                <Textarea
                  value={company.bio}
                  onChange={(e) => setCompany({ ...company, bio: e.target.value })}
                  placeholder="Tell us about your company..."
                  className="w-full bg-white border-zinc-300 text-zinc-900"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Company Verification */}
          <div className="bg-white rounded-xl p-6 border border-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Company Verification</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Verification Status
                </label>
                <div className="flex items-center gap-2">
                  {company.verified ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      Pending Verification
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Upload Company Registration Proof
                </label>
                <div className="border-2 border-dashed border-zinc-300 rounded-lg p-4 text-center">
                  {company.verificationDocument ? (
                    <div className="space-y-2">
                      <img 
                        src={company.verificationDocument} 
                        alt="Verification Document" 
                        className="max-h-40 mx-auto rounded"
                      />
                      <p className="text-sm text-zinc-600">Document uploaded</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        className="hidden" 
                        onChange={handleVerificationDocumentChange}
                      />
                      <div className="space-y-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-upload mx-auto text-zinc-400">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <p className="text-sm text-zinc-600">Click to upload company registration document</p>
                        <p className="text-xs text-zinc-500">PDF, JPG, or PNG files only</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-zinc-600">
                <p>Upload a copy of your company registration document to get verified. Verified companies get a badge next to their name and higher visibility in job listings.</p>
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
            {loading ? "Saving..." : "Save Company Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
