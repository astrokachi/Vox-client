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

export interface CursorPageDto {
  cursor?: string;
  take?: number;
}

export type ConversationListDto = CursorPageDto;

export type SentPostListDto = CursorPageDto;

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

export interface ChatRefineMessageDto {
  responseId: string;
  payload: { content?: string };
}

export interface ChatGetThreadDto {
  responseId: string;
}
