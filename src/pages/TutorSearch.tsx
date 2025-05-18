import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter, Grid, Map, MapPin, Search } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TutorCard, { TutorCardProps } from "@/components/tutor/TutorCard";
import TutorMapView from "@/components/tutor/TutorMapView";
import { useNavigate } from "react-router-dom";

const TutorSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [tutorMode, setTutorMode] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [filteredTutors, setFilteredTutors] = useState<TutorCardProps[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Filter tutors based on search criteria
  useEffect(() => {
    let results = [];

    // Filter by search query (name or subjects)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (tutor) =>
          tutor.name.toLowerCase().includes(query) ||
          tutor.subjects.some((s) => s.toLowerCase().includes(query)),
      );
    }

    // Filter by location
    if (location) {
      results = results.filter((tutor) =>
        tutor.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by tutor mode
    if (tutorMode) {
      results = results.filter((tutor) =>
        tutorMode === "both"
          ? true
          : tutor.tutorMode === tutorMode || tutor.tutorMode === "both"
      );
    }

    // Filter by subject
    if (subject) {
      results = results.filter((tutor) =>
        tutor.subjects.some((s) =>
          s.toLowerCase().includes(subject.toLowerCase())
        )
      );
    }

    setFilteredTutors(results);
  }, [searchQuery, location, tutorMode, subject]);

  const handleTutorClick = (tutorId: string) => {
    navigate(`/tutor-profile/${tutorId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Find Your Perfect <span className="text-brightpair">Tutor</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search our network of qualified tutors to find the right match for
              your learning needs, whether in-person or remote.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-md shadow-sm p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by subject or tutor name"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="City, State or ZIP Code"
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex items-center">
                <Button
                  variant="outline"
                  className="mr-2 border-gray-300"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button className="flex-1 bg-brightpair hover:bg-brightpair-600">
                  Search
                </Button>
              </div>
            </div>

            {/* Expanded Filters */}
            {isFilterOpen && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter a specific subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tutorMode">Tutoring Mode</Label>
                    <Select onValueChange={setTutorMode} value={tutorMode}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Any mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any mode</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {filteredTutors.length}{" "}
                {filteredTutors.length === 1 ? "Tutor" : "Tutors"} Found
              </h2>

              {/* View toggle buttons */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid"
                    ? "bg-brightpair hover:bg-brightpair-600"
                    : ""}
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className={viewMode === "map"
                    ? "bg-brightpair hover:bg-brightpair-600"
                    : ""}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>

            {filteredTutors.length === 0
              ? (
                <div className="bg-white rounded-md shadow-sm p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No tutors found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria to find more tutors.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setLocation("");
                      setTutorMode("");
                      setSubject("");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )
              : (
                <>
                  {/* Grid View */}
                  {viewMode === "grid" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTutors.map((tutor) => (
                        <TutorCard
                          key={tutor.id}
                          {...tutor}
                          onClick={() => handleTutorClick(tutor.id)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Map View */}
                  {viewMode === "map" && (
                    <div className="h-[70vh] bg-white rounded-md shadow-sm overflow-hidden">
                      <TutorMapView className="h-full" />
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TutorSearch;
