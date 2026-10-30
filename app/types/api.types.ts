// Shared types 
export type MessageRole = "user" | "assistant";

export type ChatMessageType = "SINGLE" | "MULTIPLE";

export interface Pagination {
  nextCursor: string | null;
  hasNextPage: boolean;
}

// One page of a cursor-paginated list; `nextCursor` is null on the last page.
export interface Page<T> {
  items: T[];
  nextCursor: string | null;
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
  profile_img_url: string;
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

// The user's free-tier draft allowance, shared across all posts.
export interface DraftUsage {
  used: number;
  limit: number;
  remaining: number;
}

export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  // True once any of its drafts has been posted to X (list endpoint).
  published?: boolean;
  // The latest post published from it, refinements included (single-post endpoint).
  published_post?: { x_post_id: string | null; published_at: string } | null;
}

// When a draft was last published, as the server records it.
export interface DraftPosted {
  x_post_id: string | null;
  // The text that went out; it may have been edited from the draft.
  content: string;
  published_at: string;
}

// chat API types
export interface ChatMessageRequest {
  content: string;
  type: ChatMessageType;
}

export interface Message {
  id: string;
  conversation_id: string;
  message_group_id?: string | null;
  role: MessageRole;
  content: string;
  type?: ChatMessageType;
  created_at: string;
  // Drafts loaded from history only; absent on prompts and streamed drafts.
  posted?: DraftPosted | null;
}

/**
 * A turn = one question (user message) + its response variants (assistant
 * messages). `parentMessageId` links a refinement turn to the response it
 * refines (null for a top-level turn).
 */
export interface Turn {
  turnId: string;
  parentMessageId: string | null;
  question: Message | null;
  response: {
    type: ChatMessageType;
    options: Message[];
  };
}

// Post API types
// The published post, as X returned it.
export interface PostResponseData {
  id: string;
  text: string;
  edit_history_tweet_ids: string[];
}

// A post published to X, listed under Posts → Published.
export interface SentPost {
  id: string;
  content: string;
  x_post_id: string | null;
  // Null when it wasn't published from a draft, or its post was deleted.
  conversation_id: string | null;
  conversation_title: string | null;
  message_id: string | null;
  published_at: string;
}

// Returned by POST /new/prompt
export interface Chats {
  id: string;
  title: string;
  turn: Turn;
}
