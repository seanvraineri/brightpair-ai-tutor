
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
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
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const TutorSignup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subjects: "",
    experience: "",
    education: "",
    availability: "",
    referralSource: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // We'll integrate Supabase here in the future
      console.log("Submitting tutor application:", formData);
      
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Application submitted!",
          description: "Thank you for applying to join the BrightPair tutor network. We'll be in touch soon.",
        });
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Join the <span className="text-brightpair">BrightPair Network</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Apply to become a BrightPair tutor and transform how you deliver results for your students while growing your tutoring business.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Tutor Application</CardTitle>
              <CardDescription>
                Please provide your information below. We'll review your application and contact you within 3-5 business days.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName"
                        name="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      placeholder="(123) 456-7890"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subjects">Subjects You Teach</Label>
                    <Input 
                      id="subjects"
                      name="subjects"
                      placeholder="Math, Science, English, etc."
                      value={formData.subjects}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Teaching Experience</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange(value, "experience")}
                      defaultValue={formData.experience}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">More than 10 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="education">Education / Certifications</Label>
                    <Textarea 
                      id="education"
                      name="education"
                      placeholder="Bachelor's in Education, Teaching Certifications, etc."
                      value={formData.education}
                      onChange={handleChange}
                      required
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange(value, "availability")}
                      defaultValue={formData.availability}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="part-time">Part-time (1-15 hrs/week)</SelectItem>
                        <SelectItem value="full-time">Full-time (15+ hrs/week)</SelectItem>
                        <SelectItem value="weekends">Weekends only</SelectItem>
                        <SelectItem value="evenings">Evenings only</SelectItem>
                        <SelectItem value="flexible">Flexible schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referralSource">How did you hear about BrightPair?</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange(value, "referralSource")}
                      defaultValue={formData.referralSource}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="search">Search Engine</SelectItem>
                        <SelectItem value="friend">Friend/Colleague</SelectItem>
                        <SelectItem value="school">School/University</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-6">
                <Link to="/">
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button type="submit" className="bg-brightpair hover:bg-brightpair-600" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TutorSignup;
