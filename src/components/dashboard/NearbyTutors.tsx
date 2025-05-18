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
              className={`px-2 h-8 rounded-none ${
                viewMode === "list" ? "bg-muted" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 h-8 rounded-none ${
                viewMode === "map" ? "bg-muted" : ""
              }`}
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
        {viewMode === "list"
          ? (
            <div className="grid grid-cols-1 gap-4">
              {/* Render live tutors here */}
            </div>
          )
          : (
            <div className="h-[300px]">
              <TutorMapView tutors={[]} className="h-full" />
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default NearbyTutors;
