
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'parent';
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'parent';
  }[];
  lastMessage: Message;
  unreadCount: number;
}
