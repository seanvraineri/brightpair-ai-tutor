import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import TeacherNavLinks from "./nav/TeacherNavLinks";
import StudentNavLinks from "./nav/StudentNavLinks";
import ParentNavLinks from "./nav/ParentNavLinks";
import LearningResourcesLinks from "./nav/LearningResourcesLinks";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

interface DashboardNavProps {
  isMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  isCollapsed?: boolean;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ 
  isMobileOpen = false,
  onMobileOpenChange,
  isCollapsed = false
}) => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(isMobileOpen);
  
  const handleMobileNavToggle = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onMobileOpenChange) {
      onMobileOpenChange(newOpen);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  useEffect(() => {
    setOpen(isMobileOpen);
  }, [isMobileOpen]);
  
  // Generate user initials for avatar
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile top bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-10 px-4 flex items-center md:hidden">
        <Sheet open={open} onOpenChange={handleMobileNavToggle}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex items-center justify-between p-4">
              <Link to="/">
                <Logo size="sm" />
              </Link>
              <Button variant="ghost" size="icon" onClick={() => handleMobileNavToggle(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </div>
            
            <div className="flex flex-col px-4 py-2">
              <div className="flex items-center space-x-2 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role || "student"}</p>
                </div>
              </div>
              
              <Separator className="mb-2" />
              
              <div className="space-y-1">
                <Link 
                  to={user?.role === "teacher" 
                    ? "/teacher-dashboard" 
                    : user?.role === "parent" 
                      ? "/parent-dashboard" 
                      : "/dashboard"
                  }
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                >
                  Dashboard
                </Link>
              </div>
              
              <Separator className="my-2" />
              
              {/* Role-specific navigation links */}
              {user?.role === "teacher" && <TeacherNavLinks onItemClick={() => handleMobileNavToggle(false)} collapsed={isCollapsed} />}
              {user?.role === "student" && <StudentNavLinks onItemClick={() => handleMobileNavToggle(false)} collapsed={isCollapsed} />}
              {user?.role === "parent" && <ParentNavLinks onItemClick={() => handleMobileNavToggle(false)} collapsed={isCollapsed} />}
              
              <LearningResourcesLinks onItemClick={() => handleMobileNavToggle(false)} collapsed={isCollapsed} />
              
              <Separator className="my-2" />
              
              <div className="pt-2">
                <Link 
                  to="/settings" 
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
                  onClick={() => handleMobileNavToggle(false)}
                >
                  Settings
                </Link>
                <Link 
                  to="/login" 
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent text-red-500"
                  onClick={() => handleMobileNavToggle(false)}
                >
                  Log Out
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex justify-center">
          <Link to="/">
            <Logo size="sm" />
          </Link>
        </div>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.photoURL} />
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
      </nav>
      
      {/* Desktop sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-10 border-r bg-card hidden md:block transition-all duration-300 
                        ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} h-14`}>
          <Link to="/">
            {isCollapsed ? <Logo size="sm" /> : <Logo />}
          </Link>
        </div>
        
        <Separator />
        
        <div className="flex flex-col h-[calc(100%-3.5rem)] overflow-y-auto py-4">
          <div className={`flex ${isCollapsed ? 'justify-center px-0' : 'px-4'} items-center space-x-2 mb-6`}>
            <Avatar className={isCollapsed ? 'h-10 w-10' : 'h-8 w-8'}>
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            
            {!isCollapsed && (
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || "student"}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-1 px-2">
            <Link 
              to={user?.role === "teacher" 
                ? "/teacher-dashboard" 
                : user?.role === "parent" 
                  ? "/parent-dashboard" 
                  : "/dashboard"
              }
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-2'} py-2 text-sm rounded-md hover:bg-accent
                        ${location.pathname.includes('dashboard') ? 'bg-accent' : ''}`}
            >
              {isCollapsed ? (
                <User size={20} />
              ) : (
                <>Dashboard</>
              )}
            </Link>
          </div>
          
          {/* Role-specific navigation links */}
          {user?.role === "teacher" && <TeacherNavLinks collapsed={isCollapsed} />}
          {user?.role === "student" && <StudentNavLinks collapsed={isCollapsed} />}
          {user?.role === "parent" && <ParentNavLinks collapsed={isCollapsed} />}
          
          <LearningResourcesLinks collapsed={isCollapsed} />
          
          {/* Add sign out and settings buttons at the bottom */}
          <div className="mt-auto pt-4 px-2 border-t border-border mt-4">
            <Link
              to="/settings"
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-2'} py-2 text-sm rounded-md hover:bg-accent mb-1`}
            >
              {isCollapsed ? (
                <Settings size={20} />
              ) : (
                <div className="flex items-center">
                  <Settings size={20} className="mr-2" />
                  <span>Settings</span>
                </div>
              )}
            </Link>
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start px-2'} py-2 text-sm rounded-md text-red-500 hover:bg-red-50 hover:text-red-600`}
            >
              {isCollapsed ? (
                <LogOut size={20} />
              ) : (
                <div className="flex items-center">
                  <LogOut size={20} className="mr-2" />
                  <span>Sign Out</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardNav;
