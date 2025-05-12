import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { useUser } from "@/contexts/UserContext";
import NearbyTutors from "@/components/dashboard/NearbyTutors";
import ChildProgress from "@/components/parent/ChildProgress";
import BillingManagement from "@/components/parent/BillingManagement";

const ParentDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Parent Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || "Parent"}</h1>
          <p className="text-gray-600">Monitor your child's academic progress and manage tutoring services.</p>
        </div>

        {/* Dashboard Tabs */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Child Progress</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Quick Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-md text-center">
                          <p className="text-3xl font-bold text-blue-700">8</p>
                          <p className="text-sm text-blue-700">Sessions this month</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-md text-center">
                          <p className="text-3xl font-bold text-green-700">+12%</p>
                          <p className="text-sm text-green-700">Progress improvement</p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-md text-center">
                          <p className="text-3xl font-bold text-purple-700">6</p>
                          <p className="text-sm text-purple-700">Completed assignments</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-center sm:text-right">
                        <Button onClick={() => setActiveTab("progress")}>
                          View Detailed Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <h4 className="font-medium">Mathematics Tutoring with Dr. Reynolds</h4>
                            <p className="text-sm text-gray-500">Saturday, June 17, 2023 • 10:00 AM - 11:00 AM</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button variant="outline" size="sm">Add to Calendar</Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-md flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <h4 className="font-medium">Science Review with Ms. Thompson</h4>
                            <p className="text-sm text-gray-500">Tuesday, June 20, 2023 • 4:00 PM - 5:00 PM</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button variant="outline" size="sm">Add to Calendar</Button>
                          </div>
                        </div>
                        
                        <div className="text-center mt-4">
                          <Link to="/scheduling">
                            <Button variant="outline">View All Sessions</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Current Plan:</span>
                          <span>Standard Package</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Next Payment:</span>
                          <span>July 1, 2023</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Amount:</span>
                          <span className="text-lg font-bold">$150.00</span>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <Button className="w-full" onClick={() => setActiveTab("billing")}>
                            Manage Billing
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Tutors Near You</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <NearbyTutors />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="progress">
              <ChildProgress />
            </TabsContent>
            
            <TabsContent value="billing">
              <BillingManagement />
            </TabsContent>
            
            <TabsContent value="documents">
              <DocumentUpload />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
