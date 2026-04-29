import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { ArrowLeft, Star, MessageSquare, Clock, CheckCircle, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

interface Review {
  id: string;
  serviceProviderName: string;
  serviceProviderAvatar: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
  response?: string;
  serviceType: string;
}

export function UserReviews() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);

      // Mock review data
      const mockReviews: Review[] = [
        {
          id: "1",
          serviceProviderName: "John Doe",
          serviceProviderAvatar: "",
          rating: 5,
          comment: "Excellent service! John was punctual, professional, and did a fantastic job with my plumbing repair. Will definitely hire again.",
          date: "2024-03-15T10:30:00Z",
          status: "completed",
          response: "Thank you for your kind words! I'm glad I could help with your plumbing needs.",
          serviceType: "Plumbing"
        },
        {
          id: "2",
          serviceProviderName: "Jane Smith",
          serviceProviderAvatar: "",
          rating: 4,
          comment: "Good cleaning service. Jane was thorough and friendly, though she arrived a bit late.",
          date: "2024-03-10T14:20:00Z",
          status: "completed",
          serviceType: "Cleaning"
        },
        {
          id: "3",
          serviceProviderName: "Mike Johnson",
          serviceProviderAvatar: "",
          rating: 5,
          comment: "Mike did an amazing job with my electrical work. He was knowledgeable and fixed the issue quickly.",
          date: "2024-03-05T09:15:00Z",
          status: "completed",
          response: "I appreciate your feedback! It was my pleasure to assist you.",
          serviceType: "Electrical"
        },
        {
          id: "4",
          serviceProviderName: "Sarah Lee",
          serviceProviderAvatar: "",
          rating: 3,
          comment: "The gardening service was okay, but some areas were missed. Overall, it was average.",
          date: "2024-02-28T16:45:00Z",
          status: "completed",
          serviceType: "Gardening"
        }
      ];

      setReviews(mockReviews);
      setLoading(false);
    } catch (error) {
      console.error("Error loading reviews data:", error);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-600"}`}
      />
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-teal-400"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Reviews & Ratings</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Overall Rating */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Your Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">4.8</div>
                <div className="flex justify-center gap-1 mb-4">
                  {renderStars(5)}
                </div>
                <p className="text-zinc-400">Based on 12 reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Tabs */}
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-zinc-900 mb-6">
            <TabsTrigger value="received" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-zinc-400">
              Received Reviews
            </TabsTrigger>
            <TabsTrigger value="given" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-zinc-400">
              Given Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No reviews received yet</p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {review.serviceProviderAvatar ? (
                          <img
                            src={review.serviceProviderAvatar}
                            alt={review.serviceProviderName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-lg font-bold">
                            {review.serviceProviderName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{review.serviceProviderName}</h4>
                          <Badge className="bg-zinc-800 text-zinc-400">{review.serviceType}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-zinc-400">{formatDate(review.date)}</span>
                        </div>
                        <p className="text-zinc-300 mb-4">{review.comment}</p>
                        {review.response && (
                          <div className="bg-zinc-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-teal-400" />
                              <span className="text-sm font-medium text-white">{review.serviceProviderName}</span>
                            </div>
                            <p className="text-sm text-zinc-300">{review.response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="given" className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No reviews given yet</p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {review.serviceProviderAvatar ? (
                          <img
                            src={review.serviceProviderAvatar}
                            alt={review.serviceProviderName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-lg font-bold">
                            {review.serviceProviderName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{review.serviceProviderName}</h4>
                          <Badge className="bg-zinc-800 text-zinc-400">{review.serviceType}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-zinc-400">{formatDate(review.date)}</span>
                        </div>
                        <p className="text-zinc-300 mb-4">{review.comment}</p>
                        {review.response && (
                          <div className="bg-zinc-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-teal-400" />
                              <span className="text-sm font-medium text-white">{review.serviceProviderName}</span>
                            </div>
                            <p className="text-sm text-zinc-300">{review.response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav role="user" />
    </div>
  );
}
