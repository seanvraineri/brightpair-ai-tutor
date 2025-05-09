
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { MessageProvider } from "./contexts/MessageContext";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ConsultationScheduling from "./pages/ConsultationScheduling";
import OnboardingForm from "./pages/OnboardingForm";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TutorChat from "./pages/TutorChat";
import Flashcards from "./pages/Flashcards";
import Quizzes from "./pages/Quizzes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
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
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

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
                
                {/* Dashboard Routes */}
                <Route element={<AuthRoute><DashboardLayout /></AuthRoute>}>
                  {/* Student routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute allowedRole="student">
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Teacher routes */}
                  <Route path="/teacher-dashboard" element={
                    <ProtectedRoute allowedRole="teacher">
                      <TeacherDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Parent routes */}
                  <Route path="/parent-dashboard" element={
                    <ProtectedRoute allowedRole="parent">
                      <ParentDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Shared routes that all roles can access */}
                  <Route path="/homework" element={<Homework />} />
                  <Route path="/scheduling" element={<Scheduling />} />
                  <Route path="/lessons" element={<Lessons />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/messages" element={
                    <MessageProvider>
                      <Messages />
                    </MessageProvider>
                  } />
                  <Route path="/tutor-chat" element={<TutorChat />} />
                  <Route path="/flashcards" element={<Flashcards />} />
                  <Route path="/quizzes" element={<Quizzes />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                
                <Route path="/ai-tutor" element={<AITutor />} />
                
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
