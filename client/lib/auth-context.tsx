"use client"

import * as React from "react"

type UserRole = "admin" | "student"

type User = {
  name: string
  email: string
  role?: UserRole
  avatar?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userData = localStorage.getItem("user")
    
    if (isAuthenticated && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUserState({ ...parsedUser, role: parsedUser.role || "student" })
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    }
    setLoading(false)
  }, [])

  const setUser = React.useCallback((user: User | null) => {
    setUserState(user)
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("isAuthenticated", "true")
    } else {
      localStorage.removeItem("user")
      localStorage.removeItem("isAuthenticated")
    }
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
  }, [setUser])

  return <AuthContext.Provider value={{ user, loading, setUser, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
