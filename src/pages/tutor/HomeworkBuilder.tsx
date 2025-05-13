import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, FilterX, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeworkListItem } from '@/types/homework';
import { getHomeworkList, getStudents } from '@/services/homeworkService';
import HomeworkGenerator from '@/components/homework/HomeworkGenerator';
import StatusPill from '@/components/homework/StatusPill';

const HomeworkBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId?: string }>();
  
  // States
  const [homeworkList, setHomeworkList] = useState<HomeworkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>(studentId || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // Effect to load homework list
  useEffect(() => {
    fetchHomeworkList();
    fetchStudents();
  }, [statusFilter, selectedStudent]);
  
  // Fetch homework list with filters
  const fetchHomeworkList = async () => {
    setLoading(true);
    try {
      const status = statusFilter === 'all' ? undefined : statusFilter;
      const filters = {
        status: status as any,
        student_id: selectedStudent || undefined,
        search: searchQuery || undefined
      };
      
      const homework = await getHomeworkList(filters);
      setHomeworkList(homework);
    } catch (error) {
      console.error('Error fetching homework list:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch students
  const fetchStudents = async () => {
    try {
      const studentList = await getStudents();
      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    fetchHomeworkList();
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Navigate to homework detail
  const navigateToHomeworkDetail = (homeworkId: string) => {
    navigate(`/tutor/homework/${homeworkId}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setStatusFilter('all');
    setSelectedStudent('');
    setSearchQuery('');
  };
  
  // Get student name by ID
  const getStudentName = (id: string): string => {
    const student = students.find(s => s.id === id);
    return student ? student.name : `Student #${id}`;
  };

  return (
    <div className="w-full px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/tutor/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Homework Builder</h1>
        </div>
      </div>
      
      {/* Generator and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Homework Generator */}
        <div className="md:col-span-1">
          <HomeworkGenerator
            tutorId="tutor-1"
            students={students}
            defaultStudentId={selectedStudent}
            onSuccess={fetchHomeworkList}
          />
        </div>
        
        {/* Homework List */}
        <div className="md:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Homework</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  
                  {(statusFilter !== 'all' || selectedStudent || searchQuery) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={resetFilters}
                    >
                      <FilterX className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {showFilters && (
              <CardContent className="border-t pt-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                      defaultValue="all"
                    >
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="draft">Drafts</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="graded">Graded</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Select
                      value={selectedStudent || 'all'}
                      onValueChange={(val) => setSelectedStudent(val === 'all' ? '' : val)}
                      defaultValue="all"
                    >
                      <SelectTrigger id="student-filter">
                        <SelectValue placeholder="Student" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        {students.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-[2]">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Search homework..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button size="icon" onClick={handleSearch}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
          
          {/* Homework Items */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : homeworkList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No homework found. Create a new assignment using the generator.
              </div>
            ) : (
              homeworkList.map(homework => (
                <div
                  key={homework.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigateToHomeworkDetail(homework.id)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{homework.title}</h3>
                      <div className="text-sm text-gray-500">
                        {getStudentName(homework.student_id)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <StatusPill status={homework.status} />
                      
                      <div className="text-sm text-gray-500">
                        Due: {formatDate(homework.due)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeworkBuilder; 