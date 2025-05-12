
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface ProgressItemProps {
  subject: string;
  progress: number;
  goal: string;
  data: { day: string; progress: number }[];
}

const ProgressItem: React.FC<ProgressItemProps> = ({ subject, progress, goal, data }) => {
  return (
    <div className="space-y-2 pb-4">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium">{subject}</h4>
          <p className="text-sm text-gray-500">{goal}</p>
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-md ${
          progress > 75 ? "bg-green-100 text-green-800" : 
          progress > 40 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
        }`}>{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className={`h-2 ${
          progress > 75 ? "bg-green-600" : 
          progress > 40 ? "bg-yellow-600" : "bg-red-600"
        }`}
      />
      <div className="h-24 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              hide={true}
              domain={[0, 100]} 
            />
            <Tooltip 
              contentStyle={{ fontSize: '12px', borderRadius: '4px' }}
              formatter={(value) => [`${value}%`, 'Progress']}
            />
            <Line 
              type="monotone" 
              dataKey="progress" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const WeeklyProgress: React.FC = () => {
  const { toast } = useToast();
  
  const showNotification = (message: string) => {
    toast({
      title: "Notification",
      description: message,
    });
  };

  const progressItems = [
    { 
      subject: "Algebra", 
      progress: 75, 
      goal: "Master quadratic equations",
      data: [
        { day: "Mon", progress: 40 },
        { day: "Tue", progress: 52 },
        { day: "Wed", progress: 60 },
        { day: "Thu", progress: 65 },
        { day: "Fri", progress: 75 },
        { day: "Sat", progress: 75 },
        { day: "Sun", progress: 75 },
      ]
    },
    { 
      subject: "Biology", 
      progress: 48, 
      goal: "Study cell division",
      data: [
        { day: "Mon", progress: 20 },
        { day: "Tue", progress: 25 },
        { day: "Wed", progress: 30 },
        { day: "Thu", progress: 35 },
        { day: "Fri", progress: 42 },
        { day: "Sat", progress: 45 },
        { day: "Sun", progress: 48 },
      ]
    },
    { 
      subject: "English", 
      progress: 90, 
      goal: "Complete essay outline",
      data: [
        { day: "Mon", progress: 65 },
        { day: "Tue", progress: 70 },
        { day: "Wed", progress: 75 },
        { day: "Thu", progress: 80 },
        { day: "Fri", progress: 85 },
        { day: "Sat", progress: 88 },
        { day: "Sun", progress: 90 },
      ]
    },
  ];

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-card">
      <CardHeader className="pb-2">
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>Your learning activities this week</CardDescription>
      </CardHeader>
      <CardContent className="scrollbar-none overflow-y-auto" style={{ maxHeight: "500px" }}>
        <div className="space-y-6">
          {progressItems.map((item, idx) => (
            <ProgressItem 
              key={idx} 
              subject={item.subject} 
              progress={item.progress} 
              goal={item.goal}
              data={item.data}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 py-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-brightpair hover:text-brightpair-600 hover:bg-brightpair-50 transition-colors" 
          onClick={() => showNotification("Weekly report downloaded!")}
        >
          Download Weekly Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeeklyProgress;
