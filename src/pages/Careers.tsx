
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Users, Megaphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OpportunityPosition {
  title: string;
  type: string;
  icon: React.ReactNode;
  description: string;
}

const opportunityPositions: OpportunityPosition[] = [
  {
    title: "Student Ambassadors",
    type: "Marketing Department",
    icon: <Megaphone className="h-6 w-6 text-brightpair" />,
    description: "Help spread the word about BrightPair on your campus. Organize events, share resources, and earn rewards while building your marketing and leadership skills."
  },
  {
    title: "Student Tutors",
    type: "Education",
    icon: <GraduationCap className="h-6 w-6 text-brightpair" />,
    description: "Help your fellow students excel in subjects you're passionate about. Flexible hours that work with your academic schedule and valuable teaching experience."
  },
  {
    title: "Experienced Tutors",
    type: "Education",
    icon: <Users className="h-6 w-6 text-brightpair" />,
    description: "Join our network of professional tutors and leverage our AI platform to enhance your tutoring practice while building a sustainable business."
  }
];

const Careers: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-brightpair-50 py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
                Join Our <span className="text-brightpair">BrightPair</span> Community
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                We're looking for passionate individuals to help us transform education through the power of AI and human connection.
              </p>
              <Button size="lg" className="bg-brightpair hover:bg-brightpair-600" asChild>
                <a href="#opportunities">View Opportunities</a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Why Join Us */}
        <section className="py-16 md:py-24 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Why Work With BrightPair</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brightpair-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Meaningful Impact</h3>
                <p className="text-gray-700">
                  Help shape the future of education by making personalized learning accessible to students everywhere.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brightpair-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-gray-700">
                  Work with cutting-edge AI technology and help solve complex educational challenges.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brightpair-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Growth</h3>
                <p className="text-gray-700">
                  Join our growing community with plenty of opportunities for professional development and advancement.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Our Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4">For Tutors</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Flexible scheduling that works for you
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    AI-powered tools to enhance your tutoring
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Commission on BrightPair subscriptions
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Ongoing professional development resources
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4">For Student Ambassadors</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Referral bonuses for new signups
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    BrightPair swag and merchandise
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Resume-building marketing experience
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Networking opportunities with educators
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4">For Student Tutors</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Earn while helping your peers
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Deepen your own understanding of subjects
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Build teaching skills for your future career
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Flexible hours that work with your course load
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4">Team & Culture</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Community of passionate educators
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Inclusive and diverse environment
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Regular training and development workshops
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Opportunities to shape the future of BrightPair
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Open Opportunities */}
        <section className="py-16 md:py-24 px-4" id="opportunities">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Current Opportunities</h2>
            <div className="space-y-6">
              {opportunityPositions.map((position, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        {position.icon}
                        <div>
                          <CardTitle className="text-xl mb-1">{position.title}</CardTitle>
                          <CardDescription>{position.type}</CardDescription>
                        </div>
                      </div>
                      <Button className="bg-brightpair hover:bg-brightpair-600">Apply Now</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{position.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 mb-6">
                Don't see a role that fits your skills? We're always looking for passionate people to join our mission!
              </p>
              <Button variant="outline" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
