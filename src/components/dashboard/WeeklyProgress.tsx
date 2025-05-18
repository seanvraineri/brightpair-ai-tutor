import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

interface ProgressItemProps {
  subject: string;
  progress: number;
  goal: string;
  data: { day: string; progress: number }[];
}

const ProgressItem: React.FC<ProgressItemProps> = (
  { subject, progress, goal, data },
) => {
  return (
    <div className="space-y-2 pb-4">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium">{subject}</h4>
          <p className="text-sm text-gray-500">{goal}</p>
        </div>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-md ${
            progress > 75
              ? "bg-green-100 text-green-800"
              : progress > 40
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {progress}%
        </span>
      </div>
      <Progress
        value={progress}
        className={`h-2 ${
          progress > 75
            ? "bg-green-600"
            : progress > 40
            ? "bg-yellow-600"
            : "bg-red-600"
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
              contentStyle={{ fontSize: "12px", borderRadius: "4px" }}
              formatter={(value) => [`${value}%`, "Progress"]}
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
  const { user } = useUser();
  const [progressItems, setProgressItems] = React.useState<ProgressItemProps[]>(
    [],
  );

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      // Fetch quizzes completed in last 7 days with score
      const { data: quizzes } = await supabase
        .from("quizzes")
        .select("completed_at, score, subject")
        .eq("student_id", user.id)
        .gte("completed_at", start.toISOString());

      // Build daily aggregated progress (score average per day)
      const dayMap = new Map<string, { total: number; count: number }>();
      if (quizzes) {
        quizzes.forEach((q: any) => {
          const d = new Date(q.completed_at).toLocaleDateString(undefined, {
            weekday: "short",
          });
          const entry = dayMap.get(d) || { total: 0, count: 0 };
          entry.total += q.score ?? 0;
          entry.count += 1;
          dayMap.set(d, entry);
        });
      }

      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d.toLocaleDateString(undefined, { weekday: "short" });
      });

      const chartData = days.map((day) => {
        const entry = dayMap.get(day);
        return {
          day,
          progress: entry ? Math.round(entry.total / entry.count) : 0,
        };
      });

      const overall = chartData.reduce((s, d) => s + d.progress, 0) / 7;

      setProgressItems([
        {
          subject: "Quizzes",
          progress: Math.round(overall),
          goal: "Avg quiz score",
          data: chartData,
        },
      ]);
    };
    load();
  }, [user]);

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-card">
      <CardHeader className="pb-2">
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>Your learning activities this week</CardDescription>
      </CardHeader>
      <CardContent
        className="scrollbar-none overflow-y-auto"
        style={{ maxHeight: "500px" }}
      >
        <div className="space-y-6">
          {progressItems.length === 0 && (
            <p className="text-sm text-gray-500">No data for this week.</p>
          )}
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
          onClick={() =>
            toast({
              title: "Notification",
              description: "Weekly report downloaded!",
            })}
        >
          Download Weekly Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeeklyProgress;
