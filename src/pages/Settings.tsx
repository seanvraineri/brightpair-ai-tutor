import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Palette, Settings as SettingsIcon, Bell, CreditCard, FileText } from "lucide-react";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPersonalization, setSavingPersonalization] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const [savingSpecialNotes, setSavingSpecialNotes] = useState(false);
  
  // Profile data
  const [profileData, setProfileData] = useState({
    studentName: "Emma Johnson",
    email: "parent@example.com",
    gradeLevel: "high-9",
    learningStyle: "visual",
    subjects: "Algebra, Biology",
    studyGoals: "Improve SAT score to 1400+",
    motivationStyle: "praise",
    preferredTone: "calm",
  });
  
  // Personalization data
  const [personalizationData, setPersonalizationData] = useState({
    colorScheme: "brightpair",
    contentDensity: "balanced",
    uiSize: "medium",
    contentFormat: "mixed",
    examplePreference: "detailed",
    stepDetail: "medium",
    highlightStyle: "highlight",
    feedbackStyle: "encouraging",
    pacePreference: "adaptive",
    distractionsLevel: "minimal",
    gamification: true,
    aiTutorPersonality: "friendly",
    emoji: "moderate",
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailSummaries: true,
    sessionReminders: true,
    progressAlerts: true,
    marketingEmails: false,
  });

  // Special notes for student
  const [specialNotes, setSpecialNotes] = useState({
    learningChallenges: "",
    strengths: "",
    areasForImprovement: "",
    preferredApproaches: "",
    triggers: "",
    accommodations: "",
    additionalNotes: ""
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  
  const handlePersonalizationChange = (name: string, value: any) => {
    setPersonalizationData({
      ...personalizationData,
      [name]: value,
    });
  };
  
  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handleSpecialNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSpecialNotes({
      ...specialNotes,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = () => {
    setSavingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your student profile has been successfully updated.",
      });
      setSavingProfile(false);
    }, 1000);
  };
  
  const handleSavePersonalization = () => {
    setSavingPersonalization(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Personalization Settings Updated",
        description: "Your learning experience preferences have been saved.",
      });
      setSavingPersonalization(false);
    }, 1000);
  };
  
  const handleSaveNotifications = () => {
    setSavingNotifications(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
      setSavingNotifications(false);
    }, 1000);
  };
  
  const handleCancelSubscription = () => {
    if (confirm("Are you sure you want to cancel your subscription? Your access will continue until the end of your billing period.")) {
      setCancelingSubscription(true);
      
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been cancelled. You will have access until the end of your billing period.",
        });
        setCancelingSubscription(false);
      }, 1500);
    }
  };

  const handleSaveSpecialNotes = () => {
    setSavingSpecialNotes(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Special Notes Updated",
        description: "Your student's special notes have been successfully saved.",
      });
      setSavingSpecialNotes(false);
    }, 1000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="personalization" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Personalization</span>
            </TabsTrigger>
            <TabsTrigger value="special-notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Special Notes</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Subscription</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>
                  Update your student's information to personalize their learning experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student's Name</Label>
                    <Input
                      id="studentName"
                      name="studentName"
                      value={profileData.studentName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Parent Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Select
                      value={profileData.gradeLevel}
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
                    <Label htmlFor="learningStyle">Learning Style</Label>
                    <Select
                      value={profileData.learningStyle}
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subjects">Subjects They Need Help With</Label>
                  <Textarea
                    id="subjects"
                    name="subjects"
                    value={profileData.subjects}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="studyGoals">Study Goals</Label>
                  <Textarea
                    id="studyGoals"
                    name="studyGoals"
                    value={profileData.studyGoals}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="motivationStyle">Motivation Style</Label>
                    <Select
                      value={profileData.motivationStyle}
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
                      value={profileData.preferredTone}
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
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={savingProfile}
                  className="bg-brightpair hover:bg-brightpair-600"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="personalization">
            <Card>
              <CardHeader>
                <CardTitle>Personalization Factors</CardTitle>
                <CardDescription>
                  Customize your learning experience and interface preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Interface Preferences</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="colorScheme">Color Scheme</Label>
                    <Select
                      value={personalizationData.colorScheme}
                      onValueChange={(value) => handlePersonalizationChange("colorScheme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brightpair">BrightPair (Default Purple)</SelectItem>
                        <SelectItem value="ocean">Ocean Blue</SelectItem>
                        <SelectItem value="forest">Forest Green</SelectItem>
                        <SelectItem value="sunset">Sunset Orange</SelectItem>
                        <SelectItem value="berry">Berry Pink</SelectItem>
                        <SelectItem value="grayscale">Grayscale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contentDensity">Content Density</Label>
                    <RadioGroup 
                      value={personalizationData.contentDensity}
                      onValueChange={(value) => handlePersonalizationChange("contentDensity", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compact" id="density-compact" />
                        <Label htmlFor="density-compact">Compact</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="balanced" id="density-balanced" />
                        <Label htmlFor="density-balanced">Balanced</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="spacious" id="density-spacious" />
                        <Label htmlFor="density-spacious">Spacious</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="uiSize">UI Text Size</Label>
                    <RadioGroup 
                      value={personalizationData.uiSize}
                      onValueChange={(value) => handlePersonalizationChange("uiSize", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="size-small" />
                        <Label htmlFor="size-small">Small</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="size-medium" />
                        <Label htmlFor="size-medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="size-large" />
                        <Label htmlFor="size-large">Large</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Learning Experience</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contentFormat">Content Format Preference</Label>
                    <Select
                      value={personalizationData.contentFormat}
                      onValueChange={(value) => handlePersonalizationChange("contentFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Highly Visual</SelectItem>
                        <SelectItem value="text">Text-Focused</SelectItem>
                        <SelectItem value="interactive">Interactive Elements</SelectItem>
                        <SelectItem value="mixed">Balanced Mix (Default)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="examplePreference">Example Preference</Label>
                    <Select
                      value={personalizationData.examplePreference}
                      onValueChange={(value) => handlePersonalizationChange("examplePreference", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select example preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal Examples</SelectItem>
                        <SelectItem value="basic">Basic Examples</SelectItem>
                        <SelectItem value="detailed">Detailed Examples</SelectItem>
                        <SelectItem value="multiple">Multiple Examples</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stepDetail">Step-by-Step Detail</Label>
                    <Select
                      value={personalizationData.stepDetail}
                      onValueChange={(value) => handlePersonalizationChange("stepDetail", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select step detail" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal (Key Steps Only)</SelectItem>
                        <SelectItem value="medium">Medium (Standard Detail)</SelectItem>
                        <SelectItem value="high">High (Every Step Explained)</SelectItem>
                        <SelectItem value="adaptive">Adaptive (Based on Difficulty)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="highlightStyle">Highlight Style</Label>
                    <Select
                      value={personalizationData.highlightStyle}
                      onValueChange={(value) => handlePersonalizationChange("highlightStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select highlight style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highlight">Color Highlighting</SelectItem>
                        <SelectItem value="bold">Bold Text</SelectItem>
                        <SelectItem value="underline">Underlined</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Interaction Style</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedbackStyle">Feedback Style</Label>
                    <Select
                      value={personalizationData.feedbackStyle}
                      onValueChange={(value) => handlePersonalizationChange("feedbackStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select feedback style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="encouraging">Encouraging</SelectItem>
                        <SelectItem value="direct">Direct & Factual</SelectItem>
                        <SelectItem value="growth">Growth-Oriented</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="detailed">Detailed Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pacePreference">Learning Pace</Label>
                    <Select
                      value={personalizationData.pacePreference}
                      onValueChange={(value) => handlePersonalizationChange("pacePreference", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select learning pace" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accelerated">Accelerated</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="deliberate">Deliberate & Thorough</SelectItem>
                        <SelectItem value="adaptive">Adaptive (Default)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="distractionsLevel">Distractions Level</Label>
                    <Select
                      value={personalizationData.distractionsLevel}
                      onValueChange={(value) => handlePersonalizationChange("distractionsLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select distractions level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal (Focus Mode)</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="enriched">Enriched (More Context)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Gamification Elements</p>
                      <p className="text-sm text-gray-500">Points, badges, streaks, and achievement systems</p>
                    </div>
                    <Switch 
                      checked={personalizationData.gamification}
                      onCheckedChange={(checked) => handlePersonalizationChange("gamification", checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aiTutorPersonality">AI Tutor Personality</Label>
                    <Select
                      value={personalizationData.aiTutorPersonality}
                      onValueChange={(value) => handlePersonalizationChange("aiTutorPersonality", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI tutor personality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly & Supportive</SelectItem>
                        <SelectItem value="scholarly">Scholarly & Informative</SelectItem>
                        <SelectItem value="socratic">Socratic & Questioning</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                        <SelectItem value="patient">Patient & Calm</SelectItem>
                        <SelectItem value="coaching">Coaching & Motivational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emoji">Emoji Usage</Label>
                    <RadioGroup 
                      value={personalizationData.emoji}
                      onValueChange={(value) => handlePersonalizationChange("emoji", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minimal" id="emoji-minimal" />
                        <Label htmlFor="emoji-minimal">Minimal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="emoji-moderate" />
                        <Label htmlFor="emoji-moderate">Moderate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="abundant" id="emoji-abundant" />
                        <Label htmlFor="emoji-abundant">Abundant</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSavePersonalization} 
                  disabled={savingPersonalization}
                  className="bg-brightpair hover:bg-brightpair-600"
                >
                  {savingPersonalization ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="special-notes">
            <Card>
              <CardHeader>
                <CardTitle>Special Notes</CardTitle>
                <CardDescription>
                  Add important details about the student to personalize their learning experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="learningChallenges">Learning Challenges</Label>
                    <Textarea
                      id="learningChallenges"
                      name="learningChallenges"
                      value={specialNotes.learningChallenges}
                      onChange={handleSpecialNotesChange}
                      placeholder="ADHD, dyslexia, processing delays, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="strengths">Strengths & Interests</Label>
                    <Textarea
                      id="strengths"
                      name="strengths"
                      value={specialNotes.strengths}
                      onChange={handleSpecialNotesChange}
                      placeholder="Visual learning, storytelling, music, sports, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
                    <Textarea
                      id="areasForImprovement"
                      name="areasForImprovement"
                      value={specialNotes.areasForImprovement}
                      onChange={handleSpecialNotesChange}
                      placeholder="Math fluency, reading comprehension, focus during lessons, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preferredApproaches">Preferred Learning Approaches</Label>
                    <Textarea
                      id="preferredApproaches"
                      name="preferredApproaches"
                      value={specialNotes.preferredApproaches}
                      onChange={handleSpecialNotesChange}
                      placeholder="Needs frequent breaks, prefers visual explanations, learns well through examples, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="triggers">Potential Triggers</Label>
                    <Textarea
                      id="triggers"
                      name="triggers"
                      value={specialNotes.triggers}
                      onChange={handleSpecialNotesChange}
                      placeholder="Time pressure, being called on unexpectedly, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accommodations">Accommodations</Label>
                    <Textarea
                      id="accommodations"
                      name="accommodations"
                      value={specialNotes.accommodations}
                      onChange={handleSpecialNotesChange}
                      placeholder="Extra time for tests, text-to-speech tools, frequent breaks, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      value={specialNotes.additionalNotes}
                      onChange={handleSpecialNotesChange}
                      placeholder="Any other information that would help personalize the learning experience..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSpecialNotes} 
                  disabled={savingSpecialNotes}
                  className="bg-brightpair hover:bg-brightpair-600"
                >
                  {savingSpecialNotes ? "Saving..." : "Save Special Notes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control which notifications you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Email Summaries</p>
                    <p className="text-sm text-gray-500">Receive a weekly summary of your student's progress</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailSummaries}
                    onCheckedChange={(checked) => handleNotificationChange("emailSummaries", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Reminders</p>
                    <p className="text-sm text-gray-500">Get reminded about upcoming tutoring sessions</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.sessionReminders}
                    onCheckedChange={(checked) => handleNotificationChange("sessionReminders", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Progress Alerts</p>
                    <p className="text-sm text-gray-500">Be notified when your student achieves significant progress</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.progressAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("progressAlerts", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveNotifications} 
                  disabled={savingNotifications}
                  className="bg-brightpair hover:bg-brightpair-600"
                >
                  {savingNotifications ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>
                  View and manage your subscription details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-brightpair-50 p-4 rounded-md border border-brightpair-100">
                  <p className="font-medium text-brightpair-700">Current Plan: Monthly</p>
                  <p className="text-sm text-gray-600 mt-1">$50/month • Renews on May 15, 2025</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Plan Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Started On</p>
                      <p className="text-gray-600">April 15, 2025</p>
                    </div>
                    <div>
                      <p className="font-medium">Next Billing Date</p>
                      <p className="text-gray-600">May 15, 2025</p>
                    </div>
                    <div>
                      <p className="font-medium">Amount</p>
                      <p className="text-gray-600">$50.00 USD</p>
                    </div>
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="text-gray-600">•••• 4242</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    <Button variant="outline">Update Payment Method</Button>
                    <Button variant="outline">View Billing History</Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Cancel Subscription</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      If you cancel, your subscription will remain active until the end of your current billing period.
                      After that, you will lose access to all premium features.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleCancelSubscription}
                      disabled={cancelingSubscription}
                    >
                      {cancelingSubscription ? "Processing..." : "Cancel Subscription"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
