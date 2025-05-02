
import React from "react";
import { Message } from "@/types/messages";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/contexts/MessageContext";

interface MessageDetailProps {
  message: Message;
  onReply?: () => void;
}

const MessageDetail: React.FC<MessageDetailProps> = ({ message, onReply }) => {
  const { markMessageAsRead } = useMessages();

  React.useEffect(() => {
    if (!message.read) {
      markMessageAsRead(message.id);
    }
  }, [message.id, message.read, markMessageAsRead]);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">{message.subject}</h2>
        <Button variant="outline" size="sm" onClick={onReply}>
          Reply
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>
          From: <span className="font-medium">{message.senderName}</span>{" "}
          <Badge variant="outline" className="ml-1">
            {message.senderRole}
          </Badge>
        </div>
        <div>
          {format(new Date(message.timestamp), "MMM d, yyyy 'at' h:mm a")}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {message.attachments && message.attachments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Attachments</h3>
          <div className="space-y-2">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <div className="flex items-center">
                  <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{attachment.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                  onClick={() => window.open(attachment.url, "_blank")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDetail;
