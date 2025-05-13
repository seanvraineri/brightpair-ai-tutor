import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Spinner from '@/components/ui/spinner';

const ParentDashboard = lazy(() => import('@/pages/parent/dashboard'));
const StudentDetail = lazy(() => import('@/pages/parent/StudentDetail'));
const MessageComposerPage = lazy(() => import('@/pages/parent/MessageComposerPage'));
const ReportViewPage = lazy(() => import('@/pages/parent/ReportViewPage'));
const TutorSearch = lazy(() => import('@/pages/TutorSearch'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const ParentRoutes: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="dashboard" element={<ParentDashboard />} />
      <Route path="students/:id" element={<StudentDetail isParentView={true} />} />
      <Route path="messages/new" element={<MessageComposerPage isParentView={true} />} />
      <Route path="reports/view/:id" element={<ReportViewPage />} />
      <Route path="tutors" element={<TutorSearch />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default ParentRoutes; 