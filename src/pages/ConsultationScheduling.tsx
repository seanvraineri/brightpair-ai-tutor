import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import { useUser } from "../contexts/UserContext";

const ConsultationScheduling: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setConsultationDate } = useUser();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available time slots - in a real app, these would be fetched from an API
  const availableTimeSlots = [
    "9:00 AM - 10:00 AM",
    "10:30 AM - 11:30 AM",
    "1:00 PM - 2:00 PM",
    "2:30 PM - 3:30 PM",
    "4:00 PM - 5:00 PM",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date || !timeSlot) {
      toast({
        title: "Missing information",
        description:
          "Please select both a date and time for your consultation.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the date for display
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const consultationDateTime = `${formattedDate} at ${timeSlot}`;

      // Update user context with consultation date
      setConsultationDate(consultationDateTime);

      // Show success toast
      toast({
        title: "Consultation scheduled!",
        description:
          `Your consultation has been scheduled for ${consultationDateTime}.`,
      });

      // Navigate to onboarding
      navigate("/onboarding");
    } catch (error) {
      console.error("Scheduling error:", error);
      toast({
        title: "Scheduling failed",
        description: "There was an error scheduling your consultation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if a date is available (for example, no weekends)
  const isDateUnavailable = (date: Date) => {
    const day = date.getDay();
    // Disable weekends (0 is Sunday, 6 is Saturday)
    return day === 0 || day === 6;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo className="mx-auto" size="lg" />
          <h2 className="mt-6 text-3xl font-bold font-display text-gray-900">
            Schedule Your Free Consultation
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select a convenient date and time to meet with one of our expert
            tutors
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Pick a Date & Time</CardTitle>
              <CardDescription>
                Your consultation will be approximately 30 minutes
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={isDateUnavailable}
                    className="mx-auto"
                    initialFocus
                  />
                </div>
              </div>

              {date && (
                <div className="space-y-2">
                  <Label htmlFor="timeSlot">Select Time Slot</Label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t pt-6">
              <Button
                type="submit"
                className="w-full bg-brightpair hover:bg-brightpair-600"
                disabled={!date || !timeSlot || isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Consultation"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationScheduling;
