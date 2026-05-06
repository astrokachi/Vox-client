export interface Message {
  id: string;
  conversation_id: string;
  role: 'User' | 'Assistant';
  content: string;
  created_at: string;
}

export interface MessagesResponse {
  status: boolean;
  message: string;
  data: {
    messages: Message[];
    nextCursor?: string;
  };
}

export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface ConversationsResponse {
  status: boolean;
  message: string;
  data: Conversation;
}
