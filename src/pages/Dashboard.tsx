
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import UpcomingSchedule from "@/components/dashboard/UpcomingSchedule";
import RecentActivity from "@/components/dashboard/RecentActivity";
import RecommendedTasks from "@/components/dashboard/RecommendedTasks";
import HomeworkAssignments from "@/components/dashboard/HomeworkAssignments";
import OnboardingStatus from "@/components/dashboard/OnboardingStatus";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  // This would come from your authentication/user state in a real app
  const [onboardingStatus, setOnboardingStatus] = useState<"pending" | "consultation-complete" | "onboarding-complete" | "active">("pending");
  const [nextConsultationDate, setNextConsultationDate] = useState<string>("May 5, 2025 at 2:30 PM");
  
  const showNotification = (message: string) => {
    toast({
      title: "Notification",
      description: message,
    });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Onboarding Status - for new users */}
        {onboardingStatus !== "active" && (
          <OnboardingStatus 
            status={onboardingStatus} 
            nextConsultationDate={nextConsultationDate}
          />
        )}

        {/* Weekly Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-8">
            <WeeklyProgress />
          </div>
          
          <div className="md:col-span-4">
            <UpcomingSchedule />
          </div>
        </div>

        {/* Homework Assignments */}
        <div className="mb-8">
          <HomeworkAssignments />
        </div>

        {/* Recent Activity and Recommended Next Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity />
          <RecommendedTasks />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
