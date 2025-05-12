import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ChevronDown, 
  MoreHorizontal, 
  Search, 
  Calendar, 
  FileText, 
  Archive, 
  Mail, 
  BookOpen 
} from 'lucide-react';

export interface Student {
  id: string;
  full_name: string;
  grade_level: string;
  subject: string;
  status: 'active' | 'inactive';
  last_session_date: string | null;
}

interface StudentTableProps {
  students: Student[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  onRowClick?: (studentId: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ 
  students, 
  isLoading = false,
  onSearch,
  onRowClick
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (onSearch) {
      onSearch(query);
    }
  };
  
  const handleViewStudent = (studentId: string) => {
    if (onRowClick) {
      onRowClick(studentId);
    } else {
      navigate(`/tutor/student/${studentId}`);
    }
  };
  
  const handleAddSession = (studentId: string) => {
    // Navigate to add session page (to be implemented)
    navigate(`/tutor/student/${studentId}?tab=sessions`);
  };
  
  const handleManageAssignments = (studentId: string) => {
    // Navigate directly to the dedicated assignments page
    navigate(`/tutor/student/${studentId}/assignments`);
  };
  
  const handleGenerateReport = (studentId: string) => {
    // Navigate to generate report page (to be implemented)
    navigate(`/tutor/student/${studentId}?tab=progress`);
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
  
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-[240px] h-10 bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-[180px] bg-gray-200 animate-pulse rounded" />
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
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
                      <div className="w-[150px] h-5 bg-gray-300 animate-pulse rounded" />
                    </div>
                  </TableCell>
                  <TableCell><div className="w-[120px] h-5 bg-gray-300 animate-pulse rounded" /></TableCell>
                  <TableCell><div className="w-[60px] h-5 bg-gray-300 animate-pulse rounded" /></TableCell>
                  <TableCell><div className="w-[80px] h-5 bg-gray-300 animate-pulse rounded" /></TableCell>
                  <TableCell className="text-right">
                    <div className="w-[80px] h-8 bg-gray-300 animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
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
                        onClick={() => handleViewStudent(student.id)}
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
                        <DropdownMenuItem onClick={() => handleViewStudent(student.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAddSession(student.id)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Add Session
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageAssignments(student.id)}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Assignments
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGenerateReport(student.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Parent
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Archive className="mr-2 h-4 w-4" />
                          Archive Student
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

export default StudentTable; 