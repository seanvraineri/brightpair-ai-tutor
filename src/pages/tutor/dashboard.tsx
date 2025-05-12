import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { BookOpen, Users, Clock, Calendar, Brain, Plus, AlertCircle, Search, MoreHorizontal, LogOut } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Interface for Student type, matching the one in StudentTable component
interface Student {
  id: string;
  full_name: string;
  grade_level: string;
  subject: string;
  status: 'active' | 'inactive';
  last_session_date: string | null;
}

// Mock data for development purposes
const MOCK_STUDENTS: Student[] = [
  {
    id: 'student-1',
    full_name: 'Alex Johnson',
    grade_level: '8th',
    subject: 'Mathematics',
    status: 'active',
    last_session_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'student-2',
    full_name: 'Samantha Lee',
    grade_level: '10th',
    subject: 'English',
    status: 'active',
    last_session_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'student-3',
    full_name: 'Michael Chen',
    grade_level: '6th',
    subject: 'Science',
    status: 'inactive',
    last_session_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const StudentTable = ({ 
  students, 
  onRowClick, 
  onSearch 
}: { 
  students: Student[]; 
  onRowClick?: (id: string) => void;
  onSearch?: (query: string) => void;
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (onSearch) {
      onSearch(query);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search students..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Button
          onClick={() => navigate('/tutor/students/onboard')}
          className="bg-brightpair hover:bg-brightpair-600"
        >
          Add Student
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Grade & Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Session</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-brightpair-100 text-brightpair">
                        <AvatarFallback>{getInitials(student.full_name)}</AvatarFallback>
                      </Avatar>
                      <span 
                        className="font-medium cursor-pointer hover:text-brightpair"
                        onClick={() => onRowClick && onRowClick(student.id)}
                      >
                        {student.full_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{student.grade_level} Grade</span>
                      <span className="text-sm text-gray-500">{student.subject}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={`${
                        student.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(student.last_session_date)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onRowClick && onRowClick(student.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Add Session
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Generate Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const TutorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = window.location;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");
  const [tutorName, setTutorName] = useState('Dr. Michael Chen');
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0
  });
  
  // Check for tab parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // For development purposes, use mock data
        // In production, this would fetch from Supabase
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStudents(MOCK_STUDENTS);
        
        // Calculate stats
        setStats({
          totalStudents: MOCK_STUDENTS.length,
          activeSessions: 1,
          upcomingSessions: 5,
          completedSessions: 12
        });
        
        // Set a default tutor name for development
        setTutorName('Dr. Michael Chen');
        
        /*
        // Production code would look something like this:
        
        // Get auth user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        // Fetch tutor profile
        const { data: tutorData, error: tutorError } = await supabase
          .from('tutors')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (tutorError) throw tutorError;
        setTutorName(tutorData.full_name);
        
        // Fetch students from the student_profiles table
        const { data: studentData, error: studentError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('tutor_id', user.id);
          
        if (studentError) throw studentError;
        
        // Format student data
        const formattedStudents = studentData.map(student => ({
          id: student.id,
          full_name: student.full_name,
          grade_level: student.grade_level,
          subject: student.subject,
          status: student.status,
          last_session_date: student.last_session_date
        }));
        
        setStudents(formattedStudents);
        
        // Get session stats
        const { data: sessionStats, error: sessionError } = await supabase
          .from('tutor_sessions')
          .select('*')
          .eq('tutor_id', user.id);
          
        if (sessionError) throw sessionError;
        
        // Calculate stats
        const today = new Date();
        const upcomingSessions = sessionStats ? sessionStats.filter(session => 
          new Date(session.session_date) > today
        ).length : 0;
        
        const completedSessions = sessionStats ? sessionStats.filter(session => 
          new Date(session.session_date) < today
        ).length : 0;
        
        setStats({
          totalStudents: formattedStudents.length,
          activeSessions: 0, // Would get from active sessions table
          upcomingSessions,
          completedSessions
        });
        */
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);
  
  const navigateToStudentDetail = (studentId: string) => {
    navigate(`/tutor/student/${studentId}`);
  };
  
  const navigateToNewStudent = () => {
    navigate('/tutor/students/new');
  };
  
  const handleCreateMessage = (parentId?: string, studentId?: string) => {
    const url = new URL('/tutor/messages/new', window.location.origin);
    if (parentId) url.searchParams.set('parentId', parentId);
    if (studentId) url.searchParams.set('studentId', studentId);
    navigate(url.toString());
  };
  
  const handleShareReport = (studentId: string) => {
    navigate(`/tutor/reports/share?studentId=${studentId}`);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      // Reset to all students if query is empty
      setStudents(MOCK_STUDENTS);
      return;
    }
    
    const filtered = MOCK_STUDENTS.filter(student => 
      student.full_name.toLowerCase().includes(query.toLowerCase()) ||
      student.subject.toLowerCase().includes(query.toLowerCase()) ||
      student.grade_level.toLowerCase().includes(query.toLowerCase())
    );
    
    setStudents(filtered);
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-brightpair-100 flex items-center justify-center text-brightpair">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                <p className="text-3xl font-bold">{stats.activeSessions}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Clock className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming Sessions</p>
                <p className="text-3xl font-bold">{stats.upcomingSessions}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Sessions</p>
                <p className="text-3xl font-bold">{stats.completedSessions}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Brain className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Alert for onboarding */}
        <Alert className="bg-amber-50 text-amber-800 border-amber-200 mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {stats.totalStudents - stats.activeSessions} students who need to be onboarded. 
            <Button variant="link" className="p-0 ml-2 text-amber-800 h-auto" onClick={() => navigate('/tutor/students/onboard')}>
              Onboard now
            </Button>
          </AlertDescription>
        </Alert>
        
        {/* Main Content Tabs - Remove Homework tab */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full justify-center">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="parents">Parent Communication</TabsTrigger>
          </TabsList>
          
          {/* Tab Contents... */}
          
          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Students</CardTitle>
                  <div className="space-x-2">
                    <Button onClick={() => navigate('/tutor/students/onboard')} className="bg-brightpair hover:bg-brightpair-600">
                      <Plus className="h-4 w-4 mr-2" />
                      New Student
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Manage your students and their learning progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudentTable 
                  students={students} 
                  onRowClick={navigateToStudentDetail} 
                  onSearch={handleSearch}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Alex Johnson</TableCell>
                      <TableCell>Tomorrow</TableCell>
                      <TableCell>4:30 PM</TableCell>
                      <TableCell>60 min</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Confirmed
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Samantha Lee</TableCell>
                      <TableCell>Thursday</TableCell>
                      <TableCell>3:00 PM</TableCell>
                      <TableCell>45 min</TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          Pending
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No reports generated yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Parents Tab */}
          <TabsContent value="parents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Parent Communication Hub</CardTitle>
                  <Button 
                    className="bg-brightpair hover:bg-brightpair-600"
                    onClick={() => handleCreateMessage()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </div>
                <CardDescription>
                  Manage your communication with parents - send messages, share reports, and track interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Parent Communications Summary */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 bg-white">
                      <h3 className="font-medium mb-2">Recent Messages</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Alex Johnson (Emma's father)</span>
                          <span className="text-gray-500">2 days ago</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Madison Johnson (Emma's mother)</span>
                          <span className="text-gray-500">1 week ago</span>
                        </div>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-brightpair p-0 h-auto mt-3"
                        onClick={() => navigate('/tutor/messages')}
                      >
                        View all messages
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-white">
                      <h3 className="font-medium mb-2">Report Shares</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Progress Report - Emma Johnson</span>
                          <Badge className="bg-green-100 text-green-800">Viewed</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Monthly Report - Noah Williams</span>
                          <Badge variant="outline">Not Viewed</Badge>
                        </div>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-brightpair p-0 h-auto mt-3"
                        onClick={() => navigate('/tutor/reports')}
                      >
                        Manage report sharing
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-white">
                      <h3 className="font-medium mb-2">Message Templates</h3>
                      <div className="space-y-2">
                        <p className="text-sm">Save time with pre-built templates for common communications.</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full justify-start mt-2"
                          onClick={() => handleCreateMessage()}
                        >
                          Progress Update
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => handleCreateMessage()}
                        >
                          Homework Reminder
                        </Button>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-brightpair p-0 h-auto mt-3"
                        onClick={() => navigate('/tutor/messages/templates')}
                      >
                        Create template
                      </Button>
                    </div>
                  </div>
                  
                  {/* Parent Contact List */}
                  <div>
                    <h3 className="font-medium mb-3">Parent Contacts</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parent Name</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Relationship</TableHead>
                          <TableHead>Last Contact</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Alex Johnson</TableCell>
                          <TableCell>Emma Johnson</TableCell>
                          <TableCell>Father</TableCell>
                          <TableCell>2 days ago</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCreateMessage('parent-1', 'student-1')}
                              >
                                Message
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleShareReport('student-1')}
                              >
                                Share Report
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Madison Johnson</TableCell>
                          <TableCell>Emma Johnson</TableCell>
                          <TableCell>Mother</TableCell>
                          <TableCell>1 week ago</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCreateMessage('parent-2', 'student-1')}
                              >
                                Message
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleShareReport('student-1')}
                              >
                                Share Report
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Taylor Williams</TableCell>
                          <TableCell>Noah Williams</TableCell>
                          <TableCell>Mother</TableCell>
                          <TableCell>2 weeks ago</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCreateMessage('parent-3', 'student-2')}
                              >
                                Message
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleShareReport('student-2')}
                              >
                                Share Report
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TutorDashboard; 