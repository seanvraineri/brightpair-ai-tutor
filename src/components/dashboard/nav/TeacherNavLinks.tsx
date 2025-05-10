
import React from "react";
import { useLocation } from "react-router-dom";
import { Users, FileText, BarChart } from "lucide-react";
import NavItem from "./NavItem";

interface TeacherNavLinksProps {
  onItemClick?: () => void;
}

const TeacherNavLinks: React.FC<TeacherNavLinksProps> = ({ onItemClick }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="pt-2 pb-1">
      <div className="px-3 mb-2">
        <p className="text-xs font-medium text-gray-500">TEACHER TOOLS</p>
      </div>
      
      <NavItem 
        to="/students" 
        icon={<Users size={20} />} 
        label="Students"
        active={isActive("/students")}
        onClick={onItemClick}
      />
      
      <NavItem 
        to="/learning-tracks" 
        icon={<FileText size={20} />} 
        label="Learning Tracks"
        active={isActive("/learning-tracks")}
        onClick={onItemClick}
      />
      
      <NavItem 
        to="/reports" 
        icon={<BarChart size={20} />} 
        label="Reports"
        active={isActive("/reports")}
        onClick={onItemClick}
      />
    </div>
  );
};

export default TeacherNavLinks;
