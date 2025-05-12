
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, GraduationCap, MapPin, Clock, Book, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BookSessionButton from "@/components/tutor/BookSessionButton";
import { TutorCardProps } from "@/components/tutor/TutorCard";

// Mock data - in a real app, this would be fetched from an API
const MOCK_TUTORS: TutorCardProps[] = [
  {
    id: "1",
    name: "Dr. Alex Johnson",
    location: "New York, NY",
    subjects: ["Mathematics", "Physics", "Calculus"],
    experience: "10+",
    education: "Ph.D. in Applied Mathematics, MIT",
    availability: "part-time",
    tutorMode: "both",
    bio: "I have been teaching mathematics and physics for over 10 years, with experience ranging from high school to university level. My teaching philosophy focuses on building strong foundational understanding through practical examples and real-world applications.",
    hourlyRate: 75,
    rating: 4.9,
    reviewCount: 124,
    languages: ["English", "Spanish"]
  },
  {
    id: "2",
    name: "Sarah Williams",
    location: "Boston, MA",
    subjects: ["English Literature", "Writing", "Grammar"],
    experience: "5-10",
    education: "Master's in English Literature, Harvard",
    availability: "evenings",
    tutorMode: "remote",
    bio: "As a passionate writer and educator, I help students develop their critical thinking and communication skills through literature analysis and creative writing exercises. I specialize in essay writing, literary analysis, and preparation for standardized tests.",
    hourlyRate: 65,
    rating: 4.8,
    reviewCount: 87,
    languages: ["English", "French"]
  },
  {
    id: "3",
    name: "Michael Chen",
    location: "San Francisco, CA",
    subjects: ["Computer Science", "Programming", "Web Development"],
    experience: "3-5",
    education: "BS in Computer Science, Stanford",
    availability: "flexible",
    tutorMode: "in-person",
    bio: "I'm a software engineer with experience in teaching programming fundamentals, data structures, and web development. My approach combines theoretical concepts with practical coding exercises to help students build real-world skills.",
    hourlyRate: 80,
    rating: 4.7,
    reviewCount: 56,
    languages: ["English", "Mandarin"]
  }
];

interface ExtendedTutorProps extends TutorCardProps {
  bio?: string;
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
  languages?: string[];
}

const TutorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<ExtendedTutorProps | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call to fetch the tutor data
    const foundTutor = MOCK_TUTORS.find(t => t.id === id);
    if (foundTutor) {
      setTutor(foundTutor);
    } else {
      // Handle tutor not found
      navigate("/tutor-search", { replace: true });
    }
  }, [id, navigate]);

  if (!tutor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading tutor profile...</h2>
        </div>
      </div>
    );
  }

  // Format tutor mode text
  const modeText = {
    "remote": "Remote Only",
    "in-person": "In-Person Only",
    "both": "In-Person & Remote"
  }[tutor.tutorMode];

  // Convert experience value to user-friendly text
  const experienceText = {
    "0-1": "Less than 1 year",
    "1-3": "1-3 years",
    "3-5": "3-5 years",
    "5-10": "5-10 years",
    "10+": "More than 10 years",
  }[tutor.experience] || tutor.experience;

  // Format availability text
  const availabilityText = {
    "part-time": "Part-time (1-15 hrs/week)",
    "full-time": "Full-time (15+ hrs/week)",
    "weekends": "Weekends only",
    "evenings": "Evenings only",
    "flexible": "Flexible schedule"
  }[tutor.availability] || tutor.availability;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="text-brightpair hover:underline flex items-center"
            >
              &larr; Back to Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Tutor Info */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-md shadow-sm p-6 mb-6">
                <div className="flex items-start gap-5">
                  <div className="h-24 w-24 rounded-md bg-brightpair-50 flex items-center justify-center text-4xl font-medium text-brightpair overflow-hidden">
                    {tutor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold">{tutor.name}</h1>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <MapPin size={16} />
                          <span>{tutor.location}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={tutor.tutorMode === "remote" ? "outline" : "default"}
                        className={tutor.tutorMode === "remote" ? "border-brightpair text-brightpair" : "bg-brightpair"}
                      >
                        {modeText}
                      </Badge>
                    </div>
                    
                    {tutor.rating && (
                      <div className="flex items-center gap-1 mt-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              {i < Math.floor(tutor.rating) ? "★" : (i < tutor.rating ? "★" : "☆")}
                            </span>
                          ))}
                        </div>
                        <span className="font-medium">{tutor.rating}</span>
                        <span className="text-gray-500">({tutor.reviewCount} reviews)</span>
                      </div>
                    )}
                    
                    {tutor.hourlyRate && (
                      <div className="mt-3 text-lg font-semibold">
                        ${tutor.hourlyRate}/hour
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-brightpair mt-0.5" />
                    <div>
                      <h3 className="font-medium">Education</h3>
                      <p className="text-gray-600">{tutor.education}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-brightpair mt-0.5" />
                    <div>
                      <h3 className="font-medium">Experience</h3>
                      <p className="text-gray-600">{experienceText}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brightpair mt-0.5" />
                    <div>
                      <h3 className="font-medium">Availability</h3>
                      <p className="text-gray-600">{availabilityText}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Book className="w-5 h-5 text-brightpair mt-0.5" />
                    <div>
                      <h3 className="font-medium">Languages</h3>
                      <p className="text-gray-600">{tutor.languages ? tutor.languages.join(", ") : "English"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">About Me</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {tutor.bio || "No bio available for this tutor."}
                </p>
              </div>

              <div className="bg-white rounded-md shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-sm bg-gray-100">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - CTA */}
            <div>
              <div className="bg-white rounded-md shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-4">Book a Session</h2>
                <p className="text-gray-600 mb-4">
                  Ready to learn with {tutor.name.split(' ')[0]}? Schedule a session now!
                </p>
                
                <div className="space-y-4">
                  <BookSessionButton 
                    tutorId={tutor.id} 
                    tutorName={tutor.name}
                    className="w-full"
                  />
                  
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Message Tutor
                  </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div className="text-center text-sm text-gray-500">
                  <p>Not the right tutor for you?</p>
                  <Button 
                    variant="link" 
                    className="text-brightpair p-0 h-auto"
                    onClick={() => navigate('/tutor-search')}
                  >
                    Continue browsing tutors
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TutorProfile;
