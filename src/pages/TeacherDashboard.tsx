
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Users, BookOpen, Calendar, ClipboardList } from "lucide-react";

const TeacherDashboard: React.FC = () => {
  const { toast } = useToast();

  const students = [
    { id: 1, name: "Emma Thompson", grade: "10th", subjects: ["Mathematics", "Physics"], nextSession: "May 5, 2:30 PM" },
    { id: 2, name: "James Wilson", grade: "8th", subjects: ["English", "History"], nextSession: "May 6, 4:00 PM" },
    { id: 3, name: "Sophia Martinez", grade: "12th", subjects: ["Chemistry", "Biology"], nextSession: "May 4, 1:00 PM" },
    { id: 4, name: "Lucas Johnson", grade: "9th", subjects: ["Algebra", "Spanish"], nextSession: "May 7, 3:15 PM" },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">Manage your students and create personalized learning plans</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            value="12" 
            icon={<Users className="h-8 w-8 text-brightpair-600" />} 
            trend="+2 this month"
          />
          <StatCard 
            title="Sessions Completed" 
            value="48" 
            icon={<Calendar className="h-8 w-8 text-brightpair-600" />} 
            trend="8 this week"
          />
          <StatCard 
            title="Learning Plans" 
            value="8" 
            icon={<ClipboardList className="h-8 w-8 text-brightpair-600" />} 
            trend="2 need review"
          />
          <StatCard 
            title="Subjects Taught" 
            value="5" 
            icon={<BookOpen className="h-8 w-8 text-brightpair-600" />} 
            trend="Math, Science, English"
          />
        </div>

        {/* Student Management Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">NAME</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">GRADE</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">SUBJECTS</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">NEXT SESSION</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="px-4 py-4">{student.name}</td>
                      <td className="px-4 py-4">{student.grade}</td>
                      <td className="px-4 py-4">{student.subjects.join(", ")}</td>
                      <td className="px-4 py-4">{student.nextSession}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button 
                            className="text-sm text-brightpair hover:text-brightpair-600"
                            onClick={() => toast({ title: "View Profile", description: `Viewing ${student.name}'s profile` })}
                          >
                            View
                          </button>
                          <button 
                            className="text-sm text-brightpair hover:text-brightpair-600"
                            onClick={() => toast({ title: "Edit Plan", description: `Editing learning plan for ${student.name}` })}
                          >
                            Edit Plan
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Teaching Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-gray-500">{student.subjects[0]} tutoring session</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{student.nextSession}</p>
                    <button 
                      className="text-sm text-brightpair hover:text-brightpair-600"
                      onClick={() => toast({ title: "Session Preparation", description: `Preparing for ${student.name}'s session` })}
                    >
                      Prepare
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          <div className="p-2 bg-brightpair-50 rounded-full">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherDashboard;
