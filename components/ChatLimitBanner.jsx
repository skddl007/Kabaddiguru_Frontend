"use client"

import { Button } from "@/components/ui/button"
import { Crown, AlertTriangle, Info } from "lucide-react"
import { useUser } from "@/contexts/UserContext"

export default function ChatLimitBanner({ variant = "default" }) {
  const { 
    chatLimitInfo, 
    isLimitReached, 
    isAdmin, 
  } = useUser()

  // Don't show banner for admin users
  if (isAdmin) {
    return null
  }

  // Don't show banner if no chat limit info
  if (!chatLimitInfo) {
    return null
  }

  const { remaining_chats = 0, max_chats = 0 } = chatLimitInfo
  const safeMax = Number.isFinite(max_chats) && max_chats > 0 ? max_chats : 0
  const safeRemaining = Number.isFinite(remaining_chats) && remaining_chats >= 0 ? remaining_chats : 0
  const usedChats = safeMax > 0 ? Math.max(0, safeMax - safeRemaining) : 0

  // Do not show banner unless the free trial limit has been reached
  if (!isLimitReached) {
    return null
  }

  // Different banner styles based on variant and limit status
  if (variant === "compact") {
    return (
      <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isLimitReached ? (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            ) : (
              <Info className="w-4 h-4 text-orange-600" />
            )}
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {isLimitReached ? "Chat Limit Reached" : "Free Trial"}
              </span>
            </div>
          </div>
          <Button
            onClick={() => setShowSubscriptionModal(true)}
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs"
          >
            {isLimitReached ? "Upgrade Now" : "Upgrade"}
          </Button>
        </div>
      </div>
    )
  }

  // Default variant - more detailed
  return (
    <div className={`mb-4 p-4 rounded-lg border ${
      isLimitReached 
        ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200" 
        : "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isLimitReached ? "bg-red-100" : "bg-orange-100"
          }`}>
            {isLimitReached ? (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            ) : (
              <Crown className="w-4 h-4 text-orange-600" />
            )}
          </div>
          <div>
            <h3 className={`text-sm font-medium ${
              isLimitReached ? "text-red-900" : "text-orange-900"
            }`}>
              {isLimitReached ? "Free Trial Limit Reached" : "Free Trial"}
            </h3>
            <p className={`text-xs ${
              isLimitReached ? "text-red-700" : "text-orange-700"
            }`}>
              {"You've reached your free trial limits. Upgrade to premium for unlimited access to all features."}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowSubscriptionModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs px-4 py-2"
          >
            {isLimitReached ? "Upgrade Now" : "Upgrade"}
          </Button>
        </div>
      </div>
    </div>
  )
}
