import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, Calendar, TrendingUp } from 'lucide-react';

const DashboardStats: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brightpair" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Weekly Goal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Weekly Goal</h4>
                  <div className="text-2xl font-bold">
                    3<span className="text-gray-400 text-lg">/5 hrs</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-md flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-xs text-gray-500">
                You're on track! 2 more hours to reach your weekly learning goal.
              </p>
            </div>

            {/* XP and Level */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-indigo-700 font-medium">Current Level</p>
                    <p className="text-2xl font-bold text-indigo-900 mt-1">Level 7</p>
                  </div>
                  <div className="h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center">
                    <Award className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-indigo-700">Progress</span>
                    <span className="text-indigo-700">850/1000 XP</span>
                  </div>
                  <div className="w-full bg-indigo-200 h-1.5 rounded-md overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-orange-700 font-medium">Learning Streak</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">12 Days</p>
                  </div>
                  <div className="h-8 w-8 bg-orange-100 rounded-md flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-orange-700 mt-2">
                  Keep it up! You're building consistent study habits.
                </p>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Subject Progress</h4>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium flex items-center gap-1">
                      <span className="h-2 w-2 bg-brightpair rounded"></span>
                      Mathematics
                    </span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-1.5" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium flex items-center gap-1">
                      <span className="h-2 w-2 bg-blue-500 rounded"></span>
                      Science
                    </span>
                    <span>60%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-md overflow-hidden">
                    <div className="bg-blue-500 h-full rounded" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium flex items-center gap-1">
                      <span className="h-2 w-2 bg-purple-500 rounded"></span>
                      English
                    </span>
                    <span>40%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-md overflow-hidden">
                    <div className="bg-purple-500 h-full rounded" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Recent Achievements</h4>
                <span className="text-xs text-blue-600">View All</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 border border-gray-100 rounded-md p-2">
                  <div className="h-10 w-10 bg-brightpair bg-opacity-10 rounded-md flex items-center justify-center">
                    <Award className="h-5 w-5 text-brightpair" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Weekly Warrior</p>
                    <p className="text-xs text-gray-500">Completed all weekly tasks</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 border border-gray-100 rounded-md p-2">
                  <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Algebra Master</p>
                    <p className="text-xs text-gray-500">Completed advanced algebra course</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats; 