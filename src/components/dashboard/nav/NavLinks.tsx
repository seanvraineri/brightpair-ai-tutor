
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  User,
  BookOpen, 
  HelpCircle, 
  Settings,
  ListTodo,
  Calendar,
  MessageSquare,
  GraduationCap
} from "lucide-react";
import NavItem from "./NavItem";
import MessageNavItem from "./MessageNavItem";

interface NavLinksProps {
  onItemClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ onItemClick }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="space-y-2">
      <NavItem 
        to="/dashboard" 
        icon={<User size={20} />} 
        label="Dashboard"
        active={isActive("/dashboard")}
        onClick={onItemClick}
      />
      <NavItem 
        to="/homework" 
        icon={<ListTodo size={20} />} 
        label="Homework"
        active={isActive("/homework")}
        onClick={onItemClick}
      />
      <NavItem
        to="/scheduling"
        icon={<Calendar size={20} />}
        label="Scheduling"
        active={isActive("/scheduling")}
        onClick={onItemClick}
      />
      <NavItem 
        to="/lessons" 
        icon={<GraduationCap size={20} />} 
        label="Lessons"
        active={isActive("/lessons")}
        onClick={onItemClick}
      />
      
      {/* Use MessageNavItem for messages */}
      <MessageNavItem />
      
      <NavItem 
        to="/tutor-chat" 
        icon={<MessageSquare size={20} />} 
        label="AI Tutor Chat"
        active={isActive("/tutor-chat")}
        onClick={onItemClick}
      />
      <NavItem 
        to="/flashcards" 
        icon={<BookOpen size={20} />} 
        label="Flashcards" 
        active={isActive("/flashcards")}
        onClick={onItemClick}
      />
      <NavItem 
        to="/quizzes" 
        icon={<HelpCircle size={20} />} 
        label="Quizzes"
        active={isActive("/quizzes")}
        onClick={onItemClick}
      />
      <NavItem 
        to="/settings" 
        icon={<Settings size={20} />} 
        label="Settings"
        active={isActive("/settings")}
        onClick={onItemClick}
      />
    </nav>
  );
};

export default NavLinks;
