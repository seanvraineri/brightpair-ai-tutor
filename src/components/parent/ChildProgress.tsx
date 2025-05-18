import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  BookOpen,
  Brain,
  Calendar,
  CalendarDays,
  Clock,
  GraduationCap,
  Star,
  Target,
} from "lucide-react";

const ChildProgress: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const child = null;

  if (!child) return <div>No child data available</div>;

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Child Progress Tracking</h2>

        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            {/* Render live children here */}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={child.avatarUrl} alt={child.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(child.name)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left space-y-2 flex-grow">
              <h3 className="text-2xl font-bold">{child.name}</h3>
              <p className="text-gray-500">
                {child.grade} Grade • Tutored by {child.tutor}
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                {child.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 text-gray-500">
                <Calendar size={16} />
                <span>Next Session: {formatDate(child.nextSession)}</span>
              </div>

              <Button className="mt-3">
                Schedule Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="insights">Learning Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Progress Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium">
                      {child.progress.overall}%
                    </span>
                  </div>
                  <Progress value={child.progress.overall} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Attendance</span>
                    <span className="text-sm font-medium">
                      {child.progress.attendance}%
                    </span>
                  </div>
                  <Progress value={child.progress.attendance} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Homework Completion
                    </span>
                    <span className="text-sm font-medium">
                      {child.progress.homework}%
                    </span>
                  </div>
                  <Progress value={child.progress.homework} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Quiz Performance
                    </span>
                    <span className="text-sm font-medium">
                      {child.progress.quizzes}%
                    </span>
                  </div>
                  <Progress value={child.progress.quizzes} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Recent Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {child.recentGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="p-3 rounded-md border border-gray-200 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{grade.assignment}</p>
                        <p className="text-sm text-gray-500">
                          {grade.subject} • {grade.date}
                        </p>
                      </div>
                      <Badge
                        className={`text-lg px-3 py-1 ${
                          parseInt(grade.grade) >= 90
                            ? "bg-green-100 text-green-800"
                            : parseInt(grade.grade) >= 80
                            ? "bg-blue-100 text-blue-800"
                            : parseInt(grade.grade) >= 70
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {grade.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Upcoming Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {child.upcomingAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-3 rounded-md border border-gray-200 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{assignment.title}</p>
                        <p className="text-sm text-gray-500">
                          {assignment.subject}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <CalendarDays size={14} />
                        Due: {formatDate(assignment.dueDate)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Tutor Notes Summary
                </CardTitle>
                <CardDescription>
                  Recent observations from {child.tutor}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Strengths
                    </h4>
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {child.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-red-500" />
                      Areas to Improve
                    </h4>
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {child.areasToImprove.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignment History & Upcoming Tasks</CardTitle>
              <CardDescription>
                Detailed view of past and upcoming assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4 text-gray-500">
                Assignment history will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Learning Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded">
                  <h4 className="font-medium text-blue-900">
                    Learning Style: {child.learningStyle}
                  </h4>
                  <p className="mt-2 text-sm text-blue-800">
                    {child.name}{" "}
                    tends to learn best through visual methods. Using diagrams,
                    charts, and other visual aids will help maximize learning
                    potential.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Study Habits</span>
                    <span className="text-sm font-medium">
                      {child.studyHabits}%
                    </span>
                  </div>
                  <Progress value={child.studyHabits} className="h-2" />
                  <p className="text-sm text-gray-500 mt-1">
                    Based on homework completion and tutor observations
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-medium">Personalized Learning Tips</h4>
                  <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                    <li>
                      Schedule study sessions at consistent times for better
                      retention
                    </li>
                    <li>Use flashcards to help memorize key concepts</li>
                    <li>Break down complex assignments into smaller tasks</li>
                    <li>Review notes within 24 hours of each session</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Tutor Insights</CardTitle>
                <CardDescription>
                  Analysis based on AI tutor interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-full flex items-center justify-center">
                  <p className="text-center py-8 text-gray-500">
                    AI insights will be displayed here when your child interacts
                    with our AI tutor
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline">
          Download Progress Report
        </Button>
      </div>
    </div>
  );
};

export default ChildProgress;
