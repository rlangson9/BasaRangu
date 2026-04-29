import { createBrowserRouter } from "react-router";
import App from "./App";
import { LoginPage } from "./pages/LoginPage";
import { UserHome } from "./pages/user/UserHome";
import { UserJobs } from "./pages/user/UserJobs";
import { UserChat } from "./pages/user/UserChat";
import { UserMe } from "./pages/user/UserMe";
import { UserProfile } from "./pages/user/UserProfile";
import { UserReviews } from "./pages/user/UserReviews";
import { UserIntent } from "./pages/user/UserIntent";
import { UserSettings } from "./pages/user/UserSettings";
import { VIPSubscription } from "./pages/user/VIPSubscription";
import { WalletPage } from "./pages/user/WalletPage";
import { UserVerification } from "./pages/user/UserVerification";
import { UserResume } from "./pages/user/UserResume";
import { ProviderHome } from "./pages/provider/ProviderHome";
import { ProviderJobs } from "./pages/provider/ProviderJobs";
import { ProviderEarnings } from "./pages/provider/ProviderEarnings";
import { ProviderMe } from "./pages/provider/ProviderMe";
import { ProviderProfile } from "./pages/provider/ProviderProfile";
import { ProviderReviews } from "./pages/provider/ProviderReviews";
import { ProviderSettings } from "./pages/provider/ProviderSettings";
import { ProviderVerification } from "./pages/provider/ProviderVerification";
import { ProviderResume } from "./pages/provider/ProviderResume";
import { RunnerHome } from "./pages/runner/RunnerHome";
import { RunnerVerification } from "./pages/runner/RunnerVerification";
import { RunnerTasks } from "./pages/runner/RunnerTasks";
import { RunnerEarnings } from "./pages/runner/RunnerEarnings";
import { RunnerMe } from "./pages/runner/RunnerMe";
import { RunnerProfile } from "./pages/runner/RunnerProfile";
import { RunnerReviews } from "./pages/runner/RunnerReviews";
import { RunnerSettings } from "./pages/runner/RunnerSettings";
import { RunnerResume } from "./pages/runner/RunnerResume";
import { ProviderDetail } from "./pages/provider/ProviderDetail";
import { RecruiterHome } from "./pages/recruiter/RecruiterHome";
import { RecruiterCandidates } from "./pages/recruiter/RecruiterCandidates";
import { RecruiterJobs } from "./pages/recruiter/RecruiterJobs";
import { RecruiterMe } from "./pages/recruiter/RecruiterMe";
import { RecruiterCompanyProfile } from "./pages/recruiter/RecruiterCompanyProfile";
import { RecruiterHired } from "./pages/recruiter/RecruiterHired";
import { RecruiterAnalytics } from "./pages/recruiter/RecruiterAnalytics";
import { RecruiterSettings } from "./pages/recruiter/RecruiterSettings";
import { RecruiterChat } from "./pages/recruiter/RecruiterChat";
import { CandidateDetail } from "./pages/recruiter/CandidateDetail";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminJobs } from "./pages/admin/AdminJobs";
import { AdminTransactions } from "./pages/admin/AdminTransactions";
import { AdminDisputes } from "./pages/admin/AdminDisputes";
import { JobDetail } from "./pages/JobDetail";
import { PostJob } from "./pages/PostJob";
import { ChatPage } from "./pages/ChatPage";
import { TermsPage } from "./pages/TermsPage";
import { SupportPage } from "./pages/SupportPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  // User Routes (Home Services Seeker)
  {
    path: "/user",
    children: [
      { index: true, element: <UserHome /> },
      { path: "jobs", element: <UserJobs /> },
      { path: "chat", element: <UserChat /> },
      { path: "me", element: <UserMe /> },
      { path: "profile", element: <UserProfile /> },
      { path: "reviews", element: <UserReviews /> },
      { path: "intent", element: <UserIntent /> },
      { path: "settings", element: <UserSettings /> },
      { path: "vip", element: <VIPSubscription /> },
      { path: "wallet", element: <WalletPage /> },
      { path: "verification", element: <UserVerification /> },
      { path: "resume", element: <UserResume /> },
    ],
  },
  // Service Provider Routes
  {
    path: "/provider",
    children: [
      { index: true, element: <ProviderHome /> },
      { path: "jobs", element: <ProviderJobs /> },
      { path: "earnings", element: <ProviderEarnings /> },
      { path: "me", element: <ProviderMe /> },
      { path: "profile", element: <ProviderProfile /> },
      { path: "reviews", element: <ProviderReviews /> },
      { path: "settings", element: <ProviderSettings /> },
      { path: "verification", element: <ProviderVerification /> },
      { path: "resume", element: <ProviderResume /> },
      { path: "detail/:id", element: <ProviderDetail /> },
    ],
  },
  // Errand Runner Routes
  {
    path: "/runner",
    children: [
      { index: true, element: <RunnerHome /> },
      { path: "tasks", element: <RunnerTasks /> },
      { path: "earnings", element: <RunnerEarnings /> },
      { path: "me", element: <RunnerMe /> },
      { path: "profile", element: <RunnerProfile /> },
      { path: "reviews", element: <RunnerReviews /> },
      { path: "settings", element: <RunnerSettings /> },
      { path: "verification", element: <RunnerVerification /> },
      { path: "resume", element: <RunnerResume /> },
    ],
  },
  // Recruiter/Company Routes
  {
    path: "/recruiter",
    children: [
      { index: true, element: <RecruiterHome /> },
      { path: "candidates", element: <RecruiterCandidates /> },
      { path: "jobs", element: <RecruiterJobs /> },
      { path: "hired", element: <RecruiterHired /> },
      { path: "analytics", element: <RecruiterAnalytics /> },
      { path: "settings", element: <RecruiterSettings /> },
      { path: "me", element: <RecruiterMe /> },
      { path: "company", element: <RecruiterCompanyProfile /> },
      { path: "chat", element: <RecruiterChat /> },
      { path: "candidate/:id", element: <CandidateDetail /> },
    ],
  },
  // Admin Routes (Desktop Only)
  {
    path: "/admin",
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "jobs", element: <AdminJobs /> },
      { path: "transactions", element: <AdminTransactions /> },
      { path: "disputes", element: <AdminDisputes /> },
    ],
  },
  // Shared Routes
  {
    path: "/job/:id",
    element: <JobDetail />,
  },
  {
    path: "/post-job",
    element: <PostJob />,
  },
  {
    path: "/chat/:jobId",
    element: <ChatPage />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/support",
    element: <SupportPage />,
  },
]);