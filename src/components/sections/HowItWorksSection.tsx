
import React from "react";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Onboard with a Human Tutor",
    description: "We meet 1-on-1 (via Zoom) to understand how your child learns",
    emoji: "🤝"
  },
  {
    number: 2,
    title: "AI Tutor Is Created",
    description: "Based on the session, we build your child a personal AI tutor trained to match their needs",
    emoji: "🤖"
  },
  {
    number: 3,
    title: "Learn, Practice, Review",
    description: "The AI tutor gives practice, quizzes, flashcards, and feedback 24/7",
    emoji: "📚"
  },
  {
    number: 4,
    title: "Weekly Progress Review",
    description: "The tutor and parent get insights and adjust learning each week",
    emoji: "📊"
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 px-4 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            A Better Learning System:
            <br />
            <span className="text-brightpair">Live Guidance + AI That Grows With Your Child</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.number}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-brightpair-50 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">{step.emoji}</span>
              </div>
              <div className="inline-flex items-center mb-3">
                <div className="bg-brightpair text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  {step.number}
                </div>
                <h3 className="font-display font-semibold">{step.title}</h3>
              </div>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-xl p-8 shadow-sm">
          <h3 className="text-xl md:text-2xl font-display font-bold mb-6 text-center">Why Our Approach Works Better</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Personalized to each student's learning style",
              "Available 24/7 for practice and questions",
              "Adapts to progress and changing needs",
              "Makes learning engaging and motivating",
              "Provides detailed progress tracking",
              "Creates consistency between tutoring sessions"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
