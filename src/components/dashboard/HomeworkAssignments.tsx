
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen } from "lucide-react";

interface HomeworkItem {
  subject: string;
  title: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

const HomeworkAssignments: React.FC = () => {
  const { toast } = useToast();
  
  const homeworkItems: HomeworkItem[] = [
    {
      subject: "Mathematics",
      title: "Quadratic Equations Set",
      dueDate: "2025-05-07",
      status: "not-started"
    },
    {
      subject: "English Literature",
      title: "Macbeth Analysis Essay",
      dueDate: "2025-05-10",
      status: "in-progress"
    },
    {
      subject: "Biology",
      title: "Cell Division Worksheet",
      dueDate: "2025-05-05",
      status: "completed"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: HomeworkItem['status']) => {
    switch(status) {
      case 'not-started':
        return <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700">Not Started</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs rounded-md bg-yellow-100 text-yellow-700">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700">Completed</span>;
    }
  };

  const handleViewHomework = (title: string) => {
    toast({
      title: "Opening homework",
      description: `Opening ${title} for viewing.`,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-semibold">Homework Assignments</CardTitle>
          <CardDescription>Assignments from your tutors</CardDescription>
        </div>
        <BookOpen className="h-5 w-5 text-brightpair" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeworkItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.subject}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{formatDate(item.dueDate)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleViewHomework(item.title)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-brightpair hover:text-brightpair-600"
        >
          View All Assignments
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HomeworkAssignments;
