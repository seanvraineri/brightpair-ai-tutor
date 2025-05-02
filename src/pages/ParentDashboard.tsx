
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TrendingUp, Clock, BookOpen, Check, LineChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ParentDashboard: React.FC = () => {
  const { toast } = useToast();

  const childName = "Emma";
  const subjects = ["Mathematics", "Physics", "English Literature"];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
          <p className="text-gray-600">Monitor {childName}'s learning progress and achievements</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Study Time This Week</p>
                  <p className="text-2xl font-bold">12.5 hrs</p>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <TrendingUp size={16} className="mr-1" />
                    <span>+2.7 hrs from last week</span>
                  </div>
                </div>
                <div className="p-2 bg-brightpair-50 rounded-full">
                  <Clock className="h-6 w-6 text-brightpair-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Assignments Completed</p>
                  <p className="text-2xl font-bold">15/18</p>
                  <div className="flex items-center text-brightpair text-sm mt-1">
                    <Check size={16} className="mr-1" />
                    <span>3 pending submissions</span>
                  </div>
                </div>
                <div className="p-2 bg-brightpair-50 rounded-full">
                  <BookOpen className="h-6 w-6 text-brightpair-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Average Score</p>
                  <p className="text-2xl font-bold">87%</p>
                  <div className="flex items-center text-green-600 text-sm mt-1">
                    <TrendingUp size={16} className="mr-1" />
                    <span>+5% improvement</span>
                  </div>
                </div>
                <div className="p-2 bg-brightpair-50 rounded-full">
                  <LineChart className="h-6 w-6 text-brightpair-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Next Tutoring Session</p>
                  <p className="text-2xl font-bold">Tomorrow</p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <span>4:00 PM - Mathematics</span>
                  </div>
                </div>
                <div className="p-2 bg-brightpair-50 rounded-full">
                  <Clock className="h-6 w-6 text-brightpair-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Track {childName}'s progress across different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <SubjectProgress 
                subject="Mathematics" 
                progress={78} 
                grade="B+" 
                comment="Strong understanding of algebra, needs more practice with trigonometry" 
              />
              
              <SubjectProgress 
                subject="Physics" 
                progress={65} 
                grade="B-" 
                comment="Good grasp of mechanics, struggling with electricity and magnetism" 
              />
              
              <SubjectProgress 
                subject="English Literature" 
                progress={92} 
                grade="A" 
                comment="Excellent critical analysis skills and essay structure" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem 
                title="Completed Physics Quiz" 
                date="Yesterday" 
                description="Score: 85% - Good understanding of Newton's Laws"
              />
              
              <ActivityItem 
                title="Mathematics Homework Submitted" 
                date="2 days ago" 
                description="13/15 correct answers - Excellent work on polynomials"
              />
              
              <ActivityItem 
                title="Tutoring Session" 
                date="3 days ago" 
                description="90-minute English Literature session focusing on Shakespeare"
              />
              
              <ActivityItem 
                title="Practice Test" 
                date="1 week ago" 
                description="Scored 92% on the SAT Math practice test"
              />
            </div>
            
            <button 
              className="w-full mt-4 text-brightpair hover:text-brightpair-600 text-sm font-medium"
              onClick={() => toast({ title: "View More", description: "Viewing all activity history" })}
            >
              View All Activity
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface SubjectProgressProps {
  subject: string;
  progress: number;
  grade: string;
  comment: string;
}

const SubjectProgress: React.FC<SubjectProgressProps> = ({ subject, progress, grade, comment }) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <div>
          <h4 className="font-medium">{subject}</h4>
          <p className="text-sm text-gray-500">{comment}</p>
        </div>
        <span className="text-lg font-bold">{grade}</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-end mt-1">
        <span className="text-sm text-gray-500">{progress}% complete</span>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  title: string;
  date: string;
  description: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, date, description }) => {
  return (
    <div className="flex border-l-4 border-brightpair pl-4">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-400">{date}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default ParentDashboard;
