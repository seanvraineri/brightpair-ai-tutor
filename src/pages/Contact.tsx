
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      console.log("Contact form submitted:", formData);
      
      setTimeout(() => {
        toast({
          title: "Message sent!",
          description: "Thank you for contacting us. We'll get back to you shortly."
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your message. Please try again.",
        variant: "destructive"
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
              Contact <span className="text-brightpair">BrightPair</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about our platform or pricing? Our team is here to help.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Sales</CardTitle>
              <CardDescription>Fill out the form below and our team will get back to you shortly.</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Your name" 
                      value={formData.name} 
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      placeholder="(123) 456-7890" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Tell us about your needs..." 
                      value={formData.message} 
                      onChange={handleChange} 
                      required 
                      rows={5} 
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-6">
                <Link to="/">
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button type="submit" className="bg-brightpair hover:bg-brightpair-600" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Message"}
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

export default Contact;
