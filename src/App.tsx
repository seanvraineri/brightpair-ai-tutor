import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { UserProvider, useUser } from "./contexts/UserContext";
import { MessageProvider } from "./contexts/MessageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ConsultationScheduling from "./pages/ConsultationScheduling";
import OnboardingForm from "./pages/OnboardingForm";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/parent/dashboard";
import TutorChat from "./pages/TutorChat";
import Flashcards from "./pages/Flashcards";
import Quizzes from "./pages/Quizzes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardNav from "./components/dashboard/DashboardNav";
import TutorSignup from "./pages/TutorSignup";
import TutorSearch from "./pages/TutorSearch";
import TutorProfile from "./pages/TutorProfile";
import TutorFAQ from "./pages/TutorFAQ";
import Contact from "./pages/Contact";
import Homework from "./pages/Homework";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Scheduling from "./pages/Scheduling";
import Progress from "./pages/Progress";
import Messages from "./pages/Messages";
import Lessons from "./pages/Lessons";
import AITutor from "./pages/AITutor";
import StudentNotes from "./pages/StudentNotes";
import BillingManagement from "./pages/BillingManagement";
import Reports from "./pages/Reports";
import CustomLessonPage from "./pages/CustomLessonPage";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import CurriculumBuilder from "./pages/tutor/CurriculumBuilder";
import StudentOnboardingWizard from "@/components/onboarding/StudentOnboardingWizard";

// Protected Route component to check role and authentication
const ProtectedRoute = (
  { children, allowedRole }: {
    children: React.ReactNode;
    allowedRole: string | string[];
  },
) => {
  const { user, session } = useUser();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but no user data yet, wait for it
  if (!user) {
    return null;
  }

  // Normalize allowed roles to array for flexible checks
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  // If user doesn't have one of the required roles, redirect to appropriate dashboard
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case "teacher":
        return <Navigate to="/teacher-dashboard" />;
      case "parent":
        return <Navigate to="/parent-dashboard" />;
      default:
        return <Navigate to="/dashboard" />;
    }
  }

  // User is authenticated and has the correct role
  return <>{children}</>;
};

// Authentication check for routes that just require being logged in, regardless of role
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useUser();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated
  return <>{children}</>;
};

// Public Dashboard layout that includes navigation but no auth checks
const PublicDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <DashboardNav />
      <main className="md:ml-64 pt-16 md:pt-6 pb-28 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const TutorRoutes = lazy(() => import("./routes/TutorRoutes"));
const StudentRoutes = lazy(() => import("./routes/StudentRoutes"));
const ParentRoutes = lazy(() => import("./routes/ParentRoutes"));

const queryClient = new QueryClient();

function StudentOnboardingWizardWrapper() {
  const { studentId } = useParams();
  return (
    <StudentOnboardingWizard
      studentId={studentId}
      onComplete={() => {
        window.location.href = "/dashboard";
      }}
    />
  );
}

// Lazy load dashboard pages
// const StudentDashboard = lazy(() => import("@/pages/StudentDashboard"));
// const TutorDashboard = lazy(() => import("@/pages/TutorDashboard"));
// const ParentDashboard = lazy(() => import("@/pages/ParentDashboard"));

// Lazy load standalone pages
// const StudentOnboarding = lazy(() => import("@/pages/StudentOnboarding"));
// const LessonInterface = lazy(() => import("@/pages/LessonInterface"));
// const CustomLessonPage = lazy(() => import("@/pages/CustomLessonPage"));
// const StudyBuddy = lazy(() => import("@/components/tutor/StudyBuddy"));
// const LoginPage = lazy(() => import("@/pages/LoginPage"));
// const SignupPage = lazy(() => import("@/pages/SignupPage"));
// const LessonChat = lazy(() => import("@/pages/LessonChat"));

// Loading component for lazy-loaded routes
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brightpair mx-auto">
        </div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <UserProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/consultation"
                  element={<ConsultationScheduling />}
                />
                <Route path="/onboarding" element={<OnboardingForm />} />
                <Route
                  path="/onboarding/student/:studentId"
                  element={<StudentOnboardingWizardWrapper />}
                />
                <Route path="/tutor-signup" element={<TutorSignup />} />
                <Route path="/tutor-search" element={<TutorSearch />} />
                <Route path="/tutor-profile/:id" element={<TutorProfile />} />
                <Route path="/tutor-faq" element={<TutorFAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/careers" element={<Careers />} />

                {/* Tutor bundle (teachers & tutors) */}
                <Route
                  path="/tutor/*"
                  element={
                    <ProtectedRoute allowedRole={["teacher", "tutor"]}>
                      <ErrorBoundary>
                        <Suspense fallback={<Spinner />}>
                          <TutorRoutes />
                        </Suspense>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />

                {/* Student bundle */}
                <Route
                  path="/student/*"
                  element={
                    <AuthRoute>
                      <ErrorBoundary>
                        <Suspense fallback={<Spinner />}>
                          <StudentRoutes />
                        </Suspense>
                      </ErrorBoundary>
                    </AuthRoute>
                  }
                />

                {/* Parent bundle */}
                <Route
                  path="/parent/*"
                  element={
                    <ProtectedRoute allowedRole="parent">
                      <ErrorBoundary>
                        <Suspense fallback={<Spinner />}>
                          <ParentRoutes />
                        </Suspense>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />

                {/* Public Dashboard Routes - no auth required but with nav */}
                <Route element={<PublicDashboardLayout />}>
                  <Route path="/quizzes" element={<Quizzes />} />
                </Route>

                {/* Dashboard Routes - auth required */}
                <Route
                  element={
                    <AuthRoute>
                      <Outlet />
                    </AuthRoute>
                  }
                >
                  {/* Student routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRole="student">
                        <DashboardLayout>
                          <Dashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Teacher routes */}
                  <Route
                    path="/teacher-dashboard"
                    element={
                      <ProtectedRoute allowedRole="teacher">
                        <DashboardLayout>
                          <TeacherDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Parent routes */}
                  <Route
                    path="/parent-dashboard"
                    element={
                      <ProtectedRoute allowedRole="parent">
                        <DashboardLayout>
                          <ParentDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Shared routes */}
                  <Route
                    path="/homework"
                    element={
                      <DashboardLayout>
                        <Homework />
                      </DashboardLayout>
                    }
                  />

                  {/* Curriculum route */}
                  <Route
                    path="/curriculum"
                    element={
                      <ProtectedRoute allowedRole="teacher">
                        <DashboardLayout>
                          <CurriculumBuilder />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Reports route */}
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute allowedRole="teacher">
                        <DashboardLayout>
                          <Reports />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Other routes... */}
                  <Route
                    path="/scheduling"
                    element={
                      <DashboardLayout>
                        <Scheduling />
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path="/lessons"
                    element={
                      <DashboardLayout>
                        <Lessons />
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path="/progress"
                    element={
                      <DashboardLayout>
                        <Progress />
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <MessageProvider>
                        <DashboardLayout>
                          <Messages />
                        </DashboardLayout>
                      </MessageProvider>
                    }
                  />
                  <Route
                    path="/ai-tutor"
                    element={
                      <DashboardLayout>
                        <AITutor />
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path="/tutor-chat"
                    element={
                      <DashboardLayout>
                        <TutorChat />
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path="/flashcards"
                    element={
                      <DashboardLayout>
                        <Flashcards />
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <DashboardLayout>
                        <Settings />
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path="/student-notes"
                    element={
                      <ProtectedRoute allowedRole="teacher">
                        <DashboardLayout>
                          <StudentNotes />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/billing"
                    element={
                      <ProtectedRoute allowedRole="parent">
                        <DashboardLayout>
                          <BillingManagement />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tutors"
                    element={
                      <ProtectedRoute allowedRole="parent">
                        <DashboardLayout>
                          <Card>
                            <CardHeader>
                              <CardTitle>Find Tutors</CardTitle>
                              <CardDescription>
                                Discover qualified tutors for your child
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <TutorSearch />
                            </CardContent>
                          </Card>
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/custom-lessons"
                    element={
                      <DashboardLayout>
                        <CustomLessonPage />
                      </DashboardLayout>
                    }
                  />
                </Route>

                <Route
                  path="/student/dashboard"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/teacher/dashboard"
                  element={<Navigate to="/teacher-dashboard" replace />}
                />
                <Route
                  path="/parent/dashboard"
                  element={<Navigate to="/parent-dashboard" replace />}
                />
                <Route
                  path="/curricula"
                  element={<Navigate to="/curriculum" replace />}
                />

                {/* Protected Routes - Removed as components don't exist */}
                {
                  /*
                <Route
                  path="/student/onboarding"
                  element={
                    <AuthGuard>
                      <StudentOnboarding />
                    </AuthGuard>
                  }
                />

                <Route
                  path="/student/*"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={["student"]}>
                        <StudentRoutes />
                      </RoleGuard>
                    </AuthGuard>
                  }
                />

                <Route
                  path="/tutor/dashboard"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={["tutor"]}>
                        <TutorDashboard />
                      </RoleGuard>
                    </AuthGuard>
                  }
                />

                <Route
                  path="/tutor/*"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={["tutor"]}>
                        <TutorRoutes />
                      </RoleGuard>
                    </AuthGuard>
                  }
                />

                <Route
                  path="/parent/*"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={["parent"]}>
                        <ParentRoutes />
                      </RoleGuard>
                    </AuthGuard>
                  }
                />
                */
                }

                <Route
                  path="/student"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/tutor"
                  element={<Navigate to="/tutor/dashboard" replace />}
                />
                <Route
                  path="/parent"
                  element={<Navigate to="/parent/dashboard" replace />}
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
