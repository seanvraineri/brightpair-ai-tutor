import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Calendar, 
  Brain, 
  Plus, 
  Archive, 
  SendHorizontal, 
  Download,
  Mail,
  Settings
} from 'lucide-react';
import TutorNavigation from '@/components/tutor/TutorNavigation';

interface StudentDetail {
  id: string;
  full_name: string;
  grade_level: string;
  subject: string;
  status: 'active' | 'inactive';
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing' | null;
  schedule_preferences: {
    days: string[];
    timeOfDay: string;
  } | null;
  learning_goals: string | null;
  curriculum_source: string | null;
  difficulty_level: number | null;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  last_session_date: string | null;
}

interface TutorNote {
  id: string;
  student_id: string;
  tutor_id: string;
  note_content: string;
  created_at: string;
}

interface TutorSession {
  id: string;
  student_id: string;
  tutor_id: string;
  session_date: string;
  duration_minutes: number;
  summary: string | null;
  topics_covered: string[] | null;
  homework_assigned: string | null;
}

interface ProgressReport {
  id: string;
  student_id: string;
  report_date: string;
  strengths: string[];
  areas_for_improvement: string[];
  next_steps: string[];
}

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [notes, setNotes] = useState<TutorNote[]>([]);
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Get auth user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        // Fetch student details
        const { data: studentData, error: studentError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', id)
          .eq('tutor_id', user.id)
          .single();
          
        if (studentError) throw studentError;
        
        if (!studentData) {
          // Student not found or doesn't belong to this tutor
          navigate('/tutor/dashboard');
          return;
        }
        
        setStudent(studentData as StudentDetail);
        
        // Fetch notes
        const { data: notesData, error: notesError } = await supabase
          .from('tutor_notes')
          .select('*')
          .eq('student_id', id)
          .order('created_at', { ascending: false });
          
        if (notesError) throw notesError;
        
        setNotes(notesData as TutorNote[]);
        
        // Fetch sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('tutor_sessions')
          .select('*')
          .eq('student_id', id)
          .order('session_date', { ascending: false });
          
        if (sessionsError) throw sessionsError;
        
        setSessions(sessionsData as TutorSession[]);
        
        // Fetch reports
        const { data: reportsData, error: reportsError } = await supabase
          .from('student_progress_reports')
          .select('*')
          .eq('student_id', id)
          .order('report_date', { ascending: false });
          
        if (reportsError) throw reportsError;
        
        setReports(reportsData as ProgressReport[]);
        
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchStudentData();
    }
  }, [id, navigate]);
  
  const handleBackToStudents = () => {
    navigate('/tutor/dashboard');
  };
  
  const submitNote = async () => {
    if (!newNote.trim() || !student) return;
    
    try {
      setSubmittingNote(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('tutor_notes')
        .insert({
          student_id: student.id,
          tutor_id: user.id,
          note_content: newNote.trim()
        })
        .select();
        
      if (error) throw error;
      
      // Add to the list
      if (data) {
        setNotes([data[0] as TutorNote, ...notes]);
        setNewNote('');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setSubmittingNote(false);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brightpair"></div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Student Not Found</CardTitle>
            <CardDescription>
              The student you're looking for doesn't exist or you don't have access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-brightpair hover:bg-brightpair-600"
              onClick={handleBackToStudents}
            >
              Back to Students
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-6 gap-4 p-4">
        {/* Sidebar / Navigation */}
        <div className="col-span-1">
          <TutorNavigation activeItem="students" />
        </div>
        
        {/* Main Content */}
        <div className="col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToStudents}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Student Details</h1>
          </div>
          
          {/* Student Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-brightpair-100 flex items-center justify-center text-brightpair text-2xl font-bold">
                    {student.full_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{student.full_name}</h2>
                    <div className="flex items-center mt-1 space-x-4">
                      <div className="text-gray-600">{student.subject}</div>
                      <div className="text-gray-600">{student.grade_level} Grade</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" className="text-amber-600 border-amber-300 hover:bg-amber-50">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs Content */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="sessions">Session History</TabsTrigger>
              <TabsTrigger value="reports">Progress Reports</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Parent/Guardian</h4>
                        <p className="font-medium">{student.parent_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <p className="font-medium">{student.parent_email || 'Not provided'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                        <p className="font-medium">{student.parent_phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Learning Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Learning Style</h4>
                        <p className="font-medium capitalize">
                          {student.learning_style || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Difficulty Level</h4>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div 
                              key={level}
                              className={`h-2 w-8 rounded-full ${
                                level <= (student.difficulty_level || 0)
                                  ? 'bg-brightpair' 
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">
                            {student.difficulty_level || 'Not set'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Schedule Preferences</h4>
                        <p className="font-medium">
                          {student.schedule_preferences 
                            ? `${student.schedule_preferences.days.join(', ')} - ${student.schedule_preferences.timeOfDay}`
                            : 'Not specified'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Learning Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800">
                    {student.learning_goals || 'No learning goals specified for this student.'}
                  </p>
                </CardContent>
              </Card>
              
              {/* Curriculum Source */}
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800">
                    {student.curriculum_source || 'No curriculum source specified for this student.'}
                  </p>
                </CardContent>
              </Card>
              
              {/* Quick Overview of sessions/notes */}
              <div className="grid grid-cols-2 gap-4">
                {/* Recent Notes */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Notes</CardTitle>
                      <Button 
                        variant="link" 
                        className="text-brightpair"
                        onClick={() => document.querySelector('[data-value="notes"]')?.click()}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {notes.length === 0 ? (
                      <p className="text-gray-500 py-4 text-center">No notes yet</p>
                    ) : (
                      <div className="space-y-3">
                        {notes.slice(0, 3).map((note) => (
                          <div key={note.id} className="border-b pb-3">
                            <p className="text-gray-800">{note.note_content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDateTime(note.created_at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Recent Sessions */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Sessions</CardTitle>
                      <Button 
                        variant="link" 
                        className="text-brightpair"
                        onClick={() => document.querySelector('[data-value="sessions"]')?.click()}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {sessions.length === 0 ? (
                      <p className="text-gray-500 py-4 text-center">No sessions yet</p>
                    ) : (
                      <div className="space-y-3">
                        {sessions.slice(0, 3).map((session) => (
                          <div key={session.id} className="border-b pb-3">
                            <div className="flex justify-between">
                              <p className="font-medium">{formatDate(session.session_date)}</p>
                              <p className="text-sm text-gray-600">{session.duration_minutes} min</p>
                            </div>
                            <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                              {session.summary || 'No summary provided'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Notes Tab */}
            <TabsContent value="notes" className="mt-4 space-y-4">
              {/* Add New Note */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Notes</CardTitle>
                  <CardDescription>Add notes about the student's progress, behavior, or areas of focus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Enter your notes here..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button 
                      className="bg-brightpair hover:bg-brightpair-600"
                      onClick={submitNote}
                      disabled={submittingNote || !newNote.trim()}
                    >
                      <SendHorizontal className="mr-2 h-4 w-4" />
                      {submittingNote ? 'Saving...' : 'Save Note'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Notes List */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes History</CardTitle>
                  <CardDescription>
                    {notes.length} {notes.length === 1 ? 'note' : 'notes'} for {student.full_name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notes.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No notes have been added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {notes.map((note) => (
                        <div key={note.id} className="border-b pb-6">
                          <p className="text-gray-800 whitespace-pre-wrap">{note.note_content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDateTime(note.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Sessions Tab */}
            <TabsContent value="sessions" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Session History</CardTitle>
                    <CardDescription>
                      {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} with {student.full_name}
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-brightpair hover:bg-brightpair-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Session
                  </Button>
                </CardHeader>
                <CardContent>
                  {sessions.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No sessions have been recorded yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Topics Covered</TableHead>
                          <TableHead>Homework</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell className="font-medium">
                              {formatDate(session.session_date)}
                            </TableCell>
                            <TableCell>{session.duration_minutes} min</TableCell>
                            <TableCell>
                              {session.topics_covered ? (
                                <div className="flex flex-wrap gap-1">
                                  {session.topics_covered.map((topic, index) => (
                                    <span 
                                      key={index}
                                      className="bg-gray-100 px-2 py-0.5 rounded text-xs"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {session.homework_assigned || <span className="text-gray-500">-</span>}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Reports Tab */}
            <TabsContent value="reports" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Progress Reports</CardTitle>
                    <CardDescription>
                      Generate and view progress reports for {student.full_name}
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-brightpair hover:bg-brightpair-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </CardHeader>
                <CardContent>
                  {reports.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No progress reports have been generated yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Generate a report to summarize progress and provide insights
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <Card key={report.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">
                                  Progress Report - {formatDate(report.report_date)}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  Generated automatically based on session data
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mt-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Strengths</h4>
                                <ul className="space-y-1">
                                  {report.strengths.map((strength, i) => (
                                    <li key={i} className="text-sm">• {strength}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Areas for Improvement</h4>
                                <ul className="space-y-1">
                                  {report.areas_for_improvement.map((area, i) => (
                                    <li key={i} className="text-sm">• {area}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Recommended Next Steps</h4>
                                <ul className="space-y-1">
                                  {report.next_steps.map((step, i) => (
                                    <li key={i} className="text-sm">• {step}</li>
                                  ))}
                                </ul>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage; 