import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { MessageProvider } from "./contexts/MessageContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
import Curriculum from "./pages/Curriculum";
import Reports from "./pages/Reports";
import CustomLessonPage from "./pages/CustomLessonPage";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

// Import TutorDashboard
import TutorDashboard from "./pages/tutor/dashboard";

// Import our newly created components
import StudentDetailComponent from './pages/parent/StudentDetail';
import MessageComposerPageComponent from './pages/parent/MessageComposerPage';
import ReportViewPageComponent from './pages/parent/ReportViewPage';
import StudentOnboarding from "./pages/tutor/StudentOnboarding";
import HomeworkCreator from './pages/tutor/HomeworkCreator';

// Import the new StudentAssignments component
import StudentAssignments from "./pages/tutor/StudentAssignments";
import TutorAssignments from "./pages/tutor/TutorAssignments";

// Import the new homework components
import HomeworkBuilder from './pages/tutor/HomeworkBuilder';
import HomeworkViewer from './pages/student/HomeworkViewer';

// Import the new curriculum builder component
import CurriculumBuilder from './pages/tutor/CurriculumBuilder';
import CurriculumManager from './pages/tutor/CurriculumManager';

// Update the placeholder components
const StudentDetail = ({ isParentView }: { isParentView?: boolean }) => <StudentDetailComponent isParentView={isParentView} />;
const MessageComposerPage = ({ isParentView }: { isParentView?: boolean }) => <MessageComposerPageComponent isParentView={isParentView} />;
const ReportViewPage = () => <ReportViewPageComponent />;

const queryClient = new QueryClient();

