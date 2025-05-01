
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import { useUser } from "@/contexts/UserContext";

const OnboardingForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateOnboardingStatus } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentAge: "",
    gradeLevel: "",
    subjects: [],
    learningStyle: "",
    strengths: "",
    challenges: "",
    goals: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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

      // Navigate to dashboard
      navigate("/dashboard");
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Logo className="mx-auto" size="lg" />
          <h2 className="mt-6 text-3xl font-bold font-display text-gray-900">
            Student Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Help us personalize the learning experience for your student
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
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

              {/* Strengths and Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="strengths">Academic Strengths</Label>
                  <Textarea
                    id="strengths"
                    name="strengths"
                    placeholder="What subjects does the student excel in?"
                    value={formData.strengths}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challenges">Academic Challenges</Label>
                  <Textarea
                    id="challenges"
                    name="challenges"
                    placeholder="What subjects does the student need help with?"
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
                  placeholder="What are the student's main learning objectives?"
                  value={formData.goals}
                  onChange={handleChange}
                />
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

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit"
                  className="w-full bg-brightpair hover:bg-brightpair-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving Profile..." : "Complete Profile"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingForm;
