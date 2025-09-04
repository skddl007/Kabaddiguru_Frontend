"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, Search, Loader2, AlertCircle, CheckCircle, ArrowLeft, TrendingUp, Target, Award, Menu, X, LogOut, Filter, Play, Shield, Zap, ChevronDown, ChevronUp, X as XIcon, Calendar, Trophy, Users2, TrendingDown } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import AuthWrapper from "@/components/AuthWrapper"
import ChatLimitBanner from "@/components/ChatLimitBanner"
import { useUser } from "@/contexts/UserContext"
import MobileMenu from "@/components/MobileMenu"
import SubscriptionModal from "@/components/SubscriptionModal"
import VideoPlayer from "@/components/VideoPlayer"


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Team code to full name mapping
const TEAM_NAMES = {
  'TT': 'Telugu Titans',
  'BB': 'Bengaluru Bulls',
  'BW': 'Bengal Warriors',
  'DD': 'Dabang Delhi',
  'GG': 'Gujarat Giants',
  'HS': 'Haryana Steelers',
  'JP': 'Jaipur Pink Panthers',
  'PP': 'Patna Pirates',
  'PU': 'Puneri Paltan',
  'TN': 'Tamil Thalaivas',
  'UM': 'U Mumba',
  'UP': 'U.P. Yoddhas'
}

// Team logo mapping with actual image paths
const TEAM_LOGOS = {
  'TT': '/team-logos/Telugu Titans.jpeg',
  'BB': '/team-logos/Bengaluru Bulls.png',
  'BW': '/team-logos/Bengal Warriors.png',
  'DD': '/team-logos/Dabang Delhi.jpeg',
  'GG': '/team-logos/Gujarat Giants.jpeg',
  'HS': '/team-logos/Haryana Steelers.jpeg',
  'JP': '/team-logos/Jaipur Pink Panthers.png',
  'PP': '/team-logos/Patna Pirates.jpeg',
  'PU': '/team-logos/Puneri Paltan.jpeg',
  'TN': '/team-logos/Tamil Thalaivas.png',
  'UM': '/team-logos/U Mumba.png',
  'UP': '/team-logos/U.P. Yoddhas.jpeg'
}

