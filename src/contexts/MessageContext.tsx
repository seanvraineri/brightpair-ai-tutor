import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Conversation, Message } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

// Type for Supabase message row
interface MessageRow {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
}

// Helper to build conversations from message rows
const buildConversations = (
  msgs: Message[],
  currentUserId: string,
): Conversation[] => {
  const map = new Map<string, Conversation>();

  msgs.forEach((m) => {
    const convoKey = [m.senderId, m.recipientId].sort().join("-");
    const existing = map.get(convoKey);
    const other = m.senderId === currentUserId
      ? { id: m.recipientId, name: m.recipientName, role: "student" as const }
      : { id: m.senderId, name: m.senderName, role: "teacher" as const };

    if (!existing) {
      map.set(convoKey, {
        id: convoKey,
        participants: [
          { id: currentUserId, name: "You", role: "student" as const },
          other,
        ],
        lastMessage: m,
        unreadCount: m.read ? 0 : 1,
      });
    } else if (
      new Date(m.timestamp) > new Date(existing.lastMessage.timestamp)
    ) {
      existing.lastMessage = m;
      if (!m.read) existing.unreadCount += 1;
    }
  });

  return Array.from(map.values());
};

// Define context type
interface MessageContextType {
  messages: Message[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  sendMessage: (message: Omit<Message, "id" | "timestamp" | "read">) => void;
  markMessageAsRead: (messageId: string) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  getUnreadCount: () => number;
}

// Create context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Provider component
export const MessageProvider: React.FC<{ children: ReactNode }> = (
  { children },
) => {
  const { session } = useUser();
  const currentUserId = session?.user?.id ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<
    Conversation | null
  >(null);

  // Initial load from Supabase
  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, content:content, created_at, sender_id, receiver_id")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false });

      if (error) {
        return;
      }

      const rows = (data ?? []).map((r: MessageRow) => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_id,
        senderRole: r.sender_id === currentUserId
          ? "student" as const
          : "teacher" as const,
        recipientId: r.receiver_id,
        recipientName: r.receiver_id,
        subject: "",
        content: r.content,
        timestamp: r.created_at,
        read: true,
      })) as Message[];

      setMessages(rows);
      setConversations(buildConversations(rows, currentUserId));
    })();
  }, [currentUserId]);

  const sendMessage = async (
    messageData: Omit<Message, "id" | "timestamp" | "read">,
  ) => {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        content: messageData.content,
        sender_id: messageData.senderId,
        receiver_id: messageData.recipientId,
        role: messageData.senderRole,
      })
      .select()
      .single();

    if (error) {
      return;
    }

    const newMessage: Message = {
      id: data.id,
      senderId: data.sender_id,
      senderName: messageData.senderName,
      senderRole: messageData.senderRole,
      recipientId: data.receiver_id,
      recipientName: messageData.recipientName,
      subject: "",
      content: data.content,
      timestamp: data.created_at,
      read: false,
    };

    setMessages((prev) => [newMessage, ...prev]);
    setConversations(
      buildConversations([newMessage, ...messages], currentUserId),
    );
  };

  const markMessageAsRead = (messageId: string) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex >= 0) {
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        read: true,
      };
      setMessages(updatedMessages);

      // Update unread count in the associated conversation
      const conversationIndex = conversations.findIndex(
        (conv) => conv.lastMessage.id === messageId,
      );
      if (conversationIndex >= 0) {
        const updatedConversations = [...conversations];
        updatedConversations[conversationIndex] = {
          ...updatedConversations[conversationIndex],
          unreadCount: Math.max(
            0,
            updatedConversations[conversationIndex].unreadCount - 1,
          ),
        };
        setConversations(updatedConversations);
      }
    }
  };

  const getUnreadCount = () => {
    return messages.filter((message) => !message.read).length;
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
        getUnreadCount,
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
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};
