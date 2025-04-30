
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNav from "./DashboardNav";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="md:ml-64 pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
