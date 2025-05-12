import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, ChevronRight, Calculator, Lightbulb, Dna } from 'lucide-react';

// Define the data structure for a lesson
interface Lesson {
  id: string;
  title: string;
  subject: string;
  icon: React.ReactNode;
  duration: string;
  progress: number;
  lastAccessed: string;
}

const DashboardRecentLessons: React.FC = () => {
  // Sample data
  const recentLessons: Lesson[] = [
    {
      id: '1',
      title: 'Algebra Foundations',
      subject: 'Mathematics',
      icon: <Calculator className="h-5 w-5 text-brightpair" />,
      duration: '25 min',
      progress: 75,
      lastAccessed: '2 days ago'
    },
    {
      id: '2',
      title: 'Introduction to Energy',
      subject: 'Physics',
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      duration: '30 min',
      progress: 40,
      lastAccessed: '3 days ago'
    },
    {
      id: '3',
      title: 'Cell Biology',
      subject: 'Biology',
      icon: <Dna className="h-5 w-5 text-green-500" />,
      duration: '45 min',
      progress: 20,
      lastAccessed: '5 days ago'
    }
  ];

  return (
    <Card className="shadow-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brightpair" />
            <span>Recent Lessons</span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-brightpair">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLessons.map((lesson) => (
            <div 
              key={lesson.id}
              className="p-3 border border-gray-100 rounded-md transition-all hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.subject}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{lesson.duration}</span>
                    </div>
                    <div className="text-xs">{lesson.progress}% complete</div>
                  </div>
                  <div className="mt-1 w-full h-1 bg-gray-100 rounded-md overflow-hidden">
                    <div 
                      className="h-full bg-brightpair rounded" 
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="p-3 border border-dashed border-gray-200 rounded-md bg-gray-50 text-center">
            <Button variant="ghost" className="text-brightpair w-full justify-between">
              <span>Start new lesson</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRecentLessons; 