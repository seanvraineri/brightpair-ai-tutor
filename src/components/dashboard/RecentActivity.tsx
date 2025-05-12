
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, description, timestamp }) => {
  return (
    <div className="flex items-start">
      <div className="bg-brightpair-50 p-2 rounded-md mr-4">
        {icon}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
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

const RecentActivity: React.FC = () => {
  const activities = [
    {
      icon: <MessageSquareIcon className="h-5 w-5 text-brightpair" />,
      title: "AI Tutor Chat",
      description: "You completed a lesson on algebraic expressions",
      timestamp: "Today, 2:15 PM"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-brightpair" />,
      title: "Flashcards",
      description: "You reviewed 15 math flashcards",
      timestamp: "Yesterday, 6:30 PM"
    },
    {
      icon: <Award className="h-5 w-5 text-brightpair" />,
      title: "Quiz Completed",
      description: "You scored 85% on Geometry Quiz",
      timestamp: "Yesterday, 5:15 PM"
    }
  ];

  return (
    <Card className="hover:shadow-card transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <ActivityItem
              key={idx}
              icon={activity.icon}
              title={activity.title}
              description={activity.description}
              timestamp={activity.timestamp}
            />
          ))}
          
          <Link to="/activity-log" className="text-brightpair hover:underline text-sm flex items-center">
            View all activity <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
