
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OnboardingForm from "./pages/OnboardingForm";
import Dashboard from "./pages/Dashboard";
import TutorChat from "./pages/TutorChat";
import Flashcards from "./pages/Flashcards";
import Quizzes from "./pages/Quizzes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import TutorSignup from "./pages/TutorSignup";
import TutorFAQ from "./pages/TutorFAQ";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/tutor-signup" element={<TutorSignup />} />
          <Route path="/tutor-faq" element={<TutorFAQ />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tutor-chat" element={<TutorChat />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
