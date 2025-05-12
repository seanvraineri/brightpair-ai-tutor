import React from "react";
import { Link } from "react-router-dom";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";

// The actual Calendly link
const CALENDLY_URL = "https://calendly.com/seanvraineri/brightpair-tutoring-onboarding";

const CTASection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-brightpair-600 to-brightpair-700">
      <div className="container max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
          Ready to Transform Your Child's Learning Experience?
        </h2>
        <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
          Schedule a free consultation and see how a personalized AI tutor can help your child excel.
          No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <ButtonPrimary 
              size="lg" 
              className="bg-white text-brightpair-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-shadow font-semibold"
            >
              Book Free Consultation
            </ButtonPrimary>
          </a>
          <Link to="/signup">
            <ButtonSecondary 
              size="lg" 
              className="bg-blue-100 border-blue-200 text-blue-900 hover:bg-blue-200 hover:text-blue-900 font-semibold shadow-md"
            >
              Create Account
            </ButtonSecondary>
          </Link>
        </div>
        <p className="mt-4 text-white/80 text-sm">
          We recommend booking a consultation first for the best experience
        </p>
      </div>
    </section>
  );
};

export default CTASection;
