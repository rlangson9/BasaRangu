import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { BarChart3, PieChart, TrendingUp, Calendar, Users, Briefcase, Clock, MapPin } from "lucide-react";
import { projectId } from "../../../../utils/supabase/info";
import { toast } from "sonner";

export function RecruiterAnalytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    applications: 0,
    interviews: 0,
    hires: 0,
    averageTimeToHire: 0,
    sourceBreakdown: [],
    departmentBreakdown: [],
    timeToHire: [],
    monthlyApplications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // In real implementation, fetch analytics from database
      // For now, showing dummy data
      setAnalytics({
        applications: 156,
        interviews: 48,
        hires: 12,
        averageTimeToHire: 28,
        sourceBreakdown: [
          { name: "LinkedIn", value: 45 },
          { name: "Indeed", value: 30 },
          { name: "Referrals", value: 15 },
          { name: "Other", value: 10 },
        ],
        departmentBreakdown: [
          { name: "Engineering", value: 4 },
          { name: "Marketing", value: 3 },
          { name: "Sales", value: 2 },
          { name: "Design", value: 2 },
          { name: "Other", value: 1 },
        ],
        timeToHire: [
          { name: "Engineering", value: 35 },
          { name: "Marketing", value: 25 },
          { name: "Sales", value: 20 },
          { name: "Design", value: 30 },
        ],
        monthlyApplications: [
          { month: "Jan", applications: 12, hires: 1 },
          { month: "Feb", applications: 18, hires: 2 },
          { month: "Mar", applications: 25, hires: 2 },
          { month: "Apr", applications: 22, hires: 1 },
          { month: "May", applications: 30, hires: 3 },
          { month: "Jun", applications: 28, hires: 3 },
        ],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900">Hiring Analytics</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-zinc-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-600">Total Applications</h3>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{analytics.applications}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+12% from last month</span>
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-zinc-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-600">Interviews Conducted</h3>
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{analytics.interviews}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+8% from last month</span>
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-zinc-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-600">Hires Made</h3>
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{analytics.hires}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+15% from last month</span>
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-zinc-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-600">Avg. Time to Hire</h3>
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{analytics.averageTimeToHire} days</p>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+2% from last month</span>
            </p>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-white border border-zinc-200 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sources" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              Sources
            </TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              Departments
            </TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              Time to Hire
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Monthly Applications & Hires</h3>
              <div className="h-80">
                {/* In a real app, this would be a chart */}
                <div className="flex items-end justify-between h-full gap-2">
                  {analytics.monthlyApplications.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="flex items-end gap-1 w-full">
                        <div 
                          className="flex-1 bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                          style={{ height: `${(item.applications / 30) * 100}%` }}
                        />
                        <div 
                          className="flex-1 bg-green-500 rounded-t-md transition-all hover:bg-green-600"
                          style={{ height: `${(item.hires / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-600 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-zinc-600">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Applications</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Hires</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Application Sources</h3>
              <div className="h-80 flex items-center justify-center">
                {/* In a real app, this would be a pie chart */}
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clip: "rect(0px, 128px, 128px, 0px)" }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-purple-500" style={{ clip: "rect(0px, 256px, 128px, 128px)" }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clip: "rect(128px, 128px, 256px, 0px)" }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-amber-500" style={{ clip: "rect(128px, 256px, 256px, 128px)" }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-zinc-900">100%</p>
                      <p className="text-xs text-zinc-600">Total Sources</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {analytics.sourceBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ 
                      backgroundColor: index === 0 ? '#3b82f6' : 
                                     index === 1 ? '#8b5cf6' : 
                                     index === 2 ? '#22c55e' : '#f59e0b'
                    }}></div>
                    <span className="text-sm text-zinc-700">{item.name}</span>
                    <span className="ml-auto text-sm font-medium text-zinc-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Hires by Department</h3>
              <div className="h-80">
                {/* In a real app, this would be a bar chart */}
                <div className="flex items-end justify-between h-full gap-4">
                  {analytics.departmentBreakdown.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-teal-500 rounded-t-md transition-all hover:bg-teal-600"
                        style={{ height: `${(item.value / 4) * 100}%` }}
                      />
                      <span className="text-xs text-zinc-600 mt-2 text-center">{item.name}</span>
                      <span className="text-xs font-medium text-zinc-900 mt-1">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="time" className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Time to Hire by Department</h3>
              <div className="h-80">
                {/* In a real app, this would be a bar chart */}
                <div className="flex items-end justify-between h-full gap-4">
                  {analytics.timeToHire.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-amber-500 rounded-t-md transition-all hover:bg-amber-600"
                        style={{ height: `${(item.value / 35) * 100}%` }}
                      />
                      <span className="text-xs text-zinc-600 mt-2 text-center">{item.name}</span>
                      <span className="text-xs font-medium text-zinc-900 mt-1">{item.value} days</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-6 border border-zinc-200 mt-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Hiring Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Increase LinkedIn Presence</h4>
                <p className="text-xs text-blue-700 mt-1">LinkedIn is your top source of quality candidates. Consider increasing your presence with more job posts and company updates.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-900">Reduce Time to Hire</h4>
                <p className="text-xs text-green-700 mt-1">Your engineering department has the longest time to hire. Consider streamlining the interview process or pre-screening candidates.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-900">Employee Referral Program</h4>
                <p className="text-xs text-purple-700 mt-1">Referrals have a higher retention rate. Consider implementing an employee referral program with incentives.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav role="recruiter" />
    </div>
  );
}
