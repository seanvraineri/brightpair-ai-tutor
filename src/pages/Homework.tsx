
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import HomeworkAssignments from "@/components/dashboard/HomeworkAssignments";

const Homework: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Homework Assignments</h1>
          <p className="text-gray-500">Complete your assignments to track your progress</p>
        </div>
        
        <HomeworkAssignments />
      </div>
    </div>
  );
};

export default Homework;
