
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
import VideoModal from "@/components/VideoModal";
import TrustBar from "@/components/TrustBar";
import ButtonPrimary from "@/components/ButtonPrimary";
import FaqSection from "@/components/sections/FaqSection";

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
    answer: "Our pricing plans are available in the Pricing section above. We offer different tiers based on how much human tutoring and AI support your child needs. All plans start with a 14-day free trial with no credit card required."
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
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <StickyCTA />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-brightpair-50 pt-16 md:pt-24 pb-20 md:pb-32 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-6 max-w-3xl">
                Your Child's Personal AI Tutor—
                <span className="text-brightpair">Trained by a Real Human Tutor</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-lg">
                The smartest way to learn. 1-on-1 human support + your own AI learning coach. 
                Personalized for how your child learns.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup">
                  <ButtonPrimary size="lg">
                    Start Free Trial
                  </ButtonPrimary>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                      <img 
                        src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} 
                        alt={`User ${i}`}
                        className="h-full w-full object-cover"  
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-3 text-sm text-gray-600">
                  <span className="font-semibold">500+ parents</span> trust BrightPair with their children's education
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden relative p-4 md:p-6 mx-auto max-w-md animate-float">
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="pt-6">
                  <div className="text-center mb-4">
                    <div className="inline-block h-12 w-12 rounded-full bg-brightpair-100 mb-2 overflow-hidden">
                      <div className="h-full w-full flex items-center justify-center text-2xl">
                        🧠
                      </div>
                    </div>
                    <h3 className="font-semibold">Math AI Tutor</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Hi Emma! Today we're going to review exponents. How confident do you feel about this topic from 1-10?</p>
                    </div>
                    <div className="bg-brightpair-50 rounded-lg p-3 ml-auto max-w-[80%]">
                      <p className="text-sm">Maybe a 4? I get confused with the negative exponents.</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">That's okay! I know you're a visual learner, so I've created a diagram to help explain negative exponents. Take a look:</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="bg-white p-2 rounded border border-gray-200 text-center">
                        <p className="text-xs mb-2 font-semibold">Understanding Negative Exponents</p>
                        <div className="space-y-1 text-xs">
                          <p>x<sup>-n</sup> = 1/x<sup>n</sup></p>
                          <p>Example: 2<sup>-3</sup> = 1/2<sup>3</sup> = 1/8 = 0.125</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 relative">
                    <input
                      type="text"
                      placeholder="Type your response..."
                      className="w-full p-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brightpair focus:border-transparent"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-brightpair">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 transform rotate-6 bg-white rounded-xl shadow-lg overflow-hidden w-48 h-32 hidden md:block">
                <div className="p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center mr-2">📚</div>
                    <h4 className="text-xs font-semibold">Math Flashcards</h4>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center text-xs">
                    <p className="font-medium">What is the formula for the area of a circle?</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 transform -rotate-6 bg-white rounded-xl shadow-lg overflow-hidden w-48 h-32 hidden md:block">
                <div className="p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mr-2">📊</div>
                    <h4 className="text-xs font-semibold">Weekly Progress</h4>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="h-2 bg-gray-200 rounded-full mb-1">
                      <div className="h-2 bg-green-500 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-xs text-gray-500">75% mastery in Algebra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Video Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="container max-w-5xl mx-auto">
          <VideoModal 
            thumbnailUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop"
            videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="See how BrightPair transforms learning"
          />
        </div>
      </section>
      
      <HowItWorksSection />
      <ComparisonSection />
      <TestimonialsSection />
      <TutorsSection />
      <PricingSection />
      <FaqSection faqs={faqs} />
      <CTASection />
      <TrustBar />
      <Footer />
    </div>
  );
};

export default LandingPage;
