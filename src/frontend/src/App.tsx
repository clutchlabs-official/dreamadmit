import Layout from "@/components/Layout";
import AIAdvisorPage from "@/pages/AIAdvisorPage";
import AdmissionsHubPage from "@/pages/AdmissionsHubPage";
import AlumniChatCollegePage from "@/pages/AlumniChatCollegePage";
import AlumniChatPage from "@/pages/AlumniChatPage";
import CalculatorPage from "@/pages/CalculatorPage";
import CareerPage from "@/pages/CareerPage";
import CollegeDetailPage from "@/pages/CollegeDetailPage";
import CollegesPage from "@/pages/CollegesPage";
import CommunityPage from "@/pages/CommunityPage";
import ComparePage from "@/pages/ComparePage";
import CourseFinderPage from "@/pages/CourseFinderPage";
import DeadlinesPage from "@/pages/DeadlinesPage";
import DocumentsPage from "@/pages/DocumentsPage";
import EditProfilePage from "@/pages/EditProfilePage";
import EssayReviewerPage from "@/pages/EssayReviewerPage";
import EssaysPage from "@/pages/EssaysPage";
import ExtracurricularsPage from "@/pages/ExtracurricularsPage";
import FinanceHubPage from "@/pages/FinanceHubPage";
import GuidancePage from "@/pages/GuidancePage";
import InternationalPage from "@/pages/InternationalPage";
import InterviewPrepPage from "@/pages/InterviewPrepPage";
import OfficerPortalPage from "@/pages/OfficerPortalPage";
import ProfilePage from "@/pages/ProfilePage";
import ScholarshipsPage from "@/pages/ScholarshipsPage";
import SmartPlanningPage from "@/pages/SmartPlanningPage";
import TestPrepPage from "@/pages/TestPrepPage";
import TrackingPage from "@/pages/TrackingPage";

import AfterAdmissionPage from "@/pages/AfterAdmissionPage";
import HomePage from "@/pages/HomePage";
import MentalHealthPage from "@/pages/MentalHealthPage";
import PlansPage from "@/pages/PlansPage";
import SecretAdminPage from "@/pages/SecretAdminPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const editProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/edit",
  component: EditProfilePage,
});

const guidanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guidance",
  component: GuidancePage,
});

const scholarshipsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scholarships",
  component: ScholarshipsPage,
});

const collegesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/colleges",
  component: CollegesPage,
});

const collegeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/colleges/$id",
  component: CollegeDetailPage,
});

const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compare",
  component: ComparePage,
});

const calculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calculator",
  component: CalculatorPage,
});
const deadlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deadlines",
  component: DeadlinesPage,
});

const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documents",
  component: DocumentsPage,
});

const essayReviewerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/essay-reviewer",
  component: EssayReviewerPage,
});

const interviewPrepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interview-prep",
  component: InterviewPrepPage,
});

const extracurricularsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/extracurriculars",
  component: ExtracurricularsPage,
});

const courseFinderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/course-finder",
  component: CourseFinderPage,
});

const alumniChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alumni-chat",
  component: AlumniChatPage,
});

const alumniChatCollegeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alumni-chat/$collegeId",
  component: AlumniChatCollegePage,
});

const officerPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/officer-portal",
  component: OfficerPortalPage,
});

const admissionsHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admissions-hub",
  component: AdmissionsHubPage,
});

const essaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/essays",
  component: EssaysPage,
});

const financeHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/finance-hub",
  component: FinanceHubPage,
});

const testPrepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/test-prep",
  component: TestPrepPage,
});

const aiAdvisorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-advisor",
  component: AIAdvisorPage,
});

const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: CommunityPage,
});

const trackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tracking",
  component: TrackingPage,
});

const internationalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/international",
  component: InternationalPage,
});
const smartPlanningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/smart-planning",
  component: SmartPlanningPage,
});

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/plans",
  component: PlansPage,
});

const mentalHealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mental-health",
  component: MentalHealthPage,
});

const afterAdmissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/after-admission",
  component: AfterAdmissionPage,
});
const careerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career",
  component: CareerPage,
});

const secretAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/secret-admin",
  component: SecretAdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileRoute,
  editProfileRoute,
  guidanceRoute,
  scholarshipsRoute,
  collegesRoute,
  collegeDetailRoute,
  compareRoute,
  calculatorRoute,
  deadlinesRoute,
  documentsRoute,
  essayReviewerRoute,
  interviewPrepRoute,
  extracurricularsRoute,
  courseFinderRoute,
  alumniChatRoute,
  alumniChatCollegeRoute,
  officerPortalRoute,
  admissionsHubRoute,
  essaysRoute,
  financeHubRoute,
  testPrepRoute,
  aiAdvisorRoute,
  communityRoute,
  trackingRoute,
  internationalRoute,
  smartPlanningRoute,
  plansRoute,
  mentalHealthRoute,
  afterAdmissionRoute,
  careerRoute,
  secretAdminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
