
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SubjectModal from "./SubjectModal";

// Mock data for subjects - would come from backend in production
const initialSubjects = [
  { id: "1", name: "Mathematics", description: "Algebra, Calculus, Geometry" },
  { id: "2", name: "Science", description: "Physics, Chemistry, Biology" },
  { id: "3", name: "English", description: "Literature, Grammar, Composition" }
];

export interface Subject {
  id: string;
  name: string;
  description: string;
}

const SubjectList = () => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  const handleAddSubject = () => {
    setCurrentSubject(null);
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsModalOpen(true);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    toast({
      title: "Subject deleted",
      description: "The subject has been successfully removed."
    });
  };

  const handleSaveSubject = (subject: Subject) => {
    if (currentSubject) {
      // Edit existing subject
      setSubjects(subjects.map(s => s.id === subject.id ? subject : s));
      toast({
        title: "Subject updated",
        description: "The subject has been successfully updated."
      });
    } else {
      // Add new subject
      const newSubject = {
        ...subject,
        id: Date.now().toString() // Simple ID generation
      };
      setSubjects([...subjects, newSubject]);
      toast({
        title: "Subject added",
        description: "The new subject has been successfully added."
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subjects</h2>
        <Button onClick={handleAddSubject}>
          <Plus size={18} className="mr-1" />
          Add Subject
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => (
          <Card key={subject.id} className="shadow-card">
            <CardHeader>
              <CardTitle>{subject.name}</CardTitle>
              <CardDescription>{subject.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditSubject(subject)}>
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SubjectModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveSubject} 
        subject={currentSubject}
      />
    </div>
  );
};

export default SubjectList;
