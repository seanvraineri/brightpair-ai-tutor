
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardNav from "./DashboardNav";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";

const DashboardLayout: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<"student" | "teacher" | "parent">("student");

  const handleRoleChange = (value: string) => {
    const role = value as "student" | "teacher" | "parent";
    setActiveRole(role);
    
    // Navigate to the corresponding dashboard
    switch(role) {
      case "teacher":
        navigate("/teacher-dashboard");
        break;
      case "parent":
        navigate("/parent-dashboard");
        break;
      default:
        navigate("/dashboard");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="md:ml-64 pt-16 md:pt-6 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <Tabs defaultValue="student" value={activeRole} onValueChange={handleRoleChange} className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
                <TabsTrigger value="parent">Parent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
