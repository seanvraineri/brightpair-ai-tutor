
import React from "react";
import { useLocation } from "react-router-dom";
import { GraduationCap, ListTodo, BookOpen, HelpCircle } from "lucide-react";
import NavItem from "./NavItem";
import { UserRole } from "@/contexts/UserTypes";

interface LearningResourcesLinksProps {
  onItemClick?: () => void;
  userRole: UserRole;
}

const LearningResourcesLinks: React.FC<LearningResourcesLinksProps> = ({ 
  onItemClick,
  userRole 
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="pt-2 pb-1">
      <div className="px-3 mb-2">
        <p className="text-xs font-medium text-gray-500">LEARNING RESOURCES</p>
      </div>
      
      <NavItem 
        to="/lessons" 
        icon={<GraduationCap size={20} />} 
        label="Lessons"
        active={isActive("/lessons")}
        onClick={onItemClick}
      />
      
      {/* Show homework to students and teachers */}
      {(userRole === "student" || userRole === "teacher") && (
        <NavItem 
          to="/homework" 
          icon={<ListTodo size={20} />} 
          label="Homework"
          active={isActive("/homework")}
          onClick={onItemClick}
        />
      )}
      
      {/* Show flashcards primarily to students */}
      {userRole === "student" && (
        <NavItem 
          to="/flashcards" 
          icon={<BookOpen size={20} />} 
          label="Flashcards" 
          active={isActive("/flashcards")}
          onClick={onItemClick}
        />
      )}
      
      {/* Show quizzes to students and teachers */}
      {(userRole === "student" || userRole === "teacher") && (
        <NavItem 
          to="/quizzes" 
          icon={<HelpCircle size={20} />} 
          label="Quizzes"
          active={isActive("/quizzes")}
          onClick={onItemClick}
        />
      )}
    </div>
  );
};

export default LearningResourcesLinks;
