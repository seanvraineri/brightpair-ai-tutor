import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ButtonSecondary from "@/components/ButtonSecondary";

// The actual Calendly link
const CALENDLY_URL = "https://calendly.com/seanvraineri/brightpair-tutoring-onboarding";

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 px-4 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Simple Pricing for Better Learning
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started with an affordable subscription and add 1-on-1 human tutoring sessions as needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Free Consultation */}
          <div className="border rounded-md p-8 shadow-sm hover:shadow-card transition-all bg-white">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-display mb-2">Free Consultation</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$0</span>
              </div>
              <p className="text-gray-600 mb-6">
                Experience the power of personalized AI tutoring with no commitment.
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>One initial onboarding session</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Personalized AI tutor demo</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Learning plan recommendation</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Needs assessment</span>
              </li>
            </ul>
            <div className="space-y-3">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="default" className="w-full bg-brightpair hover:bg-brightpair-600">
                  Book Consultation
                </Button>
              </a>
              <Link to="/signup" className="block">
                <ButtonSecondary className="w-full bg-blue-100 border-blue-200 text-blue-900 hover:bg-blue-200 hover:text-blue-900 font-semibold shadow-sm">
                  Create Account
                </ButtonSecondary>
              </Link>
            </div>
          </div>

          {/* Monthly Subscription */}
          <div className="border-2 border-brightpair rounded-md p-8 shadow-lg relative bg-white">
            <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1/2 bg-brightpair text-white py-1 px-4 rounded-md text-sm font-medium">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold font-display mb-2">Monthly</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$50</span>
                <span className="text-gray-500"> / month</span>
              </div>
              <p className="text-gray-600 mb-6">
                Unlock the full potential of personalized AI tutoring.
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Monthly onboarding or review sessions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Fully personalized AI tutor</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Unlimited AI interactions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Advanced flashcards & quizzes</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Detailed progress reports</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Parent dashboard access</span>
              </li>
            </ul>
            <Link to="/signup">
              <Button className="w-full bg-brightpair hover:bg-brightpair-600">
                Subscribe Now
              </Button>
            </Link>
          </div>

          {/* Additional Tutoring */}
          <div className="border rounded-md p-8 shadow-sm hover:shadow-card transition-all bg-white">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-display mb-2">Additional Tutoring</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$100</span>
                <span className="text-gray-500"> / session</span>
              </div>
              <p className="text-gray-600 mb-6">
                Add expert 1-on-1 tutoring sessions whenever needed.
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>60-minute 1-on-1 sessions</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Expert subject tutors</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>AI tutor updates after session</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Flexible scheduling</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-brightpair mt-0.5 mr-2 flex-shrink-0" />
                <span>Session recordings & notes</span>
              </li>
            </ul>
            <ButtonSecondary className="w-full" disabled>
              Available for Subscribers
            </ButtonSecondary>
          </div>
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <p className="text-gray-500 mb-4">
            Subscriptions can be canceled anytime. Need a custom plan for schools or multiple students? 
          </p>
          <Link to="/contact" className="text-brightpair hover:underline">
            Contact us for enterprise pricing
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;