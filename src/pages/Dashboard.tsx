import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import UpcomingSchedule from "@/components/dashboard/UpcomingSchedule";
import RecentActivity from "@/components/dashboard/RecentActivity";
import RecommendedTasks from "@/components/dashboard/RecommendedTasks";
import HomeworkAssignments from "@/components/dashboard/HomeworkAssignments";
import OnboardingStatus from "@/components/dashboard/OnboardingStatus";
import GamificationWidget from "@/components/dashboard/GamificationWidget";
import NearbyTutors from "@/components/dashboard/NearbyTutors";
import SubjectList from "@/components/subjects/SubjectList";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardFooter from "@/components/dashboard/DashboardFooter.js";
import DashboardHeader from "@/components/dashboard/DashboardHeader.js";
import DashboardModules from "@/components/dashboard/DashboardModules.js";
import DashboardRecentLessons from "@/components/dashboard/DashboardRecentLessons.js";
import DashboardStats from "@/components/dashboard/DashboardStats.js";

// Walkthrough component to guide new users
const DashboardWalkthrough = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Define walkthrough steps
  const stepContent = [
    {
      title: "Welcome to Your AI Tutor Dashboard",
      description: "This is your personalized learning hub! Let's take a quick tour to help you get started.",
      image: "https://assets.brightpair.us/images/dashboard/welcome.svg"
    },
    {
      title: "Your Learning Path",
      description: "View your personalized learning recommendations based on your goals, interests, and learning style.",
      image: "https://assets.brightpair.us/images/dashboard/learning-path.svg"
    },
    {
      title: "Track Your Progress",
      description: "Monitor your learning journey with detailed statistics and achievement tracking.",
      image: "https://assets.brightpair.us/images/dashboard/progress.svg"
    },
    {
      title: "Connect Your School",
      description: "Integrate with your school's learning management system to personalize your learning experience.",
      image: "https://assets.brightpair.us/images/dashboard/lms-connect.svg"
    },
    {
      title: "Learning Tools",
      description: "Access flashcards, quizzes, lessons, and adaptive questions tailored to your needs.",
      image: "https://assets.brightpair.us/images/dashboard/tools.svg"
    }
  ];
  
  const handleNextStep = () => {
    if (currentStep < stepContent.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">{stepContent[currentStep].title}</h2>
          <p className="text-gray-600 mb-4">{stepContent[currentStep].description}</p>
          {stepContent[currentStep].image && (
            <div className="flex justify-center mb-6">
              <img 
                src={stepContent[currentStep].image} 
                alt={stepContent[currentStep].title}
                className="h-40 object-contain"
              />
            </div>
          )}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevStep}
              className={`px-4 py-2 rounded-md ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <div className="flex space-x-1">
              {stepContent.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-2 rounded-md ${index === currentStep ? 'bg-brightpair' : 'bg-gray-300'}`}
                />
              ))}
            </div>
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-brightpair text-white rounded-md hover:bg-brightpair-600"
            >
              {currentStep === stepContent.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  
  const showNotification = (message: string) => {
    toast({
      title: "Notification",
      description: message,
    });
  };

  useEffect(() => {
    // Check if the URL has a walkthrough parameter
    const params = new URLSearchParams(location.search);
    if (params.get('walkthrough') === 'true') {
      setShowWalkthrough(true);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <DashboardHeader />
        <div className="w-full px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
              <p className="text-gray-600 mb-6">
                Continue your learning journey with BrightPair AI Tutor
              </p>
            </div>
            
            <div className="md:col-span-8">
              <DashboardStats />
            </div>
            
            <div className="md:col-span-4">
              <DashboardRecentLessons />
            </div>
            
            <div className="md:col-span-12">
              <DashboardModules />
            </div>
          </div>
        </div>
      </div>
      <DashboardFooter />
      
      {showWalkthrough && (
        <DashboardWalkthrough onClose={() => setShowWalkthrough(false)} />
      )}
    </div>
  );
};

export default Dashboard;
