import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Spinner from '@/components/ui/spinner';

const DashboardLayout = lazy(() => import('@/components/dashboard/DashboardLayout'));
const TutorDashboard = lazy(() => import('@/pages/tutor/dashboard'));
const StudentDetail = lazy(() => import('@/pages/parent/StudentDetail'));
const StudentAssignments = lazy(() => import('@/pages/tutor/StudentAssignments'));
const TutorAssignments = lazy(() => import('@/pages/tutor/TutorAssignments'));
const StudentOnboarding = lazy(() => import('@/pages/tutor/StudentOnboarding'));
const HomeworkCreator = lazy(() => import('@/pages/tutor/HomeworkCreator'));
const HomeworkBuilder = lazy(() => import('@/pages/tutor/HomeworkBuilder'));
const CurriculumBuilder = lazy(() => import('@/pages/tutor/CurriculumBuilder'));
const CurriculumManager = lazy(() => import('@/pages/tutor/CurriculumManager'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Messages = lazy(() => import('@/pages/Messages'));

const TutorRoutes: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      {/* Routes that should render inside the dashboard shell */}
      <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
        <Route path="dashboard" element={<TutorDashboard />} />
        <Route path="student/:studentId" element={<StudentDetail />} />
        <Route path="student/:studentId/assignments" element={<StudentAssignments />} />
        <Route path="assignments" element={<TutorAssignments />} />
        <Route path="homework/create" element={<HomeworkCreator />} />
        <Route path="homework/builder" element={<HomeworkBuilder />} />
        <Route path="messages" element={<Messages />} />
        <Route path="curriculum/builder" element={<CurriculumBuilder />} />
        <Route path="curricula" element={<CurriculumManager />} />
      </Route>
      {/* Stand-alone pages (e.g., onboarding) that should not show sidebar */}
      <Route path="students/onboard" element={<StudentOnboarding />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default TutorRoutes; 