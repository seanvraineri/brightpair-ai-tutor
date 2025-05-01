
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookMarked, Award, Bell } from "lucide-react";

const WelcomeBanner: React.FC = () => {
  return (
    <Card className="mb-8 bg-gradient-to-r from-brightpair-50 to-white border-brightpair-100">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">Welcome back, Emma!</h1>
            <p className="text-gray-600">Let's continue your learning journey.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center mr-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
              <span>7 Day Streak!</span>
            </div>
            <Button size="sm" className="bg-brightpair hover:bg-brightpair-600">
              Start Studying
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard icon={<Clock className="h-5 w-5 text-brightpair-600" />} label="Hours Studied" value="12.5" />
          <StatCard icon={<BookMarked className="h-5 w-5 text-brightpair-600" />} label="Lessons" value="24" />
          <StatCard icon={<Award className="h-5 w-5 text-brightpair-600" />} label="Quizzes Completed" value="8" />
          <StatCard icon={<Bell className="h-5 w-5 text-brightpair-600" />} label="Upcoming Sessions" value="3" />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-white/60 rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div className="bg-brightpair-100 p-2 rounded-full mr-3">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
