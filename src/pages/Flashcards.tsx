
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Sparkles, ChevronLeft, ChevronRight, RotateCcw, Clock, CheckCircle, XCircle } from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

// Mock flashcard sets
const mockFlashcardSets = [
  {
    id: "algebra",
    name: "Algebra Fundamentals",
    count: 12,
  },
  {
    id: "biology",
    name: "Cell Biology",
    count: 8,
  },
  {
    id: "geometry",
    name: "Geometric Formulas",
    count: 10,
  },
];

// Mock flashcards
const mockFlashcards: Record<string, Flashcard[]> = {
  "algebra": [
    { id: "1", front: "What is 3/4 + 1/2?", back: "Common denominator: 6/8 + 4/8 = 10/8 = 1.25" },
    { id: "2", front: "Solve for x: 2x + 5 = 13", back: "2x = 8\nx = 4" },
    { id: "3", front: "Factor x² + 5x + 6", back: "(x + 2)(x + 3)" },
    { id: "4", front: "What is the slope-intercept form?", back: "y = mx + b\nwhere m is the slope and b is the y-intercept" },
  ],
  "biology": [
    { id: "1", front: "What are the main parts of a cell?", back: "Cell membrane, cytoplasm, nucleus, and various organelles" },
    { id: "2", front: "What is the function of mitochondria?", back: "Powerhouse of the cell - generates energy through cellular respiration" },
    { id: "3", front: "What is photosynthesis?", back: "Process where plants convert light energy into chemical energy" },
  ],
  "geometry": [
    { id: "1", front: "What is the formula for the area of a circle?", back: "A = πr²\nwhere r is the radius" },
    { id: "2", front: "What is the Pythagorean theorem?", back: "a² + b² = c²\nwhere c is the hypotenuse" },
  ],
};

const Flashcards: React.FC = () => {
  const [selectedSet, setSelectedSet] = useState<string>("algebra");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [isStudyMode, setIsStudyMode] = useState<boolean>(false);
  const [newTopicInput, setNewTopicInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const flashcards = mockFlashcards[selectedSet] || [];

  const handleFlip = () => {
    setFlipped(!flipped);
    if (cardRef.current) {
      cardRef.current.style.transform = flipped ? "rotateY(0deg)" : "rotateY(180deg)";
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
      if (cardRef.current) {
        cardRef.current.style.transform = "rotateY(0deg)";
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
      if (cardRef.current) {
        cardRef.current.style.transform = "rotateY(0deg)";
      }
    }
  };

  const handleStudyModeToggle = () => {
    setIsStudyMode(!isStudyMode);
    setCurrentIndex(0);
    setFlipped(false);
    if (cardRef.current) {
      cardRef.current.style.transform = "rotateY(0deg)";
    }
  };

  const handleSetChange = (value: string) => {
    setSelectedSet(value);
    setCurrentIndex(0);
    setFlipped(false);
    if (cardRef.current) {
      cardRef.current.style.transform = "rotateY(0deg)";
    }
  };

  const handleGenerateFlashcards = () => {
    if (!newTopicInput.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Enter a specific topic to generate flashcards",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate generating flashcards with GPT-4o
    setTimeout(() => {
      toast({
        title: "Flashcards generated!",
        description: `Created 10 new flashcards on ${newTopicInput}`,
      });
      setIsGenerating(false);
      setNewTopicInput("");
    }, 2000);
  };

  const handleKnownCard = () => {
    toast({
      title: "Card marked as known",
      description: "This card will appear less frequently",
    });
    handleNext();
  };

  const handleUnknownCard = () => {
    toast({
      title: "Card marked for review",
      description: "We'll show this card more frequently",
    });
    handleNext();
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">Flashcards</h1>
            <p className="text-gray-600">Review and memorize key concepts</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button
              variant={isStudyMode ? "default" : "outline"}
              className={isStudyMode ? "bg-brightpair hover:bg-brightpair-600" : ""}
              onClick={handleStudyModeToggle}
            >
              {isStudyMode ? "Exit Study Mode" : "Start Study Mode"}
            </Button>
          </div>
        </div>

        {/* Topic Selection and Generator */}
        {!isStudyMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Your Flashcard Sets</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flashcard-set">Select a flashcard set</Label>
                    <Select value={selectedSet} onValueChange={handleSetChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select flashcard set" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockFlashcardSets.map((set) => (
                          <SelectItem key={set.id} value={set.id}>
                            {set.name} ({set.count} cards)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Recently Studied</h3>
                    <Button variant="ghost" size="sm" className="text-brightpair">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Equations Review", time: "2 hours ago", progress: 80 },
                      { name: "Biology Terms", time: "Yesterday", progress: 60 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                        </div>
                        <div className="w-16 h-1 bg-gray-200 rounded-full">
                          <div 
                            className="h-1 bg-brightpair rounded-full" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Generate New Flashcards</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Enter a specific topic</Label>
                    <div className="flex gap-2">
                      <Input
                        id="topic"
                        placeholder="e.g., Quadratic Equations"
                        value={newTopicInput}
                        onChange={(e) => setNewTopicInput(e.target.value)}
                      />
                      <Button 
                        onClick={handleGenerateFlashcards} 
                        disabled={isGenerating}
                        className="bg-brightpair hover:bg-brightpair-600"
                      >
                        {isGenerating ? "Generating..." : "Generate"}
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Your AI tutor will create custom flashcards based on your learning style.
                  </div>
                  
                  <div className="bg-brightpair-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Sparkles size={18} className="text-brightpair mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium text-sm">Pro tip</p>
                        <p className="text-sm text-gray-600">
                          You can also generate flashcards from your quiz results or AI tutor
                          conversations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Flashcard Viewer */}
        {flashcards.length > 0 ? (
          <div className={`flex flex-col items-center ${isStudyMode ? "pt-8" : ""}`}>
            <div className="w-full max-w-lg">
              {/* Card counter */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  Card {currentIndex + 1} of {flashcards.length}
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentIndex(0);
                      setFlipped(false);
                      if (cardRef.current) {
                        cardRef.current.style.transform = "rotateY(0deg)";
                      }
                    }}
                    disabled={currentIndex === 0}
                  >
                    <RotateCcw size={16} />
                    <span className="ml-1">Reset</span>
                  </Button>
                </div>
              </div>
              
              {/* Flashcard */}
              <div
                ref={cardRef}
                onClick={handleFlip}
                className="h-64 md:h-80 w-full perspective-1000 cursor-pointer mb-6 transition-transform duration-500"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-center items-center 
                  ${flipped ? "opacity-0" : "bg-white shadow-lg border border-gray-200"}`}
                >
                  <div className="text-xl font-medium text-center">
                    {flashcards[currentIndex]?.front}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">Click to reveal answer</div>
                </div>
                <div
                  className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-center items-center 
                  bg-brightpair-50 shadow-lg border border-brightpair-100
                  ${flipped ? "" : "opacity-0"}`}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="text-xl font-medium text-center">
                    {flashcards[currentIndex]?.back}
                  </div>
                  <div className="mt-4 text-sm text-brightpair">Click to see question</div>
                </div>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={20} />
                </Button>
                
                {isStudyMode ? (
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      className="bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
                      onClick={handleUnknownCard}
                    >
                      <XCircle size={16} className="mr-2" />
                      Still Learning
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleKnownCard}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Got It!
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleFlip}
                    className="min-w-[120px]"
                  >
                    {flipped ? "Show Question" : "Show Answer"}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentIndex === flashcards.length - 1}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="text-gray-400 mb-4">
              <Plus size={48} />
            </div>
            <p className="text-lg font-medium mb-2">No flashcards found</p>
            <p className="text-gray-500 mb-4 text-center">
              Create your first set of flashcards by generating them from a topic
            </p>
            <Button className="bg-brightpair hover:bg-brightpair-600">
              Create Flashcards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
