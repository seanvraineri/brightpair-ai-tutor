import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, HandCoins, Users } from "lucide-react";
import ButtonSecondary from "@/components/ButtonSecondary";

const TutorsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            For Tutors: <span className="text-brightpair">Amplify Your Impact</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join the BrightPair Network and transform how you deliver results for your students while growing your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm hover:shadow-card transition-all duration-300">
            <div className="mb-6 bg-brightpair-50 w-14 h-14 rounded-md flex items-center justify-center">
              <Award className="h-7 w-7 text-brightpair" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Enhance Student Success</h3>
            <p className="text-gray-600 mb-4">
              Give your students 24/7 AI reinforcement that's personalized to their learning style based on your expertise and guidance.
            </p>
            <p className="text-gray-600">
              Our data shows students with BrightPair AI support improve 2-3x faster than with traditional tutoring alone.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm hover:shadow-card transition-all duration-300">
            <div className="mb-6 bg-brightpair-50 w-14 h-14 rounded-md flex items-center justify-center">
              <HandCoins className="h-7 w-7 text-brightpair" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Grow Your Income</h3>
            <p className="text-gray-600 mb-4">
              Earn recurring revenue from each student who subscribes to BrightPair through your referral, on top of your regular tutoring fees.
            </p>
            <p className="text-gray-600">
              Tutors earn a 20% commission on all subscriptions from referred students for the first year.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm hover:shadow-card transition-all duration-300">
            <div className="mb-6 bg-brightpair-50 w-14 h-14 rounded-md flex items-center justify-center">
              <Users className="h-7 w-7 text-brightpair" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Join Our Community</h3>
            <p className="text-gray-600 mb-4">
              Access professional development, specialized AI training, and connect with like-minded educators who are embracing the future of learning.
            </p>
            <p className="text-gray-600">
              Limited spots available in our pilot program for certified tutors and teachers.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-200 shadow-sm p-8 md:p-10 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">Ready to Transform Your Tutoring Business?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Apply to join our network of forward-thinking educators who are leveraging AI to provide better results for their students while growing their practices.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/tutor-signup">
              <Button size="lg" className="bg-brightpair hover:bg-brightpair-600 text-white">
                Apply to Join
              </Button>
            </Link>
            <Link to="/tutor-faq">
              <ButtonSecondary size="lg">
                Learn More
              </ButtonSecondary>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorsSection;
