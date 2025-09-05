"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Search, Loader2, AlertCircle, CheckCircle, Target, Award, Menu, X, LogOut } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import AuthWrapper from "@/components/AuthWrapper"
import ChatLimitBanner from "@/components/ChatLimitBanner"
import { useUser } from "@/contexts/UserContext"
import MobileMenu from "@/components/MobileMenu"
// Removed VideoPlayer import - using simple iframe approach

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

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("match")
  const [isLoading, setIsLoading] = useState(false)
  const [summaryData, setSummaryData] = useState(null)
  const [error, setError] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false)
  const [selectedVideoData, setSelectedVideoData] = useState(null)

  const { user, logout, isAuthenticated } = useUser()

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

  const handleWatchVideo = (video) => {
    setSelectedVideoData({
      video_url: cleanVideoUrl(video.video_url),
      player: cleanPlayerName(video.player),
      team: video.team,
      raid_no: video.raid_no,
      description: video.description || 'Raid Video'
    })
    setVideoPlayerOpen(true)
  }

  // Match-wise summary state
  const [teams, setTeams] = useState([])
  const [selectedTeam1, setSelectedTeam1] = useState("")
  const [selectedTeam2, setSelectedTeam2] = useState("")
  const [matches, setMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState("")

  // Player-wise summary state
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestedPlayers, setSuggestedPlayers] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState("")
  const [matchFilter, setMatchFilter] = useState("all")

  // Load teams on component mount
  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/teams`)
      const data = await response.json()
      if (data.success) {
        setTeams(data.teams)
      }
    } catch (error) {
      console.error('Error loading teams:', error)
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive"
      })
    }
  }

  const loadMatches = async () => {
    if (!selectedTeam1 || !selectedTeam2) return

    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/analytics/matches/${encodeURIComponent(selectedTeam1)}/${encodeURIComponent(selectedTeam2)}`)
      const data = await response.json()
      if (data.success) {
        setMatches(data.matches)
      }
    } catch (error) {
      console.error('Error loading matches:', error)
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const searchPlayers = async (term) => {
    if (!term || term.length < 2) {
      setSuggestedPlayers([])
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/analytics/players/search?search_term=${encodeURIComponent(term)}`)
      const data = await response.json()
      if (data.success) {
        setSuggestedPlayers(data.players)
      }
    } catch (error) {
      console.error('Error searching players:', error)
    }
  }

  const generateMatchSummary = async () => {
    if (!selectedTeam1 || !selectedTeam2 || !selectedMatch) {
      toast({
        title: "Error",
        description: "Please select both teams and a match",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setSummaryData(null)

      const response = await fetch(`${API_BASE_URL}/analytics/match-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team1: selectedTeam1,
          team2: selectedTeam2,
          match_number: parseInt(selectedMatch)
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSummaryData(data.summary)
        toast({
          title: "Success",
          description: "Match summary generated successfully",
        })
      } else {
        setError(data.error || "Failed to generate match summary")
        toast({
          title: "Error",
          description: data.error || "Failed to generate match summary",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error generating match summary:', error)
      setError("Failed to generate match summary")
      toast({
        title: "Error",
        description: "Failed to generate match summary",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generatePlayerSummary = async () => {
    if (!selectedPlayer) {
      toast({
        title: "Error",
        description: "Please select a player",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setSummaryData(null)

      // Generate comprehensive player summary (includes LLM summary)
      const response = await fetch(`${API_BASE_URL}/analytics/player-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_name: selectedPlayer,
          match_filter: matchFilter
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSummaryData(data.summary)
        toast({
          title: "Success",
          description: "Player summary with performance analysis generated successfully",
        })
      } else {
        setError(data.error || "Failed to generate player summary")
        toast({
          title: "Error",
          description: data.error || "Failed to generate player summary",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error generating player summary:', error)
      setError("Failed to generate player summary")
      toast({
        title: "Error",
        description: "Failed to generate player summary",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }



  const handleTeam1Change = (value) => {
    setSelectedTeam1(value)
    setSelectedMatch("")
    setMatches([])
  }

  const handleTeam2Change = (value) => {
    setSelectedTeam2(value)
    setSelectedMatch("")
    setMatches([])
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    searchPlayers(value)
  }

  return (
    <AuthWrapper>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  KabaddiGuru
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Analytics
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost">Chat</Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium">
                  Analytics Tool
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost">Contact</Button>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
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
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/">
                    <Button variant="outline" className="font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
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
            onAuthModalOpen={() => {
              // Handle auth modal if needed
            }}
            currentPage="analytics"
          />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Chat Limit Banner */}
        <ChatLimitBanner variant="compact" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Controls - Fixed */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <Card className="lg:sticky lg:top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Analysis Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="match">Match Analysis</TabsTrigger>
                    <TabsTrigger value="player">Player Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="match" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="team1">Team A</Label>
                      <Select value={selectedTeam1} onValueChange={handleTeam1Change}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Team A">
                            {selectedTeam1 && (
                              <div className="flex items-center gap-2">
                                <TeamLogo teamCode={selectedTeam1} size="sm" />
                                <span>{TEAM_NAMES[selectedTeam1] || selectedTeam1}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team} value={team}>
                              <div className="flex items-center gap-2">
                                <TeamLogo teamCode={team} size="sm" />
                                <span>{TEAM_NAMES[team] || team}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="team2">Team B</Label>
                      <Select value={selectedTeam2} onValueChange={handleTeam2Change}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Team B">
                            {selectedTeam2 && (
                              <div className="flex items-center gap-2">
                                <TeamLogo teamCode={selectedTeam2} size="sm" />
                                <span>{TEAM_NAMES[selectedTeam2] || selectedTeam2}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team} value={team}>
                              <div className="flex items-center gap-2">
                                <TeamLogo teamCode={team} size="sm" />
                                <span>{TEAM_NAMES[team] || team}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedTeam1 && selectedTeam2 && (
                      <Button 
                        onClick={loadMatches} 
                        disabled={isLoading}
                        className="w-full"
                        variant="outline"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load Matches"}
                      </Button>
                    )}

                    {matches.length > 0 && (
                      <div>
                        <Label htmlFor="match">Select Match</Label>
                        <Select value={selectedMatch} onValueChange={setSelectedMatch}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Match" />
                          </SelectTrigger>
                          <SelectContent>
                            {matches.map((match) => (
                              <SelectItem key={match.Match_Number} value={match.Match_Number.toString()}>
                                Match {match.Match_Number} - {match.Season} - {match.Venue}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedMatch && (
                      <Button 
                        onClick={generateMatchSummary} 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Match Summary"}
                      </Button>
                    )}
                  </TabsContent>

                  <TabsContent value="player" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="player-search">Search Player</Label>
                      <div className="relative">
                        <Input
                          id="player-search"
                          placeholder="Type player name..."
                          value={searchTerm}
                          onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                      
                      {suggestedPlayers.length > 0 && (
                        <div className="mt-2 border rounded-md p-2 max-h-40 overflow-y-auto">
                          {suggestedPlayers.map((player) => (
                            <div
                              key={player}
                              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                              onClick={() => {
                                setSelectedPlayer(player)
                                setSearchTerm(player)
                                setSuggestedPlayers([])
                              }}
                            >
                              {player}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedPlayer && (
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <Label className="text-sm text-blue-600 font-medium">Selected Player</Label>
                          <div className="text-lg font-semibold text-gray-900 mt-1">{selectedPlayer}</div>
                        </div>
                        
                        <div>
                          <Label htmlFor="match-filter">Match Filter</Label>
                          <Select value={matchFilter} onValueChange={setMatchFilter}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Matches</SelectItem>
                              <SelectItem value="last_5_matches">Last 5 Matches</SelectItem>
                              <SelectItem value="last_10_matches">Last 10 Matches</SelectItem>
                              <SelectItem value="first_5_matches">First 5 Matches</SelectItem>
                              <SelectItem value="first_10_matches">First 10 Matches</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {selectedPlayer && (
                      <Button 
                        onClick={generatePlayerSummary} 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Player Summary"}
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

                     {/* Right Panel - Results - Vertically Scrollable */}
           <div className="lg:flex-1 min-w-0">
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {summaryData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Award className="h-5 w-5 text-blue-600" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                     {/* Match Overview - Moved to top */}
                     {summaryData.match_id && (
                       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                         <h3 className="text-lg font-semibold text-gray-900 mb-3">Match Overview</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div>
                             <span className="text-sm text-gray-600">Match ID</span>
                             <div className="font-medium">{summaryData.match_id}</div>
                           </div>
                           <div>
                             <span className="text-sm text-gray-600">Season</span>
                             <div className="font-medium">{summaryData.season}</div>
                           </div>
                           <div>
                             <span className="text-sm text-gray-600">Venue</span>
                             <div className="font-medium">{summaryData.venue}</div>
                           </div>
                           <div>
                             <span className="text-sm text-gray-600">Winner</span>
                             <div className="font-medium text-green-600">{TEAM_NAMES[summaryData.score?.winner] || summaryData.score?.winner}</div>
                           </div>
                         </div>

                         <div className="mt-4 flex items-center justify-center space-x-8">
                           <div className="text-center">
                             <div className="text-2xl font-bold text-blue-600">{TEAM_NAMES[summaryData.teams?.team1] || summaryData.teams?.team1}</div>
                             <div className="text-3xl font-bold">{summaryData.score?.team1}</div>
                           </div>
                           <div className="text-gray-400 text-xl">vs</div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-red-600">{TEAM_NAMES[summaryData.teams?.team2] || summaryData.teams?.team2}</div>
                             <div className="text-3xl font-bold">{summaryData.score?.team2}</div>
                           </div>
                         </div>

                       </div>
                     )}

                     {/* AI-Generated Match Summary */}
                     {summaryData.tactical_analysis && (
                       <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                         <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                           <span className="text-purple-600">🤖</span>
                           AI Match Analysis
                         </h3>
                         <div className="bg-white p-4 rounded-lg border prose prose-sm max-w-none">
                           <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                             {summaryData.tactical_analysis}
                           </div>
                         </div>
                       </div>
                     )}

                     {/* AI-Generated Player Performance Summary */}
                     {summaryData.llm_summary && (
                       <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                         <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                           <span className="text-indigo-600">📊</span>
                           AI-Generated Player Performance Analysis
                         </h3>
                         <div className="mb-4 p-3 bg-indigo-100 rounded-lg">
                           <div className="text-sm text-indigo-800">
                             <strong>Player:</strong> {summaryData.player} | 
                             <strong>Season:</strong> {summaryData.season} | 
                             <strong>Matches Analyzed:</strong> {summaryData.matches ? summaryData.matches.length : 0}
                           </div>
                         </div>
                         <div className="bg-white p-4 rounded-lg border prose prose-sm max-w-none">
                           <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                             {summaryData.llm_summary}
                           </div>
                         </div>
                       </div>
                     )}

                                         {/* Video Content */}
                     {summaryData.super_tackle_videos && summaryData.super_tackle_videos.length > 0 && (
                       <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                         <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                           <span className="text-red-600">⚡</span>
                           Super Tackle Videos ({summaryData.super_tackle_videos.length})
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                                                      {summaryData.super_tackle_videos.slice(0, 2).map((video, index) => (
                             <div key={index} className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow">
                               <div className="flex items-center justify-between mb-2">
                                 <span className="text-sm font-medium text-gray-900">Raid {video.raid_no}</span>
                                 <span className="text-xs text-gray-500">{video.timestamp}</span>
                               </div>
                               <div className="text-sm text-gray-700 mb-2">{cleanPlayerName(video.player)}</div>
                               <div className="text-xs text-gray-600 mb-3">{video.description}</div>
                               <button
                                 onClick={() => handleWatchVideo(video)}
                                 className="video-button inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-0 button-glow"
                               >
                                 <div className="relative icon-bounce">
                                   <span className="text-lg">⚡</span>
                                   <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                                 </div>
                                 <span>Watch Super Tackle</span>
                               </button>
                             </div>
                           ))}
                           {summaryData.super_tackle_videos.length > 2 && (
                             <div className="col-span-full">
                               <details className="group">
                                 <summary className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700 text-center py-2">
                                   <span className="group-open:hidden">📺 Show {summaryData.super_tackle_videos.length - 2} More Super Tackle Videos</span>
                                   <span className="hidden group-open:inline">📺 Hide Additional Videos</span>
                                 </summary>
                                 <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {summaryData.super_tackle_videos.slice(2).map((video, index) => (
                                     <div key={index + 2} className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow">
                                       <div className="flex items-center justify-between mb-2">
                                         <span className="text-sm font-medium text-gray-900">Raid {video.raid_no}</span>
                                         <span className="text-xs text-gray-500">{video.timestamp}</span>
                                       </div>
                                       <div className="text-sm text-gray-700 mb-2">{cleanPlayerName(video.player)}</div>
                                       <div className="text-xs text-gray-600 mb-3">{video.description}</div>
                                       <button
                                         onClick={() => handleWatchVideo(video)}
                                         className="video-button inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-0 button-glow"
                                       >
                                         <div className="relative icon-bounce">
                                           <span className="text-lg">⚡</span>
                                           <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                                         </div>
                                         <span>Watch Super Tackle</span>
                                       </button>
                                     </div>
                                   ))}
                                 </div>
                               </details>
                             </div>
                           )}
                         </div>
                       </div>
                     )}

                     {summaryData.bonus_point_videos && summaryData.bonus_point_videos.length > 0 && (
                       <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                         <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                           <span className="text-green-600">🎯</span>
                           Bonus Point Videos ({summaryData.bonus_point_videos.length})
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                           {summaryData.bonus_point_videos.slice(0, 2).map((video, index) => (
                             <div key={index} className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow">
                               <div className="flex items-center justify-between mb-2">
                                 <span className="text-sm font-medium text-gray-900">Raid {video.raid_no}</span>
                                 <span className="text-xs text-gray-500">{video.timestamp}</span>
                               </div>
                               <div className="text-sm text-gray-700 mb-2">{cleanPlayerName(video.player)}</div>
                               <div className="text-xs text-gray-600 mb-3">{video.description}</div>
                               <button
                                 onClick={() => handleWatchVideo(video)}
                                 className="video-button inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-0 button-glow"
                               >
                                 <div className="relative icon-bounce">
                                   <span className="text-lg">🎯</span>
                                   <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                                 </div>
                                 <span>Watch Bonus Point</span>
                               </button>
                             </div>
                           ))}
                           {summaryData.bonus_point_videos.length > 2 && (
                             <div className="col-span-full">
                               <details className="group">
                                 <summary className="cursor-pointer text-sm font-medium text-green-600 hover:text-green-700 text-center py-2">
                                   <span className="group-open:hidden">📺 Show {summaryData.bonus_point_videos.length - 2} More Bonus Point Videos</span>
                                   <span className="hidden group-open:inline">📺 Hide Additional Videos</span>
                                 </summary>
                                 <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {summaryData.bonus_point_videos.slice(2).map((video, index) => (
                                     <div key={index + 2} className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow">
                                       <div className="flex items-center justify-between mb-2">
                                         <span className="text-sm font-medium text-gray-900">Raid {video.raid_no}</span>
                                         <span className="text-xs text-gray-500">{video.timestamp}</span>
                                       </div>
                                       <div className="text-sm text-gray-700 mb-2">{cleanPlayerName(video.player)}</div>
                                       <div className="text-xs text-gray-600 mb-3">{video.description}</div>
                                       <button
                                         onClick={() => handleWatchVideo(video)}
                                         className="video-button inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-0 button-glow"
                                       >
                                         <div className="relative icon-bounce">
                                           <span className="text-lg">🎯</span>
                                           <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                                         </div>
                                         <span>Watch Bonus Point</span>
                                       </button>
                                     </div>
                                   ))}
                                 </div>
                               </details>
                             </div>
                           )}
                         </div>
                       </div>
                     )}



                    

                    {/* Match Highlights */}
                    {summaryData.match_highlights && summaryData.match_highlights.length > 0 && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-yellow-600">⭐</span>
                          Match Highlights
                        </h3>
                        <ul className="space-y-2">
                          {summaryData.match_highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-yellow-600 mt-1">•</span>
                              <span className="text-sm text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Top Performers */}
                    {(summaryData.top_raiders || summaryData.top_defenders) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {summaryData.top_raiders && summaryData.top_raiders.length > 0 && (
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="text-blue-600">🏃</span>
                              Top Raiders
                            </h3>
                            <div className="space-y-2">
                              {summaryData.top_raiders.slice(0, 3).map((raider, index) => (
                                <div key={index} className="bg-white p-2 rounded border">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-900">{raider.name}</span>
                                    <span className="text-sm font-bold text-blue-600">{raider.raid_points} pts</span>
                                  </div>
                                  <div className="text-xs text-gray-500">Success Rate: {raider.raid_success_rate}%</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {summaryData.top_defenders && summaryData.top_defenders.length > 0 && (
                          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="text-red-600">🛡️</span>
                              Top Defenders
                            </h3>
                            <div className="space-y-2">
                              {summaryData.top_defenders.slice(0, 3).map((defender, index) => (
                                <div key={index} className="bg-white p-2 rounded border">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-900">{defender.name}</span>
                                    <span className="text-sm font-bold text-red-600">{defender.tackle_points} pts</span>
                                  </div>
                                  <div className="text-xs text-gray-500">Success Rate: {defender.tackle_success_rate}%</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Player Match-by-Match Statistics */}
                    {summaryData.matches && summaryData.matches.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-blue-600">🏆</span>
                          Player Match-by-Match Performance
                        </h3>
                        <div className="space-y-3">
                          {summaryData.matches.map((match, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-900">Match {match.match_number}</h4>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    match.result.status === 'Win' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {match.result.status}
                                  </span>
                                  <span className="text-sm text-gray-600">vs {match.opponent_team}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-600">{match.raid_stats.raid_points}</div>
                                  <div className="text-xs text-gray-600">Raid Points</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-green-600">{match.raid_stats.successful_raids}/{match.raid_stats.total_raids}</div>
                                  <div className="text-xs text-gray-600">Successful Raids</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-red-600">{match.tackle_stats.tackle_points}</div>
                                  <div className="text-xs text-gray-600">Tackle Points</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-purple-600">{match.tackle_stats.successful_tackles}/{match.tackle_stats.total_tackles}</div>
                                  <div className="text-xs text-gray-600">Successful Tackles</div>
                                </div>
                              </div>
                              
                              {match.achievements.milestones.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {match.achievements.milestones.map((milestone, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                      {milestone}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Match Statistics */}
                    {summaryData.summary && (
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-gray-600">📊</span>
                          Match Statistics
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white p-3 rounded border text-center">
                            <div className="text-2xl font-bold text-blue-600">{summaryData.summary.total_raids}</div>
                            <div className="text-xs text-gray-600">Total Raids</div>
                          </div>
                          <div className="bg-white p-3 rounded border text-center">
                            <div className="text-2xl font-bold text-green-600">{summaryData.summary.raid_success_rate}%</div>
                            <div className="text-xs text-gray-600">Raid Success</div>
                          </div>
                          <div className="bg-white p-3 rounded border text-center">
                            <div className="text-2xl font-bold text-red-600">{summaryData.summary.super_tackles}</div>
                            <div className="text-xs text-gray-600">Super Tackles</div>
                          </div>
                          <div className="bg-white p-3 rounded border text-center">
                            <div className="text-2xl font-bold text-purple-600">{summaryData.summary.tackle_success_rate}%</div>
                            <div className="text-xs text-gray-600">Tackle Success</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Raw JSON Data (Collapsible) */}
                     <div className="border-t pt-4">
                       <details className="group">
                         <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                           <span className="group-open:hidden">📄 Show Raw Data</span>
                           <span className="hidden group-open:inline">📄 Hide Raw Data</span>
                         </summary>
                         <div className="mt-3 max-h-96 overflow-y-auto">
                           <pre className="text-xs bg-gray-100 p-4 rounded-md overflow-x-auto">
                             {JSON.stringify(summaryData, null, 2)}
                           </pre>
                         </div>
                       </details>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             )}

            {!summaryData && !error && (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                    <p className="text-gray-500">
                      Select your analysis type and parameters to generate comprehensive insights.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>

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
