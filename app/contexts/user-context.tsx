import { createContext } from 'react'

export interface UserProfile {
  user_id: string
  email: string
  username: string
  name: string
  created_at: string
  updated_at: string
}

export interface UserContextType {
  user: UserProfile | null
  isLoading: boolean
  refetch: () => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)
