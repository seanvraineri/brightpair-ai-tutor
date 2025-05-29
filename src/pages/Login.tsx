import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { OnboardingStatus, UserRole, useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import LoginForm from "@/components/auth/LoginForm";
import SocialAuth from "@/components/auth/SocialAuth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, session } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user is logged in with a profile, redirect to appropriate dashboard
    if (session && user?.role) {
      switch (user.role) {
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "parent":
          navigate("/parent-dashboard");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    }
  }, [session, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/">
            <Logo className="mx-auto" size="lg" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold font-display text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to your account
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <LoginForm />
            <SocialAuth isLoading={isLoading} setIsLoading={setIsLoading} />
          </CardContent>
          <CardFooter className="border-t pt-6">
            <p className="text-sm text-center w-full text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-brightpair hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
