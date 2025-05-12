import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StudentDetailProps {
  isParentView?: boolean;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ isParentView = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center"
          onClick={() => navigate(isParentView ? '/parent/dashboard' : '/tutor/dashboard')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Student Detail {isParentView ? '(Parent View)' : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Viewing student with ID: {id}</p>
          <p>This is a placeholder for the student detail page.</p>
          {isParentView && (
            <p className="text-blue-600">This view is customized for parents.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetail; 