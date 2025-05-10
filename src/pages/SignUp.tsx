
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from "@/components/auth/SignUpForm";
import SocialAuth from "@/components/auth/SocialAuth";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [consultationBooked, setConsultationBooked] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to dashboard
        navigate("/dashboard");
      }
    };
    
    // Check if user came from Calendly (consultation already booked)
    const params = new URLSearchParams(location.search);
    const consultationParam = params.get('consultation_booked');
    if (consultationParam === 'true') {
      setConsultationBooked(true);
    }
    
    checkSession();
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/">
            <Logo className="mx-auto" size="lg" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold font-display text-gray-900">
            Create your account
          </h2>
          {consultationBooked ? (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">
                Great! Your consultation has been booked.
              </p>
              <p className="text-sm text-brightpair font-medium">
                Complete your account setup below
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Schedule a free consultation. No credit card required.
            </p>
          )}
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <SignUpForm initialConsultationBooked={consultationBooked} />
            <SocialAuth isLoading={isLoading} setIsLoading={setIsLoading} />
          </CardContent>
          <CardFooter className="border-t pt-6">
            <p className="text-sm text-center w-full text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-brightpair hover:underline font-medium">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
