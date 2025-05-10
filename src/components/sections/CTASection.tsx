
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ButtonPrimary from "@/components/ButtonPrimary";

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
            <ButtonPrimary size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              Book Free Consultation
            </ButtonPrimary>
          </a>
          <Link to="/contact">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-brightpair-600 font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
