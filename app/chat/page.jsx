"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Send, 
  Plus, 
  MessageSquare, 
  BarChart3, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown,
  ChevronUp,
  X,
  User,
  Home,
  Code,
  MessageCircle,
  File,
  MoreHorizontal,
  Wifi,
  WifiOff,
  Menu,
  LayoutDashboard
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import AuthWrapper from "@/components/AuthWrapper"
import ChatLimitBanner from "@/components/ChatLimitBanner"
import { useUser } from "@/contexts/UserContext"

import { sendMessage as sendMessageApi, generateSummary as generateSummaryApi, submitFeedback as submitFeedbackApi } from "@/lib/api-client"
// Removed VideoPlayer import - using simple iframe approach

// Team logo mapping with actual image paths
const TEAM_LOGOS = {
  'Bengaluru Bulls': '/team-logos/Bengaluru Bulls.png',
  'Telugu Titans': '/team-logos/Telugu Titans.jpeg',
  'Puneri Paltan': '/team-logos/Puneri Paltan.jpeg',
  'Haryana Steelers': '/team-logos/Haryana Steelers.jpeg',
  'U Mumba': '/team-logos/U Mumba.png',
  'Jaipur Pink Panthers': '/team-logos/Jaipur Pink Panthers.png',
  'Bengal Warriors': '/team-logos/Bengal Warriors.png',
  'Dabang Delhi': '/team-logos/Dabang Delhi.jpeg',
  'Gujarat Giants': '/team-logos/Gujarat Giants.jpeg',
  'Patna Pirates': '/team-logos/Patna Pirates.jpeg',
  'Tamil Thalaivas': '/team-logos/Tamil Thalaivas.png',
  'U.P. Yoddhas': '/team-logos/U.P. Yoddhas.jpeg'
}

