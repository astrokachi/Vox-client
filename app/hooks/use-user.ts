import React from "react"
import { UserContext, type UserContextType } from "~/contexts/user-context"

export const useUser = (): UserContextType => {
  const context = React.useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
