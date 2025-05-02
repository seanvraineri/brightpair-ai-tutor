
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  // Mock data for subjects
  const subjects: SubjectData[] = [
    {
      id: "math",
      name: "Mathematics",
      progress: 85,
      topics: [
        { name: "Algebra", progress: 92, description: "Equations and expressions" },
        { name: "Geometry", progress: 78, description: "Shapes and measurements" },
        { name: "Calculus", progress: 65, description: "Derivatives and integrals" },
        { name: "Trigonometry", progress: 88, description: "Angles and triangles" }
      ],
      recentGrades: [
        { assessment: "Quiz 1", score: 92, date: "April 28, 2025" },
        { assessment: "Homework 3", score: 88, date: "April 25, 2025" },
        { assessment: "Midterm", score: 85, date: "April 15, 2025" }
      ],
      skills: [
        { name: "Problem Solving", level: 4, maxLevel: 5 },
        { name: "Critical Thinking", level: 3, maxLevel: 5 },
        { name: "Formula Application", level: 5, maxLevel: 5 },
        { name: "Speed & Accuracy", level: 4, maxLevel: 5 }
      ]
    },
    {
      id: "science",
      name: "Science",
      progress: 65,
      topics: [
        { name: "Biology", progress: 72, description: "Living organisms" },
        { name: "Chemistry", progress: 65, description: "Chemical reactions" },
        { name: "Physics", progress: 58, description: "Matter and energy" }
      ],
      recentGrades: [
        { assessment: "Lab Report", score: 78, date: "April 29, 2025" },
        { assessment: "Quiz 2", score: 65, date: "April 22, 2025" },
        { assessment: "Homework 4", score: 70, date: "April 18, 2025" }
      ],
      skills: [
        { name: "Scientific Method", level: 3, maxLevel: 5 },
        { name: "Lab Techniques", level: 4, maxLevel: 5 },
        { name: "Data Analysis", level: 3, maxLevel: 5 }
      ]
    },
    {
      id: "english",
      name: "English",
      progress: 92,
      topics: [
        { name: "Literature", progress: 95, description: "Reading and analysis" },
        { name: "Writing", progress: 90, description: "Essays and creative writing" },
        { name: "Grammar", progress: 88, description: "Sentence structure" }
      ],
      recentGrades: [
        { assessment: "Essay", score: 95, date: "April 30, 2025" },
        { assessment: "Reading Quiz", score: 92, date: "April 24, 2025" },
        { assessment: "Term Paper", score: 88, date: "April 10, 2025" }
      ],
      skills: [
        { name: "Critical Reading", level: 5, maxLevel: 5 },
        { name: "Writing Clarity", level: 4, maxLevel: 5 },
        { name: "Argumentation", level: 5, maxLevel: 5 },
        { name: "Analysis", level: 4, maxLevel: 5 }
      ]
    }
  ];
  
  const [activeSubject, setActiveSubject] = useState<string>(subjects[0].id);
  
  const currentSubject = subjects.find(subject => subject.id === activeSubject) || subjects[0];
  
  const chartData = currentSubject.topics.map(topic => ({
    name: topic.name,
    progress: topic.progress
  }));

  const chartConfig = {
    progress: { theme: { light: "#8B5CF6" } }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeSubject} onValueChange={setActiveSubject}>
        <TabsList className="mb-4">
          {subjects.map(subject => (
            <TabsTrigger key={subject.id} value={subject.id}>
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {subjects.map(subject => (
          <TabsContent key={subject.id} value={subject.id}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Subject Overview */}
              <Card className="md:col-span-3">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{subject.name} Progress</CardTitle>
                    <div className="text-2xl font-bold">{subject.progress}%</div>
                  </div>
                  <Progress value={subject.progress} className="h-2.5 mt-2" />
                </CardHeader>
              </Card>

              {/* Topic Progress */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Topic Breakdown</CardTitle>
                  <CardDescription>Progress by topic area</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="progress" fill="#8B5CF6" name="Progress %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Grades */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Grades</CardTitle>
                  <CardDescription>Latest assessment scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subject.recentGrades.map((grade, index) => (
                      <div key={index} className="border-b pb-2 last:border-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{grade.assessment}</h4>
                            <p className="text-xs text-gray-500">{grade.date}</p>
                          </div>
                          <div className={`text-lg font-bold ${
                            grade.score >= 90 ? "text-green-600" :
                            grade.score >= 80 ? "text-blue-600" :
                            grade.score >= 70 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {grade.score}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Topic Details */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Topic Details</CardTitle>
                  <CardDescription>Detailed progress by topic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subject.topics.map((topic, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">{topic.name}</h4>
                          <span className="font-medium">{topic.progress}%</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{topic.description}</p>
                        <Progress value={topic.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment</CardTitle>
                  <CardDescription>Key skills development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subject.skills.map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-500">
                            Level {skill.level}/{skill.maxLevel}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: skill.maxLevel }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 rounded-full flex-1 ${
                                i < skill.level ? "bg-brightpair" : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SubjectProgress;
