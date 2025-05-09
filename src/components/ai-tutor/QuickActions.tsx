
import React from "react";
import { Button } from "@/components/ui/button";

interface TutorFunction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface QuickActionsProps {
  tutorFunctions: TutorFunction[];
  onFunctionClick: (functionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  tutorFunctions, 
  onFunctionClick 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tutorFunctions.map((func) => (
        <Button
          key={func.id}
          variant="outline"
          className="border-brightpair text-brightpair hover:bg-brightpair/10 transition-colors duration-200 shadow-sm"
          size="sm"
          onClick={() => onFunctionClick(func.id)}
        >
          {func.icon}
          <span className="ml-2">{func.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
