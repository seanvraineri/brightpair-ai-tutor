
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubjectList from "@/components/subjects/SubjectList";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { useUser } from "@/contexts/UserContext";

const TeacherDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const studentCount = 12;
  const upcomingSessions = 5;
  const pendingAssignments = 8;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Teacher Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || "Teacher"}</h1>
          <p className="text-gray-600">Here's what's happening with your students today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{studentCount}</div>
              <p className="text-sm text-gray-500">Total active students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{upcomingSessions}</div>
              <p className="text-sm text-gray-500">Upcoming this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingAssignments}</div>
              <p className="text-sm text-gray-500">Pending review</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Students</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Student Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    View and manage all students you are currently tutoring. 
                    You can create learning plans, track progress, and provide feedback.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <p>Your student list will appear here</p>
                  </div>
                </CardContent>
              </Card>
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

export default TeacherDashboard;
