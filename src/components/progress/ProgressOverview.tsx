
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Award } from "lucide-react";

const ProgressOverview: React.FC = () => {
  // Mock data for the progress overview
  const overallProgress = 73;
  const attendanceRate = 92;
  const completionRate = 85;
  const quizAverage = 78;
  
  const subjectProgress = [
    { name: "Mathematics", value: 85, color: "#8B5CF6" },
    { name: "Science", value: 65, color: "#0EA5E9" },
    { name: "English", value: 92, color: "#F97316" },
    { name: "History", value: 78, color: "#D946EF" }
  ];

  const weeklyProgressData = [
    { week: "Week 1", progress: 45, target: 50 },
    { week: "Week 2", progress: 52, target: 55 },
    { week: "Week 3", progress: 58, target: 60 },
    { week: "Week 4", progress: 65, target: 65 },
    { week: "Week 5", progress: 72, target: 70 },
    { week: "Week 6", progress: 73, target: 75 }
  ];

  const recentAchievements = [
    {
      title: "Perfect Attendance",
      description: "Attended all scheduled sessions this month",
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      date: "May 1, 2025"
    },
    {
      title: "Quick Learner",
      description: "Completed 3 quizzes with 90%+ scores",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      date: "April 28, 2025"
    },
    {
      title: "Subject Master: Math",
      description: "Achieved 85% mastery in Algebra",
      icon: <Award className="h-5 w-5 text-purple-500" />,
      date: "April 25, 2025"
    }
  ];

  const chartConfig = {
    mathematics: { label: "Mathematics", theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
    science: { label: "Science", theme: { light: "#0EA5E9", dark: "#0EA5E9" } },
    english: { label: "English", theme: { light: "#F97316", dark: "#F97316" } },
    history: { label: "History", theme: { light: "#D946EF", dark: "#D946EF" } },
    progress: { label: "Progress", theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
    target: { label: "Target", theme: { light: "#9CA3AF", dark: "#9CA3AF" } }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{attendanceRate}%</div>
            <Progress value={attendanceRate} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Homework Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{completionRate}%</div>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Quiz Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{quizAverage}%</div>
            <Progress value={quizAverage} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Breakdown Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Subject Breakdown</CardTitle>
            <CardDescription>Progress by subject area</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectProgress}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {subjectProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartLegend>
                      <ChartLegendContent nameKey="name" />
                    </ChartLegend>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Weekly Progress Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Weekly Progress Trend</CardTitle>
            <CardDescription>Your progress compared to targets</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      name="Progress"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Target"
                      stroke="#9CA3AF"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Your latest academic milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-md border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                <div className="bg-gray-100 p-2 rounded">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <Badge variant="secondary" className="text-xs">{achievement.date}</Badge>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressOverview;
