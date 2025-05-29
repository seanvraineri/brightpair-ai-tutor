import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomLessonCreator } from "@/components/CustomLessonCreator";
import { useCustomLesson } from "@/hooks/useCustomLesson";
import { UserDocument } from "@/services/documentService";
import {
  Book,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  Lightbulb,
  Upload,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { logger } from "@/services/logger";

export default function CustomLessonPage() {
  const { userDocuments, isLoadingDocuments } = useCustomLesson();
  const [activeTab, setActiveTab] = useState<string>("create");

  // Format the date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      logger.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  // View document handler
  const handleViewDocument = (url: string) => {
    window.open(url, "_blank");
  };

  // Get document icon based on type
  const getDocumentIcon = (contentType: string) => {
    switch (contentType) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "document":
        return <FileText className="h-10 w-10 text-blue-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Create Your Own Lessons</h1>
        <p className="text-muted-foreground">
          Generate personalized lessons from your notes, documents, or PDFs
        </p>
      </div>

      <div className="bg-brightpair-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <div className="mr-3">
            <Lightbulb className="h-6 w-6 text-brightpair" />
          </div>
          <div>
            <h3 className="font-medium mb-1">What's the difference?</h3>
            <p className="text-sm">
              <span className="font-medium">Custom Lessons</span>{" "}
              are created from{" "}
              <span className="italic">your own materials</span>, like notes or
              uploaded PDFs.
              <span className="inline-block mt-1">
                <span className="font-medium">Standard Lessons</span>{" "}
                (available in the{" "}
                <a href="/lessons" className="text-brightpair underline">
                  Lessons tab
                </a>) are system-generated from our curriculum.
              </span>
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Upload size={16} /> Create New
          </TabsTrigger>
          <TabsTrigger value="documents">
            My Materials
            {userDocuments && userDocuments.length > 0 && (
              <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                {userDocuments.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="pt-6">
          <CustomLessonCreator />
        </TabsContent>

        <TabsContent value="documents" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingDocuments
              ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )
              : userDocuments && userDocuments.length > 0
              ? (
                // Document cards
                userDocuments.map((doc: UserDocument) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="truncate text-lg">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="truncate">
                        {doc.topic}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getDocumentIcon(doc.contentType)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(doc.createdAt)}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() =>
                              handleViewDocument(doc.url)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />{" "}
                            View Document
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )
              : (
                // Empty state
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                  <Book className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    No materials uploaded yet
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your first document or type your notes to create a
                    custom lesson
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("create")}
                  >
                    Create Custom Lesson
                  </Button>
                </div>
              )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
