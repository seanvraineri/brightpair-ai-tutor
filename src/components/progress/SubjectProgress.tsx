import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { fetchProgress } from "@/services/progressService";

interface TopicData {
  name: string;
  progress: number;
  description: string;
}

interface SubjectData {
  id: string;
  name: string;
  progress: number;
  topics: TopicData[];
  recentGrades: { assessment: string; score: number; date: string }[];
  skills: { name: string; level: number; maxLevel: number }[];
}

const SubjectProgress: React.FC = () => {
  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["subject-progress", user?.id],
    enabled: !!user?.id,
    queryFn: () => fetchProgress(user!.id),
  });

  if (isLoading) {
    return <p>Loading subject progress...</p>;
  }

  const subjects = data?.subjectProgress ?? [];

  if (subjects.length === 0) {
    return (
      <p className="text-center text-gray-500">No subject progress data.</p>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subject Mastery</CardTitle>
          <CardDescription>Progress across curriculum subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                value: { theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjects}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" name="Mastery %" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Simple list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {subjects.map((sub, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{sub.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={sub.value} className="h-2 mb-2" />
              <p className="text-sm text-gray-500">{sub.value}% mastered</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectProgress;
