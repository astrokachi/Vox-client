// Shared types 
export type MessageRole = "user" | "assistant";

export type ChatMessageType = "SINGLE" | "MULTIPLE";

export interface Pagination {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: Pagination;
}

// auth API types 
export interface User {
  user_id: string;
  email: string;
  username: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OAuthCallbackRequest {
  code: string;
}

// campaign API types
export interface QueueTweetRepliesRequest {
  tweetUrls?: string[];
  customInstructions?: string;
  maximumTime?: string;
}

export interface QueueTweetReplies {
  queuedCount: string;
  customInstructions: string;
  maximumTime: string;
}

// conversation API types
export interface CreateConversationRequest {
  title: string;
}

export interface UpdateConversationRequest {
  title: string;
}

export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}

// chat API types
export interface ChatMessageRequest {
  content: string;
  type: ChatMessageType;
}

export interface Chats {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  messages: Message[];
}

export interface Message {
  id: string;
  conversation_id: string;
  message_group_id: string
  parent_id: string;
  role: MessageRole;
  content: string;
  type?: ChatMessageType;
  created_at: string;
}

export interface MessagesPage {
  messages: Message[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
