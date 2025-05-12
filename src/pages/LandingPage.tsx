import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import TutorsSection from "@/components/sections/TutorsSection";
import CTASection from "@/components/sections/CTASection";
import StickyCTA from "@/components/StickyCTA";
import TrustBar from "@/components/TrustBar";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import FaqSection from "@/components/sections/FaqSection";
import PersonalizationSection from "@/components/sections/PersonalizationSection";
import FindTutorsSection from "@/components/sections/FindTutorsSection";
// Removed framer-motion import that was causing issues
// import { motion, useScroll, useSpring } from "framer-motion";

const CALENDLY_URL = "https://calendly.com/seanvraineri/brightpair-tutoring-onboarding";

const faqs = [
  {
    question: "How does BrightPair combine human and AI tutoring?",
    answer: "BrightPair starts with a 1-on-1 session with a human tutor who gets to know your child's learning style and needs. Based on this session, we create a personalized AI tutor that's available 24/7 for practice and questions. Your child continues to have regular sessions with their human tutor, while the AI supports them between sessions."
  },
  {
    question: "What subjects does BrightPair cover?",
    answer: "BrightPair currently supports K-12 math, science, English, history, and standardized test prep. Our tutors are matched based on subject expertise and your child's grade level."
  },
  {
    question: "How much does BrightPair cost?",
    answer: "Our pricing plans are available in the Pricing section above. We offer different tiers based on how much human tutoring and AI support your child needs. All plans start with a free consultation with no credit card required."
  },
  {
    question: "Is my child's data secure with BrightPair?",
    answer: "Absolutely. We're COPPA and FERPA compliant, and SOC 2 certified. We never sell user data to third parties, and all information is encrypted end-to-end. Parents can access their child's learning data while keeping it private from others."
  },
  {
    question: "How personalized is the AI tutor?",
    answer: "Very personalized! The AI tutor is created based on your child's learning preferences, pace, strengths, and areas for improvement. It knows when to provide more examples, when to challenge them, and adapts as they progress."
  }
];

