import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BookSessionButton from "../tutor/BookSessionButton";
import TutorMapView from "../tutor/TutorMapView";
import { Grid, Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

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

interface TutorRow {
  id: string;
  name?: string;
  email?: string;
  full_name?: string;
}

const NearbyTutors: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [tutors, setTutors] = useState<TutorRow[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchTutors = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, full_name")
        .eq("role", "tutor")
        .limit(5);
      if (!error && data) setTutors(data as TutorRow[]);
    };
    fetchTutors();
  }, [user]);

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
              {tutors.length === 0 && (
                <p className="text-sm text-gray-500">No tutors available.</p>
              )}
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex items-center justify-between border p-3 rounded-md"
                >
                  <div>
                    <p className="font-medium">
                      {tutor.full_name || tutor.name || tutor.email}
                    </p>
                    <p className="text-xs text-gray-500">Tutor</p>
                  </div>
                  <BookSessionButton
                    tutorId={tutor.id}
                    tutorName={tutor.full_name || tutor.name || tutor.email}
                    size="sm"
                  />
                </div>
              ))}
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
