import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar,
  FileText, 
  Settings, 
  LogOut,
  MessageCircle,
  BookOpen,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TutorNavigationProps {
  activeItem?: string;
  collapsed?: boolean;
}

const TutorNavigation: React.FC<TutorNavigationProps> = ({ 
  activeItem = 'dashboard',
  collapsed = false
}) => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Generate initials for the tutor name
  const getInitials = (name: string = 'Tutor'): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const navItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/tutor/dashboard',
      active: activeItem === 'dashboard'
    },
    {
      name: 'Students',
      icon: <Users className="h-5 w-5" />,
      path: '/tutor/students',
      active: activeItem === 'students'
    },
    {
      name: 'Schedule',
      icon: <Calendar className="h-5 w-5" />,
      path: '/tutor/schedule',
      active: activeItem === 'schedule'
    },
    {
      name: 'Reports',
      icon: <FileText className="h-5 w-5" />,
      path: '/tutor/reports',
      active: activeItem === 'reports'
    },
    {
      name: 'Parent Comm',
      icon: <MessageCircle className="h-5 w-5" />,
      path: '/tutor/dashboard?tab=parents',
      active: activeItem === 'parents'
    },
    {
      name: 'Resources',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/tutor/resources',
      active: activeItem === 'resources'
    }
  ];
  
  return (
    <div className="flex flex-col h-full">
      <div className={`flex ${collapsed ? 'justify-center' : 'px-4'} items-center space-x-2 mb-6 pt-6`}>
        {!collapsed && <h2 className="text-xl font-semibold">Tutor Portal</h2>}
        {collapsed && (
          <Avatar className="h-10 w-10 bg-brightpair text-white">
            <AvatarFallback>{getInitials("Tutor")}</AvatarFallback>
          </Avatar>
        )}
      </div>
      
      <Separator className="mb-4" />
      
      <div className={`pt-2 pb-1 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed && (
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-gray-500">TUTOR TOOLS</p>
          </div>
        )}
        
        <div className="flex-grow space-y-1 px-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              asChild
              className={cn(
                `w-full ${collapsed ? 'justify-center py-2' : 'justify-start px-2 py-2'} text-sm rounded-md transition-colors`,
                item.active 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Link to={item.path}>
                {collapsed ? (
                  item.icon
                ) : (
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </div>
                )}
              </Link>
            </Button>
          ))}
          
          <Button
            variant="ghost"
            asChild
            className={cn(
              `w-full ${collapsed ? 'justify-center py-2' : 'justify-start px-2 py-2'} text-sm rounded-md transition-colors`,
              "mt-2 hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Link to="/tutor/students/onboard">
              {collapsed ? (
                <UserPlus className="h-5 w-5" />
              ) : (
                <div className="flex items-center">
                  <UserPlus className="h-5 w-5" />
                  <span className="ml-3">Onboard Student</span>
                </div>
              )}
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex-grow"></div>
      
      <div className="px-2 mt-6 mb-4">
        <Button
          variant="ghost"
          asChild
          className={cn(
            `w-full ${collapsed ? 'justify-center py-2' : 'justify-start px-2 py-2'} text-sm rounded-md transition-colors`,
            "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Link to="/settings">
            {collapsed ? (
              <Settings className="h-5 w-5" />
            ) : (
              <div className="flex items-center">
                <Settings className="h-5 w-5" />
                <span className="ml-3">Settings</span>
              </div>
            )}
          </Link>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            `w-full ${collapsed ? 'justify-center py-2' : 'justify-start px-2 py-2'} text-sm rounded-md transition-colors mt-1`,
            "text-red-500 hover:bg-red-50 hover:text-red-600"
          )}
          onClick={handleSignOut}
        >
          {collapsed ? (
            <LogOut className="h-5 w-5" />
          ) : (
            <div className="flex items-center">
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Sign Out</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TutorNavigation; 