
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Gauge, Target } from "lucide-react";

interface PersonalizationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const PersonalizationCard: React.FC<PersonalizationCardProps> = ({
  icon: Icon,
  title,
  description
}) => (
  <Card className="border-0 shadow-md hover:shadow-lg transition-all">
    <CardContent className="p-6 flex flex-col items-start">
      <div className="bg-brightpair-50 p-3 rounded-full mb-4">
        <Icon className="h-6 w-6 text-brightpair" />
      </div>
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const PersonalizationSection: React.FC = () => {
  const benefits = [
    {
      icon: Brain,
      title: "Learning Style Matched",
      description: "We adapt to visual, auditory, or hands-on learning preferences with personalized content formats."
    },
    {
      icon: Zap,
      title: "Interest-Driven Examples",
      description: "Content incorporates your child's interests—from sports to gaming—making learning relevant and engaging."
    },
    {
      icon: Gauge,
      title: "Adaptive Pacing",
      description: "Our system adjusts to your child's optimal pace, slowing down for difficult concepts and accelerating through mastered ones."
    },
    {
      icon: Target,
      title: "Precision Gap Filling",
      description: "We identify and target specific knowledge gaps with tailored practice that builds confidence and mastery."
    }
  ];

  return (
    <section id="personalization" className="py-20 px-4 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Personalization That Makes the Difference
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our approach combines data-driven insights with human expertise to create
            a learning experience uniquely tailored to your child.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <PersonalizationCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
        
        <div className="mt-12 bg-brightpair-50 p-6 md:p-8 rounded-xl text-center">
          <p className="text-lg font-medium">
            Our personalization isn't just about preferences—it's built on cognitive science and 
            real-time learning data that adapts with your child's growth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PersonalizationSection;
