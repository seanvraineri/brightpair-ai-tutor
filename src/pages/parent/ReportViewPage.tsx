import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

const ReportViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Progress Report View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Viewing report with ID: {id}</p>
            <p>This is a placeholder for the report view page that parents can access.</p>
            
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-2">Progress Report Preview</p>
              <div className="w-full h-60 bg-white border rounded-md flex items-center justify-center mb-4">
                <Eye className="h-12 w-12 text-gray-300" />
              </div>
              <Button className="bg-brightpair">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportViewPage; 