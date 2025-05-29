import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Beaker,
  BookOpen,
  Brain,
  Calculator,
  Globe,
  Music,
  Palette,
  PenTool,
  School,
  Sparkles,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Flashcard, generateFlashcards } from "@/services/flashcardService";
import { Slider } from "@/components/ui/slider";

interface FlashcardGeneratorProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
}

// Topic suggestion interface
interface TopicSuggestion {
  title: string;
  category: string;
  level: "elementary" | "middleSchool" | "highSchool" | "college";
  keywords: string[];
}

// Sample topics database - in a real app, this would come from an API
const topicsDatabase: TopicSuggestion[] = [
  // Elementary topics
  {
    title: "Basic Addition",
    category: "Math",
    level: "elementary",
    keywords: ["math", "addition", "elementary", "basic"],
  },
  {
    title: "Subtraction Facts",
    category: "Math",
    level: "elementary",
    keywords: ["math", "subtraction", "elementary", "basic"],
  },
  {
    title: "Animal Habitats",
    category: "Science",
    level: "elementary",
    keywords: ["animal", "habitat", "science", "nature"],
  },
  {
    title: "Sight Words",
    category: "English",
    level: "elementary",
    keywords: ["reading", "words", "language", "english"],
  },
  {
    title: "Solar System",
    category: "Science",
    level: "elementary",
    keywords: ["planets", "space", "astronomy", "science"],
  },
  {
    title: "Weather Types",
    category: "Science",
    level: "elementary",
    keywords: ["weather", "climate", "science", "meteorology"],
  },
  {
    title: "Simple Fractions",
    category: "Math",
    level: "elementary",
    keywords: ["math", "fractions", "numbers", "parts"],
  },

  // Middle school topics
  {
    title: "Pre-Algebra",
    category: "Math",
    level: "middleSchool",
    keywords: ["math", "algebra", "equations", "variables"],
  },
  {
    title: "Earth Science",
    category: "Science",
    level: "middleSchool",
    keywords: ["science", "geology", "earth", "geography"],
  },
  {
    title: "Ancient Egypt",
    category: "History",
    level: "middleSchool",
    keywords: ["history", "egypt", "pharaohs", "ancient"],
  },
  {
    title: "Grammar Rules",
    category: "English",
    level: "middleSchool",
    keywords: ["english", "grammar", "writing", "language"],
  },
  {
    title: "Cell Biology",
    category: "Science",
    level: "middleSchool",
    keywords: ["science", "biology", "cells", "microscopic"],
  },
  {
    title: "World Geography",
    category: "Social Studies",
    level: "middleSchool",
    keywords: ["geography", "countries", "continents", "maps"],
  },

  // High school topics
  {
    title: "Algebra II",
    category: "Math",
    level: "highSchool",
    keywords: ["math", "algebra", "advanced", "equations"],
  },
  {
    title: "Chemistry Basics",
    category: "Science",
    level: "highSchool",
    keywords: ["science", "chemistry", "elements", "compounds"],
  },
  {
    title: "World War II",
    category: "History",
    level: "highSchool",
    keywords: ["history", "war", "global", "military"],
  },
  {
    title: "Shakespeare Plays",
    category: "Literature",
    level: "highSchool",
    keywords: ["literature", "plays", "drama", "writing"],
  },
  {
    title: "Photosynthesis",
    category: "Biology",
    level: "highSchool",
    keywords: ["biology", "plants", "science", "process"],
  },
  {
    title: "Trigonometry",
    category: "Math",
    level: "highSchool",
    keywords: ["math", "angles", "triangles", "sine"],
  },

  // College topics
  {
    title: "Calculus",
    category: "Math",
    level: "college",
    keywords: ["math", "calculus", "derivatives", "integrals"],
  },
  {
    title: "Organic Chemistry",
    category: "Science",
    level: "college",
    keywords: ["chemistry", "organic", "compounds", "carbon"],
  },
  {
    title: "Psychology",
    category: "Social Science",
    level: "college",
    keywords: ["psychology", "mind", "behavior", "cognition"],
  },
  {
    title: "Economics",
    category: "Social Science",
    level: "college",
    keywords: ["economics", "market", "finance", "business"],
  },
  {
    title: "Philosophy",
    category: "Humanities",
    level: "college",
    keywords: ["philosophy", "ethics", "thinking", "concepts"],
  },
  {
    title: "Molecular Biology",
    category: "Science",
    level: "college",
    keywords: ["biology", "molecules", "dna", "cells"],
  },
];

// Topic suggestion icon mapping
const topicIcons = {
  "Math": <Calculator size={16} />,
  "Science": <Beaker size={16} />,
  "English": <PenTool size={16} />,
  "Literature": <BookOpen size={16} />,
  "History": <School size={16} />,
  "Social Studies": <Globe size={16} />,
  "Social Science": <Brain size={16} />,
  "Biology": <Beaker size={16} />,
  "Humanities": <BookOpen size={16} />,
  "Music": <Music size={16} />,
  "Art": <Palette size={16} />,
};

