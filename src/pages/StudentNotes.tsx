import React from "react";
import StudentNotesComponent from "@/components/tutor/StudentNotes";

const StudentNotes: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <StudentNotesComponent />
      </div>
    </div>
  );
};

export default StudentNotes; 