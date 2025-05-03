
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, GraduationCap, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TutorCardProps {
  id: string;
  name: string;
  image?: string;
  location: string;
  subjects: string[];
  experience: string;
  education: string;
  availability: string;
  tutorMode: "remote" | "in-person" | "both";
  onClick?: () => void;
}

const TutorCard: React.FC<TutorCardProps> = ({
  name,
  image,
  location,
  subjects,
  experience,
  education,
  tutorMode,
  availability,
  onClick,
}) => {
  // Convert experience value to user-friendly text
  const experienceText = {
    "0-1": "Less than 1 year",
    "1-3": "1-3 years",
    "3-5": "3-5 years",
    "5-10": "5-10 years",
    "10+": "More than 10 years",
  }[experience] || experience;

  // Format tutoring mode text
  const modeText = {
    "remote": "Remote Only",
    "in-person": "In-Person Only",
    "both": "In-Person & Remote"
  }[tutorMode];

  return (
    <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 rounded-full bg-brightpair-50 flex items-center justify-center text-2xl font-medium text-brightpair overflow-hidden">
            {image ? (
              <img src={image} alt={name} className="h-full w-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{name}</h3>
            <div className="flex items-center text-gray-500 text-sm gap-1 mt-1">
              <MapPin size={14} />
              <span>{location}</span>
            </div>
          </div>
          <Badge variant={tutorMode === "remote" ? "outline" : "default"} className={tutorMode === "remote" ? "border-brightpair text-brightpair" : "bg-brightpair"}>
            {modeText}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid gap-3">
          <div className="flex items-start gap-2">
            <GraduationCap className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Education</div>
              <div className="text-sm text-gray-600">{education}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Experience</div>
              <div className="text-sm text-gray-600">{experienceText}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Availability</div>
              <div className="text-sm text-gray-600">
                {availability === "part-time"
                  ? "Part-time (1-15 hrs/week)"
                  : availability === "full-time"
                  ? "Full-time (15+ hrs/week)"
                  : availability === "weekends"
                  ? "Weekends only"
                  : availability === "evenings"
                  ? "Evenings only"
                  : "Flexible schedule"}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-sm font-medium">Subjects</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {subjects.map((subject) => (
              <Badge key={subject} variant="secondary" className="text-xs bg-gray-100 hover:bg-gray-200">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onClick} className="w-full bg-brightpair hover:bg-brightpair-600">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TutorCard;
