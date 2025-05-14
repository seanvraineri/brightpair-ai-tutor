import React from "react";
import { useLocation } from "react-router-dom";
import { Users, NotebookPen, BookOpen, BarChart, MessageSquare, BookOpenCheck } from "lucide-react";
import NavItem from "./NavItem";

interface TeacherNavLinksProps {
  onItemClick?: () => void;
  collapsed?: boolean;
}

const TeacherNavLinks: React.FC<TeacherNavLinksProps> = ({ onItemClick, collapsed = false }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/tutor/dashboard") {
      return location.pathname === "/tutor/dashboard";
    }
    if (path === "/tutor/homework/builder") {
      return location.pathname.includes("/tutor/homework/builder");
    }
    return location.pathname === path;
  };

  return (
    <div className={`pt-2 pb-1 ${collapsed ? 'text-center' : ''}`}>
      {!collapsed && (
        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-gray-500">TEACHER TOOLS</p>
        </div>
      )}
      
      <NavItem 
        to="/teacher-dashboard" 
        icon={<Users size={20} />} 
        label="Student Management"
        active={isActive("/teacher-dashboard")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/student-notes" 
        icon={<NotebookPen size={20} />} 
        label="Student Notes"
        active={isActive("/student-notes")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/curriculum" 
        icon={<BookOpen size={20} />} 
        label="Curriculum"
        active={isActive("/curriculum")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/reports" 
        icon={<BarChart size={20} />} 
        label="Reports"
        active={isActive("/reports")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      {!collapsed && (
        <div className="px-3 mt-6 mb-2">
          <p className="text-xs font-medium text-gray-500">TUTOR CRM</p>
        </div>
      )}
      
      <NavItem 
        to="/tutor/dashboard" 
        icon={<Users size={20} />} 
        label="Students"
        active={isActive("/tutor/dashboard")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/tutor/homework/builder" 
        icon={<BookOpenCheck size={20} />} 
        label="Homework Builder"
        active={isActive("/tutor/homework/builder")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/tutor/messages" 
        icon={<MessageSquare size={20} />} 
        label="Messages"
        active={location.pathname.includes("/tutor/messages")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
    </div>
  );
};

export default TeacherNavLinks;