// Protected Route component to check role and authentication
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
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
  
  // If user doesn't have the required role, redirect to appropriate dashboard
  if (user.role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    switch(user.role) {
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

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserProvider>
            <BrowserRouter>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/consultation" element={<ConsultationScheduling />} />
                <Route path="/onboarding" element={<OnboardingForm />} />
                <Route path="/tutor-signup" element={<TutorSignup />} />
                <Route path="/tutor-search" element={<TutorSearch />} />
                <Route path="/tutor-profile/:id" element={<TutorProfile />} />
                <Route path="/tutor-faq" element={<TutorFAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/careers" element={<Careers />} />
                
                {/* Tutor Dashboard Routes */}
                <Route path="/tutor/dashboard" element={
                  <DashboardLayout>
                    <TutorDashboard />
                  </DashboardLayout>
                } />
                <Route path="/tutor/student/:studentId" element={<StudentDetail />} />
                <Route path="/tutor/student/:studentId/assignments" element={<StudentAssignments />} />
                <Route path="/tutor/assignments" element={<TutorAssignments />} />
                <Route path="/tutor/students/onboard" element={<StudentOnboarding />} />
                <Route path="/tutor/students/new" element={
                  <DashboardLayout>
                    <div>New Student Form</div>
                  </DashboardLayout>
                } />
                
                {/* Tutor Messaging Routes */}
                <Route path="/tutor/messages" element={
                  <DashboardLayout>
                    <Messages />
                  </DashboardLayout>
                } />
                <Route path="/tutor/messages/new" element={
                  <DashboardLayout>
                    <MessageComposerPage />
                  </DashboardLayout>
                } />

                {/* Tutor Homework Routes */}
                <Route path="/tutor/homework/create" element={
                  <DashboardLayout>
                    <HomeworkCreator />
                  </DashboardLayout>
                } />
                <Route path="/tutor/homework/view/:id" element={
                  <DashboardLayout>
                    <div>Homework Detail View</div>
                  </DashboardLayout>
                } />
                <Route path="/tutor/homework/builder" element={
                  <DashboardLayout>
                    <HomeworkBuilder />
                  </DashboardLayout>
                } />
                <Route path="/tutor/homework/builder/:studentId" element={
                  <DashboardLayout>
                    <HomeworkBuilder />
                  </DashboardLayout>
                } />
                
                {/* Student Homework Routes */}
                <Route path="/student/homework/:homeworkId" element={
                  <DashboardLayout>
                    <HomeworkViewer />
                  </DashboardLayout>
                } />
                
                {/* Parent Portal Direct Routes */}
                <Route path="/parent/dashboard" element={<ParentDashboard />} />
                <Route path="/parent/students/:id" element={<StudentDetail isParentView={true} />} />
                <Route path="/parent/messages/new" element={<MessageComposerPage isParentView={true} />} />
                <Route path="/parent/reports/view/:id" element={<ReportViewPage />} />
                
                {/* Public Dashboard Routes - no auth required but with nav */}
                <Route element={<PublicDashboardLayout />}>
                  <Route path="/quizzes" element={<Quizzes />} />
                </Route>
                
                {/* Dashboard Routes - auth required */}
                <Route element={<AuthRoute><Outlet /></AuthRoute>}>
                  {/* Student routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute allowedRole="student">
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Teacher routes */}
                  <Route path="/teacher-dashboard" element={
                    <ProtectedRoute allowedRole="teacher">
                      <DashboardLayout>
                        <TeacherDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Parent routes */}
                  <Route path="/parent-dashboard" element={
                    <ProtectedRoute allowedRole="parent">
                      <DashboardLayout>
                        <ParentDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Shared routes */}
                  <Route path="/homework" element={
                    <DashboardLayout>
                      <Homework />
                    </DashboardLayout>
                  } />
                  
                  {/* Curriculum route */}
                  <Route path="/curriculum" element={
                    <ProtectedRoute allowedRole="teacher">
                      <DashboardLayout>
                        <CurriculumBuilder />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Reports route */}
                  <Route path="/reports" element={
                    <ProtectedRoute allowedRole="teacher">
                      <DashboardLayout>
                        <Reports />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Other routes... */}
                  <Route path="/scheduling" element={
                    <DashboardLayout>
                      <Scheduling />
                    </DashboardLayout>
                  } />
                  <Route path="/lessons" element={
                    <DashboardLayout>
                      <Lessons />
                    </DashboardLayout>
                  } />
                  <Route path="/progress" element={
                    <DashboardLayout>
                      <Progress />
                    </DashboardLayout>
                  } />
                  <Route path="/messages" element={
                    <MessageProvider>
                      <DashboardLayout>
                        <Messages />
                      </DashboardLayout>
                    </MessageProvider>
                  } />
                  <Route path="/ai-tutor" element={
                    <DashboardLayout>
                      <AITutor />
                    </DashboardLayout>
                  } />
                  <Route path="/tutor-chat" element={
                    <DashboardLayout>
                      <TutorChat />
                    </DashboardLayout>
                  } />
                  <Route path="/flashcards" element={
                    <DashboardLayout>
                      <Flashcards />
                    </DashboardLayout>
                  } />
                  <Route path="/settings" element={
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  } />
                  <Route path="/student-notes" element={
                    <ProtectedRoute allowedRole="teacher">
                      <DashboardLayout>
                        <StudentNotes />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/billing" element={
                    <ProtectedRoute allowedRole="parent">
                      <DashboardLayout>
                        <BillingManagement />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/tutors" element={
                    <ProtectedRoute allowedRole="parent">
                      <DashboardLayout>
                        <Card>
                          <CardHeader>
                            <CardTitle>Find Tutors</CardTitle>
                            <CardDescription>Discover qualified tutors for your child</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <TutorSearch />
                          </CardContent>
                        </Card>
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/custom-lessons" element={
                    <DashboardLayout>
                      <CustomLessonPage />
                    </DashboardLayout>
                  } />
                  {/* Curriculum manager */}
                  <Route path="/curricula" element={
                    <ProtectedRoute allowedRole="teacher">
                      <DashboardLayout>
                        <CurriculumManager />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
