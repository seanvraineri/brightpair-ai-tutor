import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import { useUser } from "@/contexts/UserContext";

const OnboardingForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateOnboardingStatus } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({
    studentName: "",
    studentAge: "",
    gradeLevel: "",
    subjects: [] as string[],
    specificTopics: [] as string[],
    learningStyle: "",
    strengths: "",
    challenges: "",
    goals: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    aiTutorName: "",
    aiTutorPersonality: "",
    communicationStyle: "",
    preferredTimeOfDay: "",
    learningPreferences: {} as Record<string, string>,
    difficultyLevel: "",
    learningPace: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[name as keyof typeof prev] as string[];
      return {
        ...prev,
        [name]: checked
          ? [...currentValues, value]
          : currentValues.filter(v => v !== value)
      };
    });
  };
  
  const handlePreferenceChange = (subject: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      learningPreferences: {
        ...prev.learningPreferences,
        [subject]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to save onboarding data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update onboarding status in context
      updateOnboardingStatus('onboarding-complete');

      toast({
        title: "Profile completed!",
        description: "Your student profile has been saved successfully.",
      });

      // Navigate to dashboard with walkthrough flag
      navigate("/dashboard?walkthrough=true");
    } catch (error) {
      console.error("Onboarding submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was an error saving your profile information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const gradeLevels = [
    "Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", 
    "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade",
    "9th Grade", "10th Grade", "11th Grade", "12th Grade", "College"
  ];

  // Detailed subject categories
  const subjectCategories = {
    "Mathematics": [
      "Early Math", "Basic Arithmetic", "Pre-Algebra", "Algebra I", "Algebra II", 
      "Geometry", "Trigonometry", "Pre-Calculus", "Calculus I", "Calculus II",
      "Statistics", "Probability", "Discrete Mathematics", "Linear Algebra", "Number Theory"
    ],
    "Science": [
      "General Science", "Earth Science", "Biology", "Chemistry", "Physics",
      "Astronomy", "Environmental Science", "Anatomy & Physiology", "Genetics",
      "Organic Chemistry", "Quantum Physics", "Thermodynamics", "Ecology", "Geology"
    ],
    "English": [
      "Early Reading", "Reading Comprehension", "Vocabulary Building", "Grammar",
      "Essay Writing", "Creative Writing", "Literature Analysis", "Poetry",
      "Public Speaking", "Rhetoric", "Critical Reading", "Research Writing",
      "World Literature", "American Literature", "British Literature"
    ],
    "History": [
      "World History", "U.S. History", "European History", "Ancient Civilizations",
      "Medieval History", "Modern History", "Civil Rights", "Geography",
      "Civics & Government", "Economics", "Political Science", "Anthropology",
      "Archaeology", "Military History", "Cultural Studies"
    ],
    "Languages": [
      "Spanish", "French", "German", "Chinese", "Japanese",
      "Italian", "Russian", "Arabic", "Latin", "Greek",
      "Portuguese", "Korean", "Hindi", "Sign Language", "ESL/ESOL"
    ],
    "Computer Science": [
      "Intro to Programming", "Python", "Java", "JavaScript", "HTML/CSS",
      "Data Structures", "Algorithms", "Web Development", "Database Design",
      "Cybersecurity", "Machine Learning", "AI", "Game Development", "Mobile App Development"
    ],
    "Arts": [
      "Visual Arts", "Drawing", "Painting", "Sculpture", "Photography",
      "Digital Art", "Graphic Design", "Art History", "Music Theory",
      "Instrumental Music", "Vocal Music", "Theater", "Dance", "Film Studies"
    ],
    "Test Prep": [
      "SAT", "ACT", "AP Exams", "IB Exams", "GRE",
      "GMAT", "LSAT", "MCAT", "State Standardized Tests", "TOEFL/IELTS"
    ]
  };

  // Generate a flat list of all specific topics for the topic selection
  const allSpecificTopics = Object.entries(subjectCategories).flatMap(
    ([category, topics]) => topics.map(topic => ({ category, topic }))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Logo className="mx-auto" size="lg" />
          <h2 className="mt-6 text-3xl font-bold font-display text-gray-900">
            Complete Your Learning Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Help us create a personalized learning experience tailored just for you
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="student" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student Information</TabsTrigger>
                <TabsTrigger value="subjects">Learning Topics</TabsTrigger>
                <TabsTrigger value="tutor">AI Tutor Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="student">
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                  <CardDescription>
                    Tell us about the student so we can tailor our approach
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Student Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input
                        id="studentName"
                        name="studentName"
                        placeholder="Full name"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentAge">Student Age</Label>
                      <Input
                        id="studentAge"
                        name="studentAge"
                        type="number"
                        placeholder="Age"
                        value={formData.studentAge}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Grade Level */}
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Select 
                      value={formData.gradeLevel} 
                      onValueChange={(value) => handleSelectChange("gradeLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Learning Style */}
                  <div className="space-y-2">
                    <Label>Learning Style</Label>
                    <RadioGroup 
                      value={formData.learningStyle} 
                      onValueChange={(value) => handleSelectChange("learningStyle", value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="visual" id="visual" />
                        <Label htmlFor="visual">Visual (learns best through images, diagrams)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auditory" id="auditory" />
                        <Label htmlFor="auditory">Auditory (learns best through listening, discussions)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kinesthetic" id="kinesthetic" />
                        <Label htmlFor="kinesthetic">Kinesthetic (learns best through hands-on activities)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reading" id="reading" />
                        <Label htmlFor="reading">Reading/Writing (learns best through text)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Learning Pace */}
                  <div className="space-y-2">
                    <Label htmlFor="learningPace">Learning Pace</Label>
                    <Select 
                      value={formData.learningPace} 
                      onValueChange={(value) => handleSelectChange("learningPace", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred learning pace" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="methodical">Methodical & Thorough</SelectItem>
                        <SelectItem value="balanced">Balanced Pace</SelectItem>
                        <SelectItem value="accelerated">Accelerated Learning</SelectItem>
                        <SelectItem value="mastery">Mastery-Based (Move on after demonstrating mastery)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Parent/Guardian Info */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Parent/Guardian Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="parentName">Parent/Guardian Name</Label>
                        <Input
                          id="parentName"
                          name="parentName"
                          placeholder="Full name"
                          value={formData.parentName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentEmail">Email</Label>
                        <Input
                          id="parentEmail"
                          name="parentEmail"
                          type="email"
                          placeholder="Email address"
                          value={formData.parentEmail}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="parentPhone">Phone Number</Label>
                      <Input
                        id="parentPhone"
                        name="parentPhone"
                        placeholder="Phone number"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setActiveTab("subjects")}>
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="subjects">
                <CardHeader>
                  <CardTitle>Learning Topics</CardTitle>
                  <CardDescription>
                    Select specific subjects and topics you want to focus on
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Subject Categories */}
                  <div className="space-y-2">
                    <Label className="text-base">Subject Categories</Label>
                    <p className="text-sm text-gray-500 mb-2">Select the main subject areas you're interested in</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.keys(subjectCategories).map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={formData.subjects.includes(category)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('subjects', category, checked as boolean)
                            }
                          />
                          <Label htmlFor={`category-${category}`} className="text-sm">{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specific Topics - Show related to selected categories */}
                  {formData.subjects.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-base">Specific Topics</Label>
                      <p className="text-sm text-gray-500 mb-2">Select the specific topics you want to learn</p>
                      
                      <div className="max-h-64 overflow-y-auto border rounded-md p-4">
                        {formData.subjects.map(subject => (
                          <div key={`topics-${subject}`} className="mb-4">
                            <h4 className="font-medium text-brightpair mb-2">{subject}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {subjectCategories[subject as keyof typeof subjectCategories]?.map(topic => (
                                <div key={topic} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`topic-${topic}`}
                                    checked={formData.specificTopics.includes(topic)}
                                    onCheckedChange={(checked) => 
                                      handleCheckboxChange('specificTopics', topic, checked as boolean)
                                    }
                                  />
                                  <Label htmlFor={`topic-${topic}`} className="text-sm">{topic}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Difficulty Level */}
                  <div className="space-y-2">
                    <Label htmlFor="difficultyLevel">Starting Difficulty Level</Label>
                    <Select 
                      value={formData.difficultyLevel} 
                      onValueChange={(value) => handleSelectChange("difficultyLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner - Start with fundamentals</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Familiar with basics</SelectItem>
                        <SelectItem value="advanced">Advanced - Looking for challenging content</SelectItem>
                        <SelectItem value="adaptive">Adaptive - Adjust based on performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Strengths and Challenges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="strengths">Academic Strengths</Label>
                      <Textarea
                        id="strengths"
                        name="strengths"
                        placeholder="What subjects or skills does the student excel in?"
                        value={formData.strengths}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="challenges">Academic Challenges</Label>
                      <Textarea
                        id="challenges"
                        name="challenges"
                        placeholder="What subjects or skills does the student find challenging?"
                        value={formData.challenges}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="space-y-2">
                    <Label htmlFor="goals">Learning Goals</Label>
                    <Textarea
                      id="goals"
                      name="goals"
                      placeholder="What specific goals does the student want to achieve? (e.g., 'Improve algebra skills for upcoming SAT', 'Master JavaScript basics', etc.)"
                      value={formData.goals}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("student")}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("tutor")}>
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="tutor">
                <CardHeader>
                  <CardTitle>AI Tutor Customization</CardTitle>
                  <CardDescription>
                    Personalize your AI tutor to fit your learning preferences
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* AI Tutor Name and Personality */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aiTutorName">AI Tutor Name (Optional)</Label>
                      <Input
                        id="aiTutorName"
                        name="aiTutorName"
                        placeholder="Give your AI tutor a name"
                        value={formData.aiTutorName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aiTutorPersonality">AI Tutor Personality</Label>
                      <Select 
                        value={formData.aiTutorPersonality} 
                        onValueChange={(value) => handleSelectChange("aiTutorPersonality", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select personality style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="encouraging">Encouraging & Supportive</SelectItem>
                          <SelectItem value="challenging">Challenging & Motivating</SelectItem>
                          <SelectItem value="patient">Patient & Detailed</SelectItem>
                          <SelectItem value="funny">Funny & Engaging</SelectItem>
                          <SelectItem value="serious">Serious & Direct</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Communication Style */}
                  <div className="space-y-2">
                    <Label htmlFor="communicationStyle">Preferred Communication Style</Label>
                    <Select 
                      value={formData.communicationStyle} 
                      onValueChange={(value) => handleSelectChange("communicationStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How should your tutor communicate?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple & Concise</SelectItem>
                        <SelectItem value="detailed">Detailed & Thorough</SelectItem>
                        <SelectItem value="socratic">Socratic (Question-Based)</SelectItem>
                        <SelectItem value="metaphor">Metaphors & Examples</SelectItem>
                        <SelectItem value="visualize">Visual Explanations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Preference */}
                  <div className="space-y-2">
                    <Label htmlFor="preferredTimeOfDay">Preferred Learning Time</Label>
                    <Select 
                      value={formData.preferredTimeOfDay} 
                      onValueChange={(value) => handleSelectChange("preferredTimeOfDay", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="When do you prefer to study?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="night">Late Night</SelectItem>
                        <SelectItem value="varies">Varies Day to Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject-specific preferences */}
                  {formData.specificTopics.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-base">Teaching Approach by Topic</Label>
                      <p className="text-sm text-gray-500 mb-2">
                        Customize how you want to learn each selected topic
                      </p>
                      <div className="space-y-4 max-h-64 overflow-y-auto border rounded-md p-4">
                        {formData.specificTopics.slice(0, 5).map(topic => (
                          <div key={`pref-${topic}`} className="p-3 bg-gray-50 rounded-md">
                            <Label className="font-medium">{topic}</Label>
                            <div className="mt-2">
                              <Select 
                                value={formData.learningPreferences[topic] || ""}
                                onValueChange={(value) => handlePreferenceChange(topic, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="How do you want to learn this?" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="practice">Practice-Based Learning</SelectItem>
                                  <SelectItem value="concept">Concept Mastery First</SelectItem>
                                  <SelectItem value="example">Learn from Examples</SelectItem>
                                  <SelectItem value="problem">Problem-Solving Focus</SelectItem>
                                  <SelectItem value="project">Project-Based Learning</SelectItem>
                                  <SelectItem value="discussion">Discussion & Dialogue</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("subjects")}>
                      Back
                    </Button>
                    <Button type="submit" className="bg-brightpair hover:bg-brightpair-600" disabled={isSubmitting}>
                      {isSubmitting ? "Finalizing Profile..." : "Complete Setup & Go to Dashboard"}
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </form>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Contact us at support@brightpair.com</p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
