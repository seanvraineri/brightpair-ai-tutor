
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award } from "lucide-react";

interface TaskItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ icon, title, description, buttonLabel }) => {
  return (
    <div className="flex items-start">
      <div className="bg-green-50 p-2 rounded mr-4">
        {icon}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
        <Button size="sm" variant="outline" className="mt-2">
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

// Custom icon component
function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const RecommendedTasks: React.FC = () => {
  const tasks = [
    {
      icon: <MessageSquareIcon className="h-5 w-5 text-green-600" />,
      title: "Practice Quadratic Equations",
      description: "Continue where you left off in your tutoring session",
      buttonLabel: "Start Session"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-yellow-600" />,
      title: "Review Biology Flashcards",
      description: "Prepare for your upcoming quiz",
      buttonLabel: "Open Flashcards"
    },
    {
      icon: <Award className="h-5 w-5 text-purple-600" />,
      title: "Complete Practice Quiz",
      description: "Test your knowledge of geometric formulas",
      buttonLabel: "Start Quiz"
    }
  ];

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Recommended Next Tasks</CardTitle>
        <CardDescription>AI-suggested learning activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task, idx) => (
            <TaskItem
              key={idx}
              icon={task.icon}
              title={task.title}
              description={task.description}
              buttonLabel={task.buttonLabel}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedTasks;
