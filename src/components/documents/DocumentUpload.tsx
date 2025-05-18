import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Subject } from "../subjects/SubjectList";

export interface Document {
  id: string;
  name: string;
  subjectId: string;
  fileName: string;
  uploadDate: string;
  size: string;
  description: string;
  tags: string[];
  uploadProgress?: number;
}

const DocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentTags, setDocumentTags] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<
    { [key: string]: number }
  >({});
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name.split(".")[0]); // Set document name to file name by default
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !documentName || !selectedSubject) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Generate a temporary ID for tracking upload progress
    const tempId = Date.now().toString();

    // Start simulated upload progress
    setUploadingFiles((prev) => ({ ...prev, [tempId]: 0 }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadingFiles((prev) => {
        const currentProgress = prev[tempId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [tempId]: Math.min(currentProgress + 10, 100) };
      });
    }, 300);

    // After "upload" is complete (in about 3 seconds), add the document
    setTimeout(() => {
      clearInterval(interval);

      const tags = documentTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const newDocument: Document = {
        id: tempId,
        name: documentName,
        subjectId: selectedSubject,
        fileName: selectedFile.name,
        uploadDate: new Date().toISOString(),
        size: formatFileSize(selectedFile.size),
        description: documentDescription,
        tags: tags,
      };

      setDocuments([...documents, newDocument]);
      resetForm();

      setUploadingFiles((prev) => {
        const newState = { ...prev };
        delete newState[tempId];
        return newState;
      });

      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded.",
      });
    }, 3000); // Mock upload time of 3 seconds
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The document has been successfully removed.",
    });
  };

  const handleDownload = (doc: Document) => {
    // In a real app, this would download the actual file
    toast({
      title: "Downloading document",
      description: `${doc.name} is being downloaded.`,
    });
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDocumentName("");
    setSelectedSubject("");
    setDocumentDescription("");
    setDocumentTags("");
    // Reset the file input
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getSubjectNameById = (id: string): string => {
    // TODO: Replace with live subject lookup if needed
    const subject = null;
    return subject ? subject.name : "Unknown";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="document-name">Document Name*</Label>
              <Input
                id="document-name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject*</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {/* Render live subjects here */}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="document-description">
                Description (Optional)
              </Label>
              <Textarea
                id="document-description"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                placeholder="Add a brief description of this document"
                className="resize-none"
              />
            </div>

            <div>
              <Label htmlFor="document-tags">Tags (Optional)</Label>
              <Input
                id="document-tags"
                value={documentTags}
                onChange={(e) => setDocumentTags(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
              <p className="mt-1 text-xs text-gray-500">
                Example: homework, math, chapter 5
              </p>
            </div>

            <div>
              <Label htmlFor="file-upload">Upload File*</Label>
              <div className="mt-1 flex items-center">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              {selectedFile && (
                <p className="mt-1 text-sm text-gray-500">
                  Selected: {selectedFile.name}{" "}
                  ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <Button onClick={handleUpload} className="w-full">
              <Upload size={18} className="mr-2" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display uploading files with progress */}
      {Object.keys(uploadingFiles).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Uploading...</h3>
          {Object.entries(uploadingFiles).map(([id, progress]) => (
            <Card key={id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <FileText className="mr-3 text-gray-400" size={24} />
                  <div className="flex-1">
                    <p className="font-medium">Uploading document...</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="mt-1 text-xs text-right">{progress}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {documents.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Uploaded Documents</h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <FileText className="mr-3 text-gray-400 mt-1" size={24} />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {getSubjectNameById(doc.subjectId)} •{" "}
                          {formatDate(doc.uploadDate)} • {doc.size}
                        </p>
                        {doc.description && (
                          <p className="text-sm mt-1">{doc.description}</p>
                        )}
                        {doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doc.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
