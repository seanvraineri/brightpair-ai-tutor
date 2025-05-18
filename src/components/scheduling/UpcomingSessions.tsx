import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Appointment,
  cancelAppointment,
  getUpcomingAppointments,
} from "@/services/schedulingService";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionItemProps {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  tutor: string;
  subject: string;
  mode: "remote" | "in-person";
  location?: string;
  onClick: () => void;
  onCancel: () => void;
}

const SessionItem: React.FC<SessionItemProps> = ({
  id,
  title,
  date,
  time,
  duration,
  tutor,
  subject,
  mode,
  location,
  onClick,
  onCancel,
}) => (
  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-medium">{title}</h3>
      <Badge variant={mode === "remote" ? "secondary" : "outline"}>
        {mode === "remote" ? "Online" : "In-Person"}
      </Badge>
    </div>

    <div className="flex items-center text-sm text-gray-500 mb-1">
      <CalendarIcon size={14} className="mr-1" />
      <span>{format(date, "PPP")}</span>
    </div>

    <div className="flex items-center text-sm text-gray-500 mb-1">
      <Clock size={14} className="mr-1" />
      <span>{time} ({duration})</span>
    </div>

    {mode === "in-person" && location && (
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <MapPin size={14} className="mr-1" />
        <span>{location}</span>
      </div>
    )}

    <div className="text-sm mb-3">
      <div>
        <span className="text-gray-600">Tutor:</span> {tutor}
      </div>
      <div>
        <span className="text-gray-600">Subject:</span> {subject}
      </div>
    </div>

    <div className="flex justify-between mt-3">
      <Button variant="outline" size="sm" onClick={onClick}>
        View Details
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
      >
        <X className="mr-1 h-4 w-4" />
        Cancel Session
      </Button>
    </div>
  </div>
);

const UpcomingSessions: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();

  const {
    data: upcomingSessions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["upcoming-sessions", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user) return [] as Appointment[];
      const role = user.role === "teacher"
        ? "tutor"
        : (user.role as "student" | "tutor");
      return await getUpcomingAppointments(user.id, role);
    },
  });

  const handleSessionClick = (id: string) => {
    toast({
      title: "Session Details",
      description: `Viewing details for session #${id}`,
    });
    // In a real app, you would navigate to the session details page or show a modal
  };

  const handleSessionCancel = async (id: string) => {
    const { success, error } = await cancelAppointment(id);
    if (success) {
      toast({
        title: "Session Cancelled",
        description: `Session #${id} has been cancelled`,
      });
      refetch();
    } else {
      toast({
        title: "Error",
        description: error ?? "Unable to cancel session.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Sessions</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {isLoading && <Skeleton className="h-32 w-full" />}
          {!isLoading && upcomingSessions && upcomingSessions.map((session) => {
            const start = new Date(session.starts_at);
            const end = new Date(session.ends_at);
            const dateStr = start;
            const timeStr = start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const durationMin = Math.round(
              (end.getTime() - start.getTime()) / 60000,
            );
            return (
              <SessionItem
                key={session.id}
                id={session.id}
                title={"Tutoring Session"}
                date={dateStr}
                time={timeStr}
                duration={`${durationMin} min`}
                tutor={session.tutor_id}
                subject={""}
                mode={"remote"}
                onClick={() => handleSessionClick(session.id)}
                onCancel={() => handleSessionCancel(session.id)}
              />
            );
          })}

          {!isLoading && upcomingSessions && upcomingSessions.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No upcoming sessions scheduled
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessions;
