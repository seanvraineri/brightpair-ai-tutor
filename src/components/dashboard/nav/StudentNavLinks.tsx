import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Brain, BarChart, GraduationCap, FileCheck } from "lucide-react";
import NavItem from "./NavItem";
import { getHomeworkList } from "@/services/homeworkService";
import { logger } from '@/services/logger';

interface StudentNavLinksProps {
  onItemClick?: () => void;
  collapsed?: boolean;
}

const StudentNavLinks: React.FC<StudentNavLinksProps> = ({ onItemClick, collapsed = false }) => {
  const location = useLocation();
  const [pendingHomework, setPendingHomework] = useState(0);
  
  useEffect(() => {
    // Fetch pending homework count
    const fetchPendingHomework = async () => {
      try {
        const homework = await getHomeworkList({ 
          status: 'assigned', 
          student_id: 'student-1' // Would be dynamic in a real app
        });
        setPendingHomework(homework.length);
      } catch (error) {
      logger.debug('Caught error:', error);
        
      
    }
    };
    
    fetchPendingHomework();
  }, []);
  
  const isActive = (path: string) => {
    if (path === "/homework") {
      return location.pathname === "/homework" || location.pathname.includes("/student/homework");
    }
    return location.pathname === path;
  };

  return (
    <div className={`pt-2 pb-1 ${collapsed ? 'text-center' : ''}`}>
      {!collapsed && (
        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-gray-500">LEARNING</p>
        </div>
      )}
      
      <NavItem 
        to="/ai-tutor" 
        icon={<Brain size={20} />} 
        label="AI Tutor"
        active={isActive("/ai-tutor")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/lessons" 
        icon={<BookOpen size={20} />} 
        label="Lessons"
        active={isActive("/lessons")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/homework" 
        icon={<GraduationCap size={20} />} 
        label="Homework"
        active={isActive("/homework")}
        onClick={onItemClick}
        collapsed={collapsed}
        badge={pendingHomework > 0 ? pendingHomework.toString() : undefined}
      />
      
      <NavItem 
        to="/progress" 
        icon={<BarChart size={20} />} 
        label="My Progress"
        active={isActive("/progress")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
    </div>
  );
};

export default StudentNavLinks; 