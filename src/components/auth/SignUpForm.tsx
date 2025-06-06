import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { OnboardingStatus, UserRole, useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface SignUpFormProps {
  initialEmail?: string;
  initialConsultationBooked?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  initialEmail = "",
  initialConsultationBooked = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateUser, updateRole } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: initialEmail,
    password: "",
    confirmPassword: "",
    role: "student" as UserRole,
    consultationBooked: initialConsultationBooked,
    bookingReference: "",
    rememberMe: true,
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

  const handleCheckboxChange = (field: string) => {
    setFormData({
      ...formData,
      [field]: !formData[field as keyof typeof formData],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
            consultationBooked: formData.consultationBooked,
            bookingReference: formData.bookingReference,
          },
        },
      });

      if (error) throw error;

      // If we have a session and "remember me" is selected, set a longer session
      if (data.session && formData.rememberMe) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      // Update user context
      updateRole(formData.role);
      updateUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        onboardingStatus: formData.consultationBooked
          ? "consultation-scheduled"
          : "pending" as OnboardingStatus,
      });

      toast({
        title: "Account created!",
        description: "You've successfully created your account.",
      });

      // Navigate based on whether they've already booked a consultation
      navigate(formData.consultationBooked ? "/dashboard" : "/consultation");
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "An error occurred during registration.";
      toast({
        title: "Registration failed",
        description: errorMessage,
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
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

        {/* Consultation booking checkbox - only show if not already set from URL param */}
        {!initialConsultationBooked && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="consultationBooked"
              checked={formData.consultationBooked}
              onCheckedChange={() => handleCheckboxChange("consultationBooked")}
            />
            <Label
              htmlFor="consultationBooked"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              I've already booked a consultation
            </Label>
          </div>
        )}

        {/* Booking reference field - only shown when consultation is booked */}
        {formData.consultationBooked && (
          <div className="space-y-2">
            <Label htmlFor="bookingReference">
              Booking Reference (Optional)
            </Label>
            <Input
              id="bookingReference"
              name="bookingReference"
              type="text"
              placeholder="Your Calendly booking reference"
              value={formData.bookingReference}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500">
              This helps us match your account with your scheduled consultation
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={() => handleCheckboxChange("rememberMe")}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Stay signed in for 30 days
          </Label>
        </div>
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          className="w-full bg-brightpair hover:bg-brightpair-600"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
