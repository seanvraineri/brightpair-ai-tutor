import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, BookOpen, Clock, ExternalLink, FilePlus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

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

// Internal task shape including skillId for click handler
interface Task extends Omit<TaskItemProps, "onClick"> {
  skillId: string;
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
  onClick,
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
        <div
          className={`bg-brightpair-50 p-2 rounded-md mr-4 transition-transform duration-300 ${
            isHovered ? "scale-110" : ""
          }`}
        >
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
            className={`w-full transition-all ${
              isHovered
                ? "bg-brightpair text-white hover:bg-brightpair-600"
                : ""
            }`}
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
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("student_skills")
        .select("skill_id, mastery_level, skills(name, description)")
        .eq("student_id", user.id)
        .order("mastery_level", { ascending: true })
        .limit(3);
      if (!error && data) {
        const items: Task[] = data.map((row: {
          skill_id: string;
          mastery_level: number;
          skills: { name?: string; description?: string } | null;
        }) => ({
          icon: <FilePlus className="h-5 w-5 text-brightpair" />,
          title: `Practice ${row.skills?.name}`,
          description: row.skills?.description || "AI-generated practice task",
          buttonLabel: "Generate Task",
          difficulty: row.mastery_level < 0.3
            ? "hard"
            : row.mastery_level < 0.6
            ? "medium"
            : "easy",
          completionTime: "30 min",
          progressPercent: Math.round((row.mastery_level ?? 0) * 100),
          skillId: row.skill_id as string,
        }));
        setTasks(items);
      }
    };
    load();
  }, [user]);

  const handleGenerate = async (skillId: string) => {
    toast({ title: "Generating homework…" });
    const { error } = await supabase.functions.invoke("generate_homework", {
      body: { studentId: user?.id, skillId },
    });
    if (!error) {
      toast({ title: "Homework generated" });
    } else {
      toast({ title: "Error", description: error.message });
    }
  };

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
              onClick={() => handleGenerate(task.skillId)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedTasks;
