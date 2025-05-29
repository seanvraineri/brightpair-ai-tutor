import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, PlusCircle, Search, User } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import {
  getStudentsForTutor,
  searchStudents,
  type Student,
} from "@/services/studentService";
import { logger } from "@/services/logger";

interface Metrics {
  totalStudents: number;
  activeStudents: number;
  lessonsThisWeek: number;
  upcomingHomework: number;
}

export default function TutorDashboard() {
  const navigate = useNavigate();
  const { session } = useUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalStudents: 0,
    activeStudents: 0,
    lessonsThisWeek: 0,
    upcomingHomework: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, [session?.user?.id]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const tutorId = session?.user?.id;
      if (!tutorId) {
        logger.warn("No tutor ID available");
        return;
      }

      const fetchedStudents = await getStudentsForTutor(tutorId);
      setStudents(fetchedStudents);

      // Update metrics
      setMetrics({
        totalStudents: fetchedStudents.length,
        activeStudents: fetchedStudents.length, // All students are considered active for now
        lessonsThisWeek: Math.floor(Math.random() * 10) + 5, // Placeholder
        upcomingHomework: Math.floor(Math.random() * 5) + 2, // Placeholder
      });
    } catch (error) {
      logger.error("Failed to fetch students", error);
      setError("Failed to load students. Please try again.");
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await fetchStudents();
      return;
    }

    try {
      setIsLoading(true);
      const tutorId = session?.user?.id;
      const results = await searchStudents(searchQuery, tutorId);
      setStudents(results);
    } catch (error) {
      logger.error("Search failed", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Manage your students and track their progress.
          </p>
        </div>
        <Button
          onClick={() => navigate("/tutor/students/new")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeStudents} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeStudents}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lessons This Week
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.lessonsThisWeek}</div>
            <p className="text-xs text-muted-foreground">Across all students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Homework
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.upcomingHomework}
            </div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Students</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-4 py-2 w-64"
                />
              </div>
              <Button onClick={handleSearch} size="sm">
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          )}

          {isLoading
            ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900">
                </div>
                <p className="text-gray-600 mt-2">Loading students...</p>
              </div>
            )
            : students.length === 0
            ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {searchQuery
                    ? "No students found matching your search."
                    : "No students yet. Add your first student to get started!"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => navigate("/tutor/students/new")}
                    className="mt-4"
                  >
                    Add Your First Student
                  </Button>
                )}
              </div>
            )
            : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                  <Card
                    key={student.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/tutor/students/${student.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={student.avatar}
                            alt={student.full_name}
                            className="w-12 h-12 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.full_name}`;
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{student.full_name}</h3>
                          <p className="text-sm text-gray-600">
                            Grade {student.grade_level} •{" "}
                            {student.subjects?.join(", ") || student.subject}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Last active: Today
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tutor/students/${student.id}/message`);
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/tutor/homework")}
        >
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Create Homework</h3>
            <p className="text-sm text-gray-600">
              Assign new homework to your students
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/tutor/messages")}
        >
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Send Message</h3>
            <p className="text-sm text-gray-600">
              Communicate with students and parents
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/tutor/reports")}
        >
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">View Reports</h3>
            <p className="text-sm text-gray-600">
              Track student progress and performance
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
