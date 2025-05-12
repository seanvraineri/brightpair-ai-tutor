import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Homework, HomeworkQuestion } from '@/types/homework';
import { getHomework, updateHomeworkStatus } from '@/services/homeworkService';
import StatusPill from '@/components/homework/StatusPill';

const HomeworkViewer: React.FC = () => {
  const navigate = useNavigate();
  const { homeworkId } = useParams<{ homeworkId: string }>();
  
  // States
  const [homework, setHomework] = useState<Homework | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');
  const [pdfLoaded, setPdfLoaded] = useState(false);
  
  // Effect to load homework
  useEffect(() => {
    if (homeworkId) {
      fetchHomework(homeworkId);
    }
  }, [homeworkId]);
  
  // Fetch homework
  const fetchHomework = async (id: string) => {
    setLoading(true);
    try {
      const data = await getHomework(id);
      if (data) {
        setHomework(data);
        
        // Initialize answers from existing student_answers if available
        const initialAnswers: Record<string, string> = {};
        data.questions.forEach(question => {
          if (question.student_answer) {
            initialAnswers[question.id] = question.student_answer;
          }
        });
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error fetching homework:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle answer change
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  // Handle submit homework
  const handleSubmitHomework = async () => {
    if (!homework) return;
    
    try {
      setIsSubmitting(true);
      
      // In a real implementation, you would save the answers and update the status
      // For now, we'll just update the status
      const success = await updateHomeworkStatus(homework.id, 'submitted');
      
      if (success) {
        // Update local homework state
        setHomework({
          ...homework,
          status: 'submitted',
          questions: homework.questions.map(q => ({
            ...q,
            student_answer: answers[q.id] || null
          }))
        });
      }
    } catch (error) {
      console.error('Error submitting homework:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Check if due date has passed
  const isDueDatePassed = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    return dueDate < now;
  };
  
  // Get status message
  const getStatusMessage = () => {
    if (!homework) return '';
    
    switch (homework.status) {
      case 'assigned':
        return isDueDatePassed(homework.due)
          ? 'This homework is overdue!'
          : `Due ${formatDate(homework.due)}`;
      case 'submitted':
        return 'Submitted, waiting for feedback';
      case 'graded':
        return 'Graded';
      default:
        return '';
    }
  };
  
  // Render MCQ question
  const renderMcqQuestion = (question: HomeworkQuestion, index: number) => {
    return (
      <div className="space-y-3">
        <h3 className="font-medium">
          <span className="mr-2">{index + 1}.</span>
          {question.stem}
        </h3>
        
        <div className="pl-8 space-y-2">
          {question.choices?.map((choice, choiceIndex) => {
            const choiceLabel = String.fromCharCode(65 + choiceIndex);
            const isSelected = answers[question.id] === choiceLabel;
            const isCorrect = homework?.status === 'graded' && choiceLabel === question.answer;
            const isIncorrect = homework?.status === 'graded' && isSelected && choiceLabel !== question.answer;
            
            return (
              <div 
                key={choiceIndex}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  isSelected ? 'bg-brightpair/10' : 'hover:bg-gray-100'
                } ${isCorrect ? 'bg-green-100' : ''} ${isIncorrect ? 'bg-red-100' : ''}`}
                onClick={() => {
                  if (homework?.status !== 'graded' && homework?.status !== 'submitted') {
                    handleAnswerChange(question.id, choiceLabel);
                  }
                }}
              >
                <div className={`w-6 h-6 flex items-center justify-center border rounded-full mr-2 ${
                  isSelected ? 'border-brightpair text-brightpair font-medium' : 'text-gray-500'
                }`}>
                  {choiceLabel}
                </div>
                <p>{choice}</p>
                
                {homework?.status === 'graded' && isCorrect && (
                  <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                )}
              </div>
            );
          })}
        </div>
        
        {homework?.status === 'graded' && question.feedback && (
          <div className="pl-8 mt-2">
            <div className="p-2 bg-gray-50 rounded-md">
              <p className="text-sm font-medium">Feedback:</p>
              <p className="text-sm">{question.feedback}</p>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render short answer question
  const renderShortQuestion = (question: HomeworkQuestion, index: number) => {
    return (
      <div className="space-y-3">
        <h3 className="font-medium">
          <span className="mr-2">{index + 1}.</span>
          {question.stem}
        </h3>
        
        <div className="pl-8">
          {homework && homework.status === 'graded' ? (
            <>
              <div className="p-3 bg-gray-50 rounded-md mb-2">
                <p className="text-sm font-medium">Your answer:</p>
                <p>{question.student_answer || 'No answer provided'}</p>
              </div>
              
              {question.feedback && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Feedback:</p>
                  <p className="text-sm">{question.feedback}</p>
                </div>
              )}
            </>
          ) : (
            <Textarea
              placeholder="Type your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={homework?.status === 'submitted' || homework?.status === 'graded'}
              className="w-full"
              rows={3}
            />
          )}
        </div>
      </div>
    );
  };
  
  // Render diagram question
  const renderDiagramQuestion = (question: HomeworkQuestion, index: number) => {
    return (
      <div className="space-y-3">
        <h3 className="font-medium">
          <span className="mr-2">{index + 1}.</span>
          {question.stem}
        </h3>
        
        <div className="pl-8">
          {homework && homework.status === 'graded' ? (
            <>
              {question.student_answer ? (
                <div className="p-3 bg-gray-50 rounded-md mb-2">
                  <p className="text-sm font-medium">Your diagram:</p>
                  <p>{question.student_answer}</p>
                </div>
              ) : (
                <div className="p-3 bg-gray-100 rounded-md mb-2">
                  <p className="text-sm text-gray-500">No diagram uploaded</p>
                </div>
              )}
              
              {question.feedback && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Feedback:</p>
                  <p className="text-sm">{question.feedback}</p>
                </div>
              )}
            </>
          ) : (
            <div className="border-2 border-dashed rounded-md p-6 bg-gray-50 text-center">
              <p className="text-gray-500 mb-2">Upload your diagram</p>
              <Button variant="outline" size="sm" disabled={homework?.status === 'submitted'}>
                Upload Image
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render PDF reference question
  const renderPdfRefQuestion = (question: HomeworkQuestion, index: number) => {
    return (
      <div className="space-y-3">
        <h3 className="font-medium flex items-start">
          <span className="mr-2">{index + 1}.</span>
          <div>
            {question.stem}
            {question.source_page && (
              <div className="text-sm text-gray-500 flex items-center mt-1">
                <FileText className="h-4 w-4 mr-1" />
                Reference page: {question.source_page}
              </div>
            )}
          </div>
        </h3>
        
        <div className="pl-8">
          {homework && homework.status === 'graded' ? (
            <>
              <div className="p-3 bg-gray-50 rounded-md mb-2">
                <p className="text-sm font-medium">Your answer:</p>
                <p>{question.student_answer || 'No answer provided'}</p>
              </div>
              
              {question.feedback && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Feedback:</p>
                  <p className="text-sm">{question.feedback}</p>
                </div>
              )}
            </>
          ) : (
            <Textarea
              placeholder="Type your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={homework?.status === 'submitted' || homework?.status === 'graded'}
              className="w-full"
              rows={3}
            />
          )}
        </div>
      </div>
    );
  };
  
  // Render question
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
  
  // Calculate completion percentage
  const calculateCompletion = (): number => {
    if (!homework) return 0;
    
    const totalQuestions = homework.questions.length;
    if (totalQuestions === 0) return 0;
    
    const answeredQuestions = Object.keys(answers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <p>Loading homework...</p>
      </div>
    );
  }
  
  if (!homework) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <p>Homework not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/student/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{homework.title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <StatusPill status={homework.status} />
          
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {getStatusMessage()}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  {homework.pdf_path && (
                    <TabsTrigger value="reference">Reference Material</TabsTrigger>
                  )}
                  {homework.status === 'graded' && (
                    <TabsTrigger value="feedback">
                      Feedback
                      <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brightpair text-xs text-white">
                        {homework.questions.filter(q => q.feedback).length}
                      </span>
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="questions" className="space-y-6">
                  {homework.questions.map((question, index) => (
                    <div key={question.id} className="border-b pb-4 last:border-0">
                      {renderQuestion(question, index)}
                    </div>
                  ))}
                </TabsContent>
                
                {homework.pdf_path && (
                  <TabsContent value="reference">
                    <div className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center">
                      {pdfLoaded ? (
                        <iframe
                          src={`${homework.pdf_path}#toolbar=0`}
                          className="w-full h-full"
                          title="PDF Reference"
                        />
                      ) : (
                        <div className="text-center p-10">
                          <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">PDF Document</p>
                          <Button
                            onClick={() => setPdfLoaded(true)}
                            className="mt-4"
                            variant="outline"
                          >
                            Load PDF
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
                
                {homework.status === 'graded' && (
                  <TabsContent value="feedback">
                    <div className="space-y-4">
                      {homework.questions
                        .filter(q => q.feedback)
                        .map((question, index) => (
                          <div key={question.id} className="border rounded-md p-4">
                            <div className="flex items-start gap-3">
                              <MessageSquare className="h-5 w-5 text-brightpair mt-1" />
                              <div>
                                <p className="font-medium">Question {index + 1}</p>
                                <p className="text-sm text-gray-500 mb-2">{question.stem}</p>
                                <div className="p-3 bg-gray-50 rounded-md">
                                  <p className="text-sm">{question.feedback}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Homework Details</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-gray-500">{homework.description}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm text-gray-500">{formatDate(homework.due)}</p>
                </div>
                
                {homework.status === 'assigned' && (
                  <div>
                    <p className="text-sm font-medium">Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1.5">
                      <div
                        className="bg-brightpair h-2.5 rounded-full"
                        style={{ width: `${calculateCompletion()}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Object.keys(answers).length} of {homework.questions.length} questions answered
                    </p>
                  </div>
                )}
                
                {homework.status === 'graded' && homework.score !== undefined && (
                  <div>
                    <p className="text-sm font-medium">Score</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-brightpair">
                        {homework.score}
                      </span>
                      <span className="text-gray-500 ml-1">/ {homework.questions.length}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {homework.status === 'assigned' && (
              <Button
                className="w-full bg-brightpair hover:bg-brightpair-600 text-white"
                onClick={handleSubmitHomework}
                disabled={isSubmitting || Object.keys(answers).length === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Homework'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeworkViewer; 