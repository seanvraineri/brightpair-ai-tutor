import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Homework, HomeworkQuestion } from '@/types/homework';
import { X, Edit2, AlertCircle, FileText } from 'lucide-react';
import { logger } from '@/services/logger';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  homework: Homework;
  onSave: (homework: Homework) => Promise<void>;
  onAssign: (homework: Homework) => Promise<void>;
}

const QuestionTypeLabel: Record<string, string> = {
  'mcq': 'Multiple Choice',
  'short': 'Short Answer',
  'diagram': 'Diagram',
  'pdf_ref': 'PDF Reference'
};

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  homework,
  onSave,
  onAssign,
}) => {
  const [editedHomework, setEditedHomework] = useState<Homework>(homework);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedHomework({
      ...editedHomework,
      title: e.target.value,
    });
  };
  
  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedHomework({
      ...editedHomework,
      description: e.target.value,
    });
  };
  
  // Handle question stem change
  const handleQuestionStemChange = (id: string, value: string) => {
    setEditedHomework({
      ...editedHomework,
      questions: editedHomework.questions.map(q => 
        q.id === id ? { ...q, stem: value } : q
      ),
    });
  };
  
  // Handle question removal
  const handleRemoveQuestion = (id: string) => {
    setEditedHomework({
      ...editedHomework,
      questions: editedHomework.questions.filter(q => q.id !== id),
    });
  };
  
  // Handle save as draft
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editedHomework);
      onClose();
    } catch (error) {
      logger.debug('Caught error:', error);
      
    
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle assign to student
  const handleAssign = async () => {
    try {
      setIsAssigning(true);
      await onAssign({
        ...editedHomework,
        status: 'assigned',
      });
      onClose();
    } catch (error) {
      logger.debug('Caught error:', error);
      
    
    } finally {
      setIsAssigning(false);
    }
  };
  
  // Render MCQ question
  const renderMcqQuestion = (question: HomeworkQuestion, index: number) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <Textarea
                value={question.stem}
                onChange={(e) => handleQuestionStemChange(question.id, e.target.value)}
                className="text-sm"
              />
            ) : (
              <p className="text-sm font-medium">{question.stem}</p>
            )}
          </div>
          
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveQuestion(question.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="pl-4 space-y-1">
          {question.choices?.map((choice, choiceIndex) => (
            <div key={choiceIndex} className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center border rounded-full mr-2 text-xs font-medium">
                {String.fromCharCode(65 + choiceIndex)}
              </div>
              <p className="text-sm">{choice}</p>
              {question.answer && question.answer === String.fromCharCode(65 + choiceIndex) && (
                <div className="ml-2 text-green-600 text-sm font-medium">✓ Correct</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render short answer question
  const renderShortQuestion = (question: HomeworkQuestion, index: number) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <Textarea
                value={question.stem}
                onChange={(e) => handleQuestionStemChange(question.id, e.target.value)}
                className="text-sm"
              />
            ) : (
              <p className="text-sm font-medium">{question.stem}</p>
            )}
          </div>
          
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveQuestion(question.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="pl-4">
          <div className="flex items-center">
            <p className="text-sm text-gray-500">Expected answer: <span className="font-medium">{question.answer}</span></p>
          </div>
        </div>
      </div>
    );
  };
  
  // Render diagram question
  const renderDiagramQuestion = (question: HomeworkQuestion, index: number) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <Textarea
                value={question.stem}
                onChange={(e) => handleQuestionStemChange(question.id, e.target.value)}
                className="text-sm"
              />
            ) : (
              <p className="text-sm font-medium">{question.stem}</p>
            )}
          </div>
          
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveQuestion(question.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="pl-4">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            <p className="text-sm text-gray-500">Students will draw and upload their diagram</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Render PDF reference question
  const renderPdfRefQuestion = (question: HomeworkQuestion, index: number) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <Textarea
                value={question.stem}
                onChange={(e) => handleQuestionStemChange(question.id, e.target.value)}
                className="text-sm"
              />
            ) : (
              <p className="text-sm font-medium">{question.stem}</p>
            )}
          </div>
          
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveQuestion(question.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="pl-4">
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-blue-500 mr-2" />
            <p className="text-sm text-gray-500">
              Reference to page {question.source_page} of the uploaded PDF
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // Render question based on type
  const renderQuestion = (question: HomeworkQuestion, index: number) => {
    switch (question.type) {
      case 'mcq':
        return renderMcqQuestion(question, index);
      case 'short':
        return renderShortQuestion(question, index);
      case 'diagram':
        return renderDiagramQuestion(question, index);
      case 'pdf_ref':
        return renderPdfRefQuestion(question, index);
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isEditing ? (
              <Input value={editedHomework.title} onChange={handleTitleChange} className="mr-2" />
            ) : (
              editedHomework.title
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? (
              <Textarea value={editedHomework.description} onChange={handleDescriptionChange} className="mt-2" />
            ) : (
              editedHomework.description
            )}
          </DialogDescription>
        </DialogHeader>
        
        {/* If AI returned markdown content, show preview */}
        {editedHomework.content_md && !isEditing && (
          <div className="prose prose-sm max-w-none mb-6">
            <ReactMarkdown>{editedHomework.content_md}</ReactMarkdown>
          </div>
        )}
        
        <div className="space-y-6 py-4">
          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={editedHomework.title}
                  onChange={handleTitleChange}
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-medium mt-1">{editedHomework.title}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={editedHomework.description}
                  onChange={handleDescriptionChange}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-700 mt-1">{editedHomework.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Due Date</Label>
                <p className="text-sm text-gray-700 mt-1">{new Date(editedHomework.due).toLocaleDateString()}</p>
              </div>
              
              <div>
                <Label>Student</Label>
                <p className="text-sm text-gray-700 mt-1">
                  {/* We'd typically fetch student name here */}
                  Student #{editedHomework.student_id}
                </p>
              </div>
            </div>
          </div>
          
          {/* Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Questions</h3>
            
            <div className="space-y-6">
              {editedHomework.questions.map((question, index) => (
                <div key={question.id} className="border rounded-md p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-brightpair text-white rounded-full text-sm font-medium mr-2">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-500">
                        {QuestionTypeLabel[question.type] || question.type}
                      </span>
                    </div>
                  </div>
                  
                  {renderQuestion(question, index)}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </Button>
            
            <Button
              onClick={handleAssign}
              disabled={isAssigning}
              className="flex-1 bg-brightpair hover:bg-brightpair-600 text-white"
            >
              {isAssigning ? 'Assigning...' : 'Assign to Student'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal; 