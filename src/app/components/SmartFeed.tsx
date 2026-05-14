import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Star, Zap, Heart, Bookmark, MessageSquare, Eye, DollarSign, MapPin, Clock } from "lucide-react";
import { api, getAuthToken } from "../services/api";
import { MatchScoreBadge } from "./MatchScore";
import { VerificationBadge } from "./Verification";
import { VerificationTier, VerificationStatus } from "../types/verification";

interface SmartFeedProps {
  role?: "user" | "provider" | "runner";
}

interface FeedItem {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  budget?: number;
  location?: string;
  category?: string;
  rating?: number;
  avg_rating?: number;
  application_count?: number;
  category_match?: number;
  [key: string]: any;
}

export function SmartFeed({ role = "user" }: SmartFeedProps) {
  const navigate = useNavigate();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingTrending, setIsUsingTrending] = useState(false);

  const fetchFeed = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Try to get personalized recommendations first
      try {
        const { recommendations } = await api.feed.getRecommendations(token, { limit: 15 });
        if (recommendations && recommendations.length > 0) {
          setItems(recommendations);
          setIsUsingTrending(false);
          return;
        }
      } catch (error) {
        console.log("No personalized recommendations yet, using trending");
      }

      // Fallback to trending if no recommendations available
      const { trending } = await api.feed.getTrending({ role, limit: 15 });
      setItems(trending || []);
      setIsUsingTrending(true);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
      // Fallback to mock data
      setItems(getMockFeedData(role));
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const trackInteraction = async (
    interactionType: string,
    targetType: string,
    targetId: string,
    metadata: Record<string, any> = {},
    weight: number = 1.0
  ) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await api.feed.trackInteraction(token, {
        interactionType,
        targetType,
        targetId,
        metadata,
        weight,
      });
    } catch (error) {
      console.error("Failed to track interaction:", error);
    }
  };

  const handleItemClick = (item: FeedItem) => {
    const targetType = role === "user" ? (item.name ? "provider" : "runner") : "job";
    trackInteraction("click", targetType, item.id, {
      category: item.category,
      location: item.location,
    }, 2.0);

    if (role === "user") {
      // Navigate to provider profile or detail page
      navigate(`/user/profile/${item.id}`);
    } else {
      // Navigate to job detail
      navigate(`/job/${item.id}`);
    }
  };

  const handleBookmark = (e: React.MouseEvent, item: FeedItem) => {
    e.stopPropagation();
    const targetType = role === "user" ? (item.name ? "provider" : "runner") : "job";
    trackInteraction("bookmark", targetType, item.id, {
      category: item.category,
    }, 3.0);
  };

  const handleView = (item: FeedItem) => {
    const targetType = role === "user" ? (item.name ? "provider" : "runner") : "job";
    trackInteraction("view", targetType, item.id, {
      category: item.category,
      duration: "short",
    }, 1.0);
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-zinc-800 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-zinc-700 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-zinc-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-zinc-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-zinc-500 mb-4">No recommendations yet</div>
        <div className="text-zinc-400 text-sm">Interact with the app to get personalized recommendations</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          {isUsingTrending ? "Trending Now" : "Recommended for You"}
        </h2>
        {isUsingTrending ? (
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <Zap className="w-4 h-4" />
            Trending
          </div>
        ) : (
          <div className="flex items-center gap-2 text-teal-400 text-sm">
            <Star className="w-4 h-4" />
            Personalized
          </div>
        )}
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-zinc-800 rounded-xl p-4 hover:bg-zinc-750 transition-colors cursor-pointer border border-zinc-700 hover:border-teal-500/50"
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => handleView(item)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {role === "user" ? (
                  // For users: show providers/runners
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                        {(item.name || "P").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{item.name || "Service Provider"}</h3>
                          {item.verification && (
                            <VerificationBadge status={item.verification} size="sm" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {item.avg_rating && (
                            <div className="flex items-center gap-1 text-amber-400">
                              <Star className="w-4 h-4 fill-current" />
                              <span>{item.avg_rating.toFixed(1)}</span>
                            </div>
                          )}
                          {item.application_count && (
                            <span className="text-zinc-400">
                              {item.application_count} applications
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {item.category && (
                      <div className="inline-block bg-zinc-700 px-2 py-1 rounded text-xs text-zinc-300 mb-2">
                        {item.category}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-zinc-400 text-sm line-clamp-2">{item.description}</p>
                    )}
                  </div>
                ) : (
                  // For providers: show jobs
                  <div>
                    <h3 className="text-white font-semibold mb-2">{item.title || "Job Opportunity"}</h3>
                    <div className="flex items-center gap-4 text-sm mb-2">
                      {item.budget && (
                        <div className="flex items-center gap-1 text-teal-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${item.budget}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-1 text-zinc-400">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                    {item.category && (
                      <div className="inline-block bg-zinc-700 px-2 py-1 rounded text-xs text-zinc-300 mb-2">
                        {item.category}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-zinc-400 text-sm line-clamp-2">{item.description}</p>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => handleBookmark(e, item)}
                className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
              >
                <Bookmark className="w-5 h-5 text-zinc-400 hover:text-amber-400" />
              </button>
            </div>

            {/* Match score indicator */}
            <div className="mb-3">
              <MatchScoreBadge score={item.matchScore} />
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (role === "user") {
                    navigate(`/message/${item.id}`);
                  } else {
                    navigate(`/job/${item.id}`);
                  }
                }}
                className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {role === "user" ? "Message" : "Apply"}
              </button>
              
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mock data for fallback
function getMockFeedData(role: string): FeedItem[] {
  if (role === "user") {
    return [
      {
        id: "1",
        name: "John Smith",
        category: "Plumbing",
        description: "Experienced plumber with 10+ years of service",
        avg_rating: 4.8,
        application_count: 47,
        category_match: 8.5,
        matchScore: 92,
      },
      {
        id: "2",
        name: "Maria Garcia",
        category: "Cleaning",
        description: "Professional house cleaning services",
        avg_rating: 4.9,
        application_count: 32,
        category_match: 7.2,
        matchScore: 85,
      },
    ];
  } else {
    return [
      {
        id: "1",
        title: "Kitchen Sink Repair",
        category: "Plumbing",
        budget: 75,
        location: "Downtown",
        description: "Leaky faucet needs repair, emergency service required",
        application_count: 3,
        matchScore: 78,
      },
      {
        id: "2",
        title: "Deep House Cleaning",
        category: "Cleaning",
        budget: 120,
        location: "Westside",
        description: "3 bedroom house needs thorough cleaning",
        application_count: 8,
        matchScore: 88,
      },
    ];
  }
}
