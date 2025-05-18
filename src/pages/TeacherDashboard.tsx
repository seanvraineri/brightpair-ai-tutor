import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import SubjectList from "@/components/subjects/SubjectList";
import DocumentUpload from "@/components/documents/DocumentUpload";
import StudentManagement from "@/components/tutor/StudentManagement";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  BookOpen,
  Calendar as CalendarIcon,
  CalendarX2,
  Clock,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TeacherDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const tutorId = user?.id || "";

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["teacher-stats", tutorId],
    enabled: !!tutorId,
    queryFn: async () => {
      // students
      const { data: students } = await supabase
        .from("tutor_students")
        .select("student_id")
        .eq("tutor_id", tutorId);

      // upcoming sessions in next 7 days
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      const { data: sessions } = await supabase
        .from("appointments")
        .select("id, starts_at, ends_at, student_id, learning_tracks(name)")
        .eq("tutor_id", tutorId)
        .gte("starts_at", now.toISOString())
        .lte("starts_at", nextWeek.toISOString())
        .order("starts_at");

      // pending homework to grade
      const { data: pending } = await supabase
        .from("homework")
        .select("id")
        .eq("tutor_id", tutorId)
        .eq("status", "submitted");

      return {
        studentCount: students?.length ?? 0,
        upcomingSessions: sessions ?? [],
        pendingAssignments: pending?.length ?? 0,
      };
    },
  });

  const studentCount = stats?.studentCount ?? 0;
  const upcomingSessions = stats?.upcomingSessions.length ?? 0;
  const pendingAssignments = stats?.pendingAssignments ?? 0;
  const upcomingSessionsData = stats?.upcomingSessions ?? [];

  // Navigation handlers
  const handleNavToStudentNotes = () => navigate("/student-notes");
  const handleNavToCurriculum = () => navigate("/curriculum");
  const handleNavToReports = () => navigate("/reports");
  const handleNavToScheduling = () => navigate("/scheduling");

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Teacher Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.name || "Teacher"}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your students today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-md p-2 mr-4">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Students</p>
                  {isLoadingStats
                    ? <Skeleton className="h-7 w-14" />
                    : <h2 className="text-3xl font-bold">{studentCount}</h2>}
                  <p className="text-xs text-gray-500">Total active students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-md p-2 mr-4">
                  <CalendarIcon className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sessions</p>
                  {isLoadingStats
                    ? <Skeleton className="h-7 w-14" />
                    : <h2 className="text-3xl font-bold">{upcomingSessions}
                    </h2>}
                  <p className="text-xs text-gray-500">Upcoming this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="bg-amber-100 rounded-md p-2 mr-4">
                  <BookOpen className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Assignments
                  </p>
                  {isLoadingStats
                    ? <Skeleton className="h-7 w-14" />
                    : (
                      <h2 className="text-3xl font-bold">
                        {pendingAssignments}
                      </h2>
                    )}
                  <p className="text-xs text-gray-500">Pending review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleNavToStudentNotes}
          >
            <Users className="h-6 w-6" />
            <span>Student Notes</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleNavToCurriculum}
          >
            <BookOpen className="h-6 w-6" />
            <span>Curriculum</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleNavToReports}
          >
            <BarChart className="h-6 w-6" />
            <span>Reports</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleNavToScheduling}
          >
            <CalendarIcon className="h-6 w-6" />
            <span>Scheduling</span>
          </Button>
        </div>

        {/* Tutor CRM Access */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-700">Tutor CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access the Tutor CRM to manage students, parent relationships,
                and track tutoring sessions.
              </p>
              <Button
                className="bg-brightpair hover:bg-brightpair-600"
                onClick={() => navigate("/tutor/dashboard")}
              >
                Open Tutor Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <div className="mt-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Students</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <StudentManagement />
            </TabsContent>

            <TabsContent value="calendar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingSessionsData.length === 0
                          ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                              <CalendarX2 className="h-10 w-10 mb-2" />
                              <p>No sessions scheduled yet.</p>
                            </div>
                          )
                          : (
                            (upcomingSessionsData as any).map(
                              (session: any) => {
                                const start = new Date(session.starts_at);
                                const dateStr = start.toLocaleDateString();
                                const timeStr = start.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                                return (
                                  <div
                                    key={session.id}
                                    className="flex justify-between items-center p-3 rounded-md border border-gray-200"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {session.student_id}
                                      </p>
                                      <div className="flex items-center mt-1 text-sm text-gray-500">
                                        <BookOpen className="h-3.5 w-3.5 mr-1" />
                                        <span>
                                          {session.learning_tracks?.name ?? ""}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                      <p>{dateStr}</p>
                                      <p>{timeStr}</p>
                                    </div>
                                  </div>
                                );
                              },
                            )
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
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

export default TeacherDashboard;
