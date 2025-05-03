
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Calendar from "@/components/scheduling/Calendar";
import UpcomingSessions from "@/components/scheduling/UpcomingSessions";

const Scheduling: React.FC = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Scheduling</h1>
        <p className="text-gray-600 mb-6">Manage your tutoring sessions</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar">
            <Calendar />
          </TabsContent>

          <TabsContent value="list">
            <UpcomingSessions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Scheduling;
