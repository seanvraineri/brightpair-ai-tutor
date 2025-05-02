
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import NavLinks from "./NavLinks";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      <div className="flex flex-col h-full">
        <div className="bg-white border-b py-3 px-4 flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="sm" className="p-1" onClick={onClose}>
            <X size={24} />
          </Button>
        </div>
        
        <div className="flex-grow p-4">
          <NavLinks onItemClick={onClose} />
        </div>
        
        <div className="p-4 border-t">
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

export default MobileNav;
