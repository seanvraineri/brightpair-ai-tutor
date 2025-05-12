import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HomeworkStatus } from '@/types/homework';

interface StatusPillProps {
  status: HomeworkStatus;
  className?: string;
}

const StatusPill: React.FC<StatusPillProps> = ({ status, className = '' }) => {
  const getStatusStyles = (status: HomeworkStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'assigned':
        return 'bg-brightpair-50 text-brightpair border-brightpair-100';
      case 'submitted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'graded':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusLabel = (status: HomeworkStatus) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'assigned':
        return 'Assigned';
      case 'submitted':
        return 'Submitted';
      case 'graded':
        return 'Graded';
      default:
        return status;
    }
  };
  
  return (
    <Badge
      className={`font-medium ${getStatusStyles(status)} ${className}`}
    >
      {getStatusLabel(status)}
    </Badge>
  );
};

export default StatusPill; 