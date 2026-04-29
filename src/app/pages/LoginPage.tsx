import { useState } from "react";
import { useNavigate } from "react-router";

export function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = () => {
    // Store dummy user data in localStorage
    const dummyUser = {
      id: "1",
      name: "Test User",
      phone: phone || "+1 234 567 8900",
      role: role,
      verified: true,
      wallet: 1000,
      rating: 4.8
    };
    localStorage.setItem("user", JSON.stringify(dummyUser));
    
    // Redirect to appropriate dashboard based on role
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/basarangu.png" 
            alt="BasaRangu Logo" 
            className="w-32 h-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">BasaRangu</h1>
          <p className="text-zinc-400">Home Services & Job Recruitment Platform</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-white mb-4">Login / Register</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              >
                <option value="user">User (Service Seeker)</option>
                <option value="provider">Service Provider</option>
                <option value="runner">Errand Runner</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md"
              onClick={handleLogin}
            >
              Login (No OTP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
