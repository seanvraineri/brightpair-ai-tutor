
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
  GraduationCap,
  Sparkles,
  Users,
  FileText,
  BarChart
} from "lucide-react";
import NavItem from "./NavItem";
import MessageNavItem from "./MessageNavItem";
import { useUser } from "@/contexts/UserContext";

interface NavLinksProps {
  onItemClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ onItemClick }) => {
  const location = useLocation();
  const { user } = useUser();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Get user role, defaulting to student if not available
  const userRole = user?.role || "student";

  return (
    <nav className="space-y-2">
      {/* Dashboard - different links based on role */}
      <NavItem 
        to={userRole === "student" ? "/dashboard" : 
            userRole === "teacher" ? "/teacher-dashboard" : 
            "/parent-dashboard"} 
        icon={<User size={20} />} 
        label="Dashboard"
        active={isActive(userRole === "student" ? "/dashboard" : 
                         userRole === "teacher" ? "/teacher-dashboard" : 
                         "/parent-dashboard")}
        onClick={onItemClick}
      />
      
      {/* Teacher-specific navigation */}
      {userRole === "teacher" && (
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
      )}
      
      {/* Parent-specific navigation */}
      {userRole === "parent" && (
        <div className="pt-2 pb-1">
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-gray-500">PARENT TOOLS</p>
          </div>
          
          <NavItem 
            to="/children" 
            icon={<Users size={20} />} 
            label="My Children"
            active={isActive("/children")}
            onClick={onItemClick}
          />
          
          <NavItem 
            to="/progress-reports" 
            icon={<BarChart size={20} />} 
            label="Progress Reports"
            active={isActive("/progress-reports")}
            onClick={onItemClick}
          />
        </div>
      )}
      
      {/* Learning Resources - shown to all users */}
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
      
      {/* Tools Group - available to all users */}
      <div className="pt-2 pb-1">
        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-gray-500">TOOLS</p>
        </div>
        
        <NavItem
          to="/scheduling"
          icon={<Calendar size={20} />}
          label="Scheduling"
          active={isActive("/scheduling")}
          onClick={onItemClick}
        />
        
        {/* Use MessageNavItem for messages */}
        <MessageNavItem />
        
        {/* AI Tutor - primarily for students */}
        {userRole === "student" && (
          <NavItem 
            to="/ai-tutor" 
            icon={<Sparkles size={20} />} 
            label="AI Tutor"
            active={isActive("/ai-tutor")}
            onClick={onItemClick}
          />
        )}
      </div>
      
      {/* Settings */}
      <div className="pt-2">
        <NavItem 
          to="/settings" 
          icon={<Settings size={20} />} 
          label="Settings"
          active={isActive("/settings")}
          onClick={onItemClick}
        />
      </div>
    </nav>
  );
};

export default NavLinks;
