
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";
import { useUser, UserRole, OnboardingStatus } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateUser, updateRole, updateOnboardingStatus } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student" as UserRole,
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to appropriate dashboard
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData) {
          updateRole(profileData.role as UserRole);
          updateUser({
            name: profileData.name,
            email: profileData.email,
            role: profileData.role as UserRole,
            onboardingStatus: profileData.onboarding_status as OnboardingStatus
          });
          
          redirectToDashboard(profileData.role as UserRole);
        }
      }
    };
    
    checkSession();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as UserRole,
    });
  };

  const redirectToDashboard = (role: UserRole) => {
    switch(role) {
      case "teacher":
        navigate("/teacher-dashboard");
        break;
      case "parent":
        navigate("/parent-dashboard");
        break;
      default:
        navigate("/dashboard");
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      // Get user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Update role in profile if it's different from what the user selected
      if (profileData.role !== formData.role) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: formData.role })
          .eq('id', data.user.id);
          
        if (updateError) throw updateError;
        
        profileData.role = formData.role;
      }
      
      // Update user context
      updateRole(profileData.role as UserRole);
      updateUser({
        name: profileData.name,
        email: profileData.email,
        role: profileData.role as UserRole,
        onboardingStatus: profileData.onboarding_status as OnboardingStatus,
        nextConsultationDate: profileData.next_consultation_date,
      });
      
      toast({
        title: "Login successful",
        description: "Welcome back to BrightPair!",
      });
      
      // Redirect to appropriate dashboard based on role
      redirectToDashboard(profileData.role as UserRole);
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/">
            <Logo className="mx-auto" size="lg" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold font-display text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to your account
          </p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-brightpair hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Button type="submit" className="w-full bg-brightpair hover:bg-brightpair-600" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </div>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    disabled={isLoading}
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google logo"
                      className="w-5 h-5 mr-2"
                    />
                    Google
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <p className="text-sm text-center w-full text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-brightpair hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
