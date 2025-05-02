
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  User, 
  MessageSquare, 
  BookOpen, 
  HelpCircle, 
  Settings,
  LogOut,
  Menu,
  X,
  ListTodo,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { MessageProvider, useMessages } from "@/contexts/MessageContext";

interface NavItemProps {
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

const MessageNavItem = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState<number | undefined>(undefined);
  
  // Use a safer approach to get unread count
  React.useEffect(() => {
    try {
      // Import and use the context inside the effect to avoid rendering issues
      import("@/contexts/MessageContext").then(({ useMessages }) => {
        const { getUnreadCount } = useMessages();
        const count = getUnreadCount();
        setUnreadCount(count > 0 ? count : undefined);
      }).catch(() => {
        // If context is not available or fails, default to undefined
        setUnreadCount(undefined);
      });
    } catch (error) {
      setUnreadCount(undefined);
    }
  }, [location.pathname]);

  return (
    <NavItem
      to="/messages"
      icon={<MessageSquare size={20} />}
      label="Messages"
      active={location.pathname === "/messages"}
      badge={unreadCount}
    />
  );
};

const DashboardNav: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    // Will integrate with Supabase Auth
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Navigate to home page
  };

  const isActive = (path: string) => {
    return location.pathname === path;
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
      <div className="bg-white border-b py-3 px-4 flex items-center justify-between md:hidden">
        <Logo size="sm" />
        <Button variant="ghost" size="sm" className="p-1" onClick={toggleMobileNav}>
          {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r">
        <div className="p-4">
          <Logo />
        </div>
        
        <div className="flex-grow px-2 py-4 flex flex-col justify-between">
          <nav className="flex-1 space-y-2">
            <NavItem 
              to="/dashboard" 
              icon={<User size={20} />} 
              label="Dashboard"
              active={isActive("/dashboard")}
              onClick={closeMobileNav}
            />
            <NavItem 
              to="/homework" 
              icon={<ListTodo size={20} />} 
              label="Homework"
              active={isActive("/homework")}
              onClick={closeMobileNav}
            />
            <NavItem
              to="/scheduling"
              icon={<Calendar size={20} />}
              label="Scheduling"
              active={isActive("/scheduling")}
              onClick={closeMobileNav}
            />
            
            {/* Use MessageNavItem instead of directly using NavItem for messages */}
            <MessageNavItem />
            
            <NavItem 
              to="/tutor-chat" 
              icon={<MessageSquare size={20} />} 
              label="AI Tutor Chat"
              active={isActive("/tutor-chat")}
              onClick={closeMobileNav}
            />
            <NavItem 
              to="/flashcards" 
              icon={<BookOpen size={20} />} 
              label="Flashcards" 
              active={isActive("/flashcards")}
              onClick={closeMobileNav}
            />
            <NavItem 
              to="/quizzes" 
              icon={<HelpCircle size={20} />} 
              label="Quizzes"
              active={isActive("/quizzes")}
              onClick={closeMobileNav}
            />
            <NavItem 
              to="/settings" 
              icon={<Settings size={20} />} 
              label="Settings"
              active={isActive("/settings")}
              onClick={closeMobileNav}
            />
          </nav>
          
          <div className="mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-700 hover:bg-gray-100" 
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex flex-col h-full">
            <div className="bg-white border-b py-3 px-4 flex items-center justify-between">
              <Logo size="sm" />
              <Button variant="ghost" size="sm" className="p-1" onClick={toggleMobileNav}>
                <X size={24} />
              </Button>
            </div>
            
            <div className="flex-grow p-4">
              <nav className="space-y-2">
                <NavItem 
                  to="/dashboard" 
                  icon={<User size={20} />} 
                  label="Dashboard"
                  active={isActive("/dashboard")}
                  onClick={closeMobileNav}
                />
                <NavItem 
                  to="/homework" 
                  icon={<ListTodo size={20} />} 
                  label="Homework"
                  active={isActive("/homework")}
                  onClick={closeMobileNav}
                />
                <NavItem
                  to="/scheduling"
                  icon={<Calendar size={20} />}
                  label="Scheduling"
                  active={isActive("/scheduling")}
                  onClick={closeMobileNav}
                />
                
                {/* Use MessageNavItem in mobile menu as well */}
                <MessageNavItem />
                
                <NavItem 
                  to="/tutor-chat" 
                  icon={<MessageSquare size={20} />} 
                  label="AI Tutor Chat"
                  active={isActive("/tutor-chat")}
                  onClick={closeMobileNav}
                />
                <NavItem 
                  to="/flashcards" 
                  icon={<BookOpen size={20} />} 
                  label="Flashcards" 
                  active={isActive("/flashcards")}
                  onClick={closeMobileNav}
                />
                <NavItem 
                  to="/quizzes" 
                  icon={<HelpCircle size={20} />} 
                  label="Quizzes"
                  active={isActive("/quizzes")}
                  onClick={closeMobileNav}
                />
                <NavItem 
                  to="/settings" 
                  icon={<Settings size={20} />} 
                  label="Settings"
                  active={isActive("/settings")}
                  onClick={closeMobileNav}
                />
              </nav>
            </div>
            
            <div className="p-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:bg-gray-100" 
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-3" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNav;
