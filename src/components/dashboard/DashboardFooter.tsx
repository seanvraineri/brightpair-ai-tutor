import React from 'react';
import { Link } from 'react-router-dom';

const DashboardFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-2 md:mb-0">
            © {currentYear} BrightPair AI Tutor. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-brightpair">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-brightpair">
              Privacy Policy
            </Link>
            <Link to="/support" className="text-sm text-gray-500 hover:text-brightpair">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter; 