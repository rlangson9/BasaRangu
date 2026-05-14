import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { ProviderPortfolio } from "../../components/ProviderPortfolio";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";

export function ProviderPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check if current user is the provider (mock logic)
    const checkOwner = () => {
      // In real app, check authentication
      setIsOwner(false);
    };
    checkOwner();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-zinc-400 hover:text-teal-400"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-white">Portfolio</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <ProviderPortfolio isOwner={isOwner} />
      </div>

      <BottomNav role="user" />
    </div>
  );
}
