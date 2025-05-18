import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChartContainer } from "@/components/ui/chart";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getStudentSkills, StudentSkill } from "@/services/progressService";

interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: {
    name: string;
    level: number;
    maxLevel: 5;
    description: string;
    lastImproved?: string;
  }[];
}

const SkillsTracking: React.FC = () => {
  const { user } = useUser();

  const { data: skills, isLoading } = useQuery({
    queryKey: ["student-skills", user?.id],
    enabled: !!user?.id,
    queryFn: () => getStudentSkills(user!.id),
  });

  if (isLoading) {
    return <p>Loading skills...</p>;
  }

  if (!skills || skills.length === 0) {
    return (
      <p className="text-center text-gray-500">No skills data available.</p>
    );
  }

  const radarData = skills.map((s: StudentSkill) => ({
    skill: s.name,
    level: s.mastery,
    fullMark: 5,
  }));

  const chartConfig = {
    level: { theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Description */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Skill Overview</CardTitle>
            <CardDescription>Mastery across tracked skills</CardDescription>
          </CardHeader>
        </Card>

        {/* Skills Radar Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
            <CardDescription>Visual representation of skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={radarData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Tooltip />
                    <Radar
                      name="Skill Level"
                      dataKey="level"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Skills List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Skill Details</CardTitle>
            <CardDescription>Detailed breakdown of your skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{skill.name}</h4>
                      <p className="text-sm text-gray-500">
                        {skill.description}
                      </p>
                    </div>
                    <Badge variant="outline">Level {skill.mastery}/5</Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress
                      value={(skill.mastery / 5) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsTracking;
