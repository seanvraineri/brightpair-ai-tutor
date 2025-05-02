
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
import { useMessages } from "@/contexts/MessageContext";
import { Badge } from "@/components/ui/badge";

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
      <span className="mr-3 relative">
        {icon}
        {badge && badge > 0 && (
          <Badge 
            variant="default" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white"
          >
            {badge}
          </Badge>
        )}
      </span>
      <span>{label}</span>
      {badge && badge > 0 && (
        <Badge 
          variant="default" 
          className="ml-auto bg-red-500 text-white"
        >
          {badge}
        </Badge>
      )}
    </Link>
  );
};

const DashboardNav: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // Conditionally use the messages context only if it's available
  let unreadCount = 0;
  try {
    const messagesContext = require("@/contexts/MessageContext").useMessages;
    const { getUnreadCount } = messagesContext();
    unreadCount = getUnreadCount();
  } catch (error) {
    // MessageContext might not be available on all routes
  }

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

  const navItems = [
    { 
      to: "/dashboard", 
      icon: <User size={20} />, 
      label: "Dashboard",
      active: isActive("/dashboard")
    },
    { 
      to: "/homework", 
      icon: <ListTodo size={20} />, 
      label: "Homework",
      active: isActive("/homework")
    },
    {
      to: "/scheduling",
      icon: <Calendar size={20} />,
      label: "Scheduling",
      active: isActive("/scheduling")
    },
    {
      to: "/messages",
      icon: <MessageSquare size={20} />,
      label: "Messages",
      active: isActive("/messages"),
      badge: unreadCount
    },
    { 
      to: "/tutor-chat", 
      icon: <MessageSquare size={20} />, 
      label: "AI Tutor Chat",
      active: isActive("/tutor-chat")
    },
    { 
      to: "/flashcards", 
      icon: <BookOpen size={20} />, 
      label: "Flashcards", 
      active: isActive("/flashcards")
    },
    { 
      to: "/quizzes", 
      icon: <HelpCircle size={20} />, 
      label: "Quizzes",
      active: isActive("/quizzes")
    },
    { 
      to: "/settings", 
      icon: <Settings size={20} />, 
      label: "Settings",
      active: isActive("/settings")
    }
  ];

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
            {navItems.map((item, index) => (
              <NavItem key={index} {...item} />
            ))}
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
                {navItems.map((item, index) => (
                  <NavItem 
                    key={index} 
                    {...item} 
                    onClick={closeMobileNav} 
                  />
                ))}
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
