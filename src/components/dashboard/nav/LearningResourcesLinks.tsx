import React from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, FlaskConical, ScrollText, FileText } from "lucide-react";
import NavItem from "./NavItem";

interface LearningResourcesLinksProps {
  onItemClick?: () => void;
  collapsed?: boolean;
}

const LearningResourcesLinks: React.FC<LearningResourcesLinksProps> = ({ 
  onItemClick,
  collapsed = false 
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`pt-2 pb-1 ${collapsed ? 'text-center' : ''}`}>
      {!collapsed && (
        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-gray-500">LEARNING RESOURCES</p>
        </div>
      )}
      
      <NavItem 
        to="/lessons" 
        icon={<BookOpen size={20} />} 
        label="Lessons"
        active={isActive("/lessons")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/custom-lessons" 
        icon={<FileText size={20} />} 
        label="Custom Lessons"
        active={isActive("/custom-lessons")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/flashcards" 
        icon={<ScrollText size={20} />} 
        label="Flashcards"
        active={isActive("/flashcards")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/quizzes" 
        icon={<FlaskConical size={20} />} 
        label="Quizzes"
        active={isActive("/quizzes")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
    </div>
  );
};

export default LearningResourcesLinks;
