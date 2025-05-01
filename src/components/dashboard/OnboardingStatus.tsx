
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { OnboardingStatus as OnboardingStatusType } from "@/contexts/UserContext";

interface OnboardingStatusProps {
  status: OnboardingStatusType;
  nextConsultationDate?: string;
}

const OnboardingStatus: React.FC<OnboardingStatusProps> = ({ 
  status, 
  nextConsultationDate 
}) => {
  let progressValue = 0;
  switch(status) {
    case "pending":
      progressValue = 25;
      break;
    case "consultation-scheduled":
      progressValue = 40;
      break;
    case "consultation-complete":
      progressValue = 60;
      break;
    case "onboarding-complete":
      progressValue = 80;
      break;
    case "active":
      progressValue = 100;
      break;
    default:
      progressValue = 25;
  }

  return (
    <Card className="border-brightpair-100 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Onboarding Progress</CardTitle>
        <CardDescription>
          Complete your setup to get the most from BrightPair
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progressValue} className="h-2" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="text-brightpair mt-0.5">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="font-medium text-sm">Account Creation</p>
              <p className="text-sm text-gray-500">Your account has been created successfully</p>
            </div>
          </div>
          
          {status === "pending" ? (
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-700">Initial Consultation</p>
                <p className="text-sm text-gray-500">Schedule your consultation with a tutor</p>
                <Link to="/consultation">
                  <Button size="sm" variant="outline" className="mt-2">
                    Schedule Now
                  </Button>
                </Link>
              </div>
            </div>
          ) : status === "consultation-scheduled" ? (
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-700">Initial Consultation</p>
                <p className="text-sm text-gray-500">
                  {nextConsultationDate ? 
                    `Your consultation is scheduled for ${nextConsultationDate}` : 
                    "Your consultation is scheduled"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="text-brightpair mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-medium text-sm">Initial Consultation</p>
                <p className="text-sm text-gray-500">You've completed your consultation with a tutor</p>
              </div>
            </div>
          )}
          
          {(status === "pending" || status === "consultation-scheduled") ? (
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-700">Student Profiling</p>
                <p className="text-sm text-gray-500">Complete student information for personalization</p>
              </div>
            </div>
          ) : status === "consultation-complete" ? (
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-700">Student Profiling</p>
                <p className="text-sm text-gray-500">Complete student information for personalization</p>
                <Link to="/onboarding">
                  <Button size="sm" variant="outline" className="mt-2">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="text-brightpair mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-medium text-sm">Student Profiling</p>
                <p className="text-sm text-gray-500">Student profile has been created successfully</p>
              </div>
            </div>
          )}
          
          {status === "active" ? (
            <div className="flex items-start gap-3">
              <div className="text-brightpair mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-medium text-sm">Account Activated</p>
                <p className="text-sm text-gray-500">Your account is fully set up and ready to use</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-700">Account Activation</p>
                <p className="text-sm text-gray-500">Your account will be activated after all steps are complete</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingStatus;