const LandingPage: React.FC = () => {
  // Removed scrolling animation that was problematic
  // const { scrollYProgress } = useScroll();
  // const scaleX = useSpring(scrollYProgress, {
  //   stiffness: 100,
  //   damping: 30,
  //   restDelta: 0.001
  // });

  return (
    <div className="min-h-screen bg-white">
      {/* Removed motion div that was causing issues */}
      {/* <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brightpair-500 z-50 origin-left"
        style={{ scaleX }}
      /> */}
      <NavBar />
      <StickyCTA />
      
      {/* Hero Section */}
      <section className="bg-white pt-24 pb-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight mb-6 max-w-4xl">
              Your Child's Personal <span className="text-brightpair">AI Tutor</span>—
              <br />Trained by a Real Human Tutor
            </h1>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl">
              The smartest way to learn. 1-on-1 human support + your own AI learning coach. 
              Personalized for how your child learns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                <ButtonPrimary 
                  size="lg" 
                  className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-blue-600 to-brightpair-600 hover:from-blue-700 hover:to-brightpair-700 font-semibold shadow-md"
                >
                  Free Consultation
                </ButtonPrimary>
              </a>
              <Link to="/signup">
                <ButtonSecondary
                  size="lg" 
                  className="w-full sm:w-auto min-w-[200px] bg-blue-100 border-blue-200 text-blue-900 hover:bg-blue-200 hover:text-blue-900 font-semibold shadow-md"
                >
                  Create Account
                </ButtonSecondary>
              </Link>
            </div>
            
            <div className="flex items-center justify-center mt-6">
              <div className="flex -space-x-2 mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-md border-2 border-white overflow-hidden bg-gray-200">
                    <img 
                      src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} 
                      alt={`User ${i}`}
                      className="h-full w-full object-cover"  
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">500+ parents</span> trust BrightPair with their children's education
              </div>
            </div>
          </div>
          
          {/* Desktop Chat Demo */}
          <div className="max-w-4xl mx-auto relative bg-white rounded-md shadow-lg overflow-hidden p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-md shadow-card p-4 overflow-hidden">
                <div className="flex items-center border-b pb-3 mb-4">
                  <div className="h-10 w-10 rounded-md bg-brightpair-100 flex items-center justify-center text-xl mr-3">
                    🧠
                  </div>
                  <h3 className="font-semibold">Math AI Tutor</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-md p-3 max-w-[80%]">
                    <p className="text-sm">Hi Emma! Today we're going to review exponents. How confident do you feel about this topic from 1-10?</p>
                  </div>
                  <div className="bg-brightpair-50 rounded-md p-3 ml-auto max-w-[80%]">
                    <p className="text-sm">Maybe a 4? I get confused with the negative exponents.</p>
                  </div>
                  <div className="bg-gray-100 rounded-md p-3 max-w-[80%]">
                    <p className="text-sm">That's okay! I know you're a visual learner, so I've created a diagram to help explain negative exponents. Take a look:</p>
                  </div>
                  <div className="bg-gray-100 rounded-md p-3 max-w-[80%]">
                    <div className="bg-white p-2 rounded-md border border-gray-200 text-center">
                      <p className="text-xs mb-2 font-semibold">Understanding Negative Exponents</p>
                      <div className="space-y-1 text-xs">
                        <p>x<sup>-n</sup> = 1/x<sup>n</sup></p>
                        <p>Example: 2<sup>-3</sup> = 1/2<sup>3</sup> = 1/8 = 0.125</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-md shadow-card p-4">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 bg-green-200 rounded-md flex items-center justify-center mr-2">📊</div>
                    <h4 className="font-semibold">Weekly Progress</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Algebra</span>
                        <span>75%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-green-500 rounded-md w-3/4"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Geometry</span>
                        <span>60%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-green-500 rounded-md w-3/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-md shadow-card p-4">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 bg-yellow-200 rounded-md flex items-center justify-center mr-2">📚</div>
                    <h4 className="font-semibold">Math Flashcards</h4>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="font-medium mb-3">What is the formula for the area of a circle?</p>
                    <Button size="sm" className="bg-brightpair text-white">Reveal Answer</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* HIPAA Badges Section */}
      <section className="bg-gray-50 py-6">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-gray-500 uppercase text-xs tracking-wider mb-2">Secure & Compliant</p>
              <div className="flex items-center space-x-4 justify-center">
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <p className="text-xs font-semibold">HIPAA Compliant</p>
                </div>
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <p className="text-xs font-semibold">SOC 2 Certified</p>
                </div>
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <p className="text-xs font-semibold">FERPA Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Value Proposition Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">In education, every interaction counts</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ensure consistent, personalized learning experiences. At the right pace. Every time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-md shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Personalized Learning</h3>
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-md p-4 mb-4">
                    <p className="text-gray-600">Generic tutoring and inconsistent approaches. One-size-fits-all curriculum.</p>
                  </div>
                  <div className="bg-brightpair-50 rounded-md p-4">
                    <p className="text-gray-800">AI tutor that adapts to your child's learning style, pace, and interests. Truly personalized education.</p>
                  </div>
                </div>
                <div className="flex items-center text-brightpair">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Improved learning outcomes</span>
                </div>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-md shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">24/7 Support</h3>
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-md p-4 mb-4">
                    <p className="text-gray-600">Limited tutoring hours. Help only available during scheduled sessions.</p>
                  </div>
                  <div className="bg-brightpair-50 rounded-md p-4">
                    <p className="text-gray-800">Round-the-clock AI tutor access. Get help exactly when you need it, no matter the time.</p>
                  </div>
                </div>
                <div className="flex items-center text-brightpair">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Never stuck on homework</span>
                </div>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-md shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Human + AI Synergy</h3>
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-md p-4 mb-4">
                    <p className="text-gray-600">Choose between human tutors OR impersonal AI tools. Disconnected experiences.</p>
                  </div>
                  <div className="bg-brightpair-50 rounded-md p-4">
                    <p className="text-gray-800">Human tutors who train and oversee your AI tutor. The perfect blend of personal connection and technology.</p>
                  </div>
                </div>
                <div className="flex items-center text-brightpair">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Best of both worlds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Integration Partners */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Seamlessly Integrates With Your School Systems</h2>
            <p className="text-gray-600">Works with the tools your child's school already uses</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["Google Classroom", "Canvas", "Schoology", "Clever", "Microsoft Teams"].map((partner, index) => (
              <div key={index} className="bg-white rounded-md shadow-sm p-4 w-40 h-20 flex items-center justify-center">
                <p className="font-medium text-gray-600">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <SectionWrapper>
        <HowItWorksSection />
      </SectionWrapper>
      
      <SectionWrapper>
        <PersonalizationSection />
      </SectionWrapper>
      
      <SectionWrapper>
        <ComparisonSection />
      </SectionWrapper>
      
      <SectionWrapper>
        <TestimonialsSection />
      </SectionWrapper>
      
      <SectionWrapper>
        <TutorsSection />
      </SectionWrapper>
      
      <SectionWrapper>
        <FindTutorsSection />
      </SectionWrapper>
      
      <SectionWrapper>
        <PricingSection />
      </SectionWrapper>
      
      <SectionWrapper>
        <FaqSection faqs={faqs} />
      </SectionWrapper>
      
      <SectionWrapper>
        <CTASection />
      </SectionWrapper>
      
      <TrustBar />
      <Footer />
    </div>
  );
};

const SectionWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {children}
      </div>
    </section>
  );
};

export default LandingPage;
