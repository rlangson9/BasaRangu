import { useState, useEffect } from "react";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { JobCard } from "../../components/JobCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { projectId } from "../../../../utils/supabase/info";

const mockMyTasks = [
  {
    id: "6",
    title: "Grocery Shopping",
    description: "Buy groceries from Pick n Pay and deliver to my home",
    category: "Shopping",
    budget: 500,
    location: "Harare, Zimbabwe",
    distance: 2.5,
    postedBy: "John Smith",
    userName: "John Smith",
    urgency: "Urgent",
    createdAt: "2024-01-15T10:00:00Z",
    status: "in_progress",
    applicants: [
      {
        id: "app6",
        userId: "current-user",
        userName: "Test User",
        quote: 450,
        message: "I can do this right away!",
        status: "accepted",
      },
    ],
    userId: "user1",
    pickupLocation: "Pick n Pay, Borrowdale",
    dropoffLocation: "123 Samora Machel Ave",
  },
  {
    id: "7",
    title: "Document Delivery",
    description: "Deliver important documents to Harare CBD",
    category: "Document",
    budget: 300,
    location: "Harare, Zimbabwe",
    distance: 3.2,
    postedBy: "Jane Doe",
    userName: "Jane Doe",
    urgency: "Normal",
    createdAt: "2024-01-12T09:30:00Z",
    status: "completed",
    applicants: [
      {
        id: "app7",
        userId: "current-user",
        userName: "Test User",
        quote: 280,
        message: "Available anytime today",
        status: "accepted",
      },
    ],
    userId: "user2",
    pickupLocation: "Westgate Mall",
    dropoffLocation: "456 First Street",
  },
];

export function RunnerTasks() {
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/jobs?type=errand`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      let userTasks = (data.jobs || []).filter((job: any) =>
        job.applicants?.some((app: any) => app.userId === user.id)
      );
      
      if (userTasks.length === 0) {
        userTasks = mockMyTasks;
      }
      
      setMyTasks(userTasks);
    } catch (error) {
      console.log("Using mock data instead");
      setMyTasks(mockMyTasks);
    } finally {
      setLoading(false);
    }
  };

  const activeTasks = myTasks.filter(
    (task) => task.status === "in_progress" || task.status === "paid"
  );
  const completedTasks = myTasks.filter((task) => task.status === "completed");

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">My Tasks</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-zinc-900 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-teal-500">
              Active ({activeTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-teal-500">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeTasks.length === 0 ? (
              <p className="text-center text-zinc-400 py-12">No active tasks</p>
            ) : (
              activeTasks.map((task) => <JobCard key={task.id} job={task} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length === 0 ? (
              <p className="text-center text-zinc-400 py-12">No completed tasks</p>
            ) : (
              completedTasks.map((task) => <JobCard key={task.id} job={task} />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav role="runner" />
    </div>
  );
}
