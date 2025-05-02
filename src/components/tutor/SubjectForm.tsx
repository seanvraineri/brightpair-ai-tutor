
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Subject {
  id: string;
  name: string;
  grade?: string;
  description?: string;
  documents?: string[];
}

interface SubjectFormProps {
  onSubmit: (subject: Subject) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onSubmit }) => {
  const [subjectName, setSubjectName] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subjectName.trim()) {
      return;
    }
    
    // Create a new subject
    const newSubject: Subject = {
      id: subjectName.toLowerCase().replace(/\s+/g, '-'),
      name: subjectName,
      grade: grade || undefined,
      description: description || undefined,
      documents: []
    };
    
    onSubmit(newSubject);
    
    // Reset form
    setSubjectName("");
    setGrade("");
    setDescription("");
  };

  const grades = [
    "Pre-K", "K", "1st", "2nd", "3rd", "4th", "5th", 
    "6th", "7th", "8th", "9th", "10th", "11th", "12th",
    "College", "Graduate", "Professional"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject-name">Subject Name</Label>
        <Input
          id="subject-name"
          placeholder="e.g., Algebra, Biology, SAT Prep"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="grade">Grade Level (optional)</Label>
        <Select value={grade} onValueChange={setGrade}>
          <SelectTrigger id="grade">
            <SelectValue placeholder="Select a grade level" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Brief description of the subject or what you're looking to learn"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="submit" className="bg-brightpair hover:bg-brightpair-600">
          Add Subject
        </Button>
      </div>
    </form>
  );
};

export default SubjectForm;
