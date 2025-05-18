import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Plus, Save, Tag, X } from "lucide-react";

interface Note {
  id: string;
  studentId: string;
  date: string;
  content: string;
  tags: string[];
}

const StudentNotes: React.FC = () => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Common tags for autocomplete
  const commonTags = [
    "Strengths",
    "Needs Improvement",
    "Action Items",
    "Learning Style",
    "Progress",
    "Test Prep",
    "Homework",
    "Behavior",
  ];

  // Load notes for selected student
  useEffect(() => {
    if (selectedStudent) {
      // Mock API call - would fetch from backend in production
      const mockNotes: Note[] = [
        {
          id: "note1",
          studentId: "1",
          date: "2023-06-15",
          content:
            "Alex is showing significant improvement in algebra concepts. Still struggles with word problems.",
          tags: ["Progress", "Strengths", "Needs Improvement"],
        },
        {
          id: "note2",
          studentId: "1",
          date: "2023-06-08",
          content:
            "Completed practice test with 85% accuracy. Review needed on geometric proofs.",
          tags: ["Test Prep", "Action Items"],
        },
        {
          id: "note3",
          studentId: "2",
          date: "2023-06-14",
          content:
            "Jamie's essay writing has improved. Focus on citing sources correctly in next session.",
          tags: ["Progress", "Action Items"],
        },
        {
          id: "note4",
          studentId: "3",
          date: "2023-06-12",
          content:
            "Taylor shows strong aptitude for coding concepts but needs work on algorithm efficiency.",
          tags: ["Strengths", "Needs Improvement"],
        },
      ];

      setNotes(mockNotes.filter((note) => note.studentId === selectedStudent));
    } else {
      setNotes([]);
    }
  }, [selectedStudent]);

  const handleSaveNote = () => {
    if (!currentNote.trim()) {
      toast({
        title: "Cannot save empty note",
        description: "Please enter some content for your note.",
        variant: "destructive",
      });
      return;
    }

    if (editingNoteId) {
      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? {
              ...note,
              content: currentNote,
              tags: currentTags,
              date: new Date().toISOString().split("T")[0],
            }
            : note
        ),
      );

      toast({
        title: "Note updated",
        description: "Your changes have been saved.",
      });

      setEditingNoteId(null);
    } else {
      // Create new note
      const newNote: Note = {
        id: `note${Date.now()}`,
        studentId: selectedStudent,
        date: new Date().toISOString().split("T")[0],
        content: currentNote,
        tags: currentTags,
      };

      setNotes([newNote, ...notes]);

      toast({
        title: "Note saved",
        description: "Your note has been added to this student's record.",
      });
    }

    // Reset form
    setCurrentNote("");
    setCurrentTags([]);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note.content);
    setCurrentTags(note.tags);
    setEditingNoteId(note.id);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));

    if (editingNoteId === noteId) {
      setEditingNoteId(null);
      setCurrentNote("");
      setCurrentTags([]);
    }

    toast({
      title: "Note deleted",
      description: "The note has been removed from this student's record.",
    });
  };

  const handleAddTag = () => {
    if (newTag && !currentTags.includes(newTag)) {
      setCurrentTags([...currentTags, newTag]);
      setNewTag("");
    }
  };

  const handleSelectCommonTag = (tag: string) => {
    if (!currentTags.includes(tag)) {
      setCurrentTags([...currentTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCurrentTags(currentTags.filter((t) => t !== tag));
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setCurrentNote("");
    setCurrentTags([]);
  };

  const student = null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Notes</h2>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Student</CardTitle>
          <CardDescription>
            Choose a student to view or add notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {/* Render live students here */}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedStudent && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingNoteId ? "Edit Note" : "Add New Note"}
              </CardTitle>
              <CardDescription>
                {editingNoteId
                  ? "Update your notes about this student"
                  : "Record observations, progress, and plans for this student"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="note-content">Note Content</Label>
                <Textarea
                  id="note-content"
                  placeholder="Enter your observations, insights, or action items..."
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentTags.map((tag) => (
                    <Badge
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {tag}
                      <X
                        size={14}
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button type="button" size="sm" onClick={handleAddTag}>
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="mt-2">
                  <Label className="text-sm">Common Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {commonTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`cursor-pointer hover:bg-secondary ${
                          currentTags.includes(tag) ? "bg-secondary" : ""
                        }`}
                        onClick={() => handleSelectCommonTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {editingNoteId && (
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSaveNote}>
                <Save size={16} className="mr-2" />
                {editingNoteId ? "Update Note" : "Save Note"}
              </Button>
            </CardFooter>
          </Card>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Notes for {student?.name}
            </h3>

            {notes.length === 0
              ? (
                <p className="text-gray-500 text-center py-8">
                  No notes yet. Add your first note above.
                </p>
              )
              : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <Card key={note.id} className="shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar size={14} className="mr-1" />
                            {note.date}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleEditNote(note)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteNote(note.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{note.content}</p>
                        {note.tags.length > 0 && (
                          <div className="flex items-center mt-3 gap-2 flex-wrap">
                            <Tag size={14} className="text-gray-500" />
                            {note.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentNotes;
