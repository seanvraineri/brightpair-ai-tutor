
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const TutorFAQ: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <main className="flex-grow py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Frequently Asked Questions for <span className="text-brightpair">Tutors</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Learn more about how joining the BrightPair Network can transform your tutoring practice
              and grow your business.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the BrightPair tutoring model work?</AccordionTrigger>
              <AccordionContent>
                <p>BrightPair combines traditional 1-on-1 tutoring with a personalized AI learning coach that supports your students between tutoring sessions. As a tutor, you'll:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Conduct initial sessions to understand student needs</li>
                  <li>Help customize the AI coach to match their learning style</li>
                  <li>Receive analytics and insights on student progress</li>
                  <li>Focus your sessions on areas where human interaction has the most impact</li>
                  <li>Earn commission on BrightPair subscriptions from your referred students</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>What subjects does BrightPair support?</AccordionTrigger>
              <AccordionContent>
                <p>We currently support tutoring in the following areas:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Math (K-12 through college level)</li>
                  <li>Science (Physics, Chemistry, Biology)</li>
                  <li>English & Language Arts</li>
                  <li>History & Social Studies</li>
                  <li>Foreign Languages (Spanish, French, Mandarin)</li>
                  <li>Standardized Test Prep (SAT, ACT, AP exams)</li>
                </ul>
                <p className="mt-2">We're expanding to new subject areas regularly. If you specialize in a different subject, please mention it in your application.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>How does tutor compensation work?</AccordionTrigger>
              <AccordionContent>
                <p>Tutors in the BrightPair network earn money in two ways:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li><strong>Direct Tutoring Fees:</strong> You set your own hourly rates for 1-on-1 sessions, which are paid directly to you.</li>
                  <li><strong>Referral Commissions:</strong> You earn 20% commission on all BrightPair subscription fees from students you refer for a full year. With our base subscription at $50/month, that's $10/month per student.</li>
                </ol>
                <p className="mt-2">For example, if you refer 10 students who subscribe to BrightPair, you could earn an additional $1,200/year in passive income ($10 × 10 students × 12 months).</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>What qualifications do I need to apply?</AccordionTrigger>
              <AccordionContent>
                <p>We look for tutors who have:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>At least 1 year of teaching or tutoring experience</li>
                  <li>Bachelor's degree or higher (preferred)</li>
                  <li>Subject matter expertise in at least one core academic area</li>
                  <li>Comfort with technology and willingness to learn our AI-enhanced platform</li>
                  <li>Strong communication skills</li>
                  <li>Passion for helping students learn in personalized ways</li>
                </ul>
                <p className="mt-2">We especially value tutors who have experience working with diverse learning styles and educational needs.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>What makes BrightPair different from other tutoring platforms?</AccordionTrigger>
              <AccordionContent>
                <p>BrightPair is fundamentally different from traditional tutoring platforms in several ways:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>AI Enhancement:</strong> Our proprietary AI tutor provides continuous support between human sessions</li>
                  <li><strong>Learning Style Adaptation:</strong> The AI is customized to each student's unique learning profile</li>
                  <li><strong>Data-Driven Insights:</strong> Both tutors and parents receive detailed analytics on progress</li>
                  <li><strong>Passive Income:</strong> Our commission model allows tutors to earn while they sleep</li>
                  <li><strong>Focused Sessions:</strong> With AI handling repetitive practice, human tutors can focus on higher-value activities</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="text-center">
            <p className="font-display font-semibold text-lg mb-4">Ready to transform your tutoring business?</p>
            <Link to="/tutor-signup">
              <Button size="lg" className="bg-brightpair hover:bg-brightpair-600 text-white">
                Apply to Join the Network
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TutorFAQ;
