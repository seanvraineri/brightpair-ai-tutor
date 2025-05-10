
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import ButtonPrimary from "@/components/ButtonPrimary";

const FindTutorsSection: React.FC = () => {
  return (
    <section id="find-tutors" className="py-16 md:py-24 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Meet <span className="text-brightpair">BrightPair Tutors</span> Near You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with qualified tutors in your area for personalized in-person learning experiences,
            or choose remote sessions for maximum flexibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-brightpair-50 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-7 w-7 text-brightpair" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Local Tutors</h3>
                <p className="text-gray-600 mb-4">
                  Search our network of vetted tutors by location, subject expertise, and availability.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-brightpair-50 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-brightpair" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Perfect Matching</h3>
                <p className="text-gray-600 mb-4">
                  We help match your child with the ideal tutor based on learning style and educational needs.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-brightpair-50 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-7 w-7 text-brightpair" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600 mb-4">
                  Book sessions at times that work for your family with our easy scheduling system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
                Access to 500+ Qualified Tutors
              </h3>
              <p className="text-gray-600 mb-6">
                Our network includes tutors with advanced degrees, teaching certifications, and years of experience in their respective fields. Each tutor is thoroughly vetted to ensure they meet our high standards.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Mathematics</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Science</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">English</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">History</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Languages</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Test Prep</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">And More!</span>
              </div>
              <div>
                <Link to="/tutor-search">
                  <ButtonPrimary size="lg">
                    Find Tutors Near You
                  </ButtonPrimary>
                </Link>
              </div>
            </div>
            <div className="hidden md:block bg-brightpair-50 p-6">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Sample tutor profiles */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                        <img 
                          src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 20}.jpg`} 
                          alt={`Tutor ${i}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          {i === 1 ? "Dr. Alex Johnson" : 
                           i === 2 ? "Sarah Williams" : 
                           i === 3 ? "Michael Chen" : 
                                     "Priya Patel"}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {i === 1 ? "Mathematics" : 
                           i === 2 ? "English Literature" : 
                           i === 3 ? "Computer Science" : 
                                     "Chemistry"}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs flex items-center text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>
                        {i === 1 ? "New York, NY" : 
                         i === 2 ? "Boston, MA" : 
                         i === 3 ? "San Francisco, CA" : 
                                   "Chicago, IL"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-6 text-lg">
            Ready to find the perfect tutor to complement your child's AI learning experience?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/tutor-search">
              <Button size="lg">Browse All Tutors</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindTutorsSection;
