
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { generateFlashcards, Flashcard } from "@/services/flashcardService";

interface FlashcardGeneratorProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
}

const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = ({ onFlashcardsGenerated }) => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [count, setCount] = useState<number>(10);
  const { toast } = useToast();
  const { user, session } = useUser();

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
        difficulty: difficulty as 'easy' | 'medium' | 'hard'
      });

      toast({
        title: "Flashcards Generated!",
        description: `Created ${flashcards.length} new flashcards on ${topic}`,
      });

      onFlashcardsGenerated(flashcards);
      setTopic("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate flashcards",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Generate New Flashcards</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Enter a specific topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Quadratic Equations"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
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
              <Select value={count.toString()} onValueChange={(value) => setCount(parseInt(value))}>
                <SelectTrigger id="count">
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
            className="w-full bg-brightpair hover:bg-brightpair-600"
          >
            {isGenerating ? "Generating..." : "Generate Flashcards"}
          </Button>
          
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
  );
};

export default FlashcardGenerator;
