import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeworkListItem } from '@/types/homework';
import { getHomeworkList } from '@/services/homeworkService';
import StatusPill from '@/components/homework/StatusPill';
import { Calendar, Clock } from 'lucide-react';
import { logger } from '@/services/logger';

const Homework: React.FC = () => {
  const navigate = useNavigate();
  
  // States
  const [homeworkList, setHomeworkList] = useState<HomeworkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Effect to load homework list
  useEffect(() => {
    const fetchHomework = async () => {
      setLoading(true);
      try {
        // In a real app, we would get the student ID from the user context
        const studentId = 'student-1'; 
        const homework = await getHomeworkList({ student_id: studentId });
        setHomeworkList(homework);
      } catch (error) {
      logger.debug('Caught error:', error);
        
      
    } finally {
        setLoading(false);
      }
    };
    
    fetchHomework();
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Get relative time until due date
  const getRelativeTime = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };
  
  // Navigate to homework detail
  const navigateToHomework = (id: string) => {
    navigate(`/student/homework/${id}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Homework</h1>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading homework...</div>
      ) : homeworkList.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No homework assigned yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pending homework */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
              <CardDescription>Homework that needs to be completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {homeworkList
                  .filter(hw => hw.status === 'assigned')
                  .map(homework => (
                    <div
                      key={homework.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigateToHomework(homework.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-base">{homework.title}</h3>
                          <StatusPill status={homework.status} />
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          {formatDate(homework.due)}
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span className={`${
                            getRelativeTime(homework.due) === 'Overdue' ? 'text-red-500 font-medium' : ''
                          }`}>
                            {getRelativeTime(homework.due)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                {homeworkList.filter(hw => hw.status === 'assigned').length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No pending homework!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Completed homework */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
              <CardDescription>Submitted and graded homework</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {homeworkList
                  .filter(hw => hw.status === 'submitted' || hw.status === 'graded')
                  .map(homework => (
                    <div
                      key={homework.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigateToHomework(homework.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-base">{homework.title}</h3>
                          <StatusPill status={homework.status} />
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          Submitted on {formatDate(homework.due)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                {homeworkList.filter(hw => hw.status === 'submitted' || hw.status === 'graded').length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No completed homework yet!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Homework;
