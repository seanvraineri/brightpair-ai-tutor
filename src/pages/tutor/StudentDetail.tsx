import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, FileText, MessageSquare, BookOpen, Plus, Edit2, Clock, Upload, PenTool } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [student, setStudent] = useState({
    id: studentId || 'student-1',
    name: "Emma Johnson",
    grade: "8th Grade",
    subjects: ["Math", "Science", "English"],
    avatar: "/avatars/student1.png",
    enrollmentDate: "September 2022",
    nextSession: "May 12, 2023 - 4:00 PM",
    parentName: "Alex Johnson",
    parentEmail: "alex.johnson@example.com",
    parentPhone: "(555) 123-4567"
  });
  
  // Mock homework data - would be fetched from API in a real app
  const [homeworkAssignments, setHomeworkAssignments] = useState([
    {
      id: "1",
      title: "Algebra Equations Practice",
      subject: "Math",
      description: "Complete 10 algebraic equations using the substitution method.",
      assignedDate: "May 2, 2023",
      dueDate: "May 9, 2023",
      status: "completed",
      grade: "95%",
      feedback: "Excellent work! All equations solved correctly with proper work shown."
    },
    {
      id: "2",
      title: "Scientific Method Analysis",
      subject: "Science",
      description: "Write a one-page analysis of the scientific method applied to the experiment we conducted in our last session.",
      assignedDate: "May 4, 2023",
      dueDate: "May 11, 2023",
      status: "in-progress",
      grade: null,
      feedback: null
    },
    {
      id: "3",
      title: "English Vocabulary Quiz",
      subject: "English",
      description: "Complete the vocabulary quiz covering the words from our most recent reading assignment.",
      assignedDate: "May 7, 2023",
      dueDate: "May 14, 2023",
      status: "not-started",
      grade: null,
      feedback: null
    }
  ]);
  
  // Mock session data
  const [sessions, setSessions] = useState([
    {
      id: "1",
      date: "May 5, 2023",
      time: "4:00 PM - 5:30 PM",
      subject: "Math",
      topic: "Algebraic Equations",
      notes: "Focused on solving systems of equations. Emma showed good understanding of the substitution method.",
      completed: true
    },
    {
      id: "2",
      date: "May 12, 2023",
      time: "4:00 PM - 5:30 PM",
      subject: "Science",
      topic: "Scientific Method Practice",
      notes: "",
      completed: false
    }
  ]);
  
  // Get data from API in a real application
  useEffect(() => {
    // Fetch student data, homework, sessions from API
    const fetchStudentData = async () => {
      // Example API call
      // const { data, error } = await supabase
      //   .from('students')
      //   .select('*')
      //   .eq('id', studentId)
      //   .single();
      
      // if (data) setStudent(data);
    };
    
    fetchStudentData();
    
    // Check for tab parameter in URL
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'homework', 'sessions', 'progress', 'notes'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [studentId]);
  
  const handleAssignHomework = () => {
    navigate(`/tutor/homework/create?studentId=${studentId}`);
  };
  
  const handleViewHomework = (homeworkId) => {
    navigate(`/tutor/homework/view/${homeworkId}`);
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  const handleContactParent = () => {
    // In a real app, this would open a messaging form or redirect to messaging
    toast({
      title: "Contact Parent",
      description: "Messaging functionality coming soon!",
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>;
      case "not-started":
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNavigateToAssignments = () => {
    if (studentId) {
      navigate(`/tutor/student/${studentId}/assignments`);
    }
  };

  // Force browser to reload the component (added to help with caching issues)
  useEffect(() => {
    // This is a dummy effect to help with hot reloading
    console.log("StudentDetail component loaded/reloaded");
  }, []);
  
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 px-4">
        {/* Header with back button */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="gap-1"
            onClick={() => navigate('/tutor/dashboard')}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
        
        {/* Student Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={`/avatars/default.png`} alt={student.name} onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold">{student.name}</h1>
                <p className="text-gray-500">{student.grade} • {student.subjects.join(", ")}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={handleContactParent}
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact Parent
                </Button>
                <Button className="gap-1 bg-brightpair hover:bg-brightpair-600">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Enrolled Since</p>
                  <p>{student.enrollmentDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Next Session</p>
                  <p>{student.nextSession}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Parent Contact</p>
                  <p>{student.parentName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full mt-8"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-3xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="assignments" onClick={handleNavigateToAssignments}>Assignments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Student Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Current Focus Areas</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Algebraic expressions and equations</li>
                        <li>Scientific method and experimentation</li>
                        <li>Advanced vocabulary and reading comprehension</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Recent Progress</h3>
                      <p>Emma has shown significant improvement in algebraic problem-solving, increasing test scores by 15% in the last month. Still working on scientific writing skills.</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Upcoming Goals</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Master systems of equations by end of month</li>
                        <li>Complete science fair project proposal</li>
                        <li>Improve essay organization and structure</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" onClick={handleAssignHomework}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Assign Work
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Session
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleContactParent}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Parent
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Parent Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p>{student.parentName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p>{student.parentEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p>{student.parentPhone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Homework Tab - Renamed to Assignments */}
          <TabsContent value="homework">
            <div className="space-y-8">
              {/* Header with back button */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Assignments for {student.name}</h1>
                  <p className="text-gray-500">Manage and track assignments</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/tutor/dashboard?tab=students')}
                >
                  Back to All Students
                </Button>
              </div>
              
              {/* Assignment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="col-span-3">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Assignment Progress</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{homeworkAssignments.filter(hw => hw.status === "completed").length} of {homeworkAssignments.length} completed</span>
                        <span className="font-medium">
                          {Math.round((homeworkAssignments.filter(hw => hw.status === "completed").length / homeworkAssignments.length) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-brightpair h-2.5 rounded-full" 
                        style={{ width: `${(homeworkAssignments.filter(hw => hw.status === "completed").length / homeworkAssignments.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          <span className="text-gray-500">Next Session:</span> {student.nextSession}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">{homeworkAssignments.filter(hw => hw.status !== "completed").length} pending assignments</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* New Assignment Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Assign New Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" className="mt-1" placeholder="Assignment title" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="due-date">Due Date</Label>
                      <Input id="due-date" className="mt-1" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="instructions">Instructions (Optional)</Label>
                      <Textarea id="instructions" className="mt-1" placeholder="Brief instructions" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button className="bg-brightpair hover:bg-brightpair-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Task
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Assignments */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>
                <div className="space-y-4">
                  {homeworkAssignments.map((assignment) => (
                    <Card key={assignment.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-lg">{assignment.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{assignment.subject}</p>
                            </div>
                            <Badge 
                              className={
                                assignment.status === "completed" ? "bg-green-100 text-green-800" :
                                assignment.status === "in-progress" ? "bg-amber-100 text-amber-800" :
                                "bg-gray-100 text-gray-800"
                              }
                            >
                              {assignment.status === "completed" ? "Completed" :
                               assignment.status === "in-progress" ? "In Progress" :
                               "Not Started"}
                            </Badge>
                          </div>
                          <div className="mt-3 text-sm">
                            <p><span className="text-gray-500">Due:</span> {assignment.dueDate}</p>
                            {assignment.description && (
                              <p className="mt-2 text-gray-700">{assignment.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-5 flex flex-row md:flex-col justify-end items-center gap-2 md:w-48">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewHomework(assignment.id)}
                            className="w-full"
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full"
                          >
                            Mark Complete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Advanced Assignment Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Create</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate(`/tutor/homework/create?studentId=${studentId}&template=math`)}
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      Math Assignment
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate(`/tutor/homework/create?studentId=${studentId}&template=reading`)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Reading Assignment
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate(`/tutor/homework/create?studentId=${studentId}&template=vocabulary`)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Vocabulary Practice
                    </Button>
                    <Button 
                      className="mt-4 w-full bg-brightpair hover:bg-brightpair-600"
                      onClick={handleAssignHomework}
                    >
                      Advanced Creator
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <p className="text-2xl font-bold">
                          {Math.round((homeworkAssignments.filter(hw => hw.status === "completed").length / homeworkAssignments.length) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Average Grade</p>
                        <p className="text-2xl font-bold">
                          {homeworkAssignments.filter(hw => hw.grade).length > 0 ? 
                            `${Math.round(homeworkAssignments.filter(hw => hw.grade).reduce((acc, hw) => acc + parseInt(hw.grade), 0) / 
                            homeworkAssignments.filter(hw => hw.grade).length)}%` :
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">On-time Submission</p>
                        <p className="text-2xl font-bold">100%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed rounded-md p-4 mb-4 flex flex-col items-center justify-center text-center">
                      <Upload className="h-6 w-6 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Drag & drop or</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1"
                      >
                        Browse Files
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload PDF, Word, or image files to convert to assignments. Maximum size: 10MB
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Tutorial Sessions</CardTitle>
                  <Button className="bg-brightpair hover:bg-brightpair-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
                <CardDescription>
                  Past and upcoming sessions with {student.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Upcoming Sessions */}
                  <div>
                    <h3 className="font-medium mb-3">Upcoming Sessions</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.filter(session => !session.completed).map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>{session.date}</TableCell>
                            <TableCell>{session.time}</TableCell>
                            <TableCell>{session.subject}</TableCell>
                            <TableCell>{session.topic}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline">
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Past Sessions */}
                  <div>
                    <h3 className="font-medium mb-3">Past Sessions</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.filter(session => session.completed).map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>{session.date}</TableCell>
                            <TableCell>{session.time}</TableCell>
                            <TableCell>{session.subject}</TableCell>
                            <TableCell>{session.topic}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  View Notes
                                </Button>
                                <Button size="sm" variant="outline">
                                  Copy
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>
                  Track {student.name}'s academic progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-center text-gray-500 py-12">Progress charts and performance analytics coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Session Notes</CardTitle>
                  <Button className="bg-brightpair hover:bg-brightpair-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
                <CardDescription>
                  Notes and observations from tutorial sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-center text-gray-500 py-12">Detailed session notes and observations coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}; // Force page reload on Mon May 12 16:13:33 EDT 2025
