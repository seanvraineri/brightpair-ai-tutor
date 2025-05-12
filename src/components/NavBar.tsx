import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonSecondary from "@/components/ButtonSecondary";
import Logo from "./Logo";

// Add the Calendly URL constant
const CALENDLY_URL = "https://calendly.com/seanvraineri/brightpair-tutoring-onboarding";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to handle smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    
    // If we're already on the home page
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="bg-white py-5 px-4 md:px-8 shadow-sm sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <button 
              onClick={() => scrollToSection("how-it-works")} 
              className="text-gray-700 hover:text-brightpair transition-colors text-sm font-medium"
            >
              How It Works
            </button>
            <Link to="/tutor-search"
              className="text-gray-700 hover:text-brightpair transition-colors text-sm font-medium"
            >
              Find Tutors
            </Link>
            <button 
              onClick={() => scrollToSection("pricing")} 
              className="text-gray-700 hover:text-brightpair transition-colors text-sm font-medium"
            >
              Pricing
            </button>
            <Link to="/login" className="text-gray-700 hover:text-brightpair transition-colors text-sm font-medium">
              Login
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signup">
              <ButtonSecondary size="sm" className="min-w-[120px] bg-blue-100 border-blue-200 text-blue-900 hover:bg-blue-200 hover:text-blue-900 font-semibold shadow-sm">
                Create Account
              </ButtonSecondary>
            </Link>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-brightpair-600 hover:from-blue-700 hover:to-brightpair-700 text-white rounded-md min-w-[120px] font-semibold shadow-md"
              >
                Free Consultation
              </Button>
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-card py-6 px-6 z-50 border-t border-gray-100">
          <div className="flex flex-col space-y-5">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-700 hover:text-brightpair transition-colors font-medium"
            >
              How It Works
            </button>
            <Link
              to="/tutor-search"
              className="text-gray-700 hover:text-brightpair transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Tutors
            </Link>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-700 hover:text-brightpair transition-colors font-medium"
            >
              Pricing
            </button>
            <Link
              to="/login"
              className="text-gray-700 hover:text-brightpair transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <ButtonSecondary className="w-full bg-blue-100 border-blue-200 text-blue-900 hover:bg-blue-200 hover:text-blue-900 font-semibold shadow-sm">
                  Create Account
                </ButtonSecondary>
              </Link>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-brightpair-600 hover:from-blue-700 hover:to-brightpair-700 text-white rounded-md font-semibold shadow-md"
                >
                  Free Consultation
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
