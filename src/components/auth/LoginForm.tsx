
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useUser, UserRole, OnboardingStatus } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateUser, updateRole, updateOnboardingStatus } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student" as UserRole,
    rememberMe: false,
  });

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
  
  const handleCheckboxChange = () => {
    setFormData({
      ...formData,
      rememberMe: !formData.rememberMe,
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
      
      // Set session expiration time based on rememberMe checkbox
      if (data?.session && formData.rememberMe) {
        // Update session with longer expiration (30 days)
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }
      
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

  return (
    <form onSubmit={handleSubmit}>
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
            <a href="/forgot-password" className="text-sm text-brightpair hover:underline">
              Forgot password?
            </a>
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
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="rememberMe" 
            checked={formData.rememberMe}
            onCheckedChange={handleCheckboxChange}
          />
          <Label 
            htmlFor="rememberMe" 
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Remember me for 30 days
          </Label>
        </div>
      </div>

      <div className="mt-6">
        <Button type="submit" className="w-full bg-brightpair hover:bg-brightpair-600" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
