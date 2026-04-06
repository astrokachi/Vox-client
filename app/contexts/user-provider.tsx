import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { UserContext } from './user-context'
import type { UserProfile } from './user-context'


export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await axios.get('/api/user/profile')
      if (res.data.status) {
        setUser(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoading, refetch: fetchProfile }}>
      {children}
    </UserContext.Provider>
  )
}
