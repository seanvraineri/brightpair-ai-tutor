
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import LandingPage from "./LandingPage";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for Calendly redirect with consultation booked status
    const params = new URLSearchParams(location.search);
    const consultationBooked = params.get('consultation_booked');
    
    if (consultationBooked === 'true') {
      // Redirect to signup with consultation booked parameter
      navigate('/signup?consultation_booked=true', { replace: true });
    }
  }, [location, navigate]);
  
  return <LandingPage />;
};

export default Index;
