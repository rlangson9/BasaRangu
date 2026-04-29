import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Users,
  MessageSquare,
  CheckCircle,
  CreditCard,
  AlertTriangle,
  FileUser,
} from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { toast } from "sonner";
import { PaymentModal } from "../components/PaymentModal";
import { DisputeModal } from "../components/DisputeModal";

const mockJobs = [
  {
    id: "1",
    title: "Plumbing Repair",
    description: "Fix leaky faucet and pipes in kitchen",
    category: "Plumbing",
    budget: 15,
    location: "Harare, Zimbabwe",
    distance: 2.5,
    postedBy: "John Smith",
    userName: "John Smith",
    experience: "1-3 years",
    urgency: "Urgent",
    createdAt: "2024-01-15T10:00:00Z",
    status: "open",
    applicants: [],
    userId: "user1",
  },
  {
    id: "2",
    title: "House Cleaning",
    description: "Deep cleaning for 3-bedroom house",
    category: "Cleaning",
    budget: 2000,
    location: "Harare, Zimbabwe",
    distance: 3.2,
    postedBy: "Jane Doe",
    userName: "Jane Doe",
    experience: "Any",
    urgency: "Normal",
    createdAt: "2024-01-14T09:30:00Z",
    status: "open",
    applicants: [],
    userId: "user2",
  },
  {
    id: "3",
    title: "Electrical Installation",
    description: "Install new lighting fixtures and switches",
    category: "Electrical",
    budget: 25,
    location: "Bulawayo, Zimbabwe",
    distance: 1.8,
    postedBy: "Mike Johnson",
    userName: "Mike Johnson",
    experience: "3-5 years",
    urgency: "Urgent",
    createdAt: "2024-01-13T14:00:00Z",
    status: "open",
    applicants: [],
    userId: "user3",
  },
  {
    id: "4",
    title: "Garden Maintenance",
    description: "Trim hedges, mow lawn, and plant flowers",
    category: "Gardening",
    budget: 12,
    location: "Mutare, Zimbabwe",
    distance: 4.1,
    postedBy: "Sarah Williams",
    userName: "Sarah Williams",
    experience: "Any",
    urgency: "Normal",
    createdAt: "2024-01-12T11:00:00Z",
    status: "open",
    applicants: [],
    userId: "user4",
  },
  {
    id: "5",
    title: "Furniture Assembly",
    description: "Assemble new bedroom furniture",
    category: "Carpentry",
    budget: 8,
    location: "Gweru, Zimbabwe",
    distance: 2.9,
    postedBy: "David Brown",
    userName: "David Brown",
    experience: "1-3 years",
    urgency: "Normal",
    createdAt: "2024-01-11T16:30:00Z",
    status: "open",
    applicants: [],
    userId: "user5",
  },
  {
    id: "6",
    title: "Grocery Shopping",
    description: "Buy groceries from Pick n Pay and deliver to my home",
    category: "Shopping",
    budget: 5,
    location: "Harare, Zimbabwe",
    distance: 2.5,
    postedBy: "John Smith",
    userName: "John Smith",
    urgency: "Urgent",
    createdAt: "2024-01-15T10:00:00Z",
    status: "open",
    applicants: [],
    userId: "user1",
    pickupLocation: "Pick n Pay, Borrowdale",
    dropoffLocation: "123 Samora Machel Ave",
  },
  {
    id: "7",
    title: "Document Delivery",
    description: "Deliver important documents to Harare CBD",
    category: "Document",
    budget: 3,
    location: "Harare, Zimbabwe",
    distance: 3.2,
    postedBy: "Jane Doe",
    userName: "Jane Doe",
    urgency: "Normal",
    createdAt: "2024-01-14T09:30:00Z",
    status: "open",
    applicants: [],
    userId: "user2",
    pickupLocation: "Westgate Mall",
    dropoffLocation: "456 First Street",
  },
  {
    id: "8",
    title: "Package Delivery",
    description: "Deliver a small package to Bulawayo",
    category: "Delivery",
    budget: 12,
    location: "Bulawayo, Zimbabwe",
    distance: 1.8,
    postedBy: "Mike Johnson",
    userName: "Mike Johnson",
    urgency: "Urgent",
    createdAt: "2024-01-13T14:00:00Z",
    status: "open",
    applicants: [],
    userId: "user3",
    pickupLocation: "Bulawayo Central Post Office",
    dropoffLocation: "789 Main Street",
  },
  {
    id: "9",
    title: "Pharmacy Run",
    description: "Pick up medication from pharmacy and deliver",
    category: "Pickup",
    budget: 4,
    location: "Mutare, Zimbabwe",
    distance: 4.1,
    postedBy: "Sarah Williams",
    userName: "Sarah Williams",
    urgency: "Urgent",
    createdAt: "2024-01-12T11:00:00Z",
    status: "open",
    applicants: [],
    userId: "user4",
    pickupLocation: "Mutare Pharmacy",
    dropoffLocation: "321 Herbert Chitepo St",
  },
  {
    id: "10",
    title: "Restaurant Delivery",
    description: "Pick up food from Mugg & Bean and deliver",
    category: "Delivery",
    budget: 3.5,
    location: "Gweru, Zimbabwe",
    distance: 2.9,
    postedBy: "David Brown",
    userName: "David Brown",
    urgency: "Normal",
    createdAt: "2024-01-11T16:30:00Z",
    status: "open",
    applicants: [],
    userId: "user5",
    pickupLocation: "Mugg & Bean, Gweru",
    dropoffLocation: "654 Robert Mugabe Way",
  },
];

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.job) {
        setJob(data.job);
      } else {
        throw new Error("Job not found in API");
      }
    } catch (error) {
      console.log("Using mock data instead");
      const mockJob = mockJobs.find((j) => j.id === id);
      if (mockJob) {
        setJob(mockJob);
      } else {
        toast.error("Failed to load job details");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async () => {
    if (!quote || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/jobs/${id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ quote: parseInt(quote), message }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Application submitted successfully!");
        fetchJob();
        setQuote("");
        setMessage("");
      } else {
        throw new Error("API application failed");
      }
    } catch (error) {
      console.log("Using mock application instead");
      const mockJob = mockJobs.find((j) => j.id === id);
      if (mockJob) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        mockJob.applicants.push({
          id: Date.now().toString(),
          userId: user.id || "mock-user",
          userName: user.name || "Applicant",
          quote: parseInt(quote),
          message,
        });
        setJob({ ...mockJob });
        toast.success("Application submitted successfully!");
        setQuote("");
        setMessage("");
      } else {
        toast.error("Failed to submit application");
      }
    } finally {
      setApplying(false);
    }
  };

  const completeJob = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/jobs/${id}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Job marked as completed!");
        fetchJob();
      }
    } catch (error) {
      console.error("Error completing job:", error);
      toast.error("Failed to complete job");
    }
  };

  const requestLocationPermission = () => {
    // Check if job is paid or in progress (payment completed)
    if (job.status === "paid" || job.status === "in_progress") {
      // In a real app, this would request actual location permission
      // For now, we'll simulate it
      setLocationPermission(true);
      setShowLocationPrompt(false);
      toast.success("Location access granted!");
    } else {
      toast.error("Please complete payment before requesting location access");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Job not found</div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = job.userId === user.id;
  const hasApplied = job.applicants?.some((app: any) => app.userId === user.id);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-teal-400"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 pb-24">
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-teal-400">${job.budget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              {job.userAvatar ? (
                <img
                  src={job.userAvatar}
                  alt={job.userName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-xl font-bold">
                  {job.userName.charAt(0).toUpperCase()}
                </div>
              )}
              {job.companyVerified && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 bg-teal-500/20 text-teal-400 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  Verified Company
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">Description</h3>
            <p className="text-zinc-400">{job.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-xs text-zinc-500 mb-1">Category</div>
              <div className="text-sm font-semibold text-white">{job.category}</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-xs text-zinc-500 mb-1">Status</div>
              <div className="text-sm font-semibold text-teal-400">{job.status}</div>
            </div>
          </div>

          {job.pickupLocation && job.dropoffLocation && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Pickup
                </div>
                {locationPermission ? (
                  <div className="text-sm font-semibold text-white">{job.pickupLocation}</div>
                ) : (
                  <div className="text-sm text-zinc-400">
                    <span className="opacity-60">Exact location hidden</span>
                    {job.status === "paid" || job.status === "in_progress" ? (
                      <button 
                        onClick={() => setShowLocationPrompt(true)}
                        className="text-teal-400 ml-2 text-xs hover:underline"
                      >
                        Request access
                      </button>
                    ) : (
                      <span className="text-yellow-400 ml-2 text-xs">
                        Unlocks after payment
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Dropoff
                </div>
                {locationPermission ? (
                  <div className="text-sm font-semibold text-white">{job.dropoffLocation}</div>
                ) : (
                  <div className="text-sm text-zinc-400">
                    <span className="opacity-60">Exact location hidden</span>
                    {job.status === "paid" || job.status === "in_progress" ? (
                      <button 
                        onClick={() => setShowLocationPrompt(true)}
                        className="text-teal-400 ml-2 text-xs hover:underline"
                      >
                        Request access
                      </button>
                    ) : (
                      <span className="text-yellow-400 ml-2 text-xs">
                        Unlocks after payment
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {job.applicants && job.applicants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">
                Applicants ({job.applicants.length})
              </h3>
              <div className="space-y-2">
                {job.applicants.map((applicant: any) => (
                  <div
                    key={applicant.id}
                    className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-semibold">
                        {applicant.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{applicant.userName}</div>
                        <div className="text-xs text-zinc-500">Quote: ${applicant.quote}</div>
                      </div>
                    </div>
                    {isOwner && job.status === "open" && (
                      <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                        Accept
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isOwner && job.status === "open" && !hasApplied && (
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mt-4">
            <h3 className="text-lg font-semibold text-white mb-4">Apply for this job</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Your Quote ($)
                </label>
                <Input
                  type="number"
                  placeholder="Enter your price"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Introduce yourself and explain why you're a good fit..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white min-h-24"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    const role = user.role || "user";
                    navigate(`/${role}/resume`);
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                >
                  <FileUser className="w-4 h-4 mr-2" />
                  Send Resume
                </Button>
                <Button
                  onClick={applyToJob}
                  disabled={applying}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {job.status === "paid" && (
          <div className="mt-4">
            <Button
              onClick={completeJob}
              className="w-full bg-green-500 hover:bg-green-600 text-white h-12"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Mark as Completed
            </Button>
          </div>
        )}

        {(job.status === "paid" || job.status === "in_progress") && (
          <div className="mt-4">
            <Button
              onClick={() => navigate(`/chat/${job.id}`)}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Open Chat
            </Button>
          </div>
        )}

        {job.status === "completed" && (
          <div className="mt-4">
            <Button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pay Freelancer
            </Button>
          </div>
        )}

        {job.status === "completed" && (
          <div className="mt-4">
            <Button
              onClick={() => setShowDisputeModal(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white h-12"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Dispute
            </Button>
          </div>
        )}

        <PaymentModal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          jobId={job.id}
          amount={job.budget}
          onSuccess={fetchJob}
        />

        <DisputeModal
          open={showDisputeModal}
          onClose={() => setShowDisputeModal(false)}
          jobId={job.id}
          onSuccess={fetchJob}
        />

        {showLocationPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-800">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Location Access</h3>
                <p className="text-zinc-400">
                  To access the exact pickup and dropoff locations, we need your location permission.
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={requestLocationPermission}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Grant Location Access
                </Button>
                <Button 
                  onClick={() => setShowLocationPrompt(false)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}