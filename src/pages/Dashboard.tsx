
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  
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
        <WelcomeBanner userName={user?.name || "Student"} />

        {/* Onboarding Status - for new users */}
        {user?.onboardingStatus !== "active" && (
          <OnboardingStatus 
            status={user?.onboardingStatus || "pending"} 
            nextConsultationDate={user?.nextConsultationDate}
          />
        )}

        {/* Dashboard Tabs */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {/* Weekly Progress and Gamification */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                <div className="md:col-span-8">
                  <WeeklyProgress />
                </div>
                
                <div className="md:col-span-4">
                  <div className="flex flex-col h-full">
                    <GamificationWidget />
                  </div>
                </div>
              </div>

              {/* Nearby Tutors Section */}
              <div className="mb-8">
                <NearbyTutors />
              </div>

              {/* Upcoming Schedule */}
              <div className="mb-8">
                <UpcomingSchedule />
                <div className="mt-3 text-right">
                  <Link to="/scheduling">
                    <Button variant="link" className="text-brightpair">
                      View Full Calendar
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Detailed Progress Link */}
              <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">Track Your Learning Progress</h3>
                    <p className="text-gray-600">View detailed metrics and charts about your academic progress</p>
                  </div>
                  <Link to="/progress">
                    <Button>View Progress Dashboard</Button>
                  </Link>
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
            </TabsContent>
            
            <TabsContent value="subjects">
              <SubjectList />
            </TabsContent>
            
            <TabsContent value="documents">
              <DocumentUpload />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
