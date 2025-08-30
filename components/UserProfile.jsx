"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Crown, MessageSquare, Calendar, Users } from "lucide-react"
import { useUser } from "@/contexts/UserContext"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function UserProfile() {
  const { user, token, logout } = useUser()
  const [chatLimit, setChatLimit] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChatLimit = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/chat-limit`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setChatLimit(data)
        }
      } catch (error) {
        console.error("Error fetching chat limit:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChatLimit()
  }, [token])

  if (!user) {
    return null
  }

  const remainingChats = Number.isFinite(chatLimit?.remaining_chats) ? Math.max(0, chatLimit.remaining_chats) : 0
  const maxChats = Number.isFinite(chatLimit?.max_chats) ? Math.max(0, chatLimit.max_chats) : 0
  const chatProgress = maxChats > 0 ? ((maxChats - remainingChats) / maxChats) * 100 : 0

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          {user.is_premium && (
            <Crown className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        <CardTitle className="text-xl">{user.full_name}</CardTitle>
        <CardDescription className="text-gray-600">
          {user.email}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Chat Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Chat Usage</span>
            {maxChats > 0 && (
              <span className="font-medium">
                {Math.max(0, maxChats - remainingChats)} / {maxChats}
              </span>
            )}
          </div>
          {maxChats > 0 && <Progress value={chatProgress} className="h-2" />}
          <div className="text-xs text-gray-500 text-center">
            {user.is_premium ? (
              user.subscription_type === 'admin' ? (
                "Unlimited access - Admin Account"
              ) : (
                "Unlimited chats with Premium"
              )
            ) : (
              maxChats > 0 ? `${remainingChats} chats remaining in free trial` : "Free trial"
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Member since:</span>
            <span>{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
          {user.last_login && (
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Last login:</span>
              <span>{new Date(user.last_login).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {!user.is_premium && user.subscription_type !== 'admin' && (
            <Button 
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              onClick={() => {
                // In a real app, this would redirect to payment page
                alert("Premium upgrade feature coming soon!")
              }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
          {user.subscription_type === 'admin' && (
            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Admin Account</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                You have unlimited access to all features
              </p>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
