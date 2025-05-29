import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

interface ScheduleItemProps {
  date: string;
  title: string;
  subtitle: string;
  duration: string;
  location?: string;
  type: "tutoring" | "quiz" | "homework";
  startTime: string;
  onClick: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  date,
  title,
  subtitle,
  duration,
  location,
  type,
  startTime,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "tutoring":
        return {
          border: "border-brightpair-200",
          hover: "hover:bg-brightpair-50",
          icon: "text-brightpair",
        };
      case "quiz":
        return {
          border: "border-yellow-200",
          hover: "hover:bg-yellow-50",
          icon: "text-yellow-600",
        };
      case "homework":
        return {
          border: "border-purple-200",
          hover: "hover:bg-purple-50",
          icon: "text-purple-600",
        };
      default:
        return {
          border: "border-gray-200",
          hover: "hover:bg-gray-50",
          icon: "text-gray-600",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      className={cn(
        "rounded-md border p-3 transition-all duration-300",
        typeStyles.border,
        typeStyles.hover,
        "cursor-pointer transform",
        isHovered ? "scale-102 shadow-sm" : "",
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className="bg-white text-xs">
          {date}
        </Badge>
        <span className="text-xs font-medium">{startTime}</span>
      </div>

      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-500 mb-2">{subtitle}</p>

      <div className="flex items-center text-xs text-gray-500 space-x-2">
        <div className="flex items-center">
          <Clock size={14} className="mr-1" /> {duration}
        </div>

        {location && (
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" /> {location}
          </div>
        )}
      </div>

      {isHovered && (
        <div className="mt-3 text-right animate-fade-in">
          <Button
            size="sm"
            variant="ghost"
            className={`text-xs ${typeStyles.icon}`}
          >
            View Details
          </Button>
        </div>
      )}
    </div>
  );
};

// Appointment row returned from Supabase
interface AppointmentRow {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
}

const UpcomingSchedule: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [view, setView] = useState<"upcoming" | "calendar">("upcoming");
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchUpcoming = async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id, starts_at, ends_at, status")
        .eq("student_id", user.id)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(3);
      if (!error) {
        setAppointments((data as AppointmentRow[]) || []);
      } else {
        
      }
    };
    fetchUpcoming();
  }, [user]);

  return (
    <Card className="h-full hover:shadow-card transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your next learning sessions</CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                view === "upcoming" && "bg-gray-100",
              )}
              onClick={() => setView("upcoming")}
            >
              <Clock size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                view === "calendar" && "bg-gray-100",
              )}
              onClick={() => setView("calendar")}
            >
              <CalendarIcon size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === "upcoming"
          ? (
            <div className="space-y-4">
              {appointments.length === 0 && (
                <p className="text-sm text-gray-500">No sessions scheduled.</p>
              )}
              {appointments.map((appt) => (
                <ScheduleItem
                  key={appt.id}
                  date={new Date(appt.starts_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                  title={"Tutoring Session"}
                  subtitle={appt.status}
                  duration={`${
                    Math.round(
                      (new Date(appt.ends_at).getTime() -
                        new Date(appt.starts_at).getTime()) / 60000,
                    )
                  } min`}
                  type="tutoring"
                  startTime={new Date(appt.starts_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  onClick={() =>
                    toast({
                      title: "Tutoring Session",
                      description: "Session details coming soon",
                    })}
                />
              ))}
            </div>
          )
          : (
            <div className="bg-gray-50 rounded-md p-4 text-center h-[200px] flex items-center justify-center">
              <div className="text-gray-500">
                <CalendarIcon size={24} className="mx-auto mb-2" />
                <p>Calendar view coming soon</p>
              </div>
            </div>
          )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Full Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingSchedule;
