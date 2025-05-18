import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ChildInfo,
  getChildrenForParent,
  getMessagesForParent,
  ParentMessage,
} from "@/services/parentService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  LogOut,
  Mail,
  MessageSquare,
  TrendingUp,
  User,
} from "lucide-react";

interface Student {
  id: string;
  full_name: string;
  grade_level: string;
  subject: string;
  tutor_name: string;
  last_session_date: string | null;
  next_session_date: string | null;
}

interface Report {
  id: string;
  student_id: string;
  student_name: string;
  report_date: string;
  tutor_name: string;
  is_viewed: boolean;
}

interface Message {
  id: string;
  from_name: string;
  subject: string;
  content: string;
  date: string;
  is_read: boolean;
}

const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<ChildInfo[]>([]);
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [parentName, setParentName] = useState("Alex Johnson");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const parentSession = await supabase.auth.getSession();
        const parentId = parentSession.data.session?.user.id;
        if (!parentId) return;

        const children = await getChildrenForParent(parentId);
        setStudents(children);

        const msgs = await getMessagesForParent(parentId);
        setMessages(msgs);
        setUnreadCount(msgs.filter((m) => !m.is_read).length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => msg.id === messageId ? { ...msg, is_read: true } : msg)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const viewReport = (reportId: string) => {
    // In a real app, this would navigate to the report view
    // For now, just mark as viewed
    // setReports(prev =>
    //   prev.map(report =>
    //     report.id === reportId
    //       ? { ...report, is_viewed: true }
    //       : report
    //   )
    // );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center py-6 border-b">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-brightpair" />
            <span className="font-semibold text-xl">
              <span className="text-brightpair">Bright</span>Pair
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              className="hidden md:flex items-center text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>

            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-brightpair text-white">
                <AvatarFallback>{getInitials(parentName)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm hidden md:inline">
                {parentName}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="py-6 space-y-6">
          <h1 className="text-2xl font-bold">Parent Dashboard</h1>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex justify-between items-center p-6">
                <div>
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <User className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex justify-between items-center p-6">
                <div>
                  <p className="text-sm text-gray-500">Upcoming Sessions</p>
                  <p className="text-2xl font-bold">
                    {students.filter((s) => s.next_session_date).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  <Calendar className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex justify-between items-center p-6">
                <div>
                  <p className="text-sm text-gray-500">New Messages</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                  <Mail className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="students">
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="reports">Progress Reports</TabsTrigger>
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Students</CardTitle>
                  <CardDescription>
                    Overview of your student's progress and tutoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading
                    ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brightpair">
                        </div>
                      </div>
                    )
                    : students.length === 0
                    ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No students registered</p>
                      </div>
                    )
                    : (
                      <div className="space-y-4">
                        {students.map((student) => (
                          <Card key={student.id} className="overflow-hidden">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-12 w-12 bg-brightpair-100 text-brightpair text-xl">
                                    <AvatarFallback>
                                      {getInitials(student.name || "")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {student.name}
                                    </h3>
                                    <div className="text-gray-500 text-sm">
                                      {student.grade_level
                                        ? `${student.grade_level} Grade`
                                        : ""}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col space-y-2 items-end">
                                  <div className="text-sm text-gray-500">
                                    Last session:{" "}
                                    {formatDate(student.last_session_date)}
                                  </div>
                                  {student.next_session_date && (
                                    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                                      Next:{" "}
                                      {formatDate(student.next_session_date)} at
                                      {" "}
                                      {formatTime(student.next_session_date)}
                                    </Badge>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      navigate(
                                        `/parent/students/${student.id}`,
                                      )}
                                  >
                                    View Progress
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>
                    Schedule of upcoming tutoring sessions for your students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading
                    ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brightpair">
                        </div>
                      </div>
                    )
                    : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Tutor</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students
                            .filter((student) => student.next_session_date)
                            .sort((a, b) => {
                              if (
                                !a.next_session_date || !b.next_session_date
                              ) return 0;
                              return new Date(a.next_session_date).getTime() -
                                new Date(b.next_session_date).getTime();
                            })
                            .map((student) => (
                              <TableRow key={student.id}>
                                <TableCell className="font-medium">
                                  {student.name}
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {formatDate(student.next_session_date)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {formatTime(student.next_session_date)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="outline" size="sm">
                                    Add to Calendar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          {students.filter((student) =>
                                student.next_session_date
                              ).length === 0 && (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="h-24 text-center text-gray-500"
                              >
                                No upcoming sessions scheduled
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>
                      Communications from tutors and system updates
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate("/parent/messages/new")}
                    className="bg-brightpair hover:bg-brightpair-600"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    New Message
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading
                    ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brightpair">
                        </div>
                      </div>
                    )
                    : messages.length === 0
                    ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No messages yet</p>
                      </div>
                    )
                    : (
                      <div className="space-y-4">
                        {messages
                          .sort((a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                          )
                          .map((message) => (
                            <Card
                              key={message.id}
                              className={`overflow-hidden ${
                                !message.is_read
                                  ? "border-l-4 border-brightpair"
                                  : ""
                              }`}
                            >
                              <CardContent className="p-5">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h3 className="font-semibold">
                                        {message.sender_name}
                                      </h3>
                                      {!message.is_read && (
                                        <Badge className="bg-brightpair text-white">
                                          New
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                      {message.content.slice(0, 40)}
                                    </p>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDateTime(message.created_at)}
                                  </div>
                                </div>
                                <div className="mt-3 text-gray-700">
                                  <p>{message.content}</p>
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                  {!message.is_read && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        markMessageAsRead(message.id)}
                                    >
                                      Mark as Read
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                  >
                                    Reply
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Reports</CardTitle>
                  <CardDescription>
                    Student progress reports from tutors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading
                    ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brightpair">
                        </div>
                      </div>
                    )
                    : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Tutor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {
                            /* reports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.student_name}</TableCell>
                            <TableCell>{formatDate(report.report_date)}</TableCell>
                            <TableCell>{report.tutor_name}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={report.is_viewed
                                  ? "bg-gray-100 text-gray-800 border-gray-200"
                                  : "bg-brightpair-100 text-brightpair border-brightpair-200"}
                              >
                                {report.is_viewed ? 'Viewed' : 'New'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewReport(report.id)}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        )) */
                          }
                        </TableBody>
                      </Table>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
