import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PdfUploader from '@/components/homework/PdfUploader';
import { generateCurriculum, getCurriculumTopicsForStudent } from '@/services/curriculumService';
import { CurriculumTopic } from '@/types/curriculum';
import { getStudents } from '@/services/homeworkService';

const CurriculumBuilder: React.FC = () => {
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [goalsInput, setGoalsInput] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [topics, setTopics] = useState<CurriculumTopic[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [textbook, setTextbook] = useState('');
  const [syllabus, setSyllabus] = useState('');

  useEffect(() => {
    const load = async () => setStudents(await getStudents());
    load();
  }, []);

  useEffect(() => {
    const loadTopics = async () => {
      if (!selectedStudent) {
        setTopics([]);
        return;
      }
      const t = await getCurriculumTopicsForStudent(selectedStudent);
      setTopics(t);
    };
    loadTopics();
  }, [selectedStudent]);

  const handleAddGoal = () => {
    const trimmed = goalsInput.trim();
    if (trimmed.length) {
      setGoals([...goals, trimmed]);
      setGoalsInput('');
    }
  };

  const handleGenerate = async () => {
    if (!selectedStudent || goals.length === 0) return;
    setIsGenerating(true);
    const cur = await generateCurriculum({
      tutor_id: 'tutor-1',
      student_id: selectedStudent,
      goals,
      materials,
      textbook: textbook.trim() || undefined,
      syllabus: syllabus.trim() || undefined,
    });
    setTopics(cur.topics);
    setIsGenerating(false);
  };

  const handleMaterialUploadComplete = (url: string) => {
    setMaterials([...materials, url]);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Curriculum Builder</h1>

      <Card>
        <CardHeader>
          <CardTitle>Build Curriculum for Student</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Student selector */}
          <div className="space-y-2 max-w-sm">
            <Label>Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent} defaultValue="">
              <SelectTrigger id="student-select">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Goals input */}
          <div className="space-y-2">
            <Label htmlFor="goal-input">Learning Goals</Label>
            <div className="flex gap-2">
              <Input id="goal-input" value={goalsInput} onChange={(e) => setGoalsInput(e.target.value)} placeholder="e.g. Master factoring quadratics" />
              <Button onClick={handleAddGoal} disabled={!goalsInput.trim()}>Add</Button>
            </div>
            {goals.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {goals.map((g, idx) => <li key={idx}>{g}</li>)}
              </ul>
            )}
          </div>

          {/* Textbook */}
          <div className="space-y-2 max-w-lg">
            <Label htmlFor="textbook">Primary Textbook (optional)</Label>
            <Input id="textbook" value={textbook} onChange={(e) => setTextbook(e.target.value)} placeholder="e.g. Algebra: Structure and Method Book 1" />
          </div>

          {/* Syllabus */}
          <div className="space-y-2 max-w-lg">
            <Label htmlFor="syllabus">Course Syllabus / Outline (optional)</Label>
            <Textarea id="syllabus" rows={3} value={syllabus} onChange={(e) => setSyllabus(e.target.value)} placeholder="Paste syllabus topics or upload as PDF." />
          </div>

          {/* Material upload */}
          <div className="space-y-2">
            <Label>Upload Reference Materials (optional)</Label>
            <PdfUploader onUploadComplete={handleMaterialUploadComplete} onUploadStart={() => {}} onError={() => {}} />
            {materials.map((m, idx) => (
              <p key={idx} className="text-xs text-gray-500">Uploaded: {m}</p>
            ))}
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !selectedStudent || goals.length === 0}>
            {isGenerating ? 'Generating...' : 'Generate Curriculum'}
          </Button>

          {topics.length > 0 && (
            <div className="pt-4">
              <h2 className="font-semibold mb-2">Curriculum Topics</h2>
              <ul className="list-disc list-inside space-y-1">
                {topics.map((t) => (
                  <li key={t.id}><span className="font-medium">{t.name}</span>: {t.description}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumBuilder; 