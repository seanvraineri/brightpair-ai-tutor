import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SubjectModal from "./SubjectModal";
import { getTracks, Track } from "@/services/curriculumService";
import { Skeleton } from "@/components/ui/skeleton";
import TrackDetails from "./TrackDetails";

export interface Subject {
  id: string;
  name: string;
  description: string;
}

const SubjectList = () => {
  const [subjects, setSubjects] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const tracks = await getTracks();
      setSubjects(tracks);
      setLoading(false);
    })();
  }, []);

  const handleAddSubject = () => {
    setCurrentSubject(null);
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsModalOpen(true);
  };

  const handleDeleteSubject = () => {};

  const handleViewDetails = (track: Track) => {
    setSelectedTrack(track);
    setDetailsOpen(true);
  };

  const handleSaveSubject = (subject: Subject) => {
    if (currentSubject) {
      // Edit existing subject
      setSubjects(subjects.map((s) => s.id === subject.id ? subject : s));
      toast({
        title: "Subject updated",
        description: "The subject has been successfully updated.",
      });
    } else {
      // Add new subject
      const newSubject = {
        ...subject,
        id: Date.now().toString(), // Simple ID generation
      };
      setSubjects([...subjects, newSubject]);
      toast({
        title: "Subject added",
        description: "The new subject has been successfully added.",
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
        {loading
          ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))
          )
          : subjects.map((subject: any) => (
            <Card key={subject.id} className="shadow-card">
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>{subject.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(subject)}
                >
                  View Details
                </Button>
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

      {selectedTrack && (
        <TrackDetails
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          trackId={selectedTrack.id}
          trackName={selectedTrack.name}
        />
      )}
    </div>
  );
};

export default SubjectList;
