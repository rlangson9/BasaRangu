import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Camera, CheckCircle2, AlertCircle } from "lucide-react";

export function UserVerification() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    idNumber: "",
    verified: false,
  });
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "rejected" | "not_started">(
    "not_started"
  );

  useEffect(() => {
    // Load existing user data from localStorage
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (existingUser) {
      setUser({
        name: existingUser.name || "",
        idNumber: existingUser.idNumber || "",
        verified: existingUser.verified || false,
      });
      setVerificationStatus(existingUser.verified ? "verified" : "not_started");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would send verification data to an API
      // For now, just simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        ...user,
        verified: true,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setVerificationStatus("verified");
      toast.success("Verification completed successfully");
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error("Failed to verify account");
    } finally {
      setLoading(false);
    }
  };

  const handleIDUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the image
    // For now, just show a toast
    toast.success("ID uploaded successfully");
  };

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
            <h1 className="text-2xl font-bold text-white">Verification</h1>
            <div className="flex-1" />
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Verification Status Card */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Verification Status</h2>
          <div className="flex items-center gap-3">
            {verificationStatus === "verified" ? (
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            ) : verificationStatus === "pending" ? (
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : verificationStatus === "rejected" ? (
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <Camera className="w-5 h-5 text-zinc-400" />
              </div>
            )}
            <div>
              <h3 className="text-white font-medium">
                {verificationStatus === "verified" && "Verified"}
                {verificationStatus === "pending" && "Verification Pending"}
                {verificationStatus === "rejected" && "Verification Rejected"}
                {verificationStatus === "not_started" && "Not Verified"}
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                {verificationStatus === "verified" && "Your account has been verified."}
                {verificationStatus === "pending" && "We're reviewing your verification details."}
                {verificationStatus === "rejected" && "Please resubmit your verification details."}
                {verificationStatus === "not_started" && "Verify your account to gain trust and access more features."}
              </p>
            </div>
          </div>
        </div>

        {verificationStatus !== "verified" && (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    National ID Number
                  </label>
                  <Input
                    type="text"
                    value={user.idNumber}
                    onChange={(e) => setUser({ ...user, idNumber: e.target.value })}
                    className="w-full bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            </div>

            {/* ID Upload */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-4">ID Verification</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Upload National ID
                  </label>
                  <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
                    <Camera className="w-12 h-12 text-zinc-500 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400 mb-4">
                      Upload a clear photo of your national ID
                    </p>
                    <label className="inline-block">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleIDUpload}
                      />
                      <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                        Select File
                      </Button>
                    </label>
                  </div>
                </div>
                
                <div className="text-sm text-zinc-400">
                  <p>By submitting your ID, you agree to our <a href="/terms" className="text-teal-400 hover:underline">Terms and Conditions</a>.</p>
                  <p className="mt-2">Your ID will be securely stored and only used for verification purposes.</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Submit Verification"}
            </Button>
          </form>
        )}

        {verificationStatus === "verified" && (
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Verification Complete</h2>
                <p className="text-sm text-zinc-400 mt-1">Your account has been successfully verified.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-white">Verified Status</h3>
                  <p className="text-xs text-zinc-400 mt-1">Your account is now verified</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                  Verified
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-white">Verification Date</h3>
                  <p className="text-xs text-zinc-400 mt-1">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <p className="text-sm text-zinc-400">
                As a verified user, you'll enjoy increased trust from service providers and access to premium features.
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNav role="user" />
    </div>
  );
}
