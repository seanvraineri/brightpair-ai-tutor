import React from "react";
import { useLocation } from "react-router-dom";
import { Users, BookOpen, Calendar, FileText, MessageSquare, CreditCard } from "lucide-react";
import NavItem from "./NavItem";

interface ParentNavLinksProps {
  onItemClick?: () => void;
  collapsed?: boolean;
}

const ParentNavLinks: React.FC<ParentNavLinksProps> = ({ onItemClick, collapsed = false }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`pt-2 pb-1 ${collapsed ? 'text-center' : ''}`}>
      {!collapsed && (
        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-gray-500">PARENT TOOLS</p>
        </div>
      )}
      
      <NavItem 
        to="/parent/dashboard" 
        icon={<Users size={20} />} 
        label="Student Dashboard"
        active={isActive("/parent/dashboard")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/billing" 
        icon={<CreditCard size={20} />} 
        label="Billing & Payments"
        active={isActive("/billing")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/tutors" 
        icon={<BookOpen size={20} />} 
        label="Find Tutors"
        active={isActive("/tutors")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/parent/messages/new" 
        icon={<MessageSquare size={20} />} 
        label="Messages"
        active={isActive("/parent/messages/new")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/schedule" 
        icon={<Calendar size={20} />} 
        label="Schedule"
        active={isActive("/schedule")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
      
      <NavItem 
        to="/parent/reports" 
        icon={<FileText size={20} />} 
        label="Reports"
        active={isActive("/parent/reports")}
        onClick={onItemClick}
        collapsed={collapsed}
      />
    </div>
  );
};

export default ParentNavLinks;
