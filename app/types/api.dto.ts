import type {
  ChatMessageRequest,
  CreateConversationRequest,
  QueueTweetRepliesRequest,
  UpdateConversationRequest,
} from "./api.types";

export interface AuthSessionDto {
  token: string;
}

export interface CampaignReplyDto {
  payload?: QueueTweetRepliesRequest;
}

export interface ConversationCreateDto {
  payload: CreateConversationRequest;
}

export interface ConversationListDto {
  cursor?: string;
  take?: number;
}

export interface ConversationGetDto {
  id: string;
}

export interface ConversationUpdateDto {
  id: string;
  payload: UpdateConversationRequest;
}

export interface ConversationDeleteDto {
  id: string;
}

export interface ChatCreateWithPromptDto {
  payload: ChatMessageRequest;
}

export interface ChatGetMessagesDto {
  conversationId: string;
  cursor?: string;
  take?: number;
}

export interface ChatAddMessageDto {
  conversationId: string;
  payload: ChatMessageRequest;
}
