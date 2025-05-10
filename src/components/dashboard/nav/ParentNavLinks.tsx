
import React from "react";
import { useLocation } from "react-router-dom";
import { Users, BarChart } from "lucide-react";
import NavItem from "./NavItem";

interface ParentNavLinksProps {
  onItemClick?: () => void;
}

const ParentNavLinks: React.FC<ParentNavLinksProps> = ({ onItemClick }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
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
  );
};

export default ParentNavLinks;
