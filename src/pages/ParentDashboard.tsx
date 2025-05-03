
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";
import NearbyTutors from "@/components/dashboard/NearbyTutors";

const ParentDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for child's progress
  const childProgress = {
    name: "Alex",
    attendance: 92,
    homework: 85,
    overallProgress: 88
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Parent Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || "Parent"}</h1>
          <p className="text-gray-600">Monitor your child's academic progress and upcoming sessions.</p>
        </div>

        {/* Dashboard Tabs */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Child's Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Attendance</span>
                        <span className="text-sm font-medium">{childProgress.attendance}%</span>
                      </div>
                      <Progress value={childProgress.attendance} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Homework Completion</span>
                        <span className="text-sm font-medium">{childProgress.homework}%</span>
                      </div>
                      <Progress value={childProgress.homework} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm font-medium">{childProgress.overallProgress}%</span>
                      </div>
                      <Progress value={childProgress.overallProgress} className="h-2" />
                    </div>

                    <div className="mt-4 text-right">
                      <Link to="/progress">
                        <Button>View Detailed Progress</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Nearby Tutors Section */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Tutors Near You</CardTitle>
                </CardHeader>
                <CardContent>
                  <NearbyTutors />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    View upcoming tutoring sessions for your child.
                  </p>
                  <div className="mb-4 bg-gray-100 p-4 rounded-md text-center">
                    <p>Your child's upcoming sessions will appear here</p>
                  </div>
                  <div className="text-right">
                    <Link to="/scheduling">
                      <Button variant="outline">View Schedule</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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

export default ParentDashboard;