// TeamLogo component for consistent team logo display
const TeamLogo = ({ teamCode, size = 'md', showFallback = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  const logoPath = TEAM_LOGOS[teamCode]
  
  if (logoPath) {
    return (
      <img 
        src={logoPath} 
        alt={`${teamCode} logo`}
        className={`${sizeClasses[size]} object-cover rounded-full shadow-lg border-2 border-white/20 hover:scale-105 transition-transform duration-200 ${className}`}
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
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white/20 ${className}`}>
        {teamCode}
      </div>
    )
  }
  
  return null
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [filterLimitInfo, setFilterLimitInfo] = useState(null)
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false)
  const [selectedRaid, setSelectedRaid] = useState(null)

  // Main overview data
  const [seasonOverview, setSeasonOverview] = useState(null)
  const [pointsTable, setPointsTable] = useState([])
  const [teamPerformance, setTeamPerformance] = useState([])
  const [tableSearch, setTableSearch] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("11")



  const { user, logout, isAuthenticated, token } = useUser()

  const cleanPlayerName = (name) => {
    if (!name) return 'Unknown Player'
    
    // Extract the first part before underscore (actual player name)
    const parts = name.split('_')
    return parts[0] || 'Unknown Player'
  }

  const handleWatchVideo = (raid) => {
    setSelectedRaid(raid)
    setVideoPlayerOpen(true)
  }



  // Load initial data
  useEffect(() => {
    if (isAuthenticated && token) {
      // loadInitialData() // Commented out filter options loading
      checkFilterLimit()
    }
    // Always load main overview regardless of auth (overview endpoints are public)
    loadMainOverview(selectedSeason)
  }, [isAuthenticated, token])

  useEffect(() => {
    // Reload overview when season changes
    loadMainOverview(selectedSeason)
  }, [selectedSeason])

  // loadInitialData archived to separate file

  const checkFilterLimit = async () => {
    try {
      const response = await fetch(`/api/dashboard/filter-limit`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setFilterLimitInfo(data)
        
        // Show upgrade modal if limit reached and user is not premium/admin
        if (!data.can_filter && !data.is_admin) {
          setShowUpgradeModal(true)
        }
      }
    } catch (error) {
      console.error('Error checking filter limit:', error)
    }
  }

  const loadMainOverview = async (season) => {
    setIsLoading(true)
    setError(null)
    try {
      // Load Season 11 overview
      const authHeaders = token ? { "Authorization": `Bearer ${token}` } : {}
      const [seasonRes, tableRes, perfRes] = await Promise.all([
        fetch(`/api/dashboard/overview/season-stats?season=${selectedSeason}`, { headers: { ...authHeaders } }),
        fetch(`/api/dashboard/overview/points-table?season=${selectedSeason}`, { headers: { ...authHeaders } }),
        fetch(`/api/dashboard/overview/team-performance?season=${selectedSeason}`, { headers: { ...authHeaders } }),
      ])
      // Season stats
      if (seasonRes.ok) {
        const data = await seasonRes.json()
        setSeasonOverview(data)
      } else {
        const text = await seasonRes.text()
        console.error('Season stats error', seasonRes.status, text)
        setSeasonOverview(null)
        setError('Failed to load season statistics')
      }
      // Points table
      if (tableRes.ok) {
        const data = await tableRes.json()
        setPointsTable(data.table || [])
      } else {
        const text = await tableRes.text()
        console.error('Points table error', tableRes.status, text)
        setPointsTable([])
        setError(prev => prev || 'Failed to load points table')
      }
      // Team performance
      if (perfRes.ok) {
        const data = await perfRes.json()
        setTeamPerformance(data.performance || [])
      } else {
        const text = await perfRes.text()
        console.error('Team performance error', perfRes.status, text)
        setTeamPerformance([])
        setError(prev => prev || 'Failed to load team performance')
      }
    } catch (e) {
      console.error('Failed to load main overview', e)
      setError('Failed to load dashboard overview')
    } finally {
      setIsLoading(false)
    }
  }

  // Filters logic archived to separate file

  return (
    <AuthWrapper>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  KabaddiGuru
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Analytics Dashboard
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300 hover:scale-105">Home</Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost" className="text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300 hover:scale-105">Chat</Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 hover:scale-105">Analytics Tool</Button>
              </Link>
              <Link href="/matches">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105">Matches</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 font-medium border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Dashboard
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {(() => {
                    const displayName = user?.full_name || user?.name || user?.username || (user?.email ? user.email.split('@')[0] : "User")
                    return (
                      <span className="text-sm text-gray-600 truncate max-w-[160px] md:max-w-[220px]" title={`Welcome, ${displayName}`}>Welcome, {displayName}</span>
                    )
                  })()}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={logout}
                    className="flex items-center space-x-2 border-gray-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/">
                    <Button variant="outline" className="font-medium border-gray-300 hover:border-violet-400 hover:text-violet-600 transition-all duration-300">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)}
            onAuthModalOpen={(mode) => {
              // Handle auth modal if needed
            }}
            currentPage="dashboard"
          />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Chat Limit Banner */}
        <ChatLimitBanner variant="compact" />



        {/* Filter Limit Banner */}
        {filterLimitInfo && !filterLimitInfo.can_filter && !filterLimitInfo.is_admin && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium text-sm">Dashboard Filtering Limit Reached</span>
            </div>
            <p className="text-red-600 text-sm mt-2">
              You've used {filterLimitInfo.filter_count} of {filterLimitInfo.max_filters} filter attempts. 
              Upgrade to premium for unlimited dashboard filtering.
            </p>
            <Button 
              onClick={() => setShowUpgradeModal(true)}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white h-8 px-4 text-sm"
              size="sm"
            >
              Upgrade Now
            </Button>
          </div>
        )}

        {/* Premium User Banner */}
        {filterLimitInfo && filterLimitInfo.is_admin && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <Shield className="h-5 w-5" />
                <span className="font-medium text-sm">Premium Dashboard Access</span>
              </div>
              <Badge variant="outline" className="text-green-600 text-xs border-green-300">
                Unlimited Filters
              </Badge>
            </div>
            <p className="text-green-600 text-sm mt-2">
              You have unlimited dashboard filtering access with your premium subscription.
            </p>
          </div>
        )}

        {/* Main Dashboard Content */}
        <div className="max-w-7xl mx-auto">
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Dashboard Overview */}
          {!dashboardData && !error && !isLoading && (
              <div className="space-y-8">
              {/* Header Section */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Season Dashboard</h1>
                    <p className="text-gray-600 font-medium">{`Comprehensive overview of Season ${selectedSeason} performance`}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  {/* Matches and Players Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:text-blue-800 transition-all duration-300 hover:scale-105 shadow-md"
                      onClick={() => router.push('/matches')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      View All Matches
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 hover:text-green-800 transition-all duration-300 hover:scale-105 shadow-md"
                      onClick={() => router.push('/players')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Players
                    </Button>
                  </div>
                  
                  {/* Season Selection */}
                  <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger className="w-full md:w-32 border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11">Season 11</SelectItem>
                      <SelectItem value="10">Season 10</SelectItem>
                      <SelectItem value="9">Season 9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Season Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group relative border-0 shadow-xl bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                  {/* Rotating border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-[2px] bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-lg"></div>
                  <CardContent className="pt-6 pb-6 text-center relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700 mb-2">{seasonOverview?.totalMatches ?? '-'}</div>
                    <div className="text-sm font-medium text-blue-600 mb-1">Total Matches</div>
                    <div className="flex items-center justify-center gap-1 text-xs text-blue-500">
                      <span>Season {selectedSeason}</span>
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative border-0 shadow-xl bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                  {/* Rotating border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-[2px] bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 rounded-lg"></div>
                  <CardContent className="pt-6 pb-6 text-center relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-purple-700 mb-2">{seasonOverview?.avgRaidPoint ?? '-'}</div>
                    <div className="text-sm font-medium text-purple-600 mb-1">Average Raid Point</div>
                    <div className="flex items-center justify-center gap-1 text-xs text-purple-500">
                      <span>Season {selectedSeason}</span>
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative border-0 shadow-xl bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                  {/* Rotating border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-[2px] bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 rounded-lg"></div>
                  <CardContent className="pt-6 pb-6 text-center relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-orange-700 mb-2">{seasonOverview?.avgTacklePoint ?? '-'}</div>
                    <div className="text-sm font-medium text-orange-600 mb-1">Average Tackle Point</div>
                    <div className="flex items-center justify-center gap-1 text-xs text-orange-500">
                      <span>Season {selectedSeason}</span>
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative border-0 shadow-xl bg-gradient-to-br from-red-50 via-red-100 to-pink-100 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                  {/* Rotating border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-[2px] bg-gradient-to-br from-red-50 via-red-100 to-pink-100 rounded-lg"></div>
                  <CardContent className="pt-6 pb-6 text-center relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-red-700 mb-2">{seasonOverview?.avgBonusPoint ?? '-'}</div>
                    <div className="text-sm font-medium text-red-600 mb-1">Average Bonus Point</div>
                    <div className="flex items-center justify-center gap-1 text-xs text-red-500">
                      <span>Season {selectedSeason}</span>
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Points Table */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-500 hover:shadow-2xl">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-md">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">Points Table</CardTitle>
                    </div>
                    <div className="w-80">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={tableSearch}
                          onChange={(e) => setTableSearch(e.target.value)}
                          placeholder="Filter by team name..."
                          className="pl-10 h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300 hover:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Pos ▲</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Team</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Played</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">W</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">L</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">T</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Pts</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pointsTable
                          .filter(r => (tableSearch ? (r.team || '').toLowerCase().includes(tableSearch.toLowerCase()) : true))
                          .map((row, index) => {
                            // Determine row styling based on status
                            let rowBgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                            let rowBorderClass = 'border-gray-100'
                            let rowHoverClass = 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
                            
                            if (row.status === 'Champion') {
                              rowBgClass = 'bg-gradient-to-r from-yellow-50 to-amber-50'
                              rowBorderClass = 'border-yellow-200'
                              rowHoverClass = 'hover:bg-gradient-to-r hover:from-yellow-100 hover:to-amber-100'
                            } else if (row.status === 'Runner-up') {
                              rowBgClass = 'bg-gradient-to-r from-gray-50 to-slate-50'
                              rowBorderClass = 'border-gray-200'
                              rowHoverClass = 'hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100'
                            } else if (row.status === 'Semi-finalist') {
                              rowBgClass = 'bg-gradient-to-r from-blue-50 to-indigo-50'
                              rowBorderClass = 'border-blue-200'
                              rowHoverClass = 'hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100'
                            } else if (row.status === 'Playoff') {
                              rowBgClass = 'bg-gradient-to-r from-green-50 to-emerald-50'
                              rowBorderClass = 'border-green-200'
                              rowHoverClass = 'hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100'
                            }
                            
                            return (
                              <tr key={row.pos} className={`border-b ${rowBorderClass} ${rowBgClass} ${rowHoverClass} transition-all duration-300`}>
                                <td className="py-4 px-4 font-semibold text-gray-900">{row.pos}</td>
                                                                 <td className="py-4 px-4">
                                   <div className="flex items-center gap-3">
                                     <TeamLogo teamCode={row.teamCode} size="md" />
                                     <div className="flex flex-col">
                                       <span className="font-medium text-gray-900">{row.team}</span>
                                       <span className="text-xs text-gray-500 font-medium">{row.teamCode}</span>
                                     </div>
                                   </div>
                                 </td>
                                <td className="py-4 px-4 text-gray-700">{row.played ?? '-'}</td>
                                <td className="py-4 px-4 text-gray-700">{row.wins ?? '-'}</td>
                                <td className="py-4 px-4 text-gray-700">{row.losses ?? '-'}</td>
                                <td className="py-4 px-4 text-gray-700">{row.ties ?? '-'}</td>
                                <td className="py-4 px-4 text-gray-700">{row.points ?? '-'}</td>
                                <td className="py-4 px-4">
                                  {row.status ? (
                                    <Badge 
                                      variant="outline" 
                                      className={`px-3 py-1 text-xs font-medium transition-all duration-300 hover:scale-105 ${
                                        row.status === 'Champion' ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 font-bold' :
                                        row.status === 'Runner-up' ? 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300 font-bold' :
                                        row.status === 'Semi-finalist' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300 font-bold' :
                                        row.status === 'Playoff' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 font-bold' :
                                        'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300'
                                      }`}
                                    >
                                      {row.status === 'Champion' ? '🏆 ' + row.status : 
                                       row.status === 'Runner-up' ? '🥈 ' + row.status :
                                       row.status === 'Semi-finalist' ? '🥉 ' + row.status :
                                       row.status === 'Playoff' ? '🎯 ' + row.status :
                                       row.status}
                                    </Badge>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        {pointsTable.length === 0 && (
                          <tr>
                            <td className="py-8 text-center text-gray-500" colSpan={8}>
                              <div className="flex flex-col items-center gap-2">
                                <Trophy className="h-8 w-8 text-gray-300" />
                                <span>No points table data available</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Team Performance */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-500 hover:shadow-2xl">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                      <Users2 className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">Team Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {(() => {
                    const maxRaidPoints = Math.max(
                      1,
                      ...teamPerformance.map((t) => (t?.totalRaidPoints ?? 0))
                    )
                    return (
                      <div className="space-y-4">
                        {teamPerformance.map((team, index) => {
                          const value = team?.totalRaidPoints ?? 0
                          const percent = Math.min(100, Math.round((value / maxRaidPoints) * 100))
                          const colorClass =
                            index === 0
                              ? 'from-amber-500 via-yellow-500 to-orange-500'
                              : index === 1
                              ? 'from-gray-400 via-gray-500 to-gray-600'
                              : index === 2
                              ? 'from-orange-500 via-orange-600 to-red-500'
                              : 'from-violet-500 via-purple-500 to-indigo-500'
                          return (
                            <div key={team.teamCode} className="p-5 rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 hover:border-gray-300">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <TeamLogo teamCode={team.teamCode} size="lg" />
                                    {/* Position indicator */}
                                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                                      index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                      index === 2 ? 'bg-gradient-to-r from-orange-500 to-red-600' :
                                      'bg-gradient-to-r from-violet-500 to-purple-600'
                                    }`}>
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900 text-lg">{team.team}</div>
                                    <div className="text-xs text-gray-500 font-medium">{team.teamCode}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-gray-900">{value.toLocaleString()}</div>
                                  <div className="text-xs text-gray-500 font-medium">Raid Points</div>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="h-3 w-full rounded-full bg-gray-200 shadow-inner" />
                                <div
                                  className={`h-3 rounded-full bg-gradient-to-r ${colorClass} shadow-sm transition-all duration-1000 ease-out`}
                                  style={{ width: `${percent}%`, marginTop: -12 }}
                                />
                                <div className="mt-2 flex justify-between items-center">
                                  <div className="text-xs text-gray-500 font-medium">{percent}% of top performer</div>
                                  <div className={`text-xs font-semibold ${
                                    index === 0 ? 'text-amber-600' :
                                    index === 1 ? 'text-gray-600' :
                                    index === 2 ? 'text-orange-600' :
                                    'text-violet-600'
                                  }`}>
                                    {index === 0 ? '🥇 Leader' : index === 1 ? '🥈 Runner-up' : index === 2 ? '🥉 Third' : `#${index + 1}`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {teamPerformance.length === 0 && (
                          <div className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Users2 className="h-8 w-8 text-gray-300" />
                              <span className="text-gray-500">No team performance data available</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>

            </div>
          )}

          {/* Filtered Results (when filters are applied) */}
          {dashboardData && (
            <div className="space-y-6">
              {/* Statistics Overview */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    Filtered Results Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">{dashboardData.statistics?.totalRaids || 0}</div>
                      <div className="text-sm text-gray-600">Total Raids</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">{dashboardData.statistics?.successfulRaids || 0}</div>
                      <div className="text-sm text-gray-600">Successful Raids</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">{dashboardData.statistics?.totalPoints || 0}</div>
                      <div className="text-sm text-gray-600">Total Points</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600">{dashboardData.statistics?.uniquePlayers || 0}</div>
                      <div className="text-sm text-gray-600">Unique Players</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Raids Data */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Play className="h-6 w-6 text-green-600" />
                    Raids Data ({dashboardData.raids?.length || 0} raids)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {dashboardData.raids && dashboardData.raids.length > 0 ? (
                      dashboardData.raids.map((raid, index) => (
                        <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="p-4">
                            {/* Header with Status and Period */}
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline" className="text-xs border-gray-300">
                                {raid.Game_Half_Period || 'Unknown Period'}
                              </Badge>
                              <Badge 
                                variant={raid.Attack_Result_Status === 'Successful' ? 'default' : 'secondary'}
                                className={`px-2 py-1 text-xs ${
                                  raid.Attack_Result_Status === 'Successful' 
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : 'bg-red-100 text-red-800 border-red-200'
                                }`}
                              >
                                {raid.Attack_Result_Status || 'Unknown Status'}
                              </Badge>
                            </div>

                            {/* Players and Teams */}
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex-1 text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <TeamLogo teamCode={raid.Attacking_Team_Code} size="sm" />
                                    <div className="font-semibold text-gray-900 truncate" title={cleanPlayerName(raid.Attacking_Player_Name)}>
                                      {cleanPlayerName(raid.Attacking_Player_Name)}
                                    </div>
                                    <div className="text-gray-500 truncate">
                                      {TEAM_NAMES[raid.Attacking_Team_Code] || raid.Attacking_Team_Code || 'Unknown Team'}
                                    </div>
                                  </div>
                                </div>
                                <div className="mx-2 text-gray-400 text-xs">VS</div>
                                <div className="flex-1 text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <TeamLogo teamCode={raid.Defending_Team_Code} size="sm" />
                                    <div className="font-semibold text-gray-900 truncate" title={cleanPlayerName(raid.Primary_Defender_Name)}>
                                      {cleanPlayerName(raid.Primary_Defender_Name)}
                                    </div>
                                    <div className="text-gray-500 truncate">
                                      {TEAM_NAMES[raid.Defending_Team_Code] || raid.Defending_Team_Code || 'Unknown Team'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Points */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                              <div className="flex justify-between items-center text-xs">
                                <div className="text-center flex-1">
                                  <div className="font-bold text-gray-900">{raid.Points_Scored_By_Attacker || 0}</div>
                                  <div className="text-gray-600">Attacker</div>
                                </div>
                                <div className="text-gray-400">-</div>
                                <div className="text-center flex-1">
                                  <div className="font-bold text-gray-900">{raid.Points_Scored_By_Defenders || 0}</div>
                                  <div className="text-gray-600">Defenders</div>
                                </div>
                              </div>
                            </div>

                            {/* Watch Button */}
                            <div className="flex justify-center">
                              <Button 
                                className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white py-2 px-4 text-sm w-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                                size="sm"
                                onClick={() => handleWatchVideo(raid)}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <div className="relative">
                                    <Play className="h-4 w-4" />
                                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                                  </div>
                                  <span>Watch Video</span>
                                </div>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <div className="max-w-md mx-auto">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Play className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="text-base font-medium text-gray-900 mb-1">No raids found</h3>
                          <p className="text-gray-500 text-sm">
                            No raids found matching your current filters. Try adjusting your search criteria.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isLoading && (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Dashboard</h3>
                  <p className="text-gray-500 text-sm">
                    Please wait while we fetch your data...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <SubscriptionModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={videoPlayerOpen}
        onClose={() => setVideoPlayerOpen(false)}
        raidId={selectedRaid?.Unique_Raid_Identifier}
        raidData={selectedRaid}
      />
    </div>
    </AuthWrapper>
  )
}
