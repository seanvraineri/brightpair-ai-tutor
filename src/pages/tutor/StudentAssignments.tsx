import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, BookOpen, Plus, Check, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getStudentDocuments } from "@/services/userDocumentService";
import { useStudentAssignments } from "@/hooks/useStudentAssignments";

const StudentAssignments = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [studentName, setStudentName] = useState("Student");
  const { assignments, isLoading: dataLoading, error: dataError, addAssignment, completeAssignment, isCompleting } = useStudentAssignments(studentId);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  
  // Mock student data
  const mockStudents = {
    "student-1": "Alex Smith",
    "student-2": "Emma Johnson",
    "student-3": "Michael Chen"
  };
  
  // Load student data and assignments
  useEffect(() => {
    const loadData = async () => {
      try {
        setMetaLoading(true);
        
        // Set student name
        if (studentId && studentId in mockStudents) {
          setStudentName(mockStudents[studentId]);
        }
        
        // In a real app, you would load assignments from an API
        // For now, we'll just mock it with the existing assignments
        
        // Get documents - this won't be used directly but should prevent 404 errors
        if (studentId) {
          await getStudentDocuments(studentId);
        }
        
        setMetaLoading(false);
      } catch (err) {
        console.error("Error loading student data:", err);
        setMetaError("Failed to load student data. Please try again.");
        setMetaLoading(false);
      }
    };
    
    loadData();
  }, [studentId]);

  const handleAssignTask = async () => {
    if (!title || !subject || !dueDate || !studentId) return;

    await addAssignment({
      student_id: studentId,
      title,
      content_md: instructions || null,
      due_at: new Date(dueDate).toISOString(),
      status: "not-started",
    } as any);

    // Reset form inputs
    setTitle("");
    setSubject("");
    setDueDate("");
    setInstructions("");
  };

  return (
    <DashboardLayout>
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Assignments for {studentName}</h1>
            <p className="text-gray-500">Manage and track assignments</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/tutor/dashboard?tab=students')}
            className="text-sm border-gray-300"
          >
            Back to All Students
          </Button>
        </div>

        {/* Error message if any */}
        {(metaError || dataError) && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="p-4 text-red-800">
              {metaError || dataError?.message}
            </CardContent>
          </Card>
        )}

        {/* Loading indicator */}
        {metaLoading || dataLoading ? (
          <Card className="mb-6">
            <CardContent className="p-4 text-center">
              Loading assignments...
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Progress Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Assignment Progress</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{assignments.filter(a => a.status === "completed").length} of {assignments.length} completed</span>
                    <span className="font-medium">{assignments.length === 0 ? 0 : Math.round((assignments.filter(a => a.status === "completed").length / assignments.length) * 100)}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-brightpair h-2.5 rounded-full" 
                    style={{ width: `${assignments.length === 0 ? 0 : (assignments.filter(a => a.status === "completed").length / assignments.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Next Session:</span> 2023-06-15
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">{assignments.length} pending assignments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* New Assignment Form */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Assign New Task</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subject" className="mt-1">
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
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  className="bg-brightpair hover:bg-brightpair-600 text-white"
                  onClick={handleAssignTask}
                  disabled={!title || !subject || !dueDate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Task
                </Button>
              </div>
            </div>
            
            {/* Current Assignments */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>
              
              <div className="space-y-4">
                {assignments.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center text-gray-500">
                      No assignments found. Create a new assignment using the form above.
                    </CardContent>
                  </Card>
                ) : (
                  assignments.map((assignment) => (
                    <Card key={assignment.id} className="overflow-hidden border border-gray-200">
                      <div className="flex flex-row justify-between">
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-lg">{assignment.title}</h3>
                              <div className="mt-1">
                                <Badge variant="secondary" className="bg-gray-100 text-gray-800 font-normal rounded-sm">
                                  {assignment.subject}
                                </Badge>
                              </div>
                            </div>
                            <Badge className="bg-brightpair-50 text-brightpair border-brightpair-100">
                              {assignment.status === "completed" ? "Completed" : "Not Started"}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm">
                            <p><span className="text-gray-500">Due:</span> {assignment.due_at ? assignment.due_at.split("T")[0] : ""}</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 flex items-center">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="mr-2 border-gray-300"
                          >
                            View Details
                          </Button>
                          {assignment.status !== "completed" && (
                            <Button 
                              variant="outline"
                              size="sm"
                              className="flex items-center border-gray-300"
                              disabled={isCompleting}
                              onClick={() => completeAssignment(assignment.id)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments; 