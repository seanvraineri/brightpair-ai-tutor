
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

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
    <nav className="bg-white py-4 px-4 md:px-6 shadow-sm">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection("how-it-works")} 
            className="text-gray-700 hover:text-brightpair transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection("pricing")} 
            className="text-gray-700 hover:text-brightpair transition-colors"
          >
            Pricing
          </button>
          <Link to="/login" className="text-gray-700 hover:text-brightpair transition-colors">
            Login
          </Link>
          <Link to="/signup">
            <Button className="bg-brightpair hover:bg-brightpair-600 text-white">
              Start Free Trial
            </Button>
          </Link>
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
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md py-4 px-4 z-50">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-700 hover:text-brightpair transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-700 hover:text-brightpair transition-colors"
            >
              Pricing
            </button>
            <Link
              to="/login"
              className="text-gray-700 hover:text-brightpair transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-brightpair hover:bg-brightpair-600 text-white">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
