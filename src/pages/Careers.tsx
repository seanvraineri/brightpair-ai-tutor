
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface JobPosition {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const jobPositions: JobPosition[] = [
  {
    title: "AI Learning Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Design and develop advanced AI systems that can adapt to individual students' learning styles and needs."
  },
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Build and maintain the BrightPair platform infrastructure, focusing on scalability, reliability, and user experience."
  },
  {
    title: "Educational Content Specialist",
    department: "Curriculum",
    location: "Remote",
    type: "Full-time",
    description: "Create engaging, standards-aligned learning content across K-12 subjects for our AI tutoring system."
  },
  {
    title: "UX Researcher",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    description: "Conduct user research with students, parents, and educators to inform product development and improvements."
  },
  {
    title: "Lead Tutor Recruitment Specialist",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Source, interview, and onboard exceptional tutors for our platform, ensuring high quality educational experiences."
  },
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
                Join Our Team at <span className="text-brightpair">BrightPair</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Help us build the future of personalized education by combining human expertise with cutting-edge AI technology.
              </p>
              <Button size="lg" className="bg-brightpair hover:bg-brightpair-600">
                View Open Positions
              </Button>
            </div>
          </div>
        </section>
        
        {/* Why Join Us */}
        <section className="py-16 md:py-24 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Why Work at BrightPair</h2>
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
                  Join a fast-growing startup with plenty of opportunities for professional development and advancement.
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
                <h3 className="text-xl font-semibold mb-4">Health & Wellness</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Comprehensive health, dental, and vision insurance
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Mental health support and resources
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Wellness stipend for gym memberships or fitness classes
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Flexible time off policy
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4">Work & Life</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Flexible remote work options
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Generous parental leave
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Home office setup stipend
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Professional development budget
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4">Financial Benefits</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Competitive salary packages
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Equity options for all employees
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    401(k) retirement plan with company matching
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Twice-yearly performance reviews with raise opportunities
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4">Team & Culture</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Regular team retreats and social events
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Inclusive and diverse workplace culture
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Volunteer time off for community service
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Continuous learning opportunities
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Open Positions */}
        <section className="py-16 md:py-24 px-4" id="open-positions">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Open Positions</h2>
            <div className="space-y-6">
              {jobPositions.map((job, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                        <CardDescription>{job.department} · {job.location} · {job.type}</CardDescription>
                      </div>
                      <Button className="bg-brightpair hover:bg-brightpair-600">Apply Now</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
