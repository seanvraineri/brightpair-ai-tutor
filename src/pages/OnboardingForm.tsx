
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";

const OnboardingForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    gradeLevel: "",
    learningStyle: "",
    subjects: "",
    studyGoals: "",
    motivationStyle: "",
    preferredTone: "",
    preferredStudyTime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // We'll integrate Supabase here
      console.log("Submitting onboarding data:", formData);
      
      // Simulate successful submission
      setTimeout(() => {
        toast({
          title: "Profile created!",
          description: "Your student profile has been created successfully.",
        });
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        title: "Submission failed",
        description: "There was an error creating your student profile.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-display">Student Information</CardTitle>
              <CardDescription>
                Let's get to know the student better.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student's Name</Label>
                <Input
                  id="studentName"
                  name="studentName"
                  placeholder="e.g. Emma Johnson"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                />
              </div>
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
                    <SelectItem value="elementary-3">Elementary School (Grade 3)</SelectItem>
                    <SelectItem value="elementary-4">Elementary School (Grade 4)</SelectItem>
                    <SelectItem value="elementary-5">Elementary School (Grade 5)</SelectItem>
                    <SelectItem value="middle-6">Middle School (Grade 6)</SelectItem>
                    <SelectItem value="middle-7">Middle School (Grade 7)</SelectItem>
                    <SelectItem value="middle-8">Middle School (Grade 8)</SelectItem>
                    <SelectItem value="high-9">High School (Grade 9)</SelectItem>
                    <SelectItem value="high-10">High School (Grade 10)</SelectItem>
                    <SelectItem value="high-11">High School (Grade 11)</SelectItem>
                    <SelectItem value="high-12">High School (Grade 12)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects They Struggle With</Label>
                <Textarea
                  id="subjects"
                  name="subjects"
                  placeholder="e.g. Math, specifically algebra and fractions"
                  value={formData.subjects}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </>
        );
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-display">Learning Preferences</CardTitle>
              <CardDescription>
                Help us understand how your student learns best.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="learningStyle">Learning Style</Label>
                <Select
                  value={formData.learningStyle}
                  onValueChange={(value) => handleSelectChange("learningStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select learning style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">Visual (learns best by seeing)</SelectItem>
                    <SelectItem value="auditory">Auditory (learns best by hearing)</SelectItem>
                    <SelectItem value="reading">Reading/Writing (learns best by reading and writing)</SelectItem>
                    <SelectItem value="kinesthetic">Hands-on (learns best by doing)</SelectItem>
                    <SelectItem value="multimodal">Multimodal (combination of styles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivationStyle">Motivation Style</Label>
                <Select
                  value={formData.motivationStyle}
                  onValueChange={(value) => handleSelectChange("motivationStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select motivation style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="praise">Praise and Encouragement</SelectItem>
                    <SelectItem value="challenge">Challenge-Oriented</SelectItem>
                    <SelectItem value="competition">Competitive Motivation</SelectItem>
                    <SelectItem value="curiosity">Curiosity and Exploration</SelectItem>
                    <SelectItem value="gamification">Gamification and Rewards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredTone">Preferred Communication Tone</Label>
                <Select
                  value={formData.preferredTone}
                  onValueChange={(value) => handleSelectChange("preferredTone", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enthusiastic">Enthusiastic and Energetic</SelectItem>
                    <SelectItem value="calm">Calm and Patient</SelectItem>
                    <SelectItem value="direct">Direct and Straightforward</SelectItem>
                    <SelectItem value="playful">Playful and Humorous</SelectItem>
                    <SelectItem value="encouraging">Encouraging and Supportive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-display">Goals & Scheduling</CardTitle>
              <CardDescription>
                Let's set some study goals and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studyGoals">Study Goals</Label>
                <Textarea
                  id="studyGoals"
                  name="studyGoals"
                  placeholder="e.g. Improve SAT score to 1400+, raise GPA to 3.5"
                  value={formData.studyGoals}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredStudyTime">Preferred Study Time</Label>
                <Select
                  value={formData.preferredStudyTime}
                  onValueChange={(value) => handleSelectChange("preferredStudyTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred study time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="earlyMorning">Early Morning (5-8 AM)</SelectItem>
                    <SelectItem value="morning">Morning (8-11 AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12-4 PM)</SelectItem>
                    <SelectItem value="evening">Evening (5-8 PM)</SelectItem>
                    <SelectItem value="night">Night (8-11 PM)</SelectItem>
                    <SelectItem value="flexible">Flexible/Varies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Privacy Note:</h3>
                <p className="text-sm text-gray-600">
                  This information will only be used to personalize your student's AI tutor. 
                  We take your privacy seriously and never share this information with third parties.
                </p>
              </div>
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo className="mx-auto" size="lg" />
          <h2 className="mt-6 text-3xl font-bold font-display text-gray-900">
            Student Profile Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Help us personalize your child's learning experience
          </p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            {renderStep()}
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || isSubmitting}
              >
                Back
              </Button>
              
              {step < 3 ? (
                <Button 
                  type="button" 
                  className="bg-brightpair hover:bg-brightpair-600" 
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="bg-brightpair hover:bg-brightpair-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Profile..." : "Create Profile"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between pt-2">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  i === step ? 'bg-brightpair text-white' : 
                  i < step ? 'bg-brightpair-200 text-brightpair-700' : 
                  'bg-gray-200 text-gray-500'
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div className={`flex-1 h-1 mx-2 ${i < step ? 'bg-brightpair-300' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
