
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message, Conversation } from '@/types/messages';

// Mock data for initial state
const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "teacher1",
    senderName: "Ms. Johnson",
    senderRole: "teacher",
    recipientId: "student1",
    recipientName: "Emma",
    subject: "Homework Review",
    content: "Hi Emma, I've reviewed your latest math assignment and was impressed by your work on quadratic equations. Let's discuss some advanced topics in our next session.",
    timestamp: "2025-04-30T10:15:00Z",
    read: true
  },
  {
    id: "2",
    senderId: "teacher1",
    senderName: "Ms. Johnson",
    senderRole: "teacher",
    recipientId: "student1",
    recipientName: "Emma",
    subject: "Next Week's Schedule",
    content: "Just confirming our session times for next week. We'll meet Monday at 4pm and Wednesday at 3:30pm to prepare for your upcoming test.",
    timestamp: "2025-05-01T14:22:00Z",
    read: false
  },
  {
    id: "3",
    senderId: "parent2",
    senderName: "Mr. Williams",
    senderRole: "parent",
    recipientId: "student1",
    recipientName: "Emma",
    subject: "Permission Slip",
    content: "I've signed your permission slip for the science museum field trip. It's in your folder.",
    timestamp: "2025-05-01T18:05:00Z",
    read: false
  }
];

const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: [
      { id: "student1", name: "Emma", role: "student" },
      { id: "teacher1", name: "Ms. Johnson", role: "teacher" }
    ],
    lastMessage: mockMessages[1],
    unreadCount: 1
  },
  {
    id: "conv2",
    participants: [
      { id: "student1", name: "Emma", role: "student" },
      { id: "parent2", name: "Mr. Williams", role: "parent" }
    ],
    lastMessage: mockMessages[2],
    unreadCount: 1
  }
];

// Define context type
interface MessageContextType {
  messages: Message[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  markMessageAsRead: (messageId: string) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  getUnreadCount: () => number;
}

// Create context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Provider component
export const MessageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Update or create conversation
    const existingConversationIndex = conversations.findIndex(
      conv => conv.participants.some(p => p.id === messageData.senderId) && 
        conv.participants.some(p => p.id === messageData.recipientId)
    );

    if (existingConversationIndex >= 0) {
      // Update existing conversation
      const updatedConversations = [...conversations];
      updatedConversations[existingConversationIndex] = {
        ...updatedConversations[existingConversationIndex],
        lastMessage: newMessage,
        unreadCount: updatedConversations[existingConversationIndex].unreadCount + 1
      };
      setConversations(updatedConversations);
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participants: [
          { id: messageData.senderId, name: messageData.senderName, role: messageData.senderRole },
          { id: messageData.recipientId, name: messageData.recipientName, role: 'student' }
        ],
        lastMessage: newMessage,
        unreadCount: 1
      };
      setConversations([...conversations, newConversation]);
    }
  };

  const markMessageAsRead = (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex >= 0) {
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], read: true };
      setMessages(updatedMessages);

      // Update unread count in the associated conversation
      const conversationIndex = conversations.findIndex(
        conv => conv.lastMessage.id === messageId
      );
      if (conversationIndex >= 0) {
        const updatedConversations = [...conversations];
        updatedConversations[conversationIndex] = {
          ...updatedConversations[conversationIndex],
          unreadCount: Math.max(0, updatedConversations[conversationIndex].unreadCount - 1)
        };
        setConversations(updatedConversations);
      }
    }
  };

  const getUnreadCount = () => {
    return messages.filter(message => !message.read).length;
  };

  return (
    <MessageContext.Provider 
      value={{
        messages,
        conversations,
        currentConversation,
        sendMessage,
        markMessageAsRead,
        setCurrentConversation,
        getUnreadCount
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

// Custom hook for using the context
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
