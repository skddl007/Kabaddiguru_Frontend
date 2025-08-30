"use client"

import { createContext, useContext, useState, useEffect } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chatLimitInfo, setChatLimitInfo] = useState(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  useEffect(() => {
    // Check for existing token and user data on app load
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    
    setLoading(false)
  }, [])

  // Auto-check chat limit whenever token becomes available/changes
  useEffect(() => {
    if (token) {
      checkChatLimit()
    } else {
      setChatLimitInfo(null)
    }
  }, [token])

  // Auto-open subscription modal if limit is reached for non-admin users
  useEffect(() => {
    const limitReached = chatLimitInfo 
      ? ((!chatLimitInfo.can_chat || (Number.isFinite(chatLimitInfo.remaining_chats) && chatLimitInfo.remaining_chats <= 0)) && !chatLimitInfo.is_admin)
      : false
    if (limitReached) setShowSubscriptionModal(true)
  }, [chatLimitInfo])

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem("token", userToken)
    localStorage.setItem("user", JSON.stringify(userData))
    // Chat limits will be checked automatically by the token effect
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setChatLimitInfo(null)
    setShowSubscriptionModal(false)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem("user", JSON.stringify(updatedUserData))
  }

  const checkChatLimit = async () => {
    if (!token) {
      // No token: do not set misleading defaults; hide limit UI
      setChatLimitInfo(null)
      return { can_chat: false, remaining_chats: 0, max_chats: 0, is_admin: false, subscription_type: "guest" }
    }
    
    try {
      const response = await fetch(`/api/auth/chat-limit`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChatLimitInfo(data)
        return data
      }
    } catch (error) {
      console.error("Error checking chat limit:", error)
    }
    
    // Default fallback
    const fallbackData = { 
      can_chat: true, 
      remaining_chats: 10, 
      max_chats: 10,
      subscription_type: "free",
      is_admin: false 
    }
    setChatLimitInfo(fallbackData)
    return fallbackData
  }

  const refreshChatLimit = async () => {
    return await checkChatLimit()
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    checkChatLimit,
    refreshChatLimit,
    chatLimitInfo,
    showSubscriptionModal,
    setShowSubscriptionModal,
    isAuthenticated: !!user && !!token,
    // Computed values for easier access
    canChat: chatLimitInfo?.can_chat ?? true,
    remainingChats: chatLimitInfo?.remaining_chats ?? 0,
    isAdmin: chatLimitInfo?.is_admin ?? false,
    isLimitReached: chatLimitInfo 
      ? ((!chatLimitInfo.can_chat || (Number.isFinite(chatLimitInfo.remaining_chats) && chatLimitInfo.remaining_chats <= 0)) && !chatLimitInfo.is_admin)
      : false
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
