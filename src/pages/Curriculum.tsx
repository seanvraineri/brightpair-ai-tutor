import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Book,
  BookOpen,
  Calendar,
  Clock,
  FilePlus,
  FileText,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Curriculum: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [curriculums, setCurriculums] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<string | null>(
    null,
  );
  const [isNewCurriculumDialogOpen, setIsNewCurriculumDialogOpen] = useState(
    false,
  );
  const [isNewUnitDialogOpen, setIsNewUnitDialogOpen] = useState(false);

  // New curriculum form state
  const [newCurriculum, setNewCurriculum] = useState({
    title: "",
    subject: "",
    grade: "",
    description: "",
  });

  // New unit form state
  const [newUnit, setNewUnit] = useState({
    title: "",
    lessons: "1",
  });

  // Filter curriculums based on tab and search
  const filteredCurriculums = curriculums.filter((curriculum) => {
    const matchesSearch =
      curriculum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curriculum.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curriculum.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" ||
      (activeTab === "published" && curriculum.status === "published") ||
      (activeTab === "draft" && curriculum.status === "draft");

    return matchesSearch && matchesTab;
  });

  const getCurriculumById = (id: string) => {
    return curriculums.find((c) => c.id === id);
  };

  const handleAddCurriculum = () => {
    const newId = `curr${Date.now()}`;
    const currentDate = new Date().toISOString().split("T")[0];

    const curriculum = {
      id: newId,
      title: newCurriculum.title,
      subject: newCurriculum.subject,
      grade: newCurriculum.grade,
      description: newCurriculum.description,
      units: [],
      lastUpdated: currentDate,
      status: "draft",
    };

    setCurriculums([curriculum, ...curriculums]);
    setSelectedCurriculum(newId);

    toast({
      title: "Curriculum created",
      description: "Your new curriculum has been created successfully.",
    });

    // Reset form and close dialog
    setNewCurriculum({
      title: "",
      subject: "",
      grade: "",
      description: "",
    });
    setIsNewCurriculumDialogOpen(false);
  };

  const handleAddUnit = () => {
    if (!selectedCurriculum) return;

    const newId = `u${Date.now()}`;
    const currentDate = new Date().toISOString().split("T")[0];

    const unit = {
      id: newId,
      title: newUnit.title,
      lessons: parseInt(newUnit.lessons),
      status: "draft",
    };

    const updatedCurriculums = curriculums.map((curr) => {
      if (curr.id === selectedCurriculum) {
        return {
          ...curr,
          units: [...curr.units, unit],
          lastUpdated: currentDate,
        };
      }
      return curr;
    });

    setCurriculums(updatedCurriculums);

    toast({
      title: "Unit added",
      description: `Unit "${newUnit.title}" has been added to the curriculum.`,
    });

    // Reset form and close dialog
    setNewUnit({
      title: "",
      lessons: "1",
    });
    setIsNewUnitDialogOpen(false);
  };

  const handleDeleteCurriculum = (id: string) => {
    setCurriculums(curriculums.filter((curriculum) => curriculum.id !== id));

    if (selectedCurriculum === id) {
      setSelectedCurriculum(null);
    }

    toast({
      title: "Curriculum deleted",
      description: "The curriculum has been removed.",
    });
  };

  const handlePublishCurriculum = (id: string) => {
    const updatedCurriculums = curriculums.map((curriculum) =>
      curriculum.id === id ? { ...curriculum, status: "published" } : curriculum
    );

    setCurriculums(updatedCurriculums);

    toast({
      title: "Curriculum published",
      description: "Your curriculum is now available to your students.",
    });
  };

  const handlePublishUnit = (curriculumId: string, unitId: string) => {
    const updatedCurriculums = curriculums.map((curriculum) => {
      if (curriculum.id === curriculumId) {
        const updatedUnits = curriculum.units.map((unit) =>
          unit.id === unitId ? { ...unit, status: "published" } : unit
        );
        return { ...curriculum, units: updatedUnits };
      }
      return curriculum;
    });

    setCurriculums(updatedCurriculums);

    toast({
      title: "Unit published",
      description: "This unit is now available to your students.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Grade levels
  const gradeOptions = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];

  // Subject options
  const subjectOptions = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Social Studies",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Foreign Languages",
    "Art",
    "Music",
    "Physical Education",
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Curriculum Management</h1>
            <p className="text-gray-600">
              Create and manage learning curricula for your students
            </p>
          </div>
          <Button onClick={() => setIsNewCurriculumDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Curriculum
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Curriculums</CardTitle>
                <CardDescription>
                  Browse and select a curriculum to edit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search curriculums..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="published">Published</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-2 mt-2">
                  {filteredCurriculums.length === 0
                    ? (
                      <p className="text-center text-gray-500 py-6">
                        No curriculums found
                      </p>
                    )
                    : (
                      filteredCurriculums.map((curriculum) => (
                        <div
                          key={curriculum.id}
                          className={`cursor-pointer p-3 rounded-md border ${
                            curriculum.id === selectedCurriculum
                              ? "bg-brightpair/5 border-brightpair"
                              : "hover:bg-gray-50 border-gray-200"
                          }`}
                          onClick={() => setSelectedCurriculum(curriculum.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                {curriculum.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {curriculum.subject} • {curriculum.grade}
                              </p>
                            </div>
                            <Badge
                              className={getStatusColor(curriculum.status)}
                            >
                              {curriculum.status === "published"
                                ? "Published"
                                : "Draft"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedCurriculum
              ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {getCurriculumById(selectedCurriculum)?.title}
                        </CardTitle>
                        <CardDescription>
                          {getCurriculumById(selectedCurriculum)?.subject} •
                          {" "}
                          {getCurriculumById(selectedCurriculum)?.grade} Grade
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getCurriculumById(selectedCurriculum)?.status ===
                            "draft" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePublishCurriculum(selectedCurriculum)}
                          >
                            Publish
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteCurriculum(selectedCurriculum)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        DESCRIPTION
                      </h3>
                      <p className="text-sm">
                        {getCurriculumById(selectedCurriculum)?.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-500">
                          UNITS
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsNewUnitDialogOpen(true)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Unit
                        </Button>
                      </div>

                      {getCurriculumById(selectedCurriculum)?.units.length === 0
                        ? (
                          <div className="text-center py-8 border border-dashed border-gray-200 rounded-md">
                            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              No units yet
                            </p>
                            <p className="text-xs text-gray-400">
                              Add your first unit to this curriculum
                            </p>
                          </div>
                        )
                        : (
                          <div className="space-y-3">
                            {getCurriculumById(selectedCurriculum)?.units.map(
                              (unit) => (
                                <Card key={unit.id} className="shadow-sm">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <h4 className="font-medium">
                                          {unit.title}
                                        </h4>
                                        <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                                          <div className="flex items-center">
                                            <Book className="h-3.5 w-3.5 mr-1" />
                                            <span>
                                              {unit.lessons} {unit.lessons === 1
                                                ? "Lesson"
                                                : "Lessons"}
                                            </span>
                                          </div>
                                          <Badge
                                            className={getStatusColor(
                                              unit.status,
                                            )}
                                          >
                                            {unit.status === "published"
                                              ? "Published"
                                              : "Draft"}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button variant="ghost" size="sm">
                                          <Pencil className="h-3.5 w-3.5 mr-1" />
                                          Edit
                                        </Button>
                                        {unit.status === "draft" && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handlePublishUnit(
                                                selectedCurriculum,
                                                unit.id,
                                              )}
                                          >
                                            Publish
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        )}
                    </div>

                    <div className="py-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>
                          Last updated:{" "}
                          {getCurriculumById(selectedCurriculum)?.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
              : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Curriculum Selected
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      Select a curriculum from the list on the left or create a
                      new one to get started.
                    </p>
                    <Button onClick={() => setIsNewCurriculumDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Curriculum
                    </Button>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>

      {/* New Curriculum Dialog */}
      <Dialog
        open={isNewCurriculumDialogOpen}
        onOpenChange={setIsNewCurriculumDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Curriculum</DialogTitle>
            <DialogDescription>
              Add details for your new curriculum. You can add units and lessons
              afterward.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="curriculum-title">Curriculum Title</Label>
              <Input
                id="curriculum-title"
                value={newCurriculum.title}
                onChange={(e) =>
                  setNewCurriculum({ ...newCurriculum, title: e.target.value })}
                placeholder="e.g., Algebra Fundamentals"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="curriculum-subject">Subject</Label>
                <Select
                  value={newCurriculum.subject}
                  onValueChange={(value) =>
                    setNewCurriculum({ ...newCurriculum, subject: value })}
                >
                  <SelectTrigger id="curriculum-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="curriculum-grade">Grade Level</Label>
                <Select
                  value={newCurriculum.grade}
                  onValueChange={(value) =>
                    setNewCurriculum({ ...newCurriculum, grade: value })}
                >
                  <SelectTrigger id="curriculum-grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="curriculum-description">Description</Label>
              <Textarea
                id="curriculum-description"
                value={newCurriculum.description}
                onChange={(e) =>
                  setNewCurriculum({
                    ...newCurriculum,
                    description: e.target.value,
                  })}
                placeholder="Brief description of the curriculum..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewCurriculumDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCurriculum}>
              Create Curriculum
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Unit Dialog */}
      <Dialog open={isNewUnitDialogOpen} onOpenChange={setIsNewUnitDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Unit</DialogTitle>
            <DialogDescription>
              Create a new unit for "{getCurriculumById(
                selectedCurriculum || "",
              )?.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unit-title">Unit Title</Label>
              <Input
                id="unit-title"
                value={newUnit.title}
                onChange={(e) =>
                  setNewUnit({ ...newUnit, title: e.target.value })}
                placeholder="e.g., Introduction to Fractions"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit-lessons">Number of Lessons</Label>
              <Input
                id="unit-lessons"
                type="number"
                min="1"
                value={newUnit.lessons}
                onChange={(e) =>
                  setNewUnit({ ...newUnit, lessons: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewUnitDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUnit}>
              Add Unit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Curriculum;
