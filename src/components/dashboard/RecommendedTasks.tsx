
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Clock, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface TaskItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  difficulty: "easy" | "medium" | "hard";
  completionTime: string;
  dueDate?: string;
  progressPercent: number;
  onClick: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  icon, 
  title, 
  description, 
  buttonLabel, 
  difficulty,
  completionTime,
  dueDate,
  progressPercent,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get badge color based on difficulty
  const difficultyColor = difficulty === "easy" 
    ? "bg-green-100 text-green-800" 
    : difficulty === "medium"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  
  return (
    <div 
      className="p-4 border rounded-md transition-all duration-300 hover:shadow-card cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`bg-brightpair-50 p-2 rounded-md mr-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <h4 className="font-medium">{title}</h4>
            <div className="flex items-center gap-1 text-xs">
              <span className={`px-2 py-0.5 rounded-md ${difficultyColor}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2">{description}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{completionTime}</span>
            </div>
            {dueDate && <span>Due: {dueDate}</span>}
          </div>
          
          <div className="mb-3 mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
          
          <Button 
            size="sm" 
            variant="outline" 
            className={`w-full transition-all ${isHovered ? 'bg-brightpair text-white hover:bg-brightpair-600' : ''}`}
          >
            {buttonLabel}
            <ExternalLink size={14} className="ml-2" />
          </Button>
        </div>
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
  const { toast } = useToast();
  
  const handleTaskClick = (taskName: string) => {
    toast({
      title: "Task Selected",
      description: `Opening ${taskName}...`,
    });
  };
  
  const tasks = [
    {
      icon: <MessageSquareIcon className="h-5 w-5 text-green-600" />,
      title: "Practice Quadratic Equations",
      description: "Continue where you left off in your tutoring session",
      buttonLabel: "Start Session",
      difficulty: "medium",
      completionTime: "30 min",
      dueDate: "Today",
      progressPercent: 60,
      onClick: () => handleTaskClick("Quadratic Equations Practice")
    },
    {
      icon: <BookOpen className="h-5 w-5 text-yellow-600" />,
      title: "Review Biology Flashcards",
      description: "Prepare for your upcoming quiz on cell structures",
      buttonLabel: "Open Flashcards",
      difficulty: "easy",
      completionTime: "15 min",
      dueDate: "Tomorrow",
      progressPercent: 25,
      onClick: () => handleTaskClick("Biology Flashcards")
    },
    {
      icon: <Award className="h-5 w-5 text-purple-600" />,
      title: "Complete Practice Quiz",
      description: "Test your knowledge of geometric formulas and concepts",
      buttonLabel: "Start Quiz",
      difficulty: "hard",
      completionTime: "45 min",
      dueDate: "May 5, 2025",
      progressPercent: 15,
      onClick: () => handleTaskClick("Geometry Practice Quiz")
    }
  ];

  return (
    <Card className="hover:shadow-card transition-shadow duration-200 h-full">
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
              difficulty={task.difficulty as "easy" | "medium" | "hard"}
              completionTime={task.completionTime}
              dueDate={task.dueDate}
              progressPercent={task.progressPercent}
              onClick={task.onClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedTasks;
