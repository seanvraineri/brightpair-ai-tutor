
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TutorCard, { TutorCardProps } from "../tutor/TutorCard";

// Mock data for nearby tutors - in a real app, this would come from an API
const NEARBY_TUTORS: TutorCardProps[] = [
  {
    id: "1",
    name: "Dr. Alex Johnson",
    location: "New York, NY",
    subjects: ["Mathematics", "Physics"],
    experience: "10+",
    education: "Ph.D. in Applied Mathematics",
    availability: "part-time",
    tutorMode: "both",
  },
  {
    id: "2",
    name: "Sarah Williams",
    location: "Boston, MA",
    subjects: ["English Literature", "Writing"],
    experience: "5-10",
    education: "Master's in English Literature",
    availability: "evenings",
    tutorMode: "remote",
  },
  {
    id: "3",
    name: "Michael Chen",
    location: "San Francisco, CA",
    subjects: ["Computer Science", "Programming"],
    experience: "3-5",
    education: "BS in Computer Science",
    availability: "flexible",
    tutorMode: "in-person",
  },
];

const NearbyTutors: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Tutors Near You</CardTitle>
        <Link to="/tutor-search">
          <Button variant="link" className="font-medium text-brightpair p-0">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {NEARBY_TUTORS.slice(0, 3).map((tutor) => (
            <div key={tutor.id} className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-brightpair-50 flex items-center justify-center text-xl font-medium text-brightpair flex-shrink-0">
                  {tutor.name.charAt(0)}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{tutor.name}</h4>
                  <p className="text-sm text-gray-600">{tutor.subjects.join(", ")}</p>
                </div>
                <Link to={`/tutor-search?tutorId=${tutor.id}`}>
                  <Button variant="outline" size="sm">View Profile</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyTutors;
