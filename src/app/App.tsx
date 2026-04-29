import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      // User is logged in, redirect to user dashboard
      const parsedUser = JSON.parse(user);
      navigate(`/${parsedUser.role || "user"}`);
    } else {
      // User is not logged in, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
}
