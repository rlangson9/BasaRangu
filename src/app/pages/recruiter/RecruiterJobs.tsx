import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { JobCard } from "../../components/JobCard";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { projectId } from "../../../../utils/supabase/info";

export function RecruiterJobs() {
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/jobs?type=recruitment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      const userJobs = (data.jobs || []).filter((job: any) => job.userId === user.id);
      setMyJobs(userJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = myJobs.filter((job) => job.status === "open");
  const closedJobs = myJobs.filter((job) => job.status === "closed" || job.status === "completed");

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900">Manage Jobs</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <Button
          onClick={() => navigate("/post-job")}
          className="w-full mb-6 bg-teal-500 hover:bg-teal-600 text-white h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post New Job
        </Button>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-white border border-zinc-200 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="closed" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              Closed ({closedJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-600">No active job postings</p>
                <Button
                  onClick={() => navigate("/post-job")}
                  className="mt-4 bg-teal-500 hover:bg-teal-600"
                >
                  Post Your First Job
                </Button>
              </div>
            ) : (
              activeJobs.map((job) => <JobCard key={job.id} job={job} variant="recruiter" />)
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            {closedJobs.length === 0 ? (
              <p className="text-center text-zinc-600 py-12">No closed jobs</p>
            ) : (
              closedJobs.map((job) => <JobCard key={job.id} job={job} variant="recruiter" />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav role="recruiter" />
    </div>
  );
}
