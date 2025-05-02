
import React from "react";
import { Message } from "@/types/messages";
import { format, isToday, isYesterday } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Paperclip } from "lucide-react";

interface MessageItemProps {
  message: Message;
  isSelected?: boolean;
  onClick?: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isSelected, onClick }) => {
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  const truncate = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div
      className={`flex flex-col p-3 border-b hover:bg-gray-50 cursor-pointer ${
        isSelected ? "bg-gray-50" : ""
      } ${!message.read ? "bg-blue-50" : ""}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-semibold">{message.senderName}</h3>
        <span className="text-xs text-gray-500">
          {formatMessageDate(message.timestamp)}
        </span>
      </div>
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-medium">{truncate(message.subject, 40)}</p>
        {!message.read && (
          <Badge variant="default" className="bg-blue-500 text-white">
            New
          </Badge>
        )}
      </div>
      <p className="text-xs text-gray-600 line-clamp-1">
        {truncate(message.content, 60)}
      </p>
      {message.attachments && message.attachments.length > 0 && (
        <div className="flex items-center mt-1 text-gray-500">
          <Paperclip className="h-3 w-3 mr-1" />
          <span className="text-xs">{message.attachments.length} file(s)</span>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
