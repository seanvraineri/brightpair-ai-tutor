import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Sparkles, ChevronLeft, ChevronRight, RotateCcw, Clock, CheckCircle, XCircle } from "lucide-react";
import FlashcardGenerator from "@/components/flashcards/FlashcardGenerator";
import FileUploader from "@/components/flashcards/FileUploader";
import { getFlashcardSets, Flashcard, FlashcardSet, getFlashcardSetById } from "@/services/flashcardService";
import { useUser } from "@/contexts/UserContext";
import PrettyMath from "@/components/ui/PrettyMath";
import { formatMessage } from "@/utils/messageFormatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const Flashcards: React.FC = () => {
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [isStudyMode, setIsStudyMode] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([]);
  const [userFlashcardSets, setUserFlashcardSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCards, setIsLoadingCards] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const displayFlashcardSets = userFlashcardSets;

  useEffect(() => {
    const loadCards = async () => {
      // Handle generated set locally
      if (selectedSet === "generated") {
        setFlashcards(generatedFlashcards);
        return;
      }

      // If the selected set exists in userFlashcardSets, fetch from DB
      const userSet = userFlashcardSets.find((s) => s.id === selectedSet);
      if (userSet) {
        try {
          setIsLoadingCards(true);
          const fullSet = await getFlashcardSetById(selectedSet);
          if (fullSet && fullSet.cards) {
            setFlashcards(fullSet.cards);
          } else {
            setFlashcards([]);
          }
        } catch (error) {
          console.error("Error loading flashcards:", error);
          setFlashcards([]);
        } finally {
          setIsLoadingCards(false);
        }
        return;
      }

      // No cards found
      setFlashcards([]);
    };

    loadCards();

    // Reset viewer state
    setCurrentIndex(0);
    setFlipped(false);
    if (cardRef.current) {
      cardRef.current.style.transform = "rotateY(0deg)";
    }
  }, [selectedSet, generatedFlashcards, userFlashcardSets]);
  
  useEffect(() => {
    // Fetch user's flashcard sets from the database
    const fetchFlashcardSets = async () => {
      try {
        setIsLoading(true);
        const sets = await getFlashcardSets();
        setUserFlashcardSets(sets);
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchFlashcardSets();
    }
  }, [user]);

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
  };

  const handleFlashcardsGenerated = (newFlashcards: Flashcard[]) => {
    setGeneratedFlashcards(newFlashcards);
    setSelectedSet("generated");
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

  // Helper function to format flashcard content with LaTeX support
  const renderFlashcardContent = (content: string) => {
    // Check if content has LaTeX-like expressions or mathematical formulas
    const hasMathContent = content.includes('$') || 
                           content.includes('\\(') ||
                           content.includes('\\[') ||
                           content.includes('x^2') ||
                           content.includes('ax^2') ||
                           content.includes('frac') ||
                           content.includes('sqrt');
    
    if (hasMathContent) {
      return <PrettyMath latex={content} />;
    }
    
    return <div className="text-center font-tutor">{formatMessage(content)}</div>;
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
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : displayFlashcardSets.length === 0 && generatedFlashcards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                      <Plus className="h-10 w-10 mb-2" />
                      <p>No flashcard sets yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {displayFlashcardSets.map((set: any) => {
                        const cardCount = (set as any).count ?? set.cards?.length ?? 0;
                        return (
                          <div
                            key={set.id}
                            className={`p-3 rounded-md cursor-pointer border transition-colors ${
                              selectedSet === set.id
                                ? 'border-brightpair bg-brightpair-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => handleSetChange(set.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{set.name}</p>
                                <p className="text-xs text-gray-500">{cardCount} cards</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {generatedFlashcards.length > 0 && (
                        <div
                          className={`p-3 rounded-md cursor-pointer border transition-colors ${
                            selectedSet === 'generated'
                              ? 'border-brightpair bg-brightpair-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleSetChange('generated')}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Generated Flashcards</p>
                              <p className="text-xs text-gray-500">{generatedFlashcards.length} cards</p>
                            </div>
                            <Sparkles size={16} className="text-brightpair" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                        <div className="w-16 h-1 bg-gray-200 rounded">
                          <div 
                            className="h-1 bg-brightpair rounded" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Generator tabs - Topic input or File upload */}
            <Tabs defaultValue="topic">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="topic" className="flex-1">Generate from Topic</TabsTrigger>
                <TabsTrigger value="upload" className="flex-1">Upload Document</TabsTrigger>
              </TabsList>
              
              <TabsContent value="topic">
                <FlashcardGenerator onFlashcardsGenerated={handleFlashcardsGenerated} />
              </TabsContent>
              
              <TabsContent value="upload">
                <FileUploader onFlashcardsGenerated={handleFlashcardsGenerated} />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Flashcard Viewer */}
        {isLoadingCards ? (
          <div className="flex flex-col items-center pt-8">
            <Skeleton className="h-64 md:h-80 w-full max-w-lg mb-6" />
            <div className="flex space-x-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
          </div>
        ) : flashcards.length > 0 ? (
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
                  className={`absolute w-full h-full backface-hidden rounded-md p-6 flex flex-col justify-center items-center 
                  ${flipped ? "opacity-0" : "bg-white shadow-lg border border-gray-200"}`}
                >
                  <div className="text-xl font-medium text-center font-tutor">
                    {renderFlashcardContent(flashcards[currentIndex]?.front)}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">Click to reveal answer</div>
                </div>
                <div
                  className={`absolute w-full h-full backface-hidden rounded-md p-6 flex flex-col justify-center items-center 
                  bg-brightpair-50 shadow-lg border border-brightpair-100
                  ${flipped ? "" : "opacity-0"}`}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="text-xl font-medium text-center font-tutor">
                    {renderFlashcardContent(flashcards[currentIndex]?.back)}
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
              Create your first set of flashcards by generating them from a topic or uploading a document
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
