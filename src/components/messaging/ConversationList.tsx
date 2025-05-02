
import React from "react";
import { Conversation } from "@/types/messages";
import { format, isToday, isYesterday } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useMessages } from "@/contexts/MessageContext";

const ConversationList: React.FC = () => {
  const { conversations, setCurrentConversation, currentConversation } = useMessages();

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

  const getOtherParticipant = (conversation: Conversation) => {
    // Assuming current user is always student1 for this mock
    return conversation.participants.find(p => p.id !== "student1") || conversation.participants[0];
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-3 border-b">
        <h2 className="font-semibold">Conversations</h2>
      </div>
      <div className="divide-y overflow-auto max-h-[500px]">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No conversations yet</div>
        ) : (
          conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            const { lastMessage } = conversation;
            
            return (
              <div
                key={conversation.id}
                className={`flex p-3 hover:bg-gray-50 cursor-pointer ${
                  currentConversation?.id === conversation.id ? "bg-gray-50" : ""
                } ${conversation.unreadCount > 0 ? "bg-blue-50" : ""}`}
                onClick={() => setCurrentConversation(conversation)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-lg font-medium text-gray-600">
                  {otherParticipant.name.charAt(0)}
                </div>
                <div className="ml-3 flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{otherParticipant.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatMessageDate(lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {truncate(lastMessage.content, 50)}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-2 bg-blue-500 text-white self-center"
                  >
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
