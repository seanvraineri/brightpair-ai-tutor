
import React from "react";
import { useLocation } from "react-router-dom";
import { Calendar, Sparkles } from "lucide-react";
import NavItem from "./NavItem";
import { UserRole } from "@/contexts/UserTypes";
import MessageNavItem from "./MessageNavItem";

interface ToolsLinksProps {
  onItemClick?: () => void;
  userRole: UserRole;
}

const ToolsLinks: React.FC<ToolsLinksProps> = ({ onItemClick, userRole }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
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
  );
};

export default ToolsLinks;
