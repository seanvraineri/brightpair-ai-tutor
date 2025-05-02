
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import DashboardNav from "./DashboardNav";
import { useUser } from "@/contexts/UserContext";

const DashboardLayout: React.FC = () => {
  const { user } = useUser();
  
  // Redirect based on role if user is authenticated
  if (user) {
    // If user is on a dashboard route that doesn't match their role, redirect them
    if (window.location.pathname === "/dashboard" && user.role !== "student") {
      return <Navigate to="/student-dashboard" />;
    }
    if (window.location.pathname === "/teacher-dashboard" && user.role !== "teacher") {
      return <Navigate to={user.role === "student" ? "/dashboard" : "/parent-dashboard"} />;
    }
    if (window.location.pathname === "/parent-dashboard" && user.role !== "parent") {
      return <Navigate to={user.role === "student" ? "/dashboard" : "/teacher-dashboard"} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="md:ml-64 pt-16 md:pt-6 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
