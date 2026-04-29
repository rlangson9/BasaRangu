import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlatform } from "../hooks/usePlatform";

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isWeb } = usePlatform();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isWeb) {
      navigate("/login");
    }
  }, [isWeb, navigate]);

  if (!isWeb) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white text-xl font-bold mb-2">Admin Panel</div>
          <div className="text-zinc-400 mb-4">Admin features are only available on desktop/web</div>
          <button
            onClick={() => navigate("/login")}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
