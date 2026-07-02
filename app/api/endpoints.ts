import type {
  CampaignReplyDto,
  ChatAddMessageDto,
  ChatCreateWithPromptDto,
  ChatGetThreadDto,
  ChatGetMessagesDto,
  ChatRefineMessageDto,
  Chats,
  Conversation,
  ConversationCreateDto,
  ConversationDeleteDto,
  ConversationGetDto,
  ConversationListDto,
  ConversationUpdateDto,
  QueueTweetReplies,
  Turn,
  User,
} from "~/types";
import { API_BASE, externalApi, internalApi } from "./client";

export const authApi = {
  authorize: (): string => `${API_BASE}/auth/authorize`,
  logout: (): Promise<{ status: boolean; message: string }> =>
    internalApi.post<{ status: boolean; message: string }>("/auth/logout"),
};

export const userApi = {
  profile: (): Promise<User> =>
    externalApi.get<User>("/user/profile"),
};

export const campaignApi = {
  reply: (dto: CampaignReplyDto): Promise<QueueTweetReplies> =>
    externalApi.post<QueueTweetReplies>("/api/reply", dto.payload),
  post: (): Promise<void> =>
    externalApi.post<void>("/api/post"),
};

export const conversationApi = {
  create: (dto: ConversationCreateDto): Promise<Conversation> =>
    externalApi.post<Conversation>("/api/conversations", dto.payload),
  list: (dto: ConversationListDto): Promise<Conversation[]> =>
    externalApi.get<Conversation[]>(
      `/api/conversations?cursor=${dto.cursor ?? ""}&take=${dto.take ?? 20}`
    ),
  get: (dto: ConversationGetDto): Promise<Conversation> =>
    externalApi.get<Conversation>(`/api/conversations/${dto.id}`),
  update: (dto: ConversationUpdateDto): Promise<Conversation> =>
    externalApi.patch<Conversation>(`/api/conversations/${dto.id}`, dto.payload),
  delete: (dto: ConversationDeleteDto): Promise<void> =>
    externalApi.delete<void>(`/api/conversations/${dto.id}`),
};

export const chatApi = {
  createWithPrompt: (dto: ChatCreateWithPromptDto): Promise<Chats> =>
    externalApi.post<Chats>("/api/chat/new/prompt", dto.payload),
  getMessages: (dto: ChatGetMessagesDto): Promise<Turn[]> =>
    externalApi.get<Turn[]>(
      `/api/chat/${dto.conversationId}/messages?cursor=${dto.cursor ?? ""}&take=${dto.take ?? 50}`
    ),
  addMessage: (dto: ChatAddMessageDto): Promise<Turn> =>
    externalApi.post<Turn>(`/api/chat/${dto.conversationId}/prompt`, dto.payload),
  refineMessage: (dto: ChatRefineMessageDto): Promise<Turn> =>
    externalApi.post<Turn>(
      `/api/chat/messages/${dto.responseId}/refine`,
      dto.payload,
    ),
  getThread: (dto: ChatGetThreadDto): Promise<Turn[]> =>
    externalApi.get<Turn[]>(
      `/api/chat/messages/${dto.responseId}/thread`,
    ),
};