// TeamLogo component for consistent team logo display
const TeamLogo = ({ teamName, size = 'md', showFallback = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }
  
  const logoPath = TEAM_LOGOS[teamName]
  
  if (logoPath) {
    return (
      <img 
        src={logoPath} 
        alt={`${teamName} logo`}
        className={`${sizeClasses[size]} object-cover rounded-full shadow-lg border border-white/20 hover:scale-105 transition-transform duration-200 ${className}`}
        onError={(e) => {
          if (showFallback) {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }
        }}
      />
    )
  }
  
  if (showFallback) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border border-white/20 ${className}`}>
        {teamName?.charAt(0) || '?'}
      </div>
    )
  }
  
  return null
}

export default function ChatPage() {
  const { 
    user, 
    token, 
    canChat, 
    isLimitReached, 
    isAdmin, 
    setShowSubscriptionModal,
    refreshChatLimit 
  } = useUser()

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([{
    id: "1",
    content: "Hello! I'm your KabaddiGuru assistant. I can help you analyze player performance, match statistics, team strategies, and much more. What would you like to know about your Kabaddi data?",
    role: "assistant",
    timestamp: new Date()
  }])
  const [isLoading, setIsLoading] = useState(false)
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [expandedSqlQueries, setExpandedSqlQueries] = useState(new Set())
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false)
  const [connectionStatus] = useState("connected")
  const [debounceTimer, setDebounceTimer] = useState(null)
  const [summaryData, setSummaryData] = useState(null)
  const [showSummary, setShowSummary] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summaryCount, setSummaryCount] = useState(0)
  const [maxSummaries] = useState(5) // Maximum summaries allowed in free trial
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState("")
  const [feedbackStates, setFeedbackStates] = useState({}) // Track feedback state for each message
  const [showFeedbackForm, setShowFeedbackForm] = useState({}) // Track feedback form visibility
  const [feedbackText, setFeedbackText] = useState({}) // Track feedback text for each message
  const [sidebarOpen, setSidebarOpen] = useState(false) // Track sidebar open state
  const [sidebarHidden, setSidebarHidden] = useState(false) // Track sidebar hide/show state
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false) // Track video player modal state
  const [selectedVideoData, setSelectedVideoData] = useState(null) // Track selected video data
  const messagesEndRef = useRef(null)

  // Auto new thread after inactivity (similar to ChatGPT behavior where sessions are distinct)
  const INACTIVITY_WINDOW_MS = 20 * 60 * 1000 // 20 minutes

  // Generate a short, ChatGPT-like chat title from the first user message
  const generateChatTitleFromText = (text) => {
    if (!text) return 'New chat'
    const cleaned = text
      .replace(/[\r\n]+/g, ' ')
      .replace(/[`*_#>\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    // Keep first 6 words and cap to ~32 chars
    const words = cleaned.split(' ').slice(0, 6).join(' ')
    const capped = words.length > 32 ? words.slice(0, 32).trim() + '…' : words
    return capped.charAt(0).toUpperCase() + capped.slice(1)
  }

  // Helper function to clean player names (remove suffixes like _RIN_TT17)
  const cleanPlayerName = (name) => {
    if (!name) return 'Unknown Player'
    
    // If it's already a clean name (from analytics), return as is
    if (name && !name.includes('_')) return name
    
    // Extract the first part before underscore (actual player name)
    const parts = name.split('_')
    return parts[0] || 'Unknown Player'
  }

  // Helper function to clean video URLs (handle double encoding only)
  const cleanVideoUrl = (url) => {
    if (!url) return url
    
    // Remove surrounding quotes if present
    let cleanUrl = url.trim()
    if (cleanUrl.startsWith("'") && cleanUrl.endsWith("'")) {
      cleanUrl = cleanUrl.slice(1, -1)
    }
    
    // Only handle double URL encoding, don't decode already correct URLs
    if (cleanUrl.includes('%25')) {
      cleanUrl = decodeURIComponent(decodeURIComponent(cleanUrl))
    }
    // Don't decode URLs that are already properly encoded from database
    
    return cleanUrl
  }

  // Helper function to handle video button clicks - now using simple iframe
  const handleVideoClick = useCallback((videoUrl, playerName, teamCode, raidNo, description) => {
    setSelectedVideoData({
      video_url: cleanVideoUrl(videoUrl),
      player: cleanPlayerName(playerName),
      team: teamCode,
      raid_no: raidNo,
      description: description || 'Raid Video'
    })
    setVideoPlayerOpen(true)
  }, [])

  // Chat limits are managed globally in UserContext; no need to fetch here

  // Load summary count from localStorage
  useEffect(() => {
    const savedSummaryCount = localStorage.getItem('kabaddi_summary_count')
    if (savedSummaryCount) {
      const count = parseInt(savedSummaryCount, 10)
      setSummaryCount(count)
    }
  }, [])

  // Helpers for per-user and per-chat storage keys
  const getUserScopedKey = useCallback((base) => user?.user_id ? `${base}_${user.user_id}` : base, [user?.user_id])
  const getMessagesKey = useCallback((chatId) => chatId ? `kabaddi_messages_${chatId}` : null, [])

  // Load chats and current chat when user changes
  useEffect(() => {
    // Prefer user-scoped keys; gracefully fall back to base keys and migrate if needed
    const baseChatsKey = 'kabaddi_chats'
    const baseCurrentKey = 'kabaddi_current_chat_id'
    const userChatsKey = getUserScopedKey('kabaddi_chats')
    const userCurrentKey = getUserScopedKey('kabaddi_current_chat_id')

    const savedUserChats = localStorage.getItem(userChatsKey)
    const savedBaseChats = localStorage.getItem(baseChatsKey)

    let chatsJson = savedUserChats || savedBaseChats
    if (chatsJson) {
      try {
        const parsedChats = JSON.parse(chatsJson)
        const chatsWithDates = parsedChats.map(chat => ({
          ...chat,
          lastMessage: chat.lastMessage ? new Date(chat.lastMessage) : new Date()
        }))
        setChats(chatsWithDates)
        // Migrate base -> user-scoped on first load for signed-in users
        if (!savedUserChats && savedBaseChats && user?.user_id) {
          localStorage.setItem(userChatsKey, savedBaseChats)
        }
      } catch {
        setChats([])
      }
    } else {
      setChats([])
    }

    // Always start fresh on page open: do not auto-load last asked question
    setCurrentChatId(null)
    setMessages([{
      id: "1",
      content: "Hello! I'm your KabaddiGuru assistant. I can help you analyze player performance, match statistics, team strategies, and much more. What would you like to know about your Kabaddi data?",
      role: "assistant",
      timestamp: new Date()
    }])

    // Optionally clear stored current chat pointer so refreshes also start fresh
    try {
      localStorage.removeItem(userCurrentKey)
      localStorage.removeItem(baseCurrentKey)
    } catch {}
  }, [user, getUserScopedKey])

  // Save current chat id per user
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem(getUserScopedKey('kabaddi_current_chat_id'), currentChatId)
    }
  }, [currentChatId, user, getUserScopedKey])

  useEffect(() => {
    const mk = getMessagesKey(currentChatId)
    if (mk) {
      localStorage.setItem(mk, JSON.stringify(messages))
    }
  }, [messages, currentChatId, getMessagesKey])

  // Load messages for current chat
  useEffect(() => {
    if (!currentChatId) return
    
    const mk = getMessagesKey(currentChatId)
    if (mk) {
      const savedMessages = localStorage.getItem(mk)
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages)
          const messagesWithDates = parsedMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(messagesWithDates)
        } catch {
          console.error("Error parsing saved messages")
        }
      }
    }
  }, [currentChatId, getMessagesKey])

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(getUserScopedKey('kabaddi_chats'), JSON.stringify(chats))
    }
  }, [chats, user, getUserScopedKey])

  const loadSuggestions = useCallback(async () => {
    setSuggestionsLoading(true)
    try {
      const response = await fetch(`/api/suggestions`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error("Error loading suggestions:", error)
    } finally {
      setSuggestionsLoading(false)
      setSuggestionsLoaded(true)
    }
  }, [])

  // Load suggestions
  useEffect(() => {
    if (!suggestionsLoaded && !suggestionsLoading) {
      loadSuggestions()
    }
  }, [suggestionsLoaded, suggestionsLoading, loadSuggestions])

  // Set up global window function for video clicks
  useEffect(() => {
    window.handleVideoClick = handleVideoClick
    return () => {
      delete window.handleVideoClick
    }
  }, [handleVideoClick])


  const sendMessage = async (message, chatId, authToken) => {
    return await sendMessageApi(message, chatId, authToken)
  }

  const generateSummary = async (chatId) => {
    return await generateSummaryApi(chatId)
  }

  const submitFeedback = async (feedbackData) => {
    return await submitFeedbackApi(feedbackData)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return

    // Check if user can chat (for non-admin users)
    if (!isAdmin && !canChat) {
      setShowSubscriptionModal(true)
      return
    }

    // Clear any pending debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      setDebounceTimer(null)
    }

    const currentInput = input
    const now = new Date()
    const lastMsgTs = messages.length ? new Date(messages[messages.length - 1].timestamp) : null
    const needsNewChatDueToInactivity = Boolean(
      currentChatId && lastMsgTs && now - lastMsgTs > INACTIVITY_WINDOW_MS
    )

    const userMessage = {
      id: Date.now().toString(),
      content: currentInput,
      role: "user",
      timestamp: now
    }

    setInput("")
    setIsLoading(true)

    // Determine chat id to use for this send
    let usedChatId = currentChatId
    let provisionalId = null
    const startingNewChat = (!currentChatId && messages.length === 1) || needsNewChatDueToInactivity

    if (startingNewChat) {
      provisionalId = Date.now().toString()
      const newChat = {
        id: provisionalId,
        title: generateChatTitleFromText(currentInput),
        lastMessage: now
      }
      setChats(prev => [newChat, ...prev])
      setCurrentChatId(provisionalId)
      usedChatId = provisionalId

      // Reset visible messages to a fresh thread (greeting + this user message)
      const greeting = {
        id: "1",
        content: "Hello! I'm your KabaddiGuru assistant. I can help you analyze player performance, match statistics, team strategies, and much more. What would you like to know about your Kabaddi data?",
        role: "assistant",
        timestamp: now
      }
      setMessages([greeting, userMessage])

      // persist initial messages for this provisional chat
      const mk = getMessagesKey(provisionalId)
      if (mk) {
        try {
          localStorage.setItem(mk, JSON.stringify([
            greeting,
            userMessage
          ]))
        } catch {}
      }
    } else {
      // Continue existing thread
      setMessages(prev => [...prev, userMessage])
    }

    // Add optimistic loading message
    const loadingMessage = {
      id: (Date.now() + 1).toString(),
      content: "Processing your request... This may take a few moments for complex queries.",
      role: "assistant",
      timestamp: new Date(),
      isLoading: true
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      // Call the real backend API - no timeout to allow for long processing
      const response = await sendMessage(currentInput, usedChatId, token)
      
      // Remove loading message and add real response
      setMessages(prev => prev.filter(msg => !msg.isLoading))
      
      // Chat count is incremented on the backend automatically
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: "assistant",
        timestamp: new Date(),
        sql_query: response.sql_query,
        response_time: response.response_time,
        userQuestion: currentInput // Store the user question for feedback
      }
      setMessages(prev => [...prev, aiResponse])

      // Update chat title if this was a new chat
      if (provisionalId) {
        setChats(prev => prev.map(chat => 
          chat.id === provisionalId 
            ? { ...chat, title: generateChatTitleFromText(currentInput) }
            : chat
        ))
      }

      // Update last message time for current chat
      setChats(prev => prev.map(chat => 
        chat.id === usedChatId 
          ? { ...chat, lastMessage: now }
          : chat
      ))

      // Refresh chat limits after successful message
      await refreshChatLimit()

    } catch (error) {
      console.error("Error sending message:", error)
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading))
      
      // Add error message
      const errorMessage = {
        id: Date.now().toString(),
        content: error.message === "Free trial limit reached. Please upgrade to premium for unlimited chats." 
          ? "You&apos;ve reached your free trial limit. Please upgrade to premium to continue chatting."
          : "Sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])

      // If it's a limit error, show subscription modal
      if (error.message.includes("Free trial limit reached")) {
        setShowSubscriptionModal(true)
        await refreshChatLimit()
      }

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, currentChatId, messages, INACTIVITY_WINDOW_MS, connectionStatus, debounceTimer, canChat, isAdmin, token, refreshChatLimit, setShowSubscriptionModal, getUserScopedKey, getMessagesKey])

  const startNewChat = () => {
    setMessages([{
      id: "1",
      content: "Hello! I'm your KabaddiGuru assistant. I can help you analyze player performance, match statistics, team strategies, and much more. What would you like to know about your Kabaddi data?",
      role: "assistant",
      timestamp: new Date()
    }])
    setCurrentChatId(null)
    setExpandedSqlQueries(new Set())
    setSummaryData(null)
    setShowSummary(false)
    
    // Clear localStorage for new session
    localStorage.removeItem(getUserScopedKey('kabaddi_current_chat_id'))
    
    // Keep suggestions loaded to avoid unnecessary API calls
    // setSuggestionsLoaded(false) // Uncomment if you want fresh suggestions for new chat
  }

  const handleGenerateSummary = async () => {
    if (!currentChatId || isGeneratingSummary) return
    
    // Check summary limit only for non-admin users
    if (!isAdmin && summaryCount >= maxSummaries) {
      setShowSubscriptionModal(true)
      return
    }
    
    setIsGeneratingSummary(true)
    try {
      const summaryResponse = await generateSummary(currentChatId)
      
      setSummaryData(summaryResponse)
      setShowSummary(true)
      
      // Increment summary count and save to localStorage (only for non-admin users)
      if (!isAdmin) {
        const newCount = summaryCount + 1
        setSummaryCount(newCount)
        localStorage.setItem('kabaddi_summary_count', newCount.toString())
      }
    } catch (error) {
      // Show error message to user
      const errorMessage = {
        id: Date.now().toString(),
        content: "Failed to generate conversation summary. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleFeedback = async (messageId, feedbackType, message) => {
    try {
      const feedbackData = {
        user_question: message.userQuestion || "",
        ai_response: message.content,
        sql_query: message.sql_query || "",
        feedback_type: feedbackType,
        feedback_text: feedbackText[messageId] || "",
        response_time: message.response_time || 0,
        tokens_used: 0, // We don't track tokens in frontend
        chat_id: currentChatId
      }

      await submitFeedback(feedbackData)
      
      // Update feedback state
      setFeedbackStates(prev => ({
        ...prev,
        [messageId]: feedbackType
      }))
      
      // Clear feedback form
      setShowFeedbackForm(prev => ({
        ...prev,
        [messageId]: false
      }))
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      })
    }
  }

  const toggleFeedbackForm = (messageId) => {
    setShowFeedbackForm(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }))
  }

  const toggleSqlQuery = (messageId) => {
    setExpandedSqlQueries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }

  // Component for rendering formatted AI responses
  const FormattedResponse = ({ content }) => {
    // Convert markdown-style content to proper JSX
    const formatContent = (text) => {
      if (!text) return ""
      
      // Card styles based on raid result (mirrors Players page)
      const getCardStyles = (resultText) => {
        const r = (resultText || '').toLowerCase()
        if (r === 'successful') {
          return {
            badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            border: 'border-emerald-100',
            ring: 'hover:ring-emerald-300',
            header: 'text-emerald-700',
            bg: 'bg-emerald-50',
            button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
            overlayBg: 'bg-emerald-600/40'
          }
        }
        if (r === 'unsuccessful' || r === 'failed/unsuccessful' || r === 'failure' || r === 'failed') {
          return {
            badge: 'bg-rose-100 text-rose-700 border-rose-200',
            border: 'border-rose-100',
            ring: 'hover:ring-rose-300',
            header: 'text-rose-700',
            bg: 'bg-rose-50',
            button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
            overlayBg: 'bg-rose-600/40'
          }
        }
        if (r === 'empty') {
          return {
            badge: 'bg-sky-100 text-sky-700 border-sky-200',
            border: 'border-sky-100',
            ring: 'hover:ring-sky-300',
            header: 'text-sky-700',
            bg: 'bg-sky-50',
            button: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm',
            overlayBg: 'bg-sky-600/40'
          }
        }
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          border: 'border-slate-100',
          ring: 'hover:ring-slate-300',
          header: 'text-slate-700',
          bg: 'bg-white',
          button: 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm',
          overlayBg: 'bg-black/40'
        }
      }

      // Build cards HTML when a raids table is detected
      const buildRaidsCardsHtml = (headers, rows) => {
        // Identify column indices
        const findIndex = (preds) => headers.findIndex(h => preds.some(p => h.toLowerCase().includes(p)))
        const idxPlayer = findIndex(['attacking player', 'player', 'raider', 'tackled raider', 'tackler'])
        const idxOutcome = findIndex(['raid outcome', 'result', 'outcome', 'points'])
        const idxPoints = findIndex(['points', 'points scored', 'score'])
        const idxVideo = findIndex(['video', 'raid video', 'watch video'])
        const idxTeam = findIndex(['team', 'attacking team', 'team code'])
        const idxRaidNo = findIndex(['raid no', 'raid number', 'raid_no', 'raid'])

        // If we don't have at least player, fallback to table
        if (idxPlayer === -1) return null

        // Check if any row has video available - if no videos, fallback to table
        let hasAnyVideo = false
        if (idxVideo !== -1) {
          hasAnyVideo = rows.some(row => {
            const cell = row[idxVideo] || ''
            const markdownLinkMatch = cell.match(/\[Watch Video\]\((https?:\/\/[^\)]+)\)/)
            const directUrlMatch = cell.match(/https?:\/\/[^\s\)]+/)
            return (markdownLinkMatch && markdownLinkMatch[1]) || (directUrlMatch && (cell.includes('.mp4') || cell.includes('video') || cell.includes('vod.')))
          })
        }
        
        // If no videos are available, fallback to table display
        if (!hasAnyVideo) return null

        let html = '<div class="my-1.5 grid grid-cols-4 gap-1.5 max-h-96 overflow-y-auto">'

        rows.forEach((row, index) => {
          const player = cleanPlayerName(row[idxPlayer] || '')
          const outcome = idxOutcome !== -1 ? (row[idxOutcome] || '') : 'Tackled'
          const points = idxPoints !== -1 ? (row[idxPoints] || '0') : '1'
          const teamCode = idxTeam !== -1 ? (row[idxTeam] || '') : ''
          const raidNo = idxRaidNo !== -1 ? (row[idxRaidNo] || '') : ''

          // Extract video URL if present in video cell
          let videoUrl = ''
          if (idxVideo !== -1) {
            const cell = row[idxVideo] || ''
            const markdownLinkMatch = cell.match(/\[Watch Video\]\((https?:\/\/[^\)]+)\)/)
            const directUrlMatch = cell.match(/https?:\/\/[^\s\)]+/)
            if (markdownLinkMatch) videoUrl = cleanVideoUrl(markdownLinkMatch[1])
            else if (directUrlMatch && (cell.includes('.mp4') || cell.includes('video') || cell.includes('vod.'))) videoUrl = cleanVideoUrl(directUrlMatch[0])
          }

          const styles = getCardStyles(outcome)
          const btnId = `video-card-btn-${Date.now()}-${index}`

          html += `
            <div class="group relative border ${styles.border} ${styles.bg} ${styles.ring} hover:ring-2 rounded-sm overflow-hidden h-20">
              <div class="p-1 space-y-0.5 h-full flex flex-col justify-between">
                <div class="flex items-center justify-between min-w-0">
                  <div class="flex items-center gap-1 min-w-0">
                    <span class="px-1 py-0.5 text-[8px] rounded border bg-slate-50 text-slate-700 border-slate-200 shrink-0">Raid ${raidNo || '-'}</span>
                    <span class="truncate text-[10px] font-semibold text-gray-900">${player}</span>
                  </div>
                  <span class="px-1 py-0.5 rounded-full text-[8px] font-semibold bg-white/70 text-slate-900 border border-white/80 shrink-0">${points} pts</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1 min-w-0">
                    <span class="px-1 py-0.5 rounded text-[8px] border ${styles.badge} shrink-0">${outcome || '-'}</span>
                    <span class="truncate text-[9px] ${styles.header} capitalize">${teamCode || ''}</span>
                  </div>
                  ${videoUrl ? `<button id="${btnId}" class="${styles.button} h-4 px-1 rounded text-[8px] font-medium shrink-0">▶</button>` : ''}
                </div>
              </div>
              ${videoUrl ? `<button class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${styles.overlayBg}" onclick="window.handleVideoClick && window.handleVideoClick('${videoUrl}', '${player}', '${teamCode}', '${raidNo}', 'Raid Video')" aria-label="Play video">
                <div class="w-6 h-6 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
                  <span class="text-[10px]">▶</span>
                </div>
              </button>` : ''}
            </div>
          `
        })

        html += '</div>'
        return html
      }

      // Handle tables with robust parsing
      // First, try to handle tab-separated tables (like the user's example)
      const tabTableRegex = /((?:[^\n]+\t[^\n]+(?:\n|$)){2,})/g
      let formattedText = text.replace(tabTableRegex, (match) => {
        try {
          const lines = match.trim().split('\n').filter(line => line.trim())
          if (lines.length < 2) return match
          
          // First line is headers
          const headerLine = lines[0]
          const headerCells = headerLine.split('\t').map(h => h.trim()).filter(h => h)
          
          // Data rows
          const dataRows = lines.slice(1).map(line => {
            const cells = line.split('\t').map(cell => cell.trim()).filter(cell => cell)
            return cells
          }).filter(row => row.length > 0 && row.length === headerCells.length)
          
          if (headerCells.length === 0 || dataRows.length === 0) {
            return match
          }
          
          // Find Raid ID column index to exclude it
          const raidIdIndex = headerCells.findIndex(header => 
            header.toLowerCase().includes('raid id') || header.toLowerCase().includes('raid_id')
          )
          
          // Filter out Raid ID column from headers and rows
          const filteredHeaders = headerCells.filter((_, index) => index !== raidIdIndex)
          const filteredRows = dataRows.map(row => row.filter((_, index) => index !== raidIdIndex))
          // Try to build cards first; fallback to table if not a raids table
          const cards = buildRaidsCardsHtml(filteredHeaders, filteredRows)
          if (cards) return cards

          // Fallback: keep original table rendering
          let html = '<div class="overflow-x-auto my-4"><table class="min-w-full border border-gray-200 rounded-lg">'
          html += '<thead class="bg-gray-50"><tr>'
          filteredHeaders.forEach(header => { html += `<th class="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">${header}</th>` })
          html += '</tr></thead><tbody>'
          filteredRows.forEach((row, index) => { html += `<tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">`; row.forEach((cell) => { html += `<td class="px-4 py-2 text-sm text-gray-700 border-b">${cell}</td>` }); html += '</tr>' })
          html += '</tbody></table></div>'
          return html
        } catch (error) {
          console.error('Tab table parsing error:', error)
          return match
        }
      })
      
      // Handle space-separated tables (fallback for tab-separated)
      const spaceTableRegex = /((?:[^\n]+\s{2,}[^\n]+(?:\n|$)){2,})/g
      formattedText = formattedText.replace(spaceTableRegex, (match) => {
        // Skip if already processed as a table
        if (match.includes('<table')) return match
        
        try {
          const lines = match.trim().split('\n').filter(line => line.trim())
          if (lines.length < 2) return match
          
          // First line is headers
          const headerLine = lines[0]
          const headerCells = headerLine.split(/\s{2,}/).map(h => h.trim()).filter(h => h)
          
          // Data rows
          const dataRows = lines.slice(1).map(line => {
            const cells = line.split(/\s{2,}/).map(cell => cell.trim()).filter(cell => cell)
            return cells
          }).filter(row => row.length > 0 && row.length === headerCells.length)
          
          if (headerCells.length === 0 || dataRows.length === 0) {
            return match
          }
          
          // Find Raid ID column index to exclude it
          const raidIdIndex = headerCells.findIndex(header => 
            header.toLowerCase().includes('raid id') || header.toLowerCase().includes('raid_id')
          )
          
          // Filter out Raid ID column from headers and rows
          const filteredHeaders = headerCells.filter((_, index) => index !== raidIdIndex)
          const filteredRows = dataRows.map(row => row.filter((_, index) => index !== raidIdIndex))
          
          // Try to build cards first; fallback to table if not a raids table
          const cards = buildRaidsCardsHtml(filteredHeaders, filteredRows)
          if (cards) return cards

          let html = '<div class="overflow-x-auto my-4"><table class="min-w-full border border-gray-200 rounded-lg">'
          html += '<thead class="bg-gray-50"><tr>'
          filteredHeaders.forEach(header => { html += `<th class=\"px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b\">${header}</th>` })
          html += '</tr></thead><tbody>'
          filteredRows.forEach((row, index) => { html += `<tr class=\"${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}\">`; row.forEach((cell) => { html += `<td class=\"px-4 py-2 text-sm text-gray-700 border-b\">${cell}</td>` }); html += '</tr>' })
          html += '</tbody></table></div>'
          return html
        } catch (error) {
          console.error('Space table parsing error:', error)
          return match
        }
      })
      
      // Then handle pipe-separated tables
      const tableRegex = /\|(.*?)\|\n\|(.*?)\|\n((?:\|(.*?)\|\n?)*)/g
      formattedText = formattedText.replace(tableRegex, (match, headers, separator, rows) => {
        try {
          // Parse headers - split by | and clean up
          const headerCells = headers.split('|').map(h => h.trim()).filter(h => h)
          
          // Parse rows - split by newlines first, then by |
          const rowsArray = rows.trim().split('\n').map(row => {
            const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell)
            return cells
          }).filter(row => row.length > 0 && row.length === headerCells.length)
          
          if (headerCells.length === 0 || rowsArray.length === 0) {
            return match // Return original if parsing fails
          }
          
          // Find Raid ID column index to exclude it
          const raidIdIndex = headerCells.findIndex(header => 
            header.toLowerCase().includes('raid id') || header.toLowerCase().includes('raid_id')
          )
          
          // Filter out Raid ID column from headers and rows
          const filteredHeaders = headerCells.filter((_, index) => index !== raidIdIndex)
          const filteredRows = rowsArray.map(row => row.filter((_, index) => index !== raidIdIndex))
          
          // Try to build cards first; fallback to table if not a raids table
          const cards = buildRaidsCardsHtml(filteredHeaders, filteredRows)
          if (cards) return cards

          let html = '<div class="overflow-x-auto my-4"><table class="min-w-full border border-gray-200 rounded-lg">'
          html += '<thead class="bg-gray-50"><tr>'
          filteredHeaders.forEach(header => { html += `<th class=\"px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b\">${header}</th>` })
          html += '</tr></thead><tbody>'
          filteredRows.forEach((row, index) => { html += `<tr class=\"${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}\">`; row.forEach((cell) => { html += `<td class=\"px-4 py-2 text-sm text-gray-700 border-b\">${cell}</td>` }); html += '</tr>' })
          html += '</tbody></table></div>'
          return html
        } catch (error) {
          console.error('Table parsing error:', error)
          return match // Return original if parsing fails
        }
      })
      
      // Alternative table parsing for malformed tables
      const alternativeTableRegex = /Here are the top raiders by total points scored:\s*\n\s*\n((?:\|.*\|\n?)+)/g
      formattedText = formattedText.replace(alternativeTableRegex, (match, tableContent) => {
        try {
          const lines = tableContent.trim().split('\n').filter(line => line.trim())
          if (lines.length < 3) return match
          
          // Extract headers from first line
          const headerLine = lines[0]
          const headerCells = headerLine.split('|').map(h => h.trim()).filter(h => h)
          
          // Extract data rows (skip header and separator lines)
          const dataRows = lines.slice(2).map(line => {
            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell)
            return cells
          }).filter(row => row.length > 0)
          
          if (headerCells.length === 0 || dataRows.length === 0) {
            return match
          }
          
          // Find Raid ID column index to exclude it
          const raidIdIndex = headerCells.findIndex(header => 
            header.toLowerCase().includes('raid id') || header.toLowerCase().includes('raid_id')
          )
          
          // Filter out Raid ID column from headers and rows
          const filteredHeaders = headerCells.filter((_, index) => index !== raidIdIndex)
          const filteredRows = dataRows.map(row => row.filter((_, index) => index !== raidIdIndex))
          
          // Try to build cards first; fallback to table if not a raids table
          const cards = buildRaidsCardsHtml(filteredHeaders, filteredRows)
          if (cards) return cards

          let html = '<div class="overflow-x-auto my-4"><table class="min-w-full border border-gray-200 rounded-lg">'
          html += '<thead class="bg-gray-50"><tr>'
          filteredHeaders.forEach(header => { html += `<th class=\"px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b\">${header}</th>` })
          html += '</tr></thead><tbody>'
          filteredRows.forEach((row, index) => { html += `<tr class=\"${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}\">`; row.forEach((cell) => { html += `<td class=\"px-4 py-2 text-sm text-gray-700 border-b\">${cell}</td>` }); html += '</tr>' })
          html += '</tbody></table></div>'
          return html
        } catch (error) {
          console.error('Alternative table parsing error:', error)
          return match
        }
      })
      
      // General table parsing for any markdown table
      const generalTableRegex = /((?:\|.*\|\n?)+)/g
      formattedText = formattedText.replace(generalTableRegex, (match) => {
        // Skip if already processed by other table parsers
        if (match.includes('<table')) return match
        
        try {
          const lines = match.trim().split('\n').filter(line => line.trim() && line.includes('|'))
          if (lines.length < 3) return match
          
          // Check if it's a proper table structure
          const firstLine = lines[0]
          const secondLine = lines[1]
          
          // Skip if second line doesn't look like a separator
          if (!secondLine.match(/^\|[\s\-:|]+\|$/)) return match
          
          // Extract headers from first line
          const headerCells = firstLine.split('|').map(h => h.trim()).filter(h => h)
          
          // Extract data rows (skip header and separator lines)
          const dataRows = lines.slice(2).map(line => {
            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell)
            return cells
          }).filter(row => row.length > 0 && row.length === headerCells.length)
          
          if (headerCells.length === 0 || dataRows.length === 0) {
            return match
          }
          
          // Find Raid ID column index to exclude it
          const raidIdIndex = headerCells.findIndex(header => 
            header.toLowerCase().includes('raid id') || header.toLowerCase().includes('raid_id')
          )
          
          // Filter out Raid ID column from headers and rows
          const filteredHeaders = headerCells.filter((_, index) => index !== raidIdIndex)
          const filteredRows = dataRows.map(row => row.filter((_, index) => index !== raidIdIndex))
          
          // Try to build cards first; fallback to table if not a raids table
          const cards = buildRaidsCardsHtml(filteredHeaders, filteredRows)
          if (cards) return cards

          let html = '<div class="overflow-x-auto my-4"><table class="min-w-full border border-gray-200 rounded-lg">'
          html += '<thead class="bg-gray-50"><tr>'
          filteredHeaders.forEach(header => { html += `<th class=\"px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b\">${header}</th>` })
          html += '</tr></thead><tbody>'
          filteredRows.forEach((row, index) => { html += `<tr class=\"${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}\">`; row.forEach((cell) => { html += `<td class=\"px-4 py-2 text-sm text-gray-700 border-b\">${cell}</td>` }); html += '</tr>' })
          html += '</tbody></table></div>'
          return html
        } catch (error) {
          console.error('General table parsing error:', error)
          return match
        }
      })
      
      // Handle bold text
      formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Handle bullet points
      formattedText = formattedText.replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      formattedText = formattedText.replace(/(<li.*<\/li>)/s, '<ul class="list-disc pl-4 my-2">$1</ul>')
      
      // Handle line breaks for non-table content
      // Skip line break replacement to avoid breaking HTML structure
      // formattedText = formattedText.replace(/\n(?![^<]*>)/g, '<br>')
      
      return formattedText
    }

    return (
      <div 
        className="prose prose-sm max-w-none whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
    )
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-orange-50/90 via-red-50/90 to-yellow-50/90 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        sidebarHidden 
          ? 'hidden' 
          : sidebarOpen 
            ? 'fixed inset-y-0 left-0 z-50 w-64 lg:relative lg:z-auto lg:w-64' 
            : 'hidden lg:flex lg:w-64'
      }`}>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/KabaddiGuru Logo.jpeg" 
                  alt="KabaddiGuru Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-gray-900">KabaddiGuru</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={startNewChat}
                className={`${isLimitReached ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'}`}
                disabled={isLimitReached}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarHidden(true)}
                className="text-gray-600 hover:text-gray-900 hidden lg:flex"
                title="Hide sidebar"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-600 hover:text-gray-900 lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <nav className="space-y-1">
              <Link href="/" className="flex items-center space-x-2 px-2 py-2 text-sm rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 text-gray-700 hover:text-green-700 transition-all duration-300 hover:scale-105 hover:shadow-sm">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link href="/dashboard" className="flex items-center space-x-2 px-2 py-2 text-sm rounded-lg hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 text-gray-700 hover:text-violet-700 transition-all duration-300 hover:scale-105 hover:shadow-sm">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/analytics" className="flex items-center space-x-2 px-2 py-2 text-sm rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-sm">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics Tool</span>
              </Link>
              {/* <Link href="/upload" className="flex items-center space-x-2 px-2 py-2 text-sm rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 text-gray-700 hover:text-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-sm">
                <Upload className="w-4 h-4" />
                <span>Upload Data</span>
              </Link> */}
            </nav>
          </div>

          <div className="space-y-1">
            <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recent Chats
            </div>
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-2 hover:bg-gray-100"
                onClick={() => {
                  setCurrentChatId(chat.id)
                  // Load messages for this chat from storage
                  const mk = getMessagesKey(chat.id)
                  const savedMessages = mk ? localStorage.getItem(mk) : null
                  if (savedMessages) {
                    try {
                      const parsed = JSON.parse(savedMessages)
                      const withDates = parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
                      setMessages(withDates)
                    } catch {}
                  } else {
                    setMessages([{
                      id: "1",
                      content: "Hello! I'm your KabaddiGuru assistant. I can help you analyze player performance, match statistics, team strategies, and much more. What would you like to know about your Kabaddi data?",
                      role: "assistant",
                      timestamp: new Date()
                    }])
                  }
                  setSidebarOpen(false) // Close sidebar on mobile after selection
                }}
              >
                <div className="flex items-start space-x-2 w-full">
                  <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {chat.title || 'Untitled chat'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {chat.lastMessage instanceof Date && !isNaN(chat.lastMessage) 
                        ? chat.lastMessage.toLocaleDateString() 
                        : new Date(chat.lastMessage).toLocaleDateString()}
                    </div>
                  </div>
                  <MoreHorizontal className="w-3 h-3 text-gray-400" />
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - only show when sidebar is hidden */}
        {sidebarHidden && (
          <header className="border-b border-white/20 bg-white/80 backdrop-blur-md shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarHidden(false)}
                    className="text-gray-600 hover:text-violet-600 hover:bg-violet-50 p-2 transition-all duration-300 hover:scale-105"
                    title="Show sidebar"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                  <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
                    <img 
                      src="/KabaddiGuru Logo.jpeg" 
                      alt="KabaddiGuru Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      KabaddiGuru
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      AI Chat Assistant
                    </span>
                  </div>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/" className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-600 transition-all duration-300 hover:scale-105">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                  <Link href="/dashboard" className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg hover:bg-violet-50 text-gray-600 hover:text-violet-600 transition-all duration-300 hover:scale-105">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/analytics" className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics</span>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full shadow-sm ${
                      connectionStatus === "online" 
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200/50" 
                        : connectionStatus === "offline"
                        ? "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200/50"
                        : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200/50"
                    }`}
                  >
                    {connectionStatus === "online" ? (
                      <>
                        <Wifi className="w-3 h-3" />
                        <span className="hidden sm:inline">Online</span>
                      </>
                    ) : connectionStatus === "offline" ? (
                      <>
                        <WifiOff className="w-3 h-3" />
                        <span className="hidden sm:inline">Offline</span>
                      </>
                    ) : (
                      <span className="hidden sm:inline">Connecting...</span>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Mobile header - only show on mobile when sidebar is not open */}
        {!sidebarHidden && (
          <div className="lg:hidden border-b border-gray-200 bg-white p-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src="/KabaddiGuru Logo.jpeg" 
                    alt="KabaddiGuru Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-gray-900">KabaddiGuru</span>
              </div>
              <div className="w-8"></div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Team Selector Banner */}
            <div className="flex items-center justify-between bg-white border rounded-md p-3">
              <div className="text-sm text-gray-700 flex-1 min-w-0">
                <span className="hidden sm:inline">Team context: </span>
                <span className="sm:hidden">Team: </span>
                <div className="flex items-center gap-2 mt-1 sm:mt-0 sm:inline-flex">
                  {selectedTeam && <TeamLogo teamName={selectedTeam} size="sm" />}
                  <span className="font-medium truncate">{selectedTeam || 'Not set'}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsTeamModalOpen(true)} 
                className="text-xs flex-shrink-0 ml-2"
              >
                <span className="hidden sm:inline">{selectedTeam ? 'Change team' : 'Select team'}</span>
                <span className="sm:hidden">{selectedTeam ? 'Change' : 'Select'}</span>
              </Button>
            </div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8">
                    <img 
                      src="/KabaddiGuru Logo.jpeg" 
                      alt="KabaddiGuru Logo" 
                      className="w-full h-full object-cover"
                    />
                  </Avatar>
                )}
                
                <Card className={`w-full max-w-4xl lg:max-w-5xl relative ${
                  message.role === "user" 
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                    : "bg-white border-gray-200"
                }`}>
                  <CardContent className="p-4 lg:p-6">
                    {message.role === "user" ? (
                      <p className="text-sm lg:text-base leading-relaxed">{message.content}</p>
                    ) : (
                      <div>
                        {/* SQL Query Toggle Button - positioned in top-right corner */}
                        {message.sql_query && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSqlQuery(message.id)}
                            className={`absolute top-2 right-2 text-xs flex items-center space-x-1 z-10 ${
                              isLimitReached 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            disabled={isLimitReached}
                          >
                            <Code className="w-3 h-3" />
                            <span className="hidden sm:inline">
                              {expandedSqlQueries.has(message.id) ? "Hide" : "Show"} SQL
                            </span>
                            {expandedSqlQueries.has(message.id) ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                        
                        <FormattedResponse content={message.content} />
                        
                        {/* SQL Query Display */}
                        {message.sql_query && expandedSqlQueries.has(message.id) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="p-3 bg-gray-50 rounded-md border">
                              <p className="text-xs text-gray-500 mb-2 font-medium">Generated SQL Query:</p>
                              <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono bg-white p-2 rounded border overflow-x-auto">
                                {message.sql_query}
                              </pre>
                              {message.response_time && (
                                <p className="text-xs text-gray-400 mt-2">
                                  Executed in {typeof message.response_time === 'number' ? message.response_time.toFixed(2) : message.response_time}s
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Compact Feedback Section - only show for assistant messages (excluding initial greeting) */}
                        {message.role === "assistant" && !message.isError && message.id !== "1" && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            {/* Main feedback row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">Helpful?</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(message.id, 'thumbs_up', message)}
                                  className={`p-1 h-6 w-6 ${
                                    feedbackStates[message.id] === 'thumbs_up' 
                                      ? 'text-green-600 bg-green-50' 
                                      : isLimitReached 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                                  }`}
                                  disabled={feedbackStates[message.id] !== undefined || isLimitReached}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(message.id, 'thumbs_down', message)}
                                  className={`p-1 h-6 w-6 ${
                                    feedbackStates[message.id] === 'thumbs_down' 
                                      ? 'text-red-600 bg-red-50' 
                                      : isLimitReached 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                  }`}
                                  disabled={feedbackStates[message.id] !== undefined || isLimitReached}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                                {feedbackStates[message.id] && (
                                  <span className="text-xs text-green-600 ml-1">✓</span>
                                )}
                              </div>
                              
                              {/* Comment button - only show if no feedback given yet */}
                              {!feedbackStates[message.id] && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFeedbackForm(message.id)}
                                  className={`text-xs h-6 px-2 ${
                                    isLimitReached 
                                      ? 'text-gray-400 cursor-not-allowed' 
                                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                  }`}
                                  disabled={isLimitReached}
                                >
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  Comment
                                </Button>
                              )}
                            </div>
                            
                            {/* Inline feedback form */}
                            {showFeedbackForm[message.id] && (
                              <div className="mt-2 flex items-end space-x-2">
                                <textarea
                                  placeholder={isLimitReached ? "Upgrade to premium to provide feedback..." : "Add your feedback..."}
                                  value={feedbackText[message.id] || ""}
                                  onChange={(e) => {
                                    if (isLimitReached) return
                                    setFeedbackText(prev => ({
                                      ...prev,
                                      [message.id]: e.target.value
                                    }))
                                    // Auto-resize
                                    e.target.style.height = 'auto'
                                    e.target.style.height = Math.min(e.target.scrollHeight, 60) + 'px'
                                  }}
                                  className={`flex-1 p-2 text-xs border border-gray-300 rounded-md resize-none ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  rows={1}
                                  disabled={isLimitReached}
                                />
                                <div className="flex space-x-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleFeedbackForm(message.id)}
                                    className="text-xs h-8 px-2"
                                    disabled={isLimitReached}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFeedback(message.id, 'suggestion', message)}
                                    className="text-xs h-8 px-2"
                                    disabled={!feedbackText[message.id]?.trim() || isLimitReached}
                                  >
                                    Send
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className={`text-xs mt-2 ${
                      message.role === "user" ? "text-orange-100" : "text-gray-500"
                    }`}>
                      {message.timestamp instanceof Date && !isNaN(message.timestamp)
                        ? message.timestamp.toLocaleTimeString()
                        : new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>

                {message.role === "user" && (
                  <Avatar className="w-8 h-8 bg-gray-600">
                    <AvatarFallback>
                      <User className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <img 
                    src="/KabaddiGuru Logo.jpeg" 
                    alt="KabaddiGuru Logo" 
                    className="w-full h-full object-cover"
                  />
                </Avatar>
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Summary Display */}
            {showSummary && summaryData && (
              <div className="max-w-4xl mx-auto mt-6">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <File className="w-5 h-5 mr-2 text-blue-600" />
                        Conversation Summary
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSummary(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Summary Text */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {summaryData.summary}
                        </p>
                      </div>
                      
                      {/* Session Statistics */}
                      {summaryData.session_stats && Object.keys(summaryData.session_stats).length > 0 && (
                        <div className="bg-white p-4 rounded-lg border">
                          <h4 className="font-medium text-gray-900 mb-2">Session Statistics</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Total Questions:</span>
                              <div className="font-medium">{summaryData.session_stats.total_questions || 0}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Total Tokens:</span>
                              <div className="font-medium">{summaryData.session_stats.total_tokens || 0}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Avg Tokens/Question:</span>
                              <div className="font-medium">
                                {summaryData.session_stats.avg_tokens_per_question 
                                  ? Math.round(summaryData.session_stats.avg_tokens_per_question) 
                                  : 0}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Session Duration:</span>
                              <div className="font-medium">
                                {summaryData.session_stats.session_duration 
                                  ? Math.round(summaryData.session_stats.session_duration / 60) + ' min'
                                  : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Conversation Highlights */}
                      {summaryData.conversation_highlights && summaryData.conversation_highlights.length > 0 && (
                        <div className="bg-white p-4 rounded-lg border">
                          <h4 className="font-medium text-gray-900 mb-2">Recent Highlights</h4>
                          <div className="space-y-3">
                            {summaryData.conversation_highlights.slice(0, 3).map((highlight, index) => (
                              <div key={index} className="text-sm border-l-2 border-blue-200 pl-3">
                                <p className="text-gray-700 whitespace-pre-wrap">{highlight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-200 bg-transparent p-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            {/* Chat Limit Banner */}
            <ChatLimitBanner variant="default" />
            
            {/* Enhanced Suggestions Display - Horizontal Scrollable */}
            {(suggestions.length > 0 || suggestionsLoading) && (
              <div className="mb-2 p-1.5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg border border-blue-200/50 backdrop-blur-sm">
                <div className="flex items-center justify-end mb-0.5">
                  {suggestionsLoading && (
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  )}
                </div>
                {/* Horizontal scrollable suggestions for all screen sizes */}
                <div className="overflow-x-auto pb-1">
                  <div className="flex space-x-1.5 min-w-max">
                    {suggestions.slice(0, 8).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(suggestion)}
                        className="text-xs h-7 px-2 py-1 text-left justify-start bg-white/80 hover:bg-blue-50/80 border-blue-200/50 hover:border-blue-300/50 whitespace-nowrap flex-shrink-0 min-w-[180px] max-w-[280px] backdrop-blur-sm"
                        disabled={isLoading}
                      >
                        <div className="truncate">
                          {suggestion.length > 40 ? suggestion.slice(0, 40) + "..." : suggestion}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Summary Limit Warning */}
            {!isAdmin && summaryCount >= maxSummaries && (
              <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold text-xs">!</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-yellow-900">Summary Limit Reached</h3>
                      <p className="text-xs text-yellow-700">You&apos;ve used all {maxSummaries} summary generations. Upgrade to premium for unlimited summaries.</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs px-3 py-1"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}

            {/* Fallback Suggestions - Horizontal Scrollable */}
            {suggestions.length === 0 && !suggestionsLoading && (
              <div className="mb-2 p-1.5 bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-lg border border-orange-200/50 backdrop-blur-sm">
                {/* Horizontal scrollable fallback suggestions for all screen sizes */}
                <div className="overflow-x-auto pb-1">
                  <div className="flex space-x-1.5 min-w-max">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Show me top performing raiders this season")}
                      className="text-xs h-7 px-2 py-1 text-left justify-start bg-white/80 hover:bg-orange-50/80 border-orange-200/50 hover:border-orange-300/50 whitespace-nowrap flex-shrink-0 min-w-[120px] backdrop-blur-sm"
                      disabled={isLoading}
                    >
                      Top Raiders
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Analyze team defensive strategies")}
                      className="text-xs h-7 px-2 py-1 text-left justify-start bg-white/80 hover:bg-orange-50/80 border-orange-200/50 hover:border-orange-300/50 whitespace-nowrap flex-shrink-0 min-w-[120px] backdrop-blur-sm"
                      disabled={isLoading}
                    >
                      Defense Analysis
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Compare match performance trends")}
                      className="text-xs h-7 px-2 py-1 text-left justify-start bg-white/80 hover:bg-orange-50/80 border-orange-200/50 hover:border-orange-300/50 whitespace-nowrap flex-shrink-0 min-w-[120px] backdrop-blur-sm"
                      disabled={isLoading}
                    >
                      Match Trends
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Show team performance statistics")}
                      className="text-xs h-7 px-2 py-1 text-left justify-start bg-white/80 hover:bg-orange-50/80 border-orange-200/50 hover:border-orange-300/50 whitespace-nowrap flex-shrink-0 min-w-[120px] backdrop-blur-sm"
                      disabled={isLoading}
                    >
                      Team Stats
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Analyze player raid success rates")}
                      className="text-xs h-7 px-2 py-1 text-left justify-start bg-white/80 hover:bg-orange-50/80 border-orange-200/50 hover:border-orange-300/50 whitespace-nowrap flex-shrink-0 min-w-[120px] backdrop-blur-sm"
                      disabled={isLoading}
                    >
                      Raid Analysis
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Input Section */}
            <div className="space-y-1">
              {/* Input with send button inside */}
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    // Auto-resize textarea
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
                    // Debounce input changes to prevent rapid requests
                    if (debounceTimer) {
                      clearTimeout(debounceTimer)
                    }
                    const timer = setTimeout(() => {
                      // Auto-suggestions could be triggered here
                    }, 500)
                    setDebounceTimer(timer)
                  }}
                  placeholder="Ask about player stats, match analysis, team performance..."
                  className="w-full min-h-[36px] max-h-[80px] pr-10 resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="absolute bottom-1.5 right-1.5 h-7 w-7 p-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  size="sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Summary Button */}
      <Button
        onClick={handleGenerateSummary}
        disabled={!currentChatId || messages.length <= 1 || isGeneratingSummary || isLimitReached || summaryCount >= maxSummaries}
        className={`fixed bottom-20 right-6 h-12 w-12 rounded-full shadow-lg z-40 transition-all duration-300 ${
          !currentChatId || messages.length <= 1 || isLimitReached || summaryCount >= maxSummaries 
            ? 'opacity-50 cursor-not-allowed bg-gray-400' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:scale-105'
        }`}
        title={!currentChatId || messages.length <= 1 ? "Start a conversation to generate summary" : isGeneratingSummary ? "Generating summary..." : `Generate summary (${summaryCount}/${maxSummaries} used)`}
      >
        <File className="w-5 h-5 text-white" />
      </Button>

      {/* Subscription Modal moved to global layout via ClientGlobalUI */}

      {/* Team Selection Modal (simple inline modal) */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Select your team</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsTeamModalOpen(false)} className="text-gray-500"><X className="w-4 h-4" /></Button>
            </div>
            <p className="text-sm text-gray-600 mb-3">We&apos;ll tailor suggested questions to your team.</p>
            <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
              {/* All teams from TEAM_LOGOS */}
              {Object.keys(TEAM_LOGOS).map((team) => (
                <Button 
                  key={team} 
                  variant={selectedTeam === team ? 'default' : 'outline'} 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => setSelectedTeam(team)}
                >
                  <div className="flex items-center gap-2">
                    <TeamLogo teamName={team} size="sm" />
                    <span>{team}</span>
                  </div>
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Input placeholder="Or type your team name" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} />
              <Button onClick={() => { localStorage.setItem('kabaddi_selected_team', selectedTeam || ''); setIsTeamModalOpen(false); }}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Video Player Modal with iframe */}
      {videoPlayerOpen && selectedVideoData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedVideoData.player} - {selectedVideoData.description}
                </h3>
                <p className="text-sm text-gray-600">
                  Team: {selectedVideoData.team} | Raid: {selectedVideoData.raid_no}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setVideoPlayerOpen(false)
                  setSelectedVideoData(null)
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <iframe
                src={selectedVideoData.video_url}
                width="100%"
                height="400"
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
                title={`${selectedVideoData.player} - ${selectedVideoData.description}`}
              />
            </div>
          </div>
        </div>
      )}


    </div>
    </AuthWrapper>
  )
}
