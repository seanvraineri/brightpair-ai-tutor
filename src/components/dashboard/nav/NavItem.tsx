
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, onClick, badge }) => {
  return (
    <Link 
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        active ? "bg-brightpair text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <span className="mr-3">
        {icon}
      </span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge 
          variant="default" 
          className="ml-auto h-5 min-w-[20px] flex items-center justify-center text-xs bg-red-500 text-white"
        >
          {badge}
        </Badge>
      )}
    </Link>
  );
};

export default NavItem;
