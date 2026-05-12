import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { setAuthToken, setCurrentUser } from "@/services/api";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.NODE_ENV !== "production";

  const handleSendOtp = async () => {
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }
    setIsSending(true);
    try {
      const response = await api.auth.sendOtp({ phone });
      if (response.success) {
        setShowOtpInput(true);
        setError("");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setIsVerifying(true);
    try {
      const response = await api.auth.verifyOtp({ phone, otp });
      if (response.success) {
        setAuthToken(response.token);
        setCurrentUser(response.user);
        const role = response.user.active_role || "user";
        navigate(`/${role}`);
      }
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    const demoUsers: Record<string, { phone: string; name: string; roles: string[] }> = {
      user: { phone: "+1234567890", name: "Demo User", roles: ["user"] },
      provider: { phone: "+1234567891", name: "Demo Provider", roles: ["user", "provider"] },
      admin: { phone: "+1234567892", name: "Demo Admin", roles: ["user", "admin"] },
    };
    
    const demo = demoUsers[role];
    if (demo) {
      try {
        await api.auth.sendOtp({ phone: demo.phone });
        const verifyResponse = await api.auth.verifyOtp({ phone: demo.phone, otp: "123456" });
        if (verifyResponse.success) {
          setAuthToken(verifyResponse.token);
          setCurrentUser(verifyResponse.user);
          navigate(`/${role}`);
        }
      } catch (err) {
        setError("Demo login failed");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/user");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">B</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">BasaRangu</h1>
          <p className="text-zinc-400">Home Services & Job Recruitment Platform</p>
        </div>

        {isDevelopment && (
          <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <p className="text-sm text-zinc-400 mb-3 text-center">Quick Demo Login (Development Only)</p>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleDemoLogin("user")}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                User
              </Button>
              <Button 
                onClick={() => handleDemoLogin("provider")}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Provider
              </Button>
              <Button 
                onClick={() => handleDemoLogin("admin")}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Admin
              </Button>
            </div>
          </div>
        )}

        <div className="bg-zinc-800/50 backdrop-blur rounded-2xl p-6 border border-zinc-700">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+263 771 234 567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500"
                disabled={showOtpInput}
              />
            </div>

            {showOtpInput && (
              <div>
                <Label htmlFor="otp" className="text-zinc-300">OTP Code</Label>
                <div className="relative mt-1">
                  <Input
                    id="otp"
                    type={showOtp ? "text" : "password"}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="mt-1 bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {!showOtpInput ? (
              <Button
                onClick={handleSendOtp}
                disabled={isSending || !phone}
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
              >
                {isSending ? "Sending..." : "Send OTP"}
              </Button>
            ) : (
              <Button
                onClick={handleVerifyOtp}
                disabled={isVerifying || !otp}
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
              >
                {isVerifying ? "Verifying..." : "Verify & Login"}
              </Button>
            )}

            {showOtpInput && (
              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp("");
                }}
                className="w-full mt-2 text-zinc-400 hover:text-white text-sm"
              >
                Resend OTP
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-zinc-500 text-sm">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
