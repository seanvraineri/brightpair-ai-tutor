
import React from "react";
import { useLocation } from "react-router-dom";
import { User, Settings } from "lucide-react";
import NavItem from "./NavItem";
import { useUser } from "@/contexts/UserContext";
import TeacherNavLinks from "./TeacherNavLinks";
import ParentNavLinks from "./ParentNavLinks";
import LearningResourcesLinks from "./LearningResourcesLinks";
import ToolsLinks from "./ToolsLinks";

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
      
      {/* Role-specific navigation */}
      {userRole === "teacher" && <TeacherNavLinks onItemClick={onItemClick} />}
      {userRole === "parent" && <ParentNavLinks onItemClick={onItemClick} />}
      
      {/* Learning Resources - shown to all users */}
      <LearningResourcesLinks userRole={userRole} onItemClick={onItemClick} />
      
      {/* Tools Group - available to all users */}
      <ToolsLinks userRole={userRole} onItemClick={onItemClick} />
      
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
