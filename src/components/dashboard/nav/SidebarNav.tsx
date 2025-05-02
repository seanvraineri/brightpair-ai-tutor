
import React from "react";
import Logo from "@/components/Logo";
import NavLinks from "./NavLinks";
import { Button } from "@/components/ui/button";

interface SidebarNavProps {
  onLogout: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ onLogout }) => {
  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r">
      <div className="p-4">
        <Logo />
      </div>
      
      <div className="flex-grow px-2 py-4 flex flex-col justify-between">
        <NavLinks />
        
        <div className="mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:bg-gray-100" 
            onClick={onLogout}
          >
            <span className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </span>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
