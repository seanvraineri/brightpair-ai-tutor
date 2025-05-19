import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CheckCircle,
  ChevronLeft,
  Loader2,
  LogOut,
  MailPlus,
  UserPlus,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Form schema validation
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Student name must be at least 2 characters.",
  }),
  gradeLevel: z.string({
    required_error: "Please select a grade level.",
  }),
  subject: z.string({
    required_error: "Please select a subject.",
  }),
  parentName: z.string().min(2, {
    message: "Parent name must be at least 2 characters.",
  }),
  parentEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  parentRelationship: z.string().optional(),
  notes: z.string().optional(),
});

const StudentOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "student" | "parent" | "success"
  >("student");

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      gradeLevel: "",
      subject: "",
      parentName: "",
      parentEmail: "",
      parentRelationship: "parent",
      notes: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Here we would make actual API calls to Supabase
      console.log("Form values:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      /*
      // Example Supabase Implementation

      // 1. Add student to the student_profiles table
      const { data: studentData, error: studentError } = await supabase
        .from('student_profiles')
        .insert({
          full_name: values.fullName,
          grade_level: values.gradeLevel,
          subject: values.subject,
          status: 'active',
          notes: values.notes,
          tutor_id: tutorId // would come from auth
        })
        .select()
        .single();

      if (studentError) throw studentError;

      // 2. Add parent to parent_profiles if not exists
      const { data: parentData, error: parentError } = await supabase
        .from('parent_profiles')
        .insert({
          full_name: values.parentName,
          email: values.parentEmail,
        })
        .select()
        .single();

      if (parentError) throw parentError;

      // 3. Create relationship between parent and student
      const { error: relationshipError } = await supabase
        .from('parent_student_relationships')
        .insert({
          parent_id: parentData.id,
          student_id: studentData.id,
          relationship: values.parentRelationship || 'Parent'
        });

      if (relationshipError) throw relationshipError;
      */

      // Move to success screen
      setCurrentStep("success");
    } catch (error) {
      console.error("Error onboarding student:", error);
      alert("Failed to onboard student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render student information step
  const renderStudentStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Emma Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gradeLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="K">Kindergarten</SelectItem>
                    <SelectItem value="1">1st Grade</SelectItem>
                    <SelectItem value="2">2nd Grade</SelectItem>
                    <SelectItem value="3">3rd Grade</SelectItem>
                    <SelectItem value="4">4th Grade</SelectItem>
                    <SelectItem value="5">5th Grade</SelectItem>
                    <SelectItem value="6">6th Grade</SelectItem>
                    <SelectItem value="7">7th Grade</SelectItem>
                    <SelectItem value="8">8th Grade</SelectItem>
                    <SelectItem value="9">9th Grade</SelectItem>
                    <SelectItem value="10">10th Grade</SelectItem>
                    <SelectItem value="11">11th Grade</SelectItem>
                    <SelectItem value="12">12th Grade</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="foreign_language">
                      Foreign Language
                    </SelectItem>
                    <SelectItem value="computer_science">
                      Computer Science
                    </SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional information about the student's needs, goals, or current level"
                  className="h-24"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This information will help personalize your tutoring approach.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setCurrentStep("parent")}
          className="bg-brightpair hover:bg-brightpair-600"
        >
          Continue to Parent Information
        </Button>
      </div>
    </div>
  );

  // Render parent information step
  const renderParentStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="parentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent/Guardian Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Alex Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent/Guardian Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g. alex.johnson@example.com" {...field} />
              </FormControl>
              <FormDescription>
                This email will be used for report sharing and communication.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentRelationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship to Student</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="guardian">Guardian</SelectItem>
                  <SelectItem value="grandparent">Grandparent</SelectItem>
                  <SelectItem value="other">Other Family Member</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep("student")}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Student Information
        </Button>

        <Button
          type="submit"
          className="bg-brightpair hover:bg-brightpair-600"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            )
            : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Complete Onboarding
              </>
            )}
        </Button>
      </div>
    </div>
  );

  // Render success step
  const renderSuccessStep = () => (
    <div className="text-center py-8 space-y-6">
      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-xl font-medium">Student Successfully Onboarded!</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {form.getValues().fullName}{" "}
        has been added to your student roster. Would you like to invite their
        parent, {form.getValues().parentName}, to the platform?
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={() => navigate("/tutor/dashboard")}
        >
          Return to Dashboard
        </Button>

        <Button
          className="bg-brightpair hover:bg-brightpair-600"
          onClick={() => {
            // Here we would send an invitation email
            alert(`Invitation sent to ${form.getValues().parentEmail}`);
          }}
        >
          <MailPlus className="mr-2 h-4 w-4" />
          Send Parent Invitation
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              className="flex items-center"
              onClick={() => navigate("/tutor/dashboard")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <h1 className="text-2xl font-bold">Student Onboarding</h1>
          <p className="text-gray-500">
            Add a new student to your tutoring roster
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === "student" && "Student Information"}
              {currentStep === "parent" && "Parent/Guardian Information"}
              {currentStep === "success" && "Onboarding Complete"}
            </CardTitle>
            <CardDescription>
              {currentStep === "student" &&
                "Enter the student's basic information to get started"}
              {currentStep === "parent" &&
                "Add parent or guardian contact details for communication"}
              {currentStep === "success" &&
                "Student has been successfully added to your roster"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {currentStep === "student" && renderStudentStep()}
                {currentStep === "parent" && renderParentStep()}
                {currentStep === "success" && renderSuccessStep()}
              </form>
            </Form>
          </CardContent>
          {currentStep !== "success" && (
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="text-sm text-gray-500">
                Step {currentStep === "student" ? "1" : "2"} of 2
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentOnboarding;
