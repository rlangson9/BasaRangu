import { useState, useEffect } from "react";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { JobCard } from "../../components/JobCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { projectId } from "../../../../utils/supabase/info";

const mockMyJobs = [
  {
    id: "1",
    title: "Plumbing Repair",
    description: "Fix leaky faucet and pipes in kitchen",
    category: "Plumbing",
    budget: 1500,
    location: "Harare, Zimbabwe",
    distance: 2.5,
    postedBy: "John Smith",
    userName: "John Smith",
    experience: "1-3 years",
    urgency: "Urgent",
    createdAt: "2024-01-15T10:00:00Z",
    status: "open",
    applicants: [
      {
        id: "app1",
        userId: "current-user",
        userName: "Test User",
        quote: 1400,
        message: "I can fix this today!",
        status: "pending",
      },
    ],
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
    status: "in_progress",
    applicants: [
      {
        id: "app2",
        userId: "current-user",
        userName: "Test User",
        quote: 1900,
        message: "Available tomorrow morning",
        status: "accepted",
      },
    ],
    userId: "user2",
  },
  {
    id: "3",
    title: "Electrical Installation",
    description: "Install new lighting fixtures and switches",
    category: "Electrical",
    budget: 2500,
    location: "Bulawayo, Zimbabwe",
    distance: 1.8,
    postedBy: "Mike Johnson",
    userName: "Mike Johnson",
    experience: "3-5 years",
    urgency: "Urgent",
    createdAt: "2024-01-10T14:00:00Z",
    status: "completed",
    applicants: [
      {
        id: "app3",
        userId: "current-user",
        userName: "Test User",
        quote: 2400,
        message: "I have 5 years experience",
        status: "accepted",
      },
    ],
    userId: "user3",
  },
];

export function ProviderJobs() {
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/jobs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      let appliedJobs = (data.jobs || []).filter((job: any) =>
        job.applicants?.some((app: any) => app.userId === user.id)
      );
      
      if (appliedJobs.length === 0) {
        appliedJobs = mockMyJobs;
      }
      
      setMyJobs(appliedJobs);
    } catch (error) {
      console.log("Using mock data instead");
      setMyJobs(mockMyJobs);
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const pendingJobs = myJobs.filter(
    (job) =>
      job.applicants?.find((a: any) => a.userId === "current-user" || a.userId === user.id)
        ?.status === "pending"
  );
  const activeJobs = myJobs.filter(
    (job) => job.status === "in_progress" || job.status === "paid"
  );
  const completedJobs = myJobs.filter((job) => job.status === "completed");

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">My Work</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-zinc-900 mb-6">
            <TabsTrigger value="pending" className="data-[state=active]:bg-teal-500">
              Pending ({pendingJobs.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-teal-500">
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-teal-500">
              Completed ({completedJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingJobs.length === 0 ? (
              <p className="text-center text-zinc-400 py-12">No pending applications</p>
            ) : (
              pendingJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeJobs.length === 0 ? (
              <p className="text-center text-zinc-400 py-12">No active jobs</p>
            ) : (
              activeJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedJobs.length === 0 ? (
              <p className="text-center text-zinc-400 py-12">No completed jobs</p>
            ) : (
              completedJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav role="provider" />
    </div>
  );
}
