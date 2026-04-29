import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api, setAuthToken, setCurrentUser } from "../services/api";
import { usePlatform } from "../hooks/usePlatform";

export function LoginPage() {
  const navigate = useNavigate();
  const { isWeb } = usePlatform();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appSettings, setAppSettings] = useState({
    appName: "BasaRangu",
    appTagline: "Home Services & Job Recruitment Platform",
    logoUrl: "/basarangu.png"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.app.getSettings();
        setAppSettings(response.settings);
      } catch (err) {
        console.error("Failed to fetch app settings", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.auth.sendOtp(phone);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.auth.verifyOtp(phone, otp);
      setAuthToken(response.token);
      setCurrentUser(response.user);
      navigate(`/${response.user.activeRole || "user"}`);
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: "demo-user-1",
      name: "Demo User",
      phone: "+1234567890",
      role: "user",
      verified: true,
      wallet: 1000,
      rating: 4.8
    };
    setCurrentUser(demoUser);
    setAuthToken("demo-token");
    navigate("/user");
  };

  const handleProviderLogin = () => {
    const demoProvider = {
      id: "demo-provider-1",
      name: "Demo Provider",
      phone: "+1987654321",
      role: "provider",
      activeRole: "provider",
      verified: true,
      wallet: 500,
      rating: 4.5
    };
    setCurrentUser(demoProvider);
    setAuthToken("demo-provider-token");
    navigate("/provider");
  };

  const handleAdminLogin = () => {
    const adminUser = {
      id: "admin-1",
      name: "Admin",
      phone: "+9999999999",
      role: "admin",
      activeRole: "admin",
      verified: true,
      wallet: 0,
      rating: 5.0
    };
    setCurrentUser(adminUser);
    setAuthToken("admin-token");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={appSettings.logoUrl}
            alt={`${appSettings.appName} Logo`}
            className="w-32 h-auto mx-auto mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h1 className="text-3xl font-bold text-white mb-2">{appSettings.appName}</h1>
          <p className="text-zinc-400">{appSettings.appTagline}</p>
        </div>

        {/* Quick Test Buttons (Top) */}
        {isWeb && (
          <div className="mb-4 space-y-2">
            <div className="text-white text-sm mb-2 text-center">Quick Testing:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleDemoLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded-md text-sm"
              >
                User
              </button>
              <button
                onClick={handleProviderLogin}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-2 rounded-md text-sm"
              >
                Provider
              </button>
              <button
                onClick={handleAdminLogin}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-2 rounded-md text-sm"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-white mb-4">
            {step === "phone" ? "Login / Register" : "Verify OTP"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {step === "phone" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+263 771 234 567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
                  />
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-zinc-700 text-white py-2 px-4 rounded-md"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-zinc-900 text-zinc-400">or</span>
                  </div>
                </div>

                <button
                  onClick={handleDemoLogin}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md border border-zinc-700"
                >
                  Continue with Demo
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Enter OTP sent to {phone}
                  </label>
                  <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-zinc-700 text-white py-2 px-4 rounded-md"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <button
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                  className="w-full text-zinc-400 hover:text-white text-sm py-2"
                >
                  Change phone number
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-4">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
