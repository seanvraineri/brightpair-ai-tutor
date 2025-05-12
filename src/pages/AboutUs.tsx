
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Phone, Mail, Linkedin, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-brightpair-50 py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
                About <span className="text-brightpair">BrightPair</span>
              </h1>
              <p className="text-lg text-gray-700">
                Making personalized education accessible through the power of AI and human expertise.
              </p>
            </div>
          </div>
        </section>
        
        {/* Founder Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-display mb-6">Our Founder</h2>
                <p className="text-gray-700 mb-4">
                  BrightPair was founded by Sean Raineri, a finance graduate from Fordham University whose academic 
                  career was transformed by the benefits of AI personalization.
                </p>
                <p className="text-gray-700 mb-4">
                  Having experienced firsthand how personalized learning can dramatically improve educational outcomes, 
                  Sean is passionate about making these same benefits accessible to students everywhere.
                </p>
                <p className="text-gray-700">
                  His mission is to empower students' educational journeys by combining the expertise of human tutors 
                  with the personalization capabilities of AI, creating a learning experience that adapts to each 
                  student's unique needs and learning style.
                </p>
                
                <div className="mt-8">
                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-brightpair mr-3" />
                          <span>(917) 797-5691</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-brightpair mr-3" />
                          <span>sean@brightpair.com</span>
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 text-brightpair mr-3" />
                          <span>Finance Graduate, Fordham University</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="rounded-md overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-brightpair rounded-md flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl font-bold">SR</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Sean Raineri</h3>
                  <p className="text-gray-600">Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-md shadow">
                <div className="w-12 h-12 bg-brightpair-100 rounded-md flex items-center justify-center mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalization</h3>
                <p className="text-gray-700">
                  Every student learns differently. We believe educational technology should adapt to students, not the other way around.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-md shadow">
                <div className="w-12 h-12 bg-brightpair-100 rounded-md flex items-center justify-center mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Human Connection</h3>
                <p className="text-gray-700">
                  Technology is powerful, but the human element of teaching—empathy, encouragement, and understanding—remains irreplaceable.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-md shadow">
                <div className="w-12 h-12 bg-brightpair-100 rounded-md flex items-center justify-center mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Continuous Growth</h3>
                <p className="text-gray-700">
                  We're committed to constant improvement, both for our students and our platform, using data and feedback to evolve.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
