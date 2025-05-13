import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  Search, 
  CheckCircle, 
  Filter, 
  Upload 
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getStudentDocuments } from "@/services/userDocumentService";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: string;
  studentId: string;
  studentName: string;
}

const TutorAssignments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock students
  const [students, setStudents] = useState([
    { id: "student-1", name: "Alex Smith", subjects: ["Mathematics", "Science"] },
    { id: "student-2", name: "Emma Johnson", subjects: ["English", "History"] },
    { id: "student-3", name: "Michael Chen", subjects: ["Mathematics", "Computer Science"] },
    { id: "student-4", name: "Jordan Lee", subjects: ["Physics", "Chemistry"] }
  ]);
  
  // Mock assignments
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Algebra Practice Set",
      subject: "Mathematics",
      dueDate: "2023-06-18",
      status: "not-started",
      studentId: "student-1",
      studentName: "Alex Smith"
    },
    {
      id: "2",
      title: "Cell Structure Quiz",
      subject: "Science",
      dueDate: "2023-06-20",
      status: "not-started",
      studentId: "student-1",
      studentName: "Alex Smith"
    },
    {
      id: "3",
      title: "Literature Analysis",
      subject: "English",
      dueDate: "2023-06-15",
      status: "completed",
      studentId: "student-2",
      studentName: "Emma Johnson"
    },
    {
      id: "4",
      title: "Algorithm Design",
      subject: "Computer Science",
      dueDate: "2023-06-22",
      status: "in-progress",
      studentId: "student-3",
      studentName: "Michael Chen"
    },
    {
      id: "5",
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "2023-06-19",
      status: "not-started",
      studentId: "student-4",
      studentName: "Jordan Lee"
    }
  ]);
  
  // Filter assignments based on search, subject, and status
  const filteredAssignments = assignments.filter(assignment => {
    const matchesTab = activeTab === "all" || 
                      (activeTab === "pending" && assignment.status !== "completed") ||
                      (activeTab === "completed" && assignment.status === "completed");
    
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assignment.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = subjectFilter === "all" || assignment.subject === subjectFilter;
    
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    
    return matchesTab && matchesSearch && matchesSubject && matchesStatus;
  });
  
  // Get unique subjects from assignments
  const subjects = Array.from(new Set(assignments.map(a => a.subject)));
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch assignments from an API
        
        // Mock loading documents to prevent 404 errors
        await getStudentDocuments("student-1");
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading assignments:", err);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleCreateAssignment = () => {
    if (!title || !subject || !dueDate || !selectedStudent) return;
    
    // Find the student
    const student = students.find(s => s.id === selectedStudent);
    if (!student) return;
    
    // Create a new assignment
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title,
      subject,
      dueDate,
      status: "not-started",
      studentId: selectedStudent,
      studentName: student.name
    };
    
    // Add to assignments
    setAssignments([...assignments, newAssignment]);
    
    // Reset form
    setTitle("");
    setSubject("");
    setDueDate("");
    setInstructions("");
    setSelectedStudent(null);
  };
  
  const handleAdvancedCreate = () => {
    navigate('/tutor/homework/create');
  };
  
  const handleViewStudentAssignments = (studentId: string) => {
    navigate(`/tutor/student/${studentId}/assignments`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">In Progress</Badge>;
      case "not-started":
        return <Badge className="bg-brightpair-50 text-brightpair border-brightpair-100">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="w-full px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-gray-500">Create and manage student assignments</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleAdvancedCreate}
              className="border-gray-300"
            >
              <FileText className="h-4 w-4 mr-2" />
              Advanced Creator
            </Button>
            <Button className="bg-brightpair hover:bg-brightpair-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Assignment List */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>All Assignments</CardTitle>
                    <CardDescription>Manage and track assignments for all students</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search assignments..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="border-gray-300">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">Loading assignments...</div>
                    ) : filteredAssignments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No assignments found. Create a new assignment using the form.
                      </div>
                    ) : (
                      filteredAssignments.map(assignment => (
                        <Card key={assignment.id} className="overflow-hidden border border-gray-200">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium text-lg">{assignment.title}</h3>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 font-normal rounded-sm">
                                      {assignment.subject}
                                    </Badge>
                                    <Badge variant="outline" className="bg-gray-50 font-normal">
                                      {assignment.studentName}
                                    </Badge>
                                  </div>
                                </div>
                                {getStatusBadge(assignment.status)}
                              </div>
                              <div className="mt-2 text-sm">
                                <p><span className="text-gray-500">Due:</span> {assignment.dueDate}</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 flex md:flex-col justify-end items-center gap-2 md:w-48">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-300"
                                onClick={() => handleViewStudentAssignments(assignment.studentId)}
                              >
                                View Details
                              </Button>
                              {assignment.status !== "completed" && (
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="w-full border-gray-300 flex items-center"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="pending" className="space-y-4">
                    {/* Same content as "all" tab but filtered by pending status */}
                    {loading ? (
                      <div className="text-center py-8">Loading assignments...</div>
                    ) : filteredAssignments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No pending assignments found.
                      </div>
                    ) : (
                      filteredAssignments.map(assignment => (
                        <Card key={assignment.id} className="overflow-hidden border border-gray-200">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium text-lg">{assignment.title}</h3>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 font-normal rounded-sm">
                                      {assignment.subject}
                                    </Badge>
                                    <Badge variant="outline" className="bg-gray-50 font-normal">
                                      {assignment.studentName}
                                    </Badge>
                                  </div>
                                </div>
                                {getStatusBadge(assignment.status)}
                              </div>
                              <div className="mt-2 text-sm">
                                <p><span className="text-gray-500">Due:</span> {assignment.dueDate}</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 flex md:flex-col justify-end items-center gap-2 md:w-48">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-300"
                                onClick={() => handleViewStudentAssignments(assignment.studentId)}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-300 flex items-center"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Complete
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="space-y-4">
                    {/* Same content as "all" tab but filtered by completed status */}
                    {loading ? (
                      <div className="text-center py-8">Loading assignments...</div>
                    ) : filteredAssignments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No completed assignments found.
                      </div>
                    ) : (
                      filteredAssignments.map(assignment => (
                        <Card key={assignment.id} className="overflow-hidden border border-gray-200">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium text-lg">{assignment.title}</h3>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 font-normal rounded-sm">
                                      {assignment.subject}
                                    </Badge>
                                    <Badge variant="outline" className="bg-gray-50 font-normal">
                                      {assignment.studentName}
                                    </Badge>
                                  </div>
                                </div>
                                {getStatusBadge(assignment.status)}
                              </div>
                              <div className="mt-2 text-sm">
                                <p><span className="text-gray-500">Due:</span> {assignment.dueDate}</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 flex md:flex-col justify-end items-center gap-2 md:w-48">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-300"
                                onClick={() => handleViewStudentAssignments(assignment.studentId)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column: Create Assignment Form */}
          <div className="space-y-6">
            {/* Quick Create Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create Assignment</CardTitle>
                <CardDescription>Create a new assignment for a student</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="student">Select Student</Label>
                  <Select value={selectedStudent || ""} onValueChange={setSelectedStudent}>
                    <SelectTrigger id="student" className="mt-1">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Assignment title" 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={subject} 
                    onValueChange={setSubject}
                    disabled={!selectedStudent}
                  >
                    <SelectTrigger id="subject" className="mt-1">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedStudent ? 
                        students
                          .find(s => s.id === selectedStudent)?.subjects
                          .map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          )) :
                        <SelectItem value="disabled" disabled>Select a student first</SelectItem>
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input 
                    id="due-date" 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instructions">Instructions (Optional)</Label>
                  <Textarea 
                    id="instructions" 
                    placeholder="Brief instructions" 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full bg-brightpair hover:bg-brightpair-600 text-white"
                    onClick={handleCreateAssignment}
                    disabled={!title || !subject || !dueDate || !selectedStudent}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* File Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Upload materials for assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-md p-4 mb-4 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag & drop files or</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300"
                  >
                    Browse Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, Word, or image files. Max 10MB.
                  </p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Recent Uploads</p>
                  <div className="text-xs text-gray-500">
                    No recent uploads
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorAssignments; 