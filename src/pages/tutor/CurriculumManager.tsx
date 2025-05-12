import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Curriculum } from '@/types/curriculum';
import { getCurriculaForTutor } from '@/services/curriculumService';
import { getStudents } from '@/services/homeworkService';

const CurriculumManager: React.FC = () => {
  const tutorId = 'tutor-1'; // TODO: derive from auth context
  const navigate = useNavigate();
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [students, setStudents] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const list = await getCurriculaForTutor(tutorId);
      setCurricula(list);
      const s = await getStudents();
      const map: Record<string, string> = {};
      s.forEach((st) => (map[st.id] = st.name));
      setStudents(map);
    };
    load();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Curriculum Management</h1>
      {curricula.length === 0 ? (
        <p>No curricula created yet. Click "Create Curriculum" to build one.</p>
      ) : (
        curricula.map((cur) => (
          <Card key={cur.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{cur.title}</CardTitle>
              <p className="text-sm text-gray-500">
                {students[cur.student_id] || cur.student_id} — {cur.goals.length} goals, {cur.topics.length} topics
              </p>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate('/curriculum?student=' + cur.student_id)}>
                Edit Curriculum
              </Button>
            </CardContent>
          </Card>
        ))
      )}
      <Button className="bg-brightpair text-white" onClick={() => navigate('/curriculum')}>
        Create Curriculum
      </Button>
    </div>
  );
};

export default CurriculumManager; 