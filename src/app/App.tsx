import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { usePlatform } from "./hooks/usePlatform";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isWeb } = usePlatform();

  useEffect(() => {
    // Special case: If accessing /admin directly, allow on web only
    if (location.pathname.startsWith("/admin")) {
      if (!isWeb) {
        navigate("/login");
      } else {
        return; // Let admin routes handle themselves
      }
    }

    // Normal routing logic
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      navigate(`/${parsedUser.role || "user"}`);
    } else {
      navigate("/login");
    }
  }, [navigate, location.pathname, isWeb]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
}
