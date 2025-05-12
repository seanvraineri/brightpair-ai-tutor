import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/components/ui/use-toast";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: Date | null;
  category: string;
  status: 'in-progress' | 'completed' | 'overdue' | 'not-started';
  milestones: {
    title: string;
    completed: boolean;
  }[];
}

const GoalsManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock goals data
  const goals: Goal[] = [
    {
      id: "g1",
      title: "Master Algebra Equations",
      description: "Complete all practice exercises and achieve 90% score on final assessment",
      progress: 75,
      dueDate: new Date(2025, 5, 15),
      category: "Mathematics",
      status: "in-progress",
      milestones: [
        { title: "Complete practice set 1", completed: true },
        { title: "Complete practice set 2", completed: true },
        { title: "Complete practice set 3", completed: false },
        { title: "Take final assessment", completed: false }
      ]
    },
    {
      id: "g2",
      title: "Improve Essay Writing",
      description: "Write three practice essays with improving grades",
      progress: 30,
      dueDate: new Date(2025, 5, 20),
      category: "English",
      status: "in-progress",
      milestones: [
        { title: "Complete essay outline", completed: true },
        { title: "Write first draft", completed: false },
        { title: "Review and revise", completed: false },
        { title: "Final submission", completed: false }
      ]
    },
    {
      id: "g3",
      title: "Science Project Completion",
      description: "Complete science fair project on renewable energy",
      progress: 45,
      dueDate: new Date(2025, 5, 10),
      category: "Science",
      status: "in-progress",
      milestones: [
        { title: "Research topic", completed: true },
        { title: "Design experiment", completed: true },
        { title: "Conduct experiment", completed: false },
        { title: "Analyze results", completed: false },
        { title: "Prepare presentation", completed: false }
      ]
    },
    {
      id: "g4",
      title: "Complete Calculus Course",
      description: "Finish all modules of the advanced calculus course",
      progress: 100,
      dueDate: new Date(2025, 4, 30),
      category: "Mathematics",
      status: "completed",
      milestones: [
        { title: "Complete module 1", completed: true },
        { title: "Complete module 2", completed: true },
        { title: "Complete module 3", completed: true },
        { title: "Complete final exam", completed: true }
      ]
    }
  ];
  
  // Filter goals based on active tab
  const filteredGoals = goals.filter(goal => {
    if (activeTab === "active") return goal.status === "in-progress" || goal.status === "not-started";
    if (activeTab === "completed") return goal.status === "completed";
    if (activeTab === "overdue") return goal.status === "overdue";
    return true;
  });
  
  // Progress distribution data for chart
  const progressData = [
    { name: "Not Started", value: goals.filter(g => g.status === "not-started").length },
    { name: "In Progress", value: goals.filter(g => g.status === "in-progress").length },
    { name: "Completed", value: goals.filter(g => g.status === "completed").length },
    { name: "Overdue", value: goals.filter(g => g.status === "overdue").length }
  ];

  const chartConfig = {
    value: { theme: { light: "#8B5CF6", dark: "#8B5CF6" } }
  };
  
  // Handler for toggling milestone completion
  const toggleMilestone = (goalId: string, milestoneIndex: number) => {
    toast({
      title: "Milestone updated",
      description: "Your progress has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Goals Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Goals Summary</CardTitle>
            <CardDescription>Track your academic goals and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8B5CF6" name="Goals" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Timeline</CardTitle>
            <CardDescription>View goals by due date</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Goals</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast({ 
              title: "Create Goal", 
              description: "This feature would open a goal creation modal."
            })}>
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="all">All Goals</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-4">
              {filteredGoals.length > 0 ? (
                filteredGoals.map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{goal.title}</CardTitle>
                          <CardDescription>{goal.description}</CardDescription>
                        </div>
                        <Badge className={`
                          ${goal.status === "in-progress" ? "bg-blue-100 text-blue-800" : ""}
                          ${goal.status === "completed" ? "bg-green-100 text-green-800" : ""}
                          ${goal.status === "overdue" ? "bg-red-100 text-red-800" : ""}
                          ${goal.status === "not-started" ? "bg-gray-100 text-gray-800" : ""}
                        `}>
                          {goal.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Milestones:</h4>
                          <div className="space-y-2">
                            {goal.milestones.map((milestone, idx) => (
                              <div key={idx} className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-brightpair rounded-md border-gray-300 mr-2"
                                  checked={milestone.completed}
                                  onChange={() => toggleMilestone(goal.id, idx)}
                                  disabled={goal.status === "completed"}
                                />
                                <span className={`text-sm ${milestone.completed ? "line-through text-gray-500" : ""}`}>
                                  {milestone.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between text-sm text-gray-500 pt-0">
                      <span>Category: {goal.category}</span>
                      <span>Due: {goal.dueDate ? goal.dueDate.toLocaleDateString() : "No date set"}</span>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No goals in this category. Click "Add Goal" to create one.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsManagement;
