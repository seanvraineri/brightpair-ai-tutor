import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Spinner from '@/components/ui/spinner';

const HomeworkViewer = lazy(() => import('@/pages/student/HomeworkViewer'));
const StudentNotes = lazy(() => import('@/pages/StudentNotes'));
const AITutor = lazy(() => import('@/pages/AITutor'));
const Flashcards = lazy(() => import('@/pages/Flashcards'));
const Quizzes = lazy(() => import('@/pages/Quizzes'));
const Lessons = lazy(() => import('@/pages/Lessons'));
const CustomLessonPage = lazy(() => import('@/pages/CustomLessonPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const StudentRoutes: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="homework/:homeworkId" element={<HomeworkViewer />} />
      <Route path="notes" element={<StudentNotes />} />
      <Route path="ai-tutor" element={<AITutor />} />
      <Route path="flashcards" element={<Flashcards />} />
      <Route path="quizzes" element={<Quizzes />} />
      <Route path="lessons" element={<Lessons />} />
      <Route path="custom-lessons" element={<CustomLessonPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default StudentRoutes; 