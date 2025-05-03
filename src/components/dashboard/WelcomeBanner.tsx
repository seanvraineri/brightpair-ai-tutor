
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookMarked, Award, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeBannerProps {
  userName?: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName = "Student" }) => {
  return (
    <Card className="mb-8 overflow-hidden">
      <div className="absolute -z-10 inset-0 bg-gradient-to-r from-brightpair-50 via-white to-brightpair-50/20" />
      <div className="absolute -z-10 right-0 h-full w-1/3 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbC1vcGFjaXR5PSIuMSIgZmlsbD0iIzhCNUNGNiIgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIi8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii4xIiBmaWxsPSIjOEI1Q0Y2IiBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjEiIGZpbGw9IiM4QjVDRjYiIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIvPjwvZz48L3N2Zz4=')]" />

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display mb-1 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-brightpair">Welcome back, {userName}!</h1>
            <p className="text-gray-600">Let's continue your learning journey.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center mr-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
              <span>7 Day Streak!</span>
            </div>
            <Button size="sm" className="bg-brightpair hover:bg-brightpair-600 transition-all hover:scale-105">
              Start Studying
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard 
            icon={<Clock className="h-5 w-5 text-brightpair-600" />} 
            label="Hours Studied" 
            value="12.5" 
            trend="+2.5"
            trendUp={true}
          />
          <StatCard 
            icon={<BookMarked className="h-5 w-5 text-brightpair-600" />} 
            label="Lessons" 
            value="24" 
            trend="+3"
            trendUp={true}
          />
          <StatCard 
            icon={<Award className="h-5 w-5 text-brightpair-600" />} 
            label="Quizzes Completed" 
            value="8" 
            trend="+1"
            trendUp={true}
          />
          <StatCard 
            icon={<Bell className="h-5 w-5 text-brightpair-600" />} 
            label="Upcoming Sessions" 
            value="3" 
            trend="Today"
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, trendUp }) => {
  return (
    <div className={cn(
      "bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100",
      "hover:shadow-md hover:border-brightpair-100 transition-all duration-200 group"
    )}>
      <div className="flex items-center">
        <div className="bg-brightpair-100 p-2 rounded-full mr-3 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{value}</p>
            {trend && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                trendUp ? "text-green-700 bg-green-100" : "text-gray-600 bg-gray-100"
              )}>
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