const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = (
  { onFlashcardsGenerated },
) => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [count, setCount] = useState<number>(10);
  const [ageGroup, setAgeGroup] = useState<string>("middleSchool");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    TopicSuggestion[]
  >([]);
  const { toast } = useToast();
  const { user, session } = useUser();

  // Determine appropriate age group based on user profile (if available)
  useEffect(() => {
    if (user?.gamification?.interests) {
      const interests = user.gamification.interests;
      if (interests.includes("elementary") || interests.includes("primary")) {
        setAgeGroup("elementary");
      } else if (
        interests.includes("high school") || interests.includes("secondary")
      ) {
        setAgeGroup("highSchool");
      } else if (
        interests.includes("college") || interests.includes("university")
      ) {
        setAgeGroup("college");
      }
    }
  }, [user]);

  // Update suggestions when the topic input changes
  useEffect(() => {
    if (!topic.trim() || topic.length < 2) {
      // If input is empty or too short, don't show suggestions
      setFilteredSuggestions([]);
      return;
    }

    // Filter topics based on input and age group
    const normalizedInput = topic.toLowerCase();
    const matchedTopics = topicsDatabase.filter((topicItem) => {
      // Match by title or keywords
      const titleMatch = topicItem.title.toLowerCase().includes(
        normalizedInput,
      );
      const keywordMatch = topicItem.keywords.some((keyword) =>
        keyword.toLowerCase().includes(normalizedInput)
      );

      // Check if the topic is appropriate for the user's age/level
      // For younger students, show only their level
      // For older students, can also show topics from lower levels
      if (ageGroup === "elementary") {
        return (titleMatch || keywordMatch) && topicItem.level === "elementary";
      } else if (ageGroup === "middleSchool") {
        return (titleMatch || keywordMatch) &&
          (topicItem.level === "middleSchool" ||
            topicItem.level === "elementary");
      } else if (ageGroup === "highSchool") {
        return (titleMatch || keywordMatch) &&
          (topicItem.level === "highSchool" ||
            topicItem.level === "middleSchool");
      } else {
        // College students can see any level
        return titleMatch || keywordMatch;
      }
    });

    // Sort suggestions by relevance - exact matches first
    const sortedMatches = [...matchedTopics].sort((a, b) => {
      // Prioritize exact title matches
      if (a.title.toLowerCase() === normalizedInput) return -1;
      if (b.title.toLowerCase() === normalizedInput) return 1;

      // Then prioritize title starts with input
      if (
        a.title.toLowerCase().startsWith(normalizedInput) &&
        !b.title.toLowerCase().startsWith(normalizedInput)
      ) return -1;
      if (
        b.title.toLowerCase().startsWith(normalizedInput) &&
        !a.title.toLowerCase().startsWith(normalizedInput)
      ) return 1;

      // Then sort by level appropriateness
      const levelOrder = {
        "elementary": 0,
        "middleSchool": 1,
        "highSchool": 2,
        "college": 3,
      };
      const userLevelValue = levelOrder[ageGroup as keyof typeof levelOrder];

      const aLevelDiff = Math.abs(
        levelOrder[a.level as keyof typeof levelOrder] - userLevelValue,
      );
      const bLevelDiff = Math.abs(
        levelOrder[b.level as keyof typeof levelOrder] - userLevelValue,
      );

      return aLevelDiff - bLevelDiff;
    });

    // Set a limit to show only the most relevant
    setFilteredSuggestions(sortedMatches.slice(0, 8));
  }, [topic, ageGroup]);

  const handleGenerateFlashcards = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a specific topic for your flashcards",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const flashcards = await generateFlashcards({
        topic,
        count,
        studentId: session?.user?.id,
        difficulty: difficulty as "easy" | "medium" | "hard",
      });

      toast({
        title: "Flashcards Generated!",
        description: `Created ${flashcards.length} new flashcards on ${topic}`,
      });

      onFlashcardsGenerated(flashcards);
      setTopic("");
      setShowSuggestions(false);
    } catch (error) {
      
      toast({
        title: "Generation Failed",
        description: error instanceof Error
          ? error.message
          : "Failed to generate flashcards",
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

  const getTopicIcon = (category: string) => {
    return topicIcons[category as keyof typeof topicIcons] || (
      <BookOpen size={16} />
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Generate New Flashcards</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Enter a specific topic</Label>
            <div className="relative">
              <Input
                id="topic"
                placeholder={ageGroup === "elementary"
                  ? "e.g., Addition, Animals"
                  : "e.g., Algebra, Chemistry"}
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (e.target.value.length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                onFocus={() => {
                  if (topic.length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
              />

              {/* Smart Topic suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="p-2 border-b">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Suggested Topics
                      </span>
                      <button
                        className="text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => setShowSuggestions(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-left text-sm w-full"
                        onClick={() => selectSuggestion(suggestion.title)}
                      >
                        {getTopicIcon(suggestion.category)}
                        <span>{suggestion.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger
                  id="difficulty"
                  className="border-gray-300 bg-white"
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of cards</Label>
              <Select
                value={count.toString()}
                onValueChange={(value) => setCount(parseInt(value))}
              >
                <SelectTrigger id="count" className="border-gray-300 bg-white">
                  <SelectValue placeholder="Number of cards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 cards</SelectItem>
                  <SelectItem value="10">10 cards</SelectItem>
                  <SelectItem value="15">15 cards</SelectItem>
                  <SelectItem value="20">20 cards</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerateFlashcards}
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-brightpair hover:bg-brightpair-600 text-white border border-brightpair-600"
          >
            {isGenerating ? "Generating..." : "Generate Flashcards"}
          </Button>

          <div className="text-sm text-gray-500">
            Your AI tutor will create custom flashcards based on your learning
            style.
          </div>

          <div className="bg-brightpair-50 p-4 rounded">
            <div className="flex items-start">
              <Sparkles size={18} className="text-brightpair mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-sm">Pro tip</p>
                <p className="text-sm text-gray-600">
                  Start typing to see topic suggestions related to your current
                  grade level and interests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardGenerator;
