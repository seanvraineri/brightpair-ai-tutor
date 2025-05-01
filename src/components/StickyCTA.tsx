
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ButtonPrimary from "./ButtonPrimary";
import { Button } from "./ui/button";

const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    // Don't show in dashboard area
    const isDashboard = location.pathname.includes('/dashboard') || 
                        location.pathname.includes('/tutor-chat') || 
                        location.pathname.includes('/flashcards') || 
                        location.pathname.includes('/quizzes') || 
                        location.pathname.includes('/settings');

    if (isDashboard) {
      setIsVisible(false);
      return;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 py-4 px-4 bg-white border-t border-gray-200 shadow-md z-50 transform transition-transform duration-300">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <p className="font-display font-semibold">Ready to transform your child's learning experience?</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/signup">
            <ButtonPrimary size="lg">Free Consultation</ButtonPrimary>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline">Contact Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;
