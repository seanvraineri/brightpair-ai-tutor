import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  FilterX,
  MailIcon,
  MessagesSquare,
  Plus,
  Search,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { IS_DEVELOPMENT } from "@/config/env";
import { Skeleton } from "@/components/ui/skeleton";

import StudentNotes from "./StudentNotes";

// Development-only mock data (replace with live queries)
const mockStudents = IS_DEVELOPMENT
  ? [
    {
      id: "1",
      name: "Alex Smith",
      grade: "9th",
      subjects: ["Mathematics", "Science"],
      email: "alex.smith@email.com",
      progress: 72,
      pendingAssignments: 2,
      lastSession: "2023-06-10",
      nextSession: "2023-06-17",
      avatarUrl: "",
    },
    {
      id: "2",
      name: "Jamie Johnson",
      grade: "10th",
      subjects: ["English", "History"],
      email: "jamie.johnson@email.com",
      progress: 85,
      pendingAssignments: 0,
      lastSession: "2023-06-12",
      nextSession: "2023-06-19",
      avatarUrl: "",
    },
    {
      id: "3",
      name: "Taylor Brown",
      grade: "8th",
      subjects: ["Mathematics", "Computer Science"],
      email: "taylor.brown@email.com",
      progress: 68,
      pendingAssignments: 3,
      lastSession: "2023-06-08",
      nextSession: "2023-06-15",
      avatarUrl: "",
    },
    {
      id: "4",
      name: "Jordan Lee",
      grade: "11th",
      subjects: ["Physics", "Chemistry"],
      email: "jordan.lee@email.com",
      progress: 90,
      pendingAssignments: 1,
      lastSession: "2023-06-11",
      nextSession: "2023-06-18",
      avatarUrl: "",
    },
  ]
  : [];

// Development-only mock assignments
const mockAssignments = IS_DEVELOPMENT
  ? [
    {
      id: "a1",
      studentId: "1",
      title: "Algebra Practice Set",
      dueDate: "2023-06-18",
      subject: "Mathematics",
      status: "pending",
    },
    {
      id: "a2",
      studentId: "1",
      title: "Cell Structure Quiz",
      dueDate: "2023-06-20",
      subject: "Science",
      status: "pending",
    },
    {
      id: "a3",
      studentId: "3",
      title: "Algorithm Efficiency Exercise",
      dueDate: "2023-06-16",
      subject: "Computer Science",
      status: "pending",
    },
    {
      id: "a4",
      studentId: "3",
      title: "Quadratic Equations Worksheet",
      dueDate: "2023-06-19",
      subject: "Mathematics",
      status: "pending",
    },
    {
      id: "a5",
      studentId: "3",
      title: "Pseudocode Practice",
      dueDate: "2023-06-22",
      subject: "Computer Science",
      status: "pending",
    },
    {
      id: "a6",
      studentId: "4",
      title: "Newton's Laws Lab Report",
      dueDate: "2023-06-19",
      subject: "Physics",
      status: "pending",
    },
  ]
  : [];

const gradeOptions = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const subjectOptions = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
];

const StudentManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);

  // New student form state
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    grade: "",
    subjects: [] as string[],
  });

  // New assignment form state
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subject: "",
    dueDate: "",
    instructions: "",
  });

  // Loading flag placeholder
  const isLoading = !IS_DEVELOPMENT;

  // Filter students based on search and filters
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = !filterGrade || filterGrade === "all" ||
      student.grade === filterGrade;
    const matchesSubject = !filterSubject || filterSubject === "all" ||
      student.subjects.includes(filterSubject);

    return matchesSearch && matchesGrade && matchesSubject;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterGrade("all");
    setFilterSubject("all");
  };

  const handleAddStudent = () => {
    // In production, this would call an API to add the student
    toast({
      title: "Student added",
      description: `${newStudent.name} has been added to your student list.`,
    });

    // Reset form and close dialog
    setNewStudent({
      name: "",
      email: "",
      grade: "",
      subjects: [],
    });
    setIsAddStudentDialogOpen(false);
  };

  const handleAddAssignment = () => {
    if (!selectedStudent) return;

    // In production, this would call an API to add the assignment
    toast({
      title: "Assignment created",
      description: `Assignment "${newAssignment.title}" has been assigned.`,
    });

    // Reset form
    setNewAssignment({
      title: "",
      subject: "",
      dueDate: "",
      instructions: "",
    });
  };

  const handleSubjectChange = (value: string) => {
    if (!newStudent.subjects.includes(value)) {
      setNewStudent({
        ...newStudent,
        subjects: [...newStudent.subjects, value],
      });
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setNewStudent({
      ...newStudent,
      subjects: newStudent.subjects.filter((s) => s !== subject),
    });
  };

  const getPendingAssignmentsForStudent = (studentId: string) => {
    return mockAssignments.filter((assignment) =>
      assignment.studentId === studentId
    );
  };

  const getStudentById = (id: string) => {
    return mockStudents.find((student) => student.id === id);
  };

  const renderStudentTable = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }
    if (filteredStudents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <UserPlus className="h-10 w-10 mb-2" />
          <p>No students match your filters.</p>
        </div>
      );
    }
    // existing UI rendering list later relies on filteredStudents map; keep existing rendering call site as is.
    return null;
  };

  return (
    <div className="min-h-[80vh] py-8 px-2">
      <div className="w-full max-w-4xl ml-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold text-center md:text-left">
            Student Management
          </h2>
          <Button onClick={() => setIsAddStudentDialogOpen(true)}>
            <UserPlus size={16} className="mr-2" />
            Add New Student
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="students">Student List</TabsTrigger>
            <TabsTrigger value="notes">Student Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  Manage your students and track their progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search students..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select value={filterGrade} onValueChange={setFilterGrade}>
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filterSubject}
                    onValueChange={setFilterSubject}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjectOptions.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(searchQuery || filterGrade || filterSubject) && (
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                      className="flex-shrink-0"
                    >
                      <FilterX size={16} className="mr-2" />
                      Reset
                    </Button>
                  )}
                </div>

                <div className="mt-6">
                  {renderStudentTable()}
                </div>
              </CardContent>
            </Card>

            {selectedStudent && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>
                      Assignments for {getStudentById(selectedStudent)?.name}
                    </CardTitle>
                    <CardDescription>
                      Manage and track assignments
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Back to All Students
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md space-y-4">
                      <h4 className="font-medium">Assign New Task</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="assignment-title">Title</Label>
                          <Input
                            id="assignment-title"
                            value={newAssignment.title}
                            onChange={(e) =>
                              setNewAssignment({
                                ...newAssignment,
                                title: e.target.value,
                              })}
                            placeholder="Assignment title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="assignment-subject">Subject</Label>
                          <Select
                            value={newAssignment.subject}
                            onValueChange={(value) =>
                              setNewAssignment({
                                ...newAssignment,
                                subject: value,
                              })}
                          >
                            <SelectTrigger id="assignment-subject">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {getStudentById(selectedStudent)?.subjects.map(
                                (subject) => (
                                  <SelectItem key={subject} value={subject}>
                                    {subject}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="assignment-due-date">Due Date</Label>
                          <Input
                            id="assignment-due-date"
                            type="date"
                            value={newAssignment.dueDate}
                            onChange={(e) =>
                              setNewAssignment({
                                ...newAssignment,
                                dueDate: e.target.value,
                              })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="assignment-instructions">
                            Instructions (Optional)
                          </Label>
                          <Input
                            id="assignment-instructions"
                            value={newAssignment.instructions}
                            onChange={(e) =>
                              setNewAssignment({
                                ...newAssignment,
                                instructions: e.target.value,
                              })}
                            placeholder="Brief instructions"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-2">
                        <Button onClick={handleAddAssignment}>
                          <Plus size={16} className="mr-2" />
                          Assign Task
                        </Button>
                      </div>
                    </div>

                    <h4 className="font-medium">Current Assignments</h4>
                    {getPendingAssignmentsForStudent(selectedStudent).length ===
                        0
                      ? (
                        <div className="text-gray-500 text-center py-4">
                          No pending assignments
                        </div>
                      )
                      : (
                        <div className="space-y-2">
                          {getPendingAssignmentsForStudent(selectedStudent).map(
                            (assignment) => (
                              <Card key={assignment.id} className="shadow-sm">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h5 className="font-medium">
                                        {assignment.title}
                                      </h5>
                                      <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <Badge
                                          variant="outline"
                                          className="mr-2"
                                        >
                                          {assignment.subject}
                                        </Badge>
                                        <span>Due: {assignment.dueDate}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm">
                                        <CheckCircle
                                          size={16}
                                          className="mr-2"
                                        />
                                        Mark Complete
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ),
                          )}
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notes">
            <StudentNotes />
          </TabsContent>
        </Tabs>
      </div>
      {/* Add Student Dialog */}
      <Dialog
        open={isAddStudentDialogOpen}
        onOpenChange={setIsAddStudentDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the details of the student you want to add to your
              management dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">Full Name</Label>
              <Input
                id="student-name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="Student's full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-email">Email Address</Label>
              <Input
                id="student-email"
                type="email"
                value={newStudent.email}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="student@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-grade">Grade Level</Label>
              <Select
                value={newStudent.grade}
                onValueChange={(value) =>
                  setNewStudent({ ...newStudent, grade: value })}
              >
                <SelectTrigger id="student-grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-subjects">Subjects</Label>
              <Select onValueChange={handleSubjectChange}>
                <SelectTrigger id="student-subjects">
                  <SelectValue placeholder="Add subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-1 mt-2">
                {newStudent.subjects.map((subject) => (
                  <Badge
                    key={subject}
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {subject}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() => handleRemoveSubject(subject)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddStudentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagement;
