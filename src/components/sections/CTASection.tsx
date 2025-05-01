
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection: React.FC = () => {
  return <section className="py-16 md:py-20 px-4 bg-brightpair">
      <div className="container max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
          Ready to Transform Your Child's Learning Experience?
        </h2>
        <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
          Start your 14-day free trial and see how a personalized AI tutor can help your child excel.
          No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="bg-white text-brightpair hover:bg-gray-100">
              Start Free Trial
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="border-white hover:bg-brightpair-600 text-slate-50">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};

export default CTASection;
