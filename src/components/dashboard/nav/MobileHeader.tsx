
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <div className="bg-white border-b py-3 px-4 flex items-center justify-between md:hidden sticky top-0 z-40 shadow-sm">
      <Logo size="sm" />
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 transition-transform duration-200 hover:scale-110" 
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </Button>
    </div>
  );
};

export default MobileHeader;
