import React from 'react';
import PersonalizedLearningPanel from './PersonalizedLearningPanel';

/**
 * Dashboard Modules - Contains components for providing personalized learning
 */
const DashboardModules = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Personalized Learning</h2>
      <PersonalizedLearningPanel />
    </div>
  );
};

export default DashboardModules; 