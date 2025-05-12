import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import ButtonPrimary from "@/components/ButtonPrimary";

// Add the Calendly URL constant
const CALENDLY_URL = "https://calendly.com/seanvraineri/brightpair-tutoring-onboarding";

const steps = [
  {
    number: 1,
    title: "Consultation",
    description: "We start with a free consultation to understand your child's needs.",
    emoji: "📆"
  },
  {
    number: 2,
    title: "Human Tutor Match",
    description: "We pair your child with an expert tutor in their subject area.",
    emoji: "👨‍🏫"
  },
  {
    number: 3,
    title: "Custom Plan",
    description: "The tutor creates a personalized learning plan for your child.",
    emoji: "📝"
  },
  {
    number: 4,
    title: "AI Tutor Setup",
    description: "We create an AI tutor that matches your child's learning style.",
    emoji: "🤖"
  }
];

const HowItWorksSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="how-it-works" className="py-24 md:py-32 px-4 bg-white">
      <div className="container max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            A Better Learning System:
            <br />
            <span className="text-brightpair">Live Guidance + AI That Grows With Your Child</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step) => (
            <motion.div 
              key={step.number}
              className="bg-white p-6 rounded-md border border-gray-100 shadow-sm hover:shadow-card transition-all duration-300"
              variants={itemVariants}
            >
              <div className="bg-brightpair-50 w-14 h-14 rounded-md flex items-center justify-center mb-6">
                <span className="text-2xl">{step.emoji}</span>
              </div>
              <div className="inline-flex items-center mb-3">
                <div className="bg-brightpair text-white text-sm font-medium rounded-md w-6 h-6 flex items-center justify-center mr-2">
                  {step.number}
                </div>
                <h3 className="font-display font-semibold">{step.title}</h3>
              </div>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 bg-gray-50 rounded-md p-8 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h3 className="text-xl md:text-2xl font-display font-bold mb-6 text-center">Why Our Approach Works Better</h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              "Personalized to each student's learning style",
              "Available 24/7 for practice and questions",
              "Adapts to progress and changing needs",
              "Makes learning engaging and motivating",
              "Provides detailed progress tracking",
              "Creates consistency between tutoring sessions"
            ].map((benefit, index) => (
              <motion.div 
                key={index} 
                className="flex items-start"
                variants={itemVariants}
              >
                <CheckCircle className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Add CTA Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <ButtonPrimary 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-brightpair-600 hover:from-blue-700 hover:to-brightpair-700 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Book Your Free Consultation
            </ButtonPrimary>
          </a>
          <p className="mt-4 text-gray-600 text-sm">No credit card required. See if BrightPair is right for your child.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
