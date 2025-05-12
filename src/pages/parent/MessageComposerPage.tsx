import React from 'react';
import { useParams } from 'react-router-dom';
import MessageComposer from '@/components/tutor/MessageComposer';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface MessageComposerPageProps {
  isParentView?: boolean;
}

const MessageComposerPage: React.FC<MessageComposerPageProps> = ({ isParentView = false }) => {
  const params = useParams();
  
  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compose Message {isParentView ? '(Parent View)' : ''}</CardTitle>
        </CardHeader>
      </Card>
      
      <MessageComposer 
        parentId={isParentView ? undefined : params.parentId}
        studentId={params.studentId}
        initialSubject=""
        initialMessage=""
      />
    </div>
  );
};

export default MessageComposerPage; 