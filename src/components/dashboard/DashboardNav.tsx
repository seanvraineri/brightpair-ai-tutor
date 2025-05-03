
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import SidebarNav from "./nav/SidebarNav";
import MobileHeader from "./nav/MobileHeader";
import MobileNav from "./nav/MobileNav";

const DashboardNav: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Prevent scrolling when mobile nav is open
  useEffect(() => {
    if (isMobile) {
      if (mobileNavOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen, isMobile]);

  const handleLogout = () => {
    // Will integrate with Supabase Auth
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Navigate to home page
  };

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader onMenuClick={toggleMobileNav} />

      {/* Sidebar for desktop */}
      <SidebarNav onLogout={handleLogout} />

      {/* Mobile Navigation Overlay */}
      <MobileNav 
        isOpen={mobileNavOpen} 
        onClose={closeMobileNav} 
        onLogout={handleLogout} 
      />
    </>
  );
};

export default DashboardNav;
