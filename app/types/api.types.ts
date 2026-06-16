export interface User {
  user_id: string;
  email: string;
  username: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}


export type MessageRole = "user" | "assistant";

export type ChatMessageType = "SINGLE" | "MULTIPLE";

// ------------------------- REQUEST + RESPONSE ----------------------------------------

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string;
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


export interface LogoutResponse {
  status: boolean;
  message: string;
}

export interface OAuthCallbackRequest {
  code: string;
}

export interface QueueTweetRepliesRequest {
  tweetUrls?: string[];
  customInstructions?: string;
  maximumTime?: string;
}

export interface QueueTweetRepliesResponse {
  queuedCount: string;
  customInstructions: string;
  maximumTime: string;
}

export interface CreateConversationRequest {
  title: string;
}

export interface UpdateConversationRequest {
  title: string;
}

export interface ChatMessageRequest {
  content: string;
  type: ChatMessageType;
}

export interface ChatsResponse {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  messages: Message[];
}
