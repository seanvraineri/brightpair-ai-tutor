import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  label, 
  active = false,
  onClick,
  collapsed = false,
  badge
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center py-2 text-sm rounded-md transition-colors",
        collapsed ? "justify-center px-2" : "px-3",
        active 
          ? "bg-accent text-accent-foreground" 
          : "hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={onClick}
    >
      {icon && <div className={collapsed ? "" : "mr-2"}>{icon}</div>}
      {!collapsed && (
        <div className="flex-1 flex items-center justify-between">
          <span>{label}</span>
          {badge && (
            <span className="ml-2 text-xs bg-brightpair text-white px-1.5 py-0.5 rounded-full font-medium min-w-[1.2rem] text-center">
              {badge}
            </span>
          )}
        </div>
      )}
      {collapsed && badge && (
        <span className="absolute -top-1 -right-1 text-xs bg-brightpair text-white w-4 h-4 flex items-center justify-center rounded-full font-medium">
          {badge}
        </span>
      )}
      {collapsed && (
        <span className="sr-only">{label}</span>
      )}
    </Link>
  );
};

export default NavItem;
