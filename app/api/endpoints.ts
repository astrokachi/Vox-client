import type { Message, UserProfile } from "~/types"
import { API_BASE, externalApi, internalApi } from "./client"

export const authApi = {
  authorize: `${API_BASE}/auth/authorize`,
  session: (token: string) =>
    internalApi.post<void>('/auth/session', { token }),
  logout: () =>
    internalApi.post<void>('/auth/logout'),
}

export const userApi = {
  profile: () =>
    externalApi.get<UserProfile>('/user/profile'),
}

export const campaignApi = {
  reply: () =>
    externalApi.post('/api/reply'),
  post: () =>
    externalApi.post('/api/post'),
}

export const conversation = {
  get: () =>
    externalApi.get('/api/conversations'),
}

export const chat = {
  create: () =>
    externalApi.post('/api/chat/new/prompt'),
  get: (conversation_id: string) =>
    externalApi.post<Message[]>(`/api/chat/${conversation_id}/messages`),
  post: (conversation_id: string, content: string) =>
    externalApi.post(`/api/chat/${conversation_id}/prompt`, { content }),
}
