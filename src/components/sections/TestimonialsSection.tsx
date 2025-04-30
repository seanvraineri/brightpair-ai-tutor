
import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer K.",
    role: "Parent of 8th Grader",
    quote: "My son struggled with math anxiety for years. His personalized AI tutor from BrightPair has been a game-changer. He can practice without feeling judged, and his confidence has soared.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Marcus T.",
    role: "Parent of High School Junior",
    quote: "The combination of human tutoring sessions and the AI coach has helped my daughter raise her SAT scores by over 200 points. The 24/7 availability means she can study when she's most motivated.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Sarah L.",
    role: "Parent of 5th Grader",
    quote: "My daughter is a visual learner who was falling behind in reading. BrightPair personalized her AI tutor to match her learning style with more diagrams and visual cues. She's now reading above grade level.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-brightpair-50">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Parents and Students Love BrightPair
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how our personalized approach to learning is helping students succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
