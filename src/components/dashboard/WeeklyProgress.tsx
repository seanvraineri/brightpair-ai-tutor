
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface ProgressItemProps {
  subject: string;
  progress: number;
  goal: string;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ subject, progress, goal }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium">{subject}</h4>
          <p className="text-sm text-gray-500">{goal}</p>
        </div>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className={`h-2 ${
          progress > 75 ? "bg-green-100" : 
          progress > 40 ? "bg-yellow-100" : "bg-red-100"
        }`} 
      />
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
    { subject: "Algebra", progress: 75, goal: "Master quadratic equations" },
    { subject: "Biology", progress: 48, goal: "Study cell division" },
    { subject: "English", progress: 90, goal: "Complete essay outline" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>Your learning activities this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {progressItems.map((item, idx) => (
            <ProgressItem key={idx} {...item} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-brightpair hover:text-brightpair-600" 
          onClick={() => showNotification("Weekly report downloaded!")}
        >
          Download Weekly Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeeklyProgress;
