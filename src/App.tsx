
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";

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
import TutorFAQ from "./pages/TutorFAQ";
import Contact from "./pages/Contact";
import Homework from "./pages/Homework";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";

const queryClient = new QueryClient();

// Protected Route component to check role
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const { user } = useUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
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
  
  return <>{children}</>;
};

const App = () => {
  return (
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
              <Route path="/tutor-faq" element={<TutorFAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/careers" element={<Careers />} />
              
              {/* Dashboard Routes */}
              <Route element={<DashboardLayout />}>
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
                <Route path="/tutor-chat" element={<TutorChat />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
