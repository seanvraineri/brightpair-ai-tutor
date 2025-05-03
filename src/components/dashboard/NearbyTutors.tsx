
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BookSessionButton from "../tutor/BookSessionButton";
import TutorMapView from "../tutor/TutorMapView";
import { Grid, Map } from "lucide-react";

// Define the type to match the expected GeoTutorData type in TutorMapView
interface TutorData {
  id: string;
  name: string;
  location: string;
  subjects: string[];
  experience: string;
  education: string;
  availability: string;
  tutorMode: "remote" | "in-person" | "both";
  coordinates: [number, number]; // This needs to be a tuple with exactly 2 numbers
}

// Mock data for nearby tutors - in a real app, this would come from an API
const NEARBY_TUTORS: TutorData[] = [
  {
    id: "1",
    name: "Dr. Alex Johnson",
    location: "New York, NY",
    subjects: ["Mathematics", "Physics"],
    experience: "10+",
    education: "Ph.D. in Applied Mathematics",
    availability: "part-time",
    tutorMode: "both",
    coordinates: [-73.9712, 40.7831], // New York
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
    coordinates: [-71.0589, 42.3601], // Boston
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
    coordinates: [-122.4194, 37.7749], // San Francisco
  },
];

const NearbyTutors: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Tutors Near You</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 h-8 rounded-none ${viewMode === 'list' ? 'bg-muted' : ''}`}
              onClick={() => setViewMode("list")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 h-8 rounded-none ${viewMode === 'map' ? 'bg-muted' : ''}`}
              onClick={() => setViewMode("map")}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
          <Link to="/tutor-search">
            <Button variant="link" className="font-medium text-brightpair p-0">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "list" ? (
          <div className="grid grid-cols-1 gap-4">
            {NEARBY_TUTORS.slice(0, 3).map((tutor) => (
              <div key={tutor.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-brightpair-50 flex items-center justify-center text-xl font-medium text-brightpair flex-shrink-0">
                    {tutor.name.charAt(0)}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{tutor.name}</h4>
                    <p className="text-sm text-gray-600">{tutor.subjects.join(", ")}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to={`/tutor-profile/${tutor.id}`}>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </Link>
                    <BookSessionButton 
                      tutorId={tutor.id} 
                      tutorName={tutor.name} 
                      variant="secondary" 
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[300px]">
            <TutorMapView tutors={NEARBY_TUTORS} className="h-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyTutors;
