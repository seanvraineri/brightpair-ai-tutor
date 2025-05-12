import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, Search, HelpCircle, MessageSquare } from 'lucide-react';
import { Icons } from '@/components/ui/icons';
import { Link } from 'react-router-dom';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <Icons.logo className="h-8 w-8" />
                <div className="font-bold text-xl">
                  <span className="text-[#4D8BF9]">Bright</span>
                  <span className="text-[#2D2D2D]">Pair</span>
                </div>
              </Link>
            </div>
            
            {/* Search */}
            <div className="hidden md:flex items-center border rounded-md bg-gray-50 px-3 py-1 w-64">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search lessons, topics..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-md bg-red-500"></span>
            </Button>
            
            {/* Help */}
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>
            
            {/* Chat */}
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </Button>
            
            {/* User Profile */}
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>BP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 