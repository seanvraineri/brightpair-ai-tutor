import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import { fetchProgress } from "@/services/progressService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Trophy } from "lucide-react";

const ProgressOverview: React.FC = () => {
  const { user } = useUser();
  const studentId = user?.id || "";

  const { data, isLoading } = useQuery({
    queryKey: ["progress", studentId],
    queryFn: () => fetchProgress(studentId),
    enabled: !!studentId,
  });

  const overallProgress = data?.overallProgress ?? 0;
  const attendanceRate = data?.attendanceRate ?? 0;
  const completionRate = data?.completionRate ?? 0;
  const quizAverage = data?.quizAverage ?? 0;
  const subjectProgress = data?.subjectProgress ?? [];

  const weeklyProgressData: any[] = [];
  const recentAchievements: any[] = [];

  const chartConfig = {
    mathematics: {
      label: "Mathematics",
      theme: { light: "#8B5CF6", dark: "#8B5CF6" },
    },
    science: { label: "Science", theme: { light: "#0EA5E9", dark: "#0EA5E9" } },
    english: { label: "English", theme: { light: "#F97316", dark: "#F97316" } },
    history: { label: "History", theme: { light: "#D946EF", dark: "#D946EF" } },
    progress: {
      label: "Progress",
      theme: { light: "#8B5CF6", dark: "#8B5CF6" },
    },
    target: { label: "Target", theme: { light: "#9CA3AF", dark: "#9CA3AF" } },
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{attendanceRate}%</div>
            <Progress value={attendanceRate} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Homework Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{completionRate}%</div>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Quiz Average
            </CardTitle>
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
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-md border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="bg-gray-100 p-2 rounded">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {achievement.date}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {achievement.description}
                  </p>
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
