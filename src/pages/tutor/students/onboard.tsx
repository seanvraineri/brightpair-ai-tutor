import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save } from 'lucide-react';
import TutorNavigation from '@/components/tutor/TutorNavigation';

const StudentOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    grade_level: '',
    subject: '',
    learning_style: '',
    learning_goals: '',
    curriculum_source: '',
    difficulty_level: 3,
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    schedule_preferences: {
      days: [] as string[],
      timeOfDay: 'afternoon'
    }
  });
  
  // Available options
  const subjects = [
    'Mathematics', 'English', 'Science', 'History', 
    'Computer Science', 'Foreign Language', 'Art', 'Music',
    'Physical Education', 'Other'
  ];
  
  const gradeLevels = [
    'Kindergarten', '1st', '2nd', '3rd', '4th', '5th', 
    '6th', '7th', '8th', '9th', '10th', '11th', '12th', 'College'
  ];
  
  const learningStyles = [
    'visual', 'auditory', 'kinesthetic', 'reading/writing'
  ];
  
  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];
  
  const timePreferences = [
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'evening', label: 'Evening' },
    { id: 'flexible', label: 'Flexible' }
  ];
  
  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const days = prev.schedule_preferences.days.includes(day)
        ? prev.schedule_preferences.days.filter(d => d !== day)
        : [...prev.schedule_preferences.days, day];
        
      return {
        ...prev,
        schedule_preferences: {
          ...prev.schedule_preferences,
          days
        }
      };
    });
  };
  
  const handleTimeOfDayChange = (timeOfDay: string) => {
    setFormData(prev => ({
      ...prev,
      schedule_preferences: {
        ...prev.schedule_preferences,
        timeOfDay
      }
    }));
  };
  
  const handleDifficultyChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, difficulty_level: value[0] }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      // Insert student profile
      const { data, error } = await supabase
        .from('student_profiles')
        .insert({
          ...formData,
          tutor_id: user.id,
          status: 'active'
        })
        .select();
        
      if (error) throw error;
      
      // Navigate to the student's detail page
      if (data && data[0]) {
        navigate(`/tutor/students/${data[0].id}`);
      }
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Failed to create student profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/tutor/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-6 gap-4 p-4">
        {/* Sidebar / Navigation */}
        <div className="col-span-1">
          <TutorNavigation activeItem="students" />
        </div>
        
        {/* Main Content */}
        <div className="col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">New Student Onboarding</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                Enter the details for your new student to create their profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Student Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Primary Subject <span className="text-red-500">*</span></Label>
                      <Select 
                        value={formData.subject} 
                        onValueChange={(value) => handleSelectChange('subject', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="grade_level">Grade Level <span className="text-red-500">*</span></Label>
                      <Select 
                        value={formData.grade_level} 
                        onValueChange={(value) => handleSelectChange('grade_level', value)}
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="learning_style">Learning Style</Label>
                      <Select 
                        value={formData.learning_style} 
                        onValueChange={(value) => handleSelectChange('learning_style', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select learning style" />
                        </SelectTrigger>
                        <SelectContent>
                          {learningStyles.map(style => (
                            <SelectItem key={style} value={style}>
                              <span className="capitalize">{style}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Parent/Guardian Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent_name">Parent/Guardian Name</Label>
                      <Input
                        id="parent_name"
                        name="parent_name"
                        value={formData.parent_name}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="parent_email">Parent/Guardian Email</Label>
                      <Input
                        id="parent_email"
                        name="parent_email"
                        type="email"
                        value={formData.parent_email}
                        onChange={handleInputChange}
                        placeholder="parent@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="parent_phone">Parent/Guardian Phone</Label>
                      <Input
                        id="parent_phone"
                        name="parent_phone"
                        value={formData.parent_phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Learning Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Learning Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Available Days</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {daysOfWeek.map(day => (
                          <div key={day.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={day.id}
                              checked={formData.schedule_preferences.days.includes(day.id)}
                              onCheckedChange={() => handleDayToggle(day.id)}
                            />
                            <Label htmlFor={day.id} className="font-normal">
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Preferred Time of Day</Label>
                      <RadioGroup 
                        value={formData.schedule_preferences.timeOfDay}
                        onValueChange={handleTimeOfDayChange}
                        className="flex flex-wrap gap-4"
                      >
                        {timePreferences.map(time => (
                          <div key={time.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={time.id} id={`time-${time.id}`} />
                            <Label htmlFor={`time-${time.id}`} className="font-normal">
                              {time.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Difficulty Level</Label>
                        <span className="text-sm text-gray-500">Level: {formData.difficulty_level}</span>
                      </div>
                      <Slider
                        value={[formData.difficulty_level]}
                        onValueChange={handleDifficultyChange}
                        min={1}
                        max={5}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Advanced</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Goals and Curriculum */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Goals and Curriculum</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="learning_goals">Learning Goals</Label>
                      <Textarea
                        id="learning_goals"
                        name="learning_goals"
                        value={formData.learning_goals}
                        onChange={handleInputChange}
                        placeholder="What are the student's main learning objectives or goals?"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="curriculum_source">Curriculum Source</Label>
                      <Textarea
                        id="curriculum_source"
                        name="curriculum_source"
                        value={formData.curriculum_source}
                        onChange={handleInputChange}
                        placeholder="Is there a specific curriculum, textbook, or program the student follows?"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-brightpair hover:bg-brightpair-600"
                    disabled={isSubmitting || !formData.full_name || !formData.subject || !formData.grade_level}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Creating...' : 'Create Student Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentOnboardingPage; 