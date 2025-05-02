
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <div className="bg-white border-b py-3 px-4 flex items-center justify-between md:hidden">
      <Logo size="sm" />
      <Button variant="ghost" size="sm" className="p-1" onClick={onMenuClick}>
        <Menu size={24} />
      </Button>
    </div>
  );
};

export default MobileHeader;
