import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = (
  { icon, title, description, timestamp },
) => {
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

interface Activity {
  id: string;
  type: "message" | "lesson" | "homework";
  title: string;
  description: string;
  timestamp: string; // ISO
}

const RecentActivity: React.FC = () => {
  const { user } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const promises = [
        supabase
          .from("messages")
          .select("id, content, created_at, sender_id, receiver_id")
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("homework")
          .select("id, title, updated_at, status")
          .eq("student_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(10),
        supabase
          .from("lessons")
          .select("id, title, updated_at, status")
          .eq("student_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(10),
      ];

      const [msgRes, hwRes, lessonRes] = await Promise.all(promises);
      const items: Activity[] = [];
      if (!msgRes.error && msgRes.data) {
        items.push(
          ...msgRes.data.map((m) => ({
            id: `msg-${m.id}`,
            type: "message" as const,
            title: "New message",
            description: m.content.slice(0, 60) +
              (m.content.length > 60 ? "…" : ""),
            timestamp: m.created_at,
          })),
        );
      }
      if (!hwRes.error && hwRes.data) {
        items.push(
          ...hwRes.data.map((h) => ({
            id: `hw-${h.id}`,
            type: "homework" as const,
            title: h.title,
            description: `Homework ${h.status}`,
            timestamp: h.updated_at,
          })),
        );
      }
      if (!lessonRes.error && lessonRes.data) {
        items.push(
          ...lessonRes.data.map((l) => ({
            id: `lesson-${l.id}`,
            type: "lesson" as const,
            title: l.title,
            description: `Lesson ${l.status}`,
            timestamp: l.updated_at,
          })),
        );
      }

      // sort and slice top 10
      items.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActivities(items.slice(0, 10));
    };
    load();
  }, [user]);

  const iconFor = (type: Activity["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare size={16} className="text-brightpair" />;
      case "lesson":
        return <BookOpen size={16} className="text-yellow-600" />;
      case "homework":
        return <Award size={16} className="text-purple-600" />;
    }
  };

  return (
    <Card className="hover:shadow-card transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 && (
            <p className="text-sm text-gray-500">No recent activity.</p>
          )}
          {activities.map((a) => (
            <ActivityItem
              key={a.id}
              icon={iconFor(a.type)}
              title={a.title}
              description={a.description}
              timestamp={new Date(a.timestamp).toLocaleString()}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
