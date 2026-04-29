import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Clock, CheckCircle, XCircle, Star } from "lucide-react";

// Mock data for user jobs
const mockJobs = [
  {
    id: "1",
    title: "Plumbing Repair",
    description: "Fix leaky faucet in kitchen",
    category: "Plumbing",
    budget: 10,
    location: "Harare, Zimbabwe",
    status: "open",
    createdAt: "2024-01-15T10:00:00Z",
    provider: null,
  },
  {
    id: "2",
    title: "House Cleaning",
    description: "Deep cleaning for 3-bedroom house",
    category: "Cleaning",
    budget: 20,
    location: "Bulawayo, Zimbabwe",
    status: "in_progress",
    createdAt: "2024-01-14T09:30:00Z",
    provider: {
      id: "2",
      name: "Jane Smith",
      rating: 4.9,
    },
  },
  {
    id: "3",
    title: "Electrical Installation",
    description: "Install new lighting fixtures",
    category: "Electrical",
    budget: 15,
    location: "Mutare, Zimbabwe",
    status: "completed",
    createdAt: "2024-01-10T14:00:00Z",
    provider: {
      id: "4",
      name: "Sarah Williams",
      rating: 4.6,
    },
  },
];

export function UserJobs() {
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      setTimeout(() => {
        setMyJobs(mockJobs);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
      setLoading(false);
    }
  };

  const handlePostJob = () => {
    navigate("/post-job");
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/post-job?edit=${jobId}`);
  };

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      const updatedJobs = myJobs.filter((job) => job.id !== jobId);
      setMyJobs(updatedJobs);
      toast.success("Job deleted successfully");
    }
  };

  const openJobs = myJobs.filter((job) => job.status === "open");
  const inProgressJobs = myJobs.filter(
    (job) => job.status === "in_progress" || job.status === "paid"
  );
  const completedJobs = myJobs.filter((job) => job.status === "completed");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">My Jobs</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Post Job Button */}
        <Button
          onClick={handlePostJob}
          className="w-full mb-6 bg-teal-500 hover:bg-teal-600 text-white h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post a New Job
        </Button>

        <Tabs defaultValue="open" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-zinc-900 mb-6">
            <TabsTrigger 
              value="open" 
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-zinc-400"
            >
              Open ({openJobs.length})
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-zinc-400"
            >
              In Progress ({inProgressJobs.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-zinc-400"
            >
              Completed ({completedJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="space-y-4">
            {openJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400 mb-4">No open jobs</p>
                <Button
                  onClick={handlePostJob}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Post Your First Job
                </Button>
              </div>
            ) : (
              openJobs.map((job) => (
                <div key={job.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-teal-500 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
                      {getStatusIcon(job.status)}
                      <span>{getStatusText(job.status)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                      {job.category}
                    </span>
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                      ${job.budget}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditJob(job.id)}
                        variant="ghost"
                        className="h-8 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteJob(job.id)}
                        variant="ghost"
                        className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {inProgressJobs.length === 0 ? (
              <p className="text-center text-zinc-400 py-12">No jobs in progress</p>
            ) : (
              inProgressJobs.map((job) => (
                <div key={job.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-teal-500 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded-full">
                      {getStatusIcon(job.status)}
                      <span>{getStatusText(job.status)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                      {job.category}
                    </span>
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                      ${job.budget}
                    </span>
                    {job.provider && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                        <span>Assigned to: {job.provider.name}</span>
                        {job.provider.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{job.provider.rating}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                      onClick={() => handleEditJob(job.id)}
                      variant="ghost"
                      className="h-8 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedJobs.length === 0 ? (
              <p className="text-center text-zinc-400 py-12">No completed jobs</p>
            ) : (
              completedJobs.map((job) => (
                <div key={job.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-teal-500 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                      {getStatusIcon(job.status)}
                      <span>{getStatusText(job.status)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                      {job.category}
                    </span>
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                      ${job.budget}
                    </span>
                    {job.provider && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                        <span>Completed by: {job.provider.name}</span>
                        {job.provider.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{job.provider.rating}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">
                      Completed on {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav role="user" />
    </div>
  );
}
