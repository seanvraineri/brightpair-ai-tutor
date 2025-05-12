import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, BookOpen, Calculator, Globe, School, PenTool, Brain, Beaker } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { generateQuiz, getStudentMastery, getTopicPassages, Quiz } from "@/services/quizService";

interface QuizGeneratorProps {
  onQuizGenerated: (quiz: Quiz) => void;
}

// Function to generate topic suggestions based on input and current subject/area
const getTopicSuggestions = (input: string, subject: string, ageGroup: string) => {
  // If input is too short, don't generate suggestions
  if (!input || input.length < 2) return [];
  
  const normalizedInput = input.toLowerCase().trim();
  
  // Base suggestion data with subject/age appropriateness
  const allSuggestions = [
    // Math topics by age group
    { subject: 'math', age: 'elementary', topics: ['Addition', 'Subtraction', 'Basic Multiplication', 'Simple Fractions', 'Shapes', 'Counting Money', 'Telling Time'] },
    { subject: 'math', age: 'middleSchool', topics: ['Pre-Algebra', 'Decimals', 'Percentages', 'Geometry Basics', 'Ratios & Proportions', 'Integer Operations', 'Basic Statistics'] },
    { subject: 'math', age: 'highSchool', topics: ['Algebra I', 'Algebra II', 'Geometry', 'Trigonometry', 'Pre-Calculus', 'Statistics', 'Probability'] },
    { subject: 'math', age: 'college', topics: ['Calculus I', 'Calculus II', 'Linear Algebra', 'Differential Equations', 'Abstract Algebra', 'Real Analysis', 'Number Theory'] },
    
    // Science topics by age group
    { subject: 'science', age: 'elementary', topics: ['Plants & Animals', 'Weather', 'Earth & Space', 'Human Body', 'Five Senses', 'States of Matter', 'Simple Machines'] },
    { subject: 'science', age: 'middleSchool', topics: ['Earth Science', 'Life Science', 'Physical Science', 'Ecosystems', 'Cell Biology', 'Astronomy', 'Environmental Science'] },
    { subject: 'science', age: 'highSchool', topics: ['Biology', 'Chemistry', 'Physics', 'Anatomy', 'Ecology', 'Genetics', 'Scientific Method'] },
    { subject: 'science', age: 'college', topics: ['Organic Chemistry', 'Biochemistry', 'Molecular Biology', 'Quantum Physics', 'Thermodynamics', 'Evolutionary Biology', 'Microbiology'] },
    
    // Language Arts/English topics
    { subject: 'english', age: 'elementary', topics: ['Phonics', 'Sight Words', 'Reading Comprehension', 'Basic Grammar', 'Punctuation', 'Storytelling', 'Vocabulary Building'] },
    { subject: 'english', age: 'middleSchool', topics: ['Grammar Rules', 'Essay Writing', 'Literary Elements', 'Poetry', 'Reading Comprehension', 'Vocabulary', 'Parts of Speech'] },
    { subject: 'english', age: 'highSchool', topics: ['American Literature', 'British Literature', 'World Literature', 'Essay Analysis', 'Creative Writing', 'Research Papers', 'Rhetoric'] },
    { subject: 'english', age: 'college', topics: ['Literary Theory', 'Composition', 'Advanced Literature', 'Linguistics', 'Technical Writing', 'Critical Analysis', 'Contemporary Literature'] },
    
    // Social Studies/History topics
    { subject: 'history', age: 'elementary', topics: ['Community Helpers', 'National Symbols', 'Map Skills', 'Famous Americans', 'Native Americans', 'World Cultures', 'Holidays & Traditions'] },
    { subject: 'history', age: 'middleSchool', topics: ['Ancient Civilizations', 'U.S. History', 'World Geography', 'Government', 'Economics', 'Cultural Studies', 'Medieval History'] },
    { subject: 'history', age: 'highSchool', topics: ['World History', 'U.S. History', 'Government & Politics', 'Economics', 'Geography', 'Sociology', 'Current Events'] },
    { subject: 'history', age: 'college', topics: ['Political Science', 'International Relations', 'Economic Theory', 'Ancient History', 'Modern History', 'Social Theory', 'Cultural Anthropology'] }
  ];
  
  // Get suggestions appropriate for the user's age group 
  let matchedTopics: string[] = [];
  
  // Add topics from selected age group
  const ageGroupTopics = allSuggestions
    .filter(group => {
      // For younger students, only show age-appropriate content
      // For older students, they can also see some content from lower age groups
      if (ageGroup === 'elementary') {
        return group.age === 'elementary';
      } else if (ageGroup === 'middleSchool') {
        return group.age === 'middleSchool' || group.age === 'elementary';
      } else if (ageGroup === 'highSchool') {
        return group.age === 'highSchool' || group.age === 'middleSchool';
      } else {
        // College can see everything
        return true;
      }
    })
    .flatMap(group => group.topics);
  
  // Filter for topics that match the input
  matchedTopics = ageGroupTopics.filter(topic => 
    topic.toLowerCase().includes(normalizedInput)
  );
  
  // Prioritize exact matches and topics that start with the input
  matchedTopics.sort((a, b) => {
    if (a.toLowerCase() === normalizedInput) return -1;
    if (b.toLowerCase() === normalizedInput) return 1;
    
    if (a.toLowerCase().startsWith(normalizedInput) && 
        !b.toLowerCase().startsWith(normalizedInput)) return -1;
    if (b.toLowerCase().startsWith(normalizedInput) && 
        !a.toLowerCase().startsWith(normalizedInput)) return 1;
    
    return a.localeCompare(b);
  });
  
  // Limit to a reasonable number of suggestions
  return matchedTopics.slice(0, 8);
};

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onQuizGenerated }) => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [focusSkill, setFocusSkill] = useState("auto");
  const [ageGroup, setAgeGroup] = useState<string>("middleSchool");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<string>("math");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Determine appropriate age group based on user profile (if available)
  useEffect(() => {
    if (user?.gamification?.interests) {
      const interests = user.gamification.interests;
      if (interests.includes('elementary') || interests.includes('primary')) {
        setAgeGroup('elementary');
      } else if (interests.includes('high school') || interests.includes('secondary')) {
        setAgeGroup('highSchool');
      } else if (interests.includes('college') || interests.includes('university')) {
        setAgeGroup('college');
      }
      
      // Try to determine user's current subject from interests
      if (interests.includes('math') || interests.includes('mathematics')) {
        setCurrentSubject('math');
      } else if (interests.includes('science') || interests.includes('biology') || interests.includes('chemistry')) {
        setCurrentSubject('science');
      } else if (interests.includes('english') || interests.includes('language')) {
        setCurrentSubject('english');
      } else if (interests.includes('history') || interests.includes('social studies')) {
        setCurrentSubject('history');
      }
    }
  }, [user]);
  
  // Update suggestions when input changes
  useEffect(() => {
    if (topic.length >= 2) {
      const newSuggestions = getTopicSuggestions(topic, currentSubject, ageGroup);
      setSuggestions(newSuggestions);
      if (newSuggestions.length > 0) {
        setShowSuggestions(true);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [topic, currentSubject, ageGroup]);

  // Mock skills for demonstration
  const mockSkills = [
    { skill_id: "algebra", name: "Algebra", mastery: 0.7 },
    { skill_id: "geometry", name: "Geometry", mastery: 0.5 },
    { skill_id: "calculus", name: "Calculus", mastery: 0.3 },
    { skill_id: "statistics", name: "Statistics", mastery: 0.8 },
  ];

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    
    try {
      // Check if we're in an environment where we can access the backend
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        // For demo/development purposes
        const mockQuiz: Quiz = {
          skill_id: focusSkill !== "auto" ? focusSkill : mockSkills[0].skill_id,
          quiz: [
            {
              id: "q1",
              type: "mcq",
              difficulty: "easy",
              stem: "Solve for x: 2x + 5 = 15",
              choices: ["x = 5", "x = 10", "x = 7.5", "x = 5.5"],
              answer: "0",
              rationale: "To solve for x, subtract 5 from both sides: 2x = 10. Then divide by 2: x = 5."
            },
            {
              id: "q2",
              type: "mcq",
              difficulty: "med",
              stem: "Which of the following is a quadratic function?",
              choices: ["f(x) = 3x + 2", "f(x) = x²+ 5x + 6", "f(x) = 1/x", "f(x) = √x"],
              answer: "1",
              rationale: "A quadratic function has the form f(x) = ax² + bx + c, where a ≠ 0."
            },
            {
              id: "q3",
              type: "mcq",
              difficulty: "hard",
              stem: "Evaluate the limit: lim(x→0) sin(x)/x",
              choices: ["0", "1", "∞", "The limit does not exist"],
              answer: "1",
              rationale: "This is a famous limit in calculus that equals 1, which can be proven using L'Hôpital's rule or by analyzing the behavior near x = 0."
            },
            {
              id: "q4",
              type: "mcq",
              difficulty: "med",
              stem: "What is the derivative of f(x) = e^x?",
              choices: ["f'(x) = e^x", "f'(x) = x·e^x", "f'(x) = ln(x)", "f'(x) = 1/x"],
              answer: "0",
              rationale: "The derivative of e^x is itself, e^x."
            },
            {
              id: "q5",
              type: "mcq",
              difficulty: "hard",
              stem: "Which of the following is an inflection point of f(x) = x³ - 3x² + 2?",
              choices: ["x = 0", "x = 1", "x = 2", "x = 3"],
              answer: "1",
              rationale: "At an inflection point, the second derivative equals zero and changes sign. For f(x) = x³ - 3x², f''(x) = 6x - 6, which equals 0 when x = 1."
            }
          ]
        };
        
        setTimeout(() => {
          // Create a mock quiz
          onQuizGenerated(mockQuiz);
          
          toast({
            title: "Quiz Generated!",
            description: `Created a quiz with ${mockQuiz.quiz.length} questions on ${topic || "calculus"}.`,
          });
          
          setIsGenerating(false);
          setTopic("");
          setShowSuggestions(false);
        }, 2000);
        
        return; // Skip the rest for the mock implementation
      }
      
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate quiz",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setTopic(suggestion);
    setShowSuggestions(false);
  };
  
  // Get icon for subject category
  const getSubjectIcon = (topic: string) => {
    const lowerTopic = topic.toLowerCase();
    
    // Match topic to a subject by keywords
    if (lowerTopic.includes('math') || lowerTopic.includes('algebra') || 
        lowerTopic.includes('geometry') || lowerTopic.includes('calculus') ||
        lowerTopic.includes('statistic')) {
      return <Calculator size={16} />;
    } else if (lowerTopic.includes('science') || lowerTopic.includes('biology') || 
              lowerTopic.includes('chemistry') || lowerTopic.includes('physics')) {
      return <Beaker size={16} />;
    } else if (lowerTopic.includes('history') || lowerTopic.includes('geography') ||
              lowerTopic.includes('government') || lowerTopic.includes('economics')) {
      return <School size={16} />;
    } else if (lowerTopic.includes('english') || lowerTopic.includes('literature') ||
              lowerTopic.includes('writing') || lowerTopic.includes('grammar')) {
      return <BookOpen size={16} />;
    } else if (lowerTopic.includes('psychology') || lowerTopic.includes('sociology')) {
      return <Brain size={16} />;
    } else {
      return <PenTool size={16} />;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Generate Adaptive Quiz</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-select">Focus on a specific skill (optional)</Label>
            <Select value={focusSkill} onValueChange={setFocusSkill}>
              <SelectTrigger id="skill-select" className="border-gray-300 bg-white">
                <SelectValue placeholder="Select a skill to practice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Target my weakest skill</SelectItem>
                {mockSkills.map((skill) => (
                  <SelectItem key={skill.skill_id} value={skill.skill_id}>
                    {skill.name} ({Math.round(skill.mastery * 100)}% mastery)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic">Quiz Topic (optional)</Label>
            <div className="relative">
              <Input
                id="topic"
                placeholder={ageGroup === 'elementary' ? "e.g., Basic Math, Animals" : "e.g., Algebra, Chemistry"}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="border-gray-300 bg-white"
              />
              
              {/* Topic suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="p-2 border-b">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Suggested Quiz Topics</span>
                      <button 
                        className="text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => setShowSuggestions(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-left text-sm w-full"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {getSubjectIcon(suggestion)}
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateQuiz} 
            disabled={isGenerating}
            className="w-full bg-brightpair hover:bg-brightpair-600 text-white border border-brightpair-600"
          >
            {isGenerating ? "Generating..." : "Generate Adaptive Quiz"}
          </Button>
          
          <div className="text-sm text-gray-500">
            Your AI tutor will create a quiz based on your personalized mastery data, 
            focusing on areas where you need the most practice.
          </div>
          
          <div className="bg-brightpair-50 p-4 rounded">
            <div className="flex items-start">
              <Sparkles size={18} className="text-brightpair mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-sm">Pro tip</p>
                <p className="text-sm text-gray-600">
                  Start typing a topic to see suggestions for age-appropriate quizzes tailored to your level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizGenerator; 