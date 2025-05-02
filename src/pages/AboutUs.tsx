
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

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
                We're on a mission to make personalized education accessible to every student through the power of human expertise and AI.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-display mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  BrightPair was founded in 2023 by a team of educators, technologists, and parents who believe in the power of personalized learning.
                </p>
                <p className="text-gray-700 mb-4">
                  We noticed that while one-on-one tutoring is incredibly effective, it's also expensive and difficult to schedule. Meanwhile, AI educational tools were becoming more capable, but lacked the human touch and personalization that makes learning stick.
                </p>
                <p className="text-gray-700">
                  That's when we had our lightbulb moment: what if we could combine the best of both worlds? Expert human tutors who understand how each child learns, paired with AI that's trained specifically for that child's needs, available 24/7.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176750-7b01e643ada0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
                  alt="Team meeting" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow">
                <div className="w-12 h-12 bg-brightpair-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalization</h3>
                <p className="text-gray-700">
                  Every child learns differently. We believe educational technology should adapt to students, not the other way around.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow">
                <div className="w-12 h-12 bg-brightpair-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Human Connection</h3>
                <p className="text-gray-700">
                  Technology is powerful, but the human element of teaching—empathy, encouragement, and understanding—remains irreplaceable.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow">
                <div className="w-12 h-12 bg-brightpair-100 rounded-full flex items-center justify-center mb-4">
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
        
        {/* Team Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  title: "Co-Founder & CEO",
                  bio: "Former educator with 15 years of experience in K-12 education and ed-tech.",
                  image: "https://randomuser.me/api/portraits/women/23.jpg"
                },
                {
                  name: "Marcus Johnson",
                  title: "Co-Founder & CTO",
                  bio: "AI researcher with a Ph.D. in Computer Science and a passion for educational technology.",
                  image: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  name: "Priya Patel",
                  title: "Chief Learning Officer",
                  bio: "Curriculum design expert with experience at leading educational institutions.",
                  image: "https://randomuser.me/api/portraits/women/44.jpg"
                }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 border-4 border-brightpair">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-brightpair font-medium mb-2">{member.title}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
