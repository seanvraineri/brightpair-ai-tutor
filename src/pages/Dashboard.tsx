
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, BookOpen, Award, ArrowRight, BookMarked, Bookmark, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  
  const showNotification = (message: string) => {
    toast({
      title: "Notification",
      description: message,
    });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <Card className="mb-8 bg-gradient-to-r from-brightpair-50 to-white border-brightpair-100">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">Welcome back, Emma!</h1>
                <p className="text-gray-600">Let's continue your learning journey.</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center mr-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                  <span>7 Day Streak!</span>
                </div>
                <Button size="sm" className="bg-brightpair hover:bg-brightpair-600">
                  Start Studying
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/60 rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-brightpair-100 p-2 rounded-full mr-3">
                    <Clock className="h-5 w-5 text-brightpair-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hours Studied</p>
                    <p className="text-xl font-bold">12.5</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-brightpair-100 p-2 rounded-full mr-3">
                    <BookMarked className="h-5 w-5 text-brightpair-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lessons</p>
                    <p className="text-xl font-bold">24</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-brightpair-100 p-2 rounded-full mr-3">
                    <Award className="h-5 w-5 text-brightpair-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quizzes Completed</p>
                    <p className="text-xl font-bold">8</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-brightpair-100 p-2 rounded-full mr-3">
                    <Bell className="h-5 w-5 text-brightpair-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Upcoming Sessions</p>
                    <p className="text-xl font-bold">3</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your learning activities this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { subject: "Algebra", progress: 75, goal: "Master quadratic equations" },
                    { subject: "Biology", progress: 48, goal: "Study cell division" },
                    { subject: "English", progress: 90, goal: "Complete essay outline" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{item.subject}</h4>
                          <p className="text-sm text-gray-500">{item.goal}</p>
                        </div>
                        <span className="text-sm font-medium">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className={`h-2 ${
                        item.progress > 75 ? "bg-green-100" : 
                        item.progress > 40 ? "bg-yellow-100" : "bg-red-100"
                      }`} />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-brightpair hover:text-brightpair-600" onClick={() => showNotification("Weekly report downloaded!")}>
                  Download Weekly Report
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-4">
            <Card className="h-full hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>Your next learning sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 p-3 hover:border-brightpair-300 hover:bg-brightpair-50 transition-colors cursor-pointer" onClick={() => showNotification("Math session details opened")}>
                    <div className="flex items-center mb-2">
                      <Calendar size={16} className="text-brightpair mr-2" />
                      <span className="text-sm font-medium">Today, 4:00 PM</span>
                    </div>
                    <h4 className="font-medium">Math Tutoring Session</h4>
                    <p className="text-sm text-gray-500 mb-2">Algebra Review</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-1" /> 45 minutes
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 p-3 hover:border-brightpair-300 hover:bg-brightpair-50 transition-colors cursor-pointer" onClick={() => showNotification("Biology quiz details opened")}>
                    <div className="flex items-center mb-2">
                      <Calendar size={16} className="text-brightpair mr-2" />
                      <span className="text-sm font-medium">Tomorrow, 5:30 PM</span>
                    </div>
                    <h4 className="font-medium">Biology Quiz</h4>
                    <p className="text-sm text-gray-500 mb-2">Cell Structure</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-1" /> 30 minutes
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Full Schedule
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Recent Activity and Recommended Next Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-brightpair-50 p-2 rounded mr-4">
                    <MessageSquareIcon className="h-5 w-5 text-brightpair" />
                  </div>
                  <div>
                    <h4 className="font-medium">AI Tutor Chat</h4>
                    <p className="text-sm text-gray-500">You completed a lesson on algebraic expressions</p>
                    <p className="text-xs text-gray-400 mt-1">Today, 2:15 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brightpair-50 p-2 rounded mr-4">
                    <BookOpen className="h-5 w-5 text-brightpair" />
                  </div>
                  <div>
                    <h4 className="font-medium">Flashcards</h4>
                    <p className="text-sm text-gray-500">You reviewed 15 math flashcards</p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday, 6:30 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brightpair-50 p-2 rounded mr-4">
                    <Award className="h-5 w-5 text-brightpair" />
                  </div>
                  <div>
                    <h4 className="font-medium">Quiz Completed</h4>
                    <p className="text-sm text-gray-500">You scored 85% on Geometry Quiz</p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday, 5:15 PM</p>
                  </div>
                </div>
                
                <Link to="/activity-log" className="text-brightpair hover:underline text-sm flex items-center">
                  View all activity <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Recommended Next Tasks</CardTitle>
              <CardDescription>AI-suggested learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-50 p-2 rounded mr-4">
                    <MessageSquareIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Practice Quadratic Equations</h4>
                    <p className="text-sm text-gray-500">Continue where you left off in your tutoring session</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Start Session
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-50 p-2 rounded mr-4">
                    <BookOpen className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Review Biology Flashcards</h4>
                    <p className="text-sm text-gray-500">Prepare for your upcoming quiz</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Open Flashcards
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-50 p-2 rounded mr-4">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Complete Practice Quiz</h4>
                    <p className="text-sm text-gray-500">Test your knowledge of geometric formulas</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Custom icon component
function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default Dashboard;
