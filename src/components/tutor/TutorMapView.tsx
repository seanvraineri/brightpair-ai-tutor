
import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { TutorCardProps } from "./TutorCard";
import { Link } from "react-router-dom";

// Mock data with geolocation for tutors
interface GeoTutorData extends TutorCardProps {
  coordinates: [number, number]; // This is a tuple with exactly 2 elements (longitude, latitude)
}

// Sample geocoded data for our mock tutors
const TUTORS_WITH_COORDINATES: GeoTutorData[] = [
  {
    id: "1",
    name: "Dr. Alex Johnson",
    location: "New York, NY",
    subjects: ["Mathematics", "Physics", "Calculus"],
    experience: "10+",
    education: "Ph.D. in Applied Mathematics, MIT",
    availability: "part-time",
    tutorMode: "both",
    coordinates: [-73.9712, 40.7831], // New York
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
    coordinates: [-71.0589, 42.3601], // Boston
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
    coordinates: [-122.4194, 37.7749], // San Francisco
  },
  {
    id: "4",
    name: "Priya Patel",
    location: "Chicago, IL",
    subjects: ["Chemistry", "Biology", "Organic Chemistry"],
    experience: "5-10",
    education: "Ph.D. in Chemistry, University of Chicago",
    availability: "full-time",
    tutorMode: "both",
    coordinates: [-87.6298, 41.8781], // Chicago
  },
  {
    id: "5",
    name: "David Rodriguez",
    location: "Austin, TX",
    subjects: ["Spanish", "French", "ESL"],
    experience: "3-5",
    education: "MA in Language Education, UT Austin",
    availability: "weekends",
    tutorMode: "in-person",
    coordinates: [-97.7431, 30.2672], // Austin
  },
  {
    id: "6",
    name: "Emily Wilson",
    location: "Seattle, WA",
    subjects: ["History", "Social Studies", "Political Science"],
    experience: "1-3",
    education: "Master's in History, University of Washington",
    availability: "part-time",
    tutorMode: "remote",
    coordinates: [-122.3321, 47.6062], // Seattle
  },
];

interface TutorMapViewProps {
  tutors?: GeoTutorData[];
  className?: string;
}

const TutorMapView: React.FC<TutorMapViewProps> = ({ 
  tutors = TUTORS_WITH_COORDINATES,
  className = "" 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<GeoTutorData | null>(null);

  // Load the Mapbox script dynamically
  useEffect(() => {
    const loadMapboxScript = () => {
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.async = true;
      script.onload = () => initializeMap();
      document.head.appendChild(script);
      
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };

    loadMapboxScript();
  }, []);

  // Initialize the map once the script is loaded and we have a token
  const initializeMap = () => {
    if (!mapboxToken || !mapContainerRef.current || !window.mapboxgl) return;
    
    try {
      window.mapboxgl.accessToken = mapboxToken;
      
      const map = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3
      });

      map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);
        addMarkers(map);
        mapRef.current = map;
      });
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
  };

  // Add tutor markers to the map
  const addMarkers = (map: any) => {
    tutors.forEach(tutor => {
      // Create a custom marker element
      const el = document.createElement('div');
      el.className = 'tutor-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#4F46E5';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.style.fontWeight = 'bold';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.innerText = tutor.name.charAt(0);
      
      // Add marker to map
      const marker = new window.mapboxgl.Marker(el)
        .setLngLat(tutor.coordinates)
        .addTo(map);
      
      // Add popup with tutor info
      marker.getElement().addEventListener('click', () => {
        setSelectedTutor(tutor);
        
        // Fly to the tutor location
        map.flyTo({
          center: tutor.coordinates,
          zoom: 12,
          essential: true
        });
      });
    });
  };

  // Format tutoring mode text
  const getTutorModeText = (mode: string) => {
    return {
      "remote": "Remote Only",
      "in-person": "In-Person Only",
      "both": "In-Person & Remote"
    }[mode] || mode;
  };

  return (
    <div className={`relative ${className}`}>
      <Card className="h-full shadow-sm">
        {/* Mapbox Token Input */}
        {!mapboxToken && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-6 rounded">
            <MapPin className="h-12 w-12 text-brightpair mb-4" />
            <h3 className="text-lg font-medium mb-2">Enter your Mapbox Public Token</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              To view tutors on a map, please enter your Mapbox public token.
              <br />
              You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-brightpair hover:underline">mapbox.com</a>
            </p>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-2"
              placeholder="pk.eyJ1IjoieW91..."
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <button
              className="bg-brightpair text-white px-4 py-2 rounded-md hover:bg-brightpair-600"
              onClick={initializeMap}
            >
              Load Map
            </button>
          </div>
        )}
        
        {/* Map Container */}
        <div 
          ref={mapContainerRef} 
          className="h-full min-h-[500px] w-full rounded"
        />
        
        {/* Selected Tutor Info Card */}
        {selectedTutor && (
          <div className="absolute bottom-4 left-4 right-4 bg-white p-4 shadow-lg rounded-md max-w-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md bg-brightpair-50 flex items-center justify-center text-xl font-medium text-brightpair overflow-hidden">
                  {selectedTutor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{selectedTutor.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm gap-1">
                    <MapPin size={14} />
                    <span>{selectedTutor.location}</span>
                  </div>
                </div>
              </div>
              <Badge 
                variant={selectedTutor.tutorMode === "remote" ? "outline" : "default"}
                className={selectedTutor.tutorMode === "remote" ? "border-brightpair text-brightpair" : "bg-brightpair"}
              >
                {getTutorModeText(selectedTutor.tutorMode)}
              </Badge>
            </div>
            
            <div className="mt-3">
              <div className="text-sm font-medium">Subjects</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedTutor.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-xs bg-gray-100 hover:bg-gray-200">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Link 
                to={`/tutor-profile/${selectedTutor.id}`}
                className="bg-brightpair hover:bg-brightpair-600 text-white px-4 py-2 text-sm rounded"
              >
                View Profile
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TutorMapView;

// Add these types to the global window object
declare global {
  interface Window {
    mapboxgl: any;
  }
}
