
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer } from "@/components/ui/chart";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

const TimeTracking: React.FC = () => {
  // Mock time tracking data
  const timeSpentBySubject = [
    { name: "Mathematics", hours: 12.5, color: "#8B5CF6" },
    { name: "Science", hours: 8.2, color: "#0EA5E9" },
    { name: "English", hours: 10.1, color: "#F97316" },
    { name: "History", hours: 5.5, color: "#D946EF" }
  ];
  
  const weeklyTimeData = [
    { day: "Monday", hours: 2.5, target: 2 },
    { day: "Tuesday", hours: 1.8, target: 2 },
    { day: "Wednesday", hours: 2.2, target: 2 },
    { day: "Thursday", hours: 2.0, target: 2 },
    { day: "Friday", hours: 1.5, target: 2 },
    { day: "Saturday", hours: 3.0, target: 2 },
    { day: "Sunday", hours: 0.5, target: 0 }
  ];
  
  const monthlyTrend = [
    { month: "Jan", hours: 30 },
    { month: "Feb", hours: 35 },
    { month: "Mar", hours: 38 },
    { month: "Apr", hours: 42 },
    { month: "May", hours: 45 }
  ];
  
  const timeOfDay = [
    { time: "Morning (6-12)", hours: 12 },
    { time: "Afternoon (12-5)", hours: 18 },
    { time: "Evening (5-10)", hours: 25 },
    { time: "Night (10-6)", hours: 5 }
  ];

  const studySessions = [
    {
      date: "May 2, 2025",
      subject: "Mathematics",
      duration: "1h 30m",
      topics: ["Algebra", "Equations"],
      productivity: "High"
    },
    {
      date: "May 1, 2025",
      subject: "Science",
      duration: "2h 15m",
      topics: ["Chemistry", "Chemical Bonds"],
      productivity: "Medium"
    },
    {
      date: "April 30, 2025",
      subject: "English",
      duration: "1h 45m",
      topics: ["Essay Writing", "Analysis"],
      productivity: "High"
    },
    {
      date: "April 29, 2025",
      subject: "Mathematics",
      duration: "1h 00m",
      topics: ["Geometry"],
      productivity: "Low"
    },
    {
      date: "April 28, 2025",
      subject: "Science",
      duration: "2h 00m",
      topics: ["Biology", "Cell Division"],
      productivity: "High"
    }
  ];
  
  // Time range filters
  const [timeRange, setTimeRange] = useState("week");

  const chartConfig = {
    hours: { theme: { light: "#8B5CF6" } },
    target: { theme: { light: "#9CA3AF" } }
  };
  
  // Get total hours
  const totalHours = timeSpentBySubject.reduce((sum, subject) => sum + subject.hours, 0).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Time Analysis</h2>
        <div className="flex gap-2">
          <Badge 
            className={`cursor-pointer ${timeRange === 'week' ? 'bg-brightpair' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setTimeRange('week')}
          >
            This Week
          </Badge>
          <Badge 
            className={`cursor-pointer ${timeRange === 'month' ? 'bg-brightpair' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </Badge>
          <Badge 
            className={`cursor-pointer ${timeRange === 'year' ? 'bg-brightpair' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setTimeRange('year')}
          >
            This Year
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Total Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalHours} hours</div>
            <p className="text-sm text-gray-500">This {timeRange}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Average Daily</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(Number(totalHours) / (timeRange === 'week' ? 7 : 30)).toFixed(1)} hours
            </div>
            <p className="text-sm text-gray-500">Per day</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Most Active Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Saturday</div>
            <p className="text-sm text-gray-500">3.0 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Most Studied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Mathematics</div>
            <p className="text-sm text-gray-500">12.5 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time by Subject */}
        <Card>
          <CardHeader>
            <CardTitle>Time by Subject</CardTitle>
            <CardDescription>Study time distribution across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeSpentBySubject}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="hours"
                      label={({ name, hours }) => `${name}: ${hours}h`}
                      labelLine={false}
                    >
                      {timeSpentBySubject.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Weekly Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Distribution</CardTitle>
            <CardDescription>Study hours by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#8B5CF6" name="Hours Studied" />
                    <Bar dataKey="target" fill="#9CA3AF" name="Target Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Study time progression</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      name="Study Hours"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Time of Day */}
        <Card>
          <CardHeader>
            <CardTitle>Time of Day</CardTitle>
            <CardDescription>When you study most effectively</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeOfDay} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="time" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#8B5CF6" name="Hours Studied" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Study Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Study Sessions</CardTitle>
          <CardDescription>Your latest learning activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studySessions.map((session, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="bg-gray-100 px-3 py-2 rounded text-center min-w-[80px]">
                  <div className="text-xs text-gray-500">{session.date.split(',')[0]}</div>
                  <div className="font-medium">{session.duration}</div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{session.subject}</h3>
                    <Badge className={`
                      ${session.productivity === "High" ? "bg-green-100 text-green-800" : ""}
                      ${session.productivity === "Medium" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${session.productivity === "Low" ? "bg-red-100 text-red-800" : ""}
                    `}>
                      {session.productivity}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {session.topics.map((topic, tidx) => (
                      <Badge key={tidx} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeTracking;
