
import React, { useState, useEffect } from "react";
import { useMessages } from "@/contexts/MessageContext";
import ConversationList from "./ConversationList";
import MessageDetail from "./MessageDetail";
import MessageComposer from "./MessageComposer";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Message } from "@/types/messages";

const MessageBox: React.FC = () => {
  const { currentConversation, messages, setCurrentConversation } = useMessages();
  const [isComposing, setIsComposing] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Get the other participant in the conversation (not the current user)
  const getRecipient = () => {
    if (!currentConversation) return null;
    // Mock assumption: current user is always student1
    return currentConversation.participants.find(p => p.id !== "student1");
  };

  // Get conversation messages
  const getConversationMessages = () => {
    if (!currentConversation) return [];
    return messages.filter(message => 
      currentConversation.participants.some(p => p.id === message.senderId) &&
      currentConversation.participants.some(p => p.id === message.recipientId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  // Reset selected message when conversation changes
  useEffect(() => {
    setSelectedMessage(null);
    setIsComposing(false);
    setReplyTo(null);
  }, [currentConversation]);

  const handleNewMessage = () => {
    setIsComposing(true);
    setSelectedMessage(null);
    setReplyTo(null);
    setCurrentConversation(null);
  };

  const handleReply = () => {
    setIsComposing(true);
    setReplyTo(selectedMessage);
  };

  const handleBackToConversation = () => {
    setIsComposing(false);
    setReplyTo(null);
  };

  const handleBackToList = () => {
    setCurrentConversation(null);
    setSelectedMessage(null);
  };

  const recipient = getRecipient();
  const conversationMessages = getConversationMessages();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button className="flex items-center" onClick={handleNewMessage}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Left column - conversation list */}
        <div className="md:col-span-1">
          <ConversationList />
        </div>

        {/* Right column - message detail or composer */}
        <div className="md:col-span-2">
          {isComposing ? (
            <>
              <Button
                variant="ghost"
                className="mb-4 flex items-center"
                onClick={handleBackToConversation}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <MessageComposer
                recipientId={replyTo ? replyTo.senderId : (recipient?.id || "")}
                recipientName={replyTo ? replyTo.senderName : (recipient?.name || "")}
                recipientRole={replyTo ? replyTo.senderRole : (recipient?.role || "student")}
                replyToSubject={replyTo?.subject}
                onMessageSent={handleBackToConversation}
              />
            </>
          ) : currentConversation ? (
            <>
              <Button
                variant="ghost"
                className="mb-4 flex items-center md:hidden"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Conversations
              </Button>

              {selectedMessage ? (
                <MessageDetail message={selectedMessage} onReply={handleReply} />
              ) : conversationMessages.length > 0 ? (
                <Card>
                  <CardContent className="p-0 divide-y">
                    {conversationMessages.map(message => (
                      <div
                        key={message.id}
                        className="p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {message.subject}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    No messages in this conversation yet.
                  </p>
                  <Button onClick={handleNewMessage}>Start Conversation</Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">
                Select a conversation or start a new one.
              </p>
              <Button onClick={handleNewMessage}>New Message</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
