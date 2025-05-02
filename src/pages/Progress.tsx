
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ProgressOverview from "@/components/progress/ProgressOverview";
import SubjectProgress from "@/components/progress/SubjectProgress";
import SkillsTracking from "@/components/progress/SkillsTracking";
import GoalsManagement from "@/components/progress/GoalsManagement";
import TimeTracking from "@/components/progress/TimeTracking";

const Progress: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Academic Progress</h1>
          <p className="text-gray-600">Track your learning journey and academic achievements</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="time">Time Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <ProgressOverview />
          </TabsContent>
          
          <TabsContent value="subjects">
            <SubjectProgress />
          </TabsContent>
          
          <TabsContent value="skills">
            <SkillsTracking />
          </TabsContent>

          <TabsContent value="goals">
            <GoalsManagement />
          </TabsContent>

          <TabsContent value="time">
            <TimeTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Progress;
