import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChartContainer } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: {
    name: string;
    level: number;
    maxLevel: 5;
    description: string;
    lastImproved?: string;
  }[];
}

const SkillsTracking: React.FC = () => {
  // Mock skill categories
  const skillCategories: SkillCategory[] = [
    {
      id: "academic",
      name: "Academic Skills",
      description: "Core learning and academic abilities",
      skills: [
        { 
          name: "Critical Thinking", 
          level: 4, 
          maxLevel: 5, 
          description: "Ability to analyze information objectively and make reasoned judgments",
          lastImproved: "April 28, 2025"
        },
        { 
          name: "Problem Solving", 
          level: 3, 
          maxLevel: 5, 
          description: "Ability to find solutions to difficult or complex issues",
          lastImproved: "April 25, 2025"
        },
        { 
          name: "Research Skills", 
          level: 4, 
          maxLevel: 5, 
          description: "Ability to gather and analyze information from various sources",
          lastImproved: "April 22, 2025"
        },
        { 
          name: "Numerical Literacy", 
          level: 5, 
          maxLevel: 5, 
          description: "Understanding and working with numbers and data",
          lastImproved: "April 18, 2025"
        },
        { 
          name: "Reading Comprehension", 
          level: 4, 
          maxLevel: 5, 
          description: "Understanding and interpreting written material",
          lastImproved: "April 15, 2025"
        }
      ]
    },
    {
      id: "practical",
      name: "Practical Skills",
      description: "Application-oriented abilities",
      skills: [
        { 
          name: "Time Management", 
          level: 3, 
          maxLevel: 5, 
          description: "Ability to use time effectively and productively",
          lastImproved: "April 26, 2025"
        },
        { 
          name: "Organization", 
          level: 4, 
          maxLevel: 5, 
          description: "Ability to structure tasks, information, and resources effectively",
          lastImproved: "April 24, 2025"
        },
        { 
          name: "Note Taking", 
          level: 5, 
          maxLevel: 5, 
          description: "Recording information effectively during lessons",
          lastImproved: "April 20, 2025"
        },
        { 
          name: "Test Preparation", 
          level: 3, 
          maxLevel: 5, 
          description: "Techniques for effective exam preparation",
          lastImproved: "April 16, 2025"
        }
      ]
    },
    {
      id: "communication",
      name: "Communication Skills",
      description: "Abilities related to expressing ideas",
      skills: [
        { 
          name: "Written Communication", 
          level: 4, 
          maxLevel: 5, 
          description: "Ability to write clearly and effectively",
          lastImproved: "April 27, 2025"
        },
        { 
          name: "Verbal Expression", 
          level: 3, 
          maxLevel: 5, 
          description: "Ability to articulate ideas verbally",
          lastImproved: "April 23, 2025"
        },
        { 
          name: "Presentation Skills", 
          level: 3, 
          maxLevel: 5, 
          description: "Ability to present information to others effectively",
          lastImproved: "April 19, 2025"
        },
        { 
          name: "Active Listening", 
          level: 4, 
          maxLevel: 5, 
          description: "Ability to focus completely on a speaker",
          lastImproved: "April 17, 2025"
        }
      ]
    }
  ];
  
  const [selectedCategory, setSelectedCategory] = useState<string>(skillCategories[0].id);
  
  const currentCategory = skillCategories.find(cat => cat.id === selectedCategory) || skillCategories[0];
  
  // Prepare data for radar chart
  const radarData = currentCategory.skills.map(skill => ({
    skill: skill.name,
    level: skill.level,
    fullMark: skill.maxLevel
  }));

  const chartConfig = {
    level: { theme: { light: "#8B5CF6", dark: "#8B5CF6" } }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {skillCategories.map(category => (
          <Badge 
            key={category.id}
            className={`px-3 py-1 cursor-pointer ${
              selectedCategory === category.id 
                ? "bg-brightpair text-white hover:bg-brightpair/90" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Description */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{currentCategory.name}</CardTitle>
            <CardDescription>{currentCategory.description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Skills Radar Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
            <CardDescription>Visual representation of skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Tooltip />
                    <Radar
                      name="Skill Level"
                      dataKey="level"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Skills List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Skill Details</CardTitle>
            <CardDescription>Detailed breakdown of your skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentCategory.skills.map((skill, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{skill.name}</h4>
                      <p className="text-sm text-gray-500">{skill.description}</p>
                    </div>
                    <Badge variant="outline">Level {skill.level}/{skill.maxLevel}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress value={(skill.level / skill.maxLevel) * 100} className="h-2" />
                    {skill.lastImproved && (
                      <p className="text-xs text-gray-500 text-right">
                        Last improved: {skill.lastImproved}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsTracking;
