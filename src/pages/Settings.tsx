
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
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
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailSummaries: true,
    sessionReminders: true,
    progressAlerts: true,
    marketingEmails: false,
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
  
  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
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

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="profile">Student Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
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
                <div className="bg-brightpair-50 p-4 rounded-lg border border-brightpair-100">
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
