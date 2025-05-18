import { ReactNode, useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile nav when route changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Check screen size for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsNavCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <DashboardNav
        isMobileOpen={isMobileNavOpen}
        onMobileOpenChange={setIsMobileNavOpen}
        isCollapsed={isNavCollapsed}
      />

      <main
        className={`transition-all duration-300 ease-in-out pt-16 pb-28 px-2 sm:px-4 
                   ${isNavCollapsed ? "md:ml-20" : "md:ml-64"} 
                   ${
          isMobileNavOpen ? "opacity-50 md:opacity-100" : "opacity-100"
        }`}
      >
        <div className="fixed left-0 top-1/2 -translate-y-1/2 hidden md:block">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-none rounded-r-lg h-12 w-6 opacity-20 hover:opacity-100 ${
              isNavCollapsed ? "ml-20" : "ml-64"
            }`}
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          >
            {isNavCollapsed
              ? <ChevronRight size={16} />
              : <ChevronLeft size={16} />}
          </Button>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative">
          {children}
        </div>

        {/* Fixed mobile sign out button */}
        <div className="md:hidden fixed bottom-4 right-4 z-10">
          <Button
            variant="destructive"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={handleSignOut}
          >
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
