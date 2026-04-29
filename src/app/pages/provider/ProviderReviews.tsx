import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft, Star, MessageSquare, Clock, CheckCircle, User, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
  response?: string;
  serviceType: string;
}

export function ProviderReviews() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);

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
          userName: "Alice Johnson",
          userAvatar: "",
          rating: 5,
          comment: "John was punctual, professional, and did a fantastic job with my plumbing repair. Will definitely hire again.",
          date: "2024-03-15T10:30:00Z",
          status: "completed",
          response: "Thank you for your kind words! I'm glad I could help with your plumbing needs.",
          serviceType: "Plumbing"
        },
        {
          id: "2",
          userName: "Bob Smith",
          userAvatar: "",
          rating: 4,
          comment: "Good cleaning service. Jane was thorough and friendly, though she arrived a bit late.",
          date: "2024-03-10T14:20:00Z",
          status: "completed",
          serviceType: "Cleaning"
        },
        {
          id: "3",
          userName: "Carol Williams",
          userAvatar: "",
          rating: 5,
          comment: "Mike did an amazing job with my electrical work. He was knowledgeable and fixed the issue quickly.",
          date: "2024-03-05T09:15:00Z",
          status: "completed",
          response: "I appreciate your feedback! It was my pleasure to assist you.",
          serviceType: "Electrical"
        },
        {
          id: "4",
          userName: "David Brown",
          userAvatar: "",
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

  const openResponseModal = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.response || "");
    setIsResponseModalOpen(true);
  };

  const closeResponseModal = () => {
    setIsResponseModalOpen(false);
    setSelectedReview(null);
    setResponseText("");
  };

  const submitResponse = async () => {
    if (!selectedReview || !responseText.trim()) {
      return;
    }

    setSubmittingResponse(true);
    try {
      // In a real app, this would call an API
      // For now, just update the local state
      const updatedReviews = reviews.map(review => 
        review.id === selectedReview.id 
          ? { ...review, response: responseText.trim() } 
          : review
      );
      setReviews(updatedReviews);
      
      // Save to localStorage for persistence
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.reviews = updatedReviews;
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast.success("Response submitted successfully");
      closeResponseModal();
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response");
    } finally {
      setSubmittingResponse(false);
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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-zinc-900 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-zinc-400">
              All Reviews
            </TabsTrigger>
            <TabsTrigger value="positive" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-zinc-400">
              Positive
            </TabsTrigger>
            <TabsTrigger value="negative" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-zinc-400">
              Negative
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No reviews yet</p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {review.userAvatar ? (
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-lg font-bold">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{review.userName}</h4>
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
                              <span className="text-sm font-medium text-white">You</span>
                            </div>
                            <p className="text-sm text-zinc-300">{review.response}</p>
                          </div>
                        )}
                        {!review.response && (
                          <Button 
                            className="w-full mt-2 border border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
                            onClick={() => openResponseModal(review)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Respond to Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="positive" className="space-y-4">
            {reviews.filter(r => r.rating >= 4).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No positive reviews yet</p>
              </div>
            ) : (
              reviews.filter(r => r.rating >= 4).map((review) => (
                <Card key={review.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {review.userAvatar ? (
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-lg font-bold">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{review.userName}</h4>
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
                              <span className="text-sm font-medium text-white">You</span>
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

          <TabsContent value="negative" className="space-y-4">
            {reviews.filter(r => r.rating <= 3).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No negative reviews yet</p>
              </div>
            ) : (
              reviews.filter(r => r.rating <= 3).map((review) => (
                <Card key={review.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {review.userAvatar ? (
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-lg font-bold">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{review.userName}</h4>
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
                              <span className="text-sm font-medium text-white">You</span>
                            </div>
                            <p className="text-sm text-zinc-300">{review.response}</p>
                          </div>
                        )}
                        {!review.response && (
                          <Button 
                            className="w-full mt-2 border border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
                            onClick={() => openResponseModal(review)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Respond to Review
                          </Button>
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

      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="font-medium text-white mb-2">{selectedReview?.userName}</h4>
              <p className="text-zinc-400 text-sm mb-4">{selectedReview?.comment}</p>
              <div className="flex gap-1 mb-4">
                {selectedReview && renderStars(selectedReview.rating)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Your Response
              </label>
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Enter your response..."
                className="w-full bg-zinc-800 border-zinc-700 text-white resize-none"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={closeResponseModal}
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={submitResponse}
              disabled={!responseText.trim() || submittingResponse}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              {submittingResponse ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav role="provider" />
    </div>
  );
}
