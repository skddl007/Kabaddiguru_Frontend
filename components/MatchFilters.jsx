'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { TeamLogo } from './MatchDetails'
import Link from 'next/link'
import MobileMenu from './MobileMenu'
import { 
  Search, 
  Users, 
  ArrowLeft, 
  Filter, 
  Eye, 
  Target, 
  Trophy,
  LogOut,
  Menu,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react'

// Team names mapping - using uppercase codes to match database
const TEAM_NAMES = {
  'BW': 'Bengal Warriors',
  'BB': 'Bengaluru Bulls',
  'DD': 'Dabang Delhi',
  'GG': 'Gujarat Giants',
  'HS': 'Haryana Steelers',
  'JP': 'Jaipur Pink Panthers',
  'PP': 'Patna Pirates',
  'PU': 'Puneri Paltan',
  'TN': 'Tamil Thalaivas',
  'TT': 'Telugu Titans',
  'UM': 'U Mumba',
  'UP': 'U.P. Yoddhas'
}

export default function MatchFilters({ user, logout, onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!user)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('filters')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [matches, setMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false)
  const [selectedVideoData, setSelectedVideoData] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [isLoadingVideo, setIsLoadingVideo] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    tournament: 'pk',
    season: '11',
    team: '',
    opponentTeam: 'all'
  })

  const loadMatches = useCallback(async () => {
    if (!filters.tournament || !filters.season || !filters.team || !filters.opponentTeam || filters.opponentTeam === 'all') {
      toast({
        title: "Missing Filters",
        description: "Please select tournament, season, and both teams to load matches.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams({
        tournament: filters.tournament,
        season: filters.season,
        team: filters.team
      })

      if (filters.opponentTeam !== 'all') {
        queryParams.append('opponent_team', filters.opponentTeam)
      }

      const response = await fetch(`/api/dashboard/matches?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${user?.token || ''}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setMatches(data.matches || [])
      
      // Show appropriate toast based on data source
      if (data.source === 'error') {
        toast({
          title: "Backend Connection Failed",
          description: data.message || "Please ensure the backend server is running.",
          variant: "destructive"
        })
      } else if (data.source === 'backend') {
        toast({
          title: "Matches Loaded",
          description: `Successfully loaded ${data.matches?.length || 0} matches from database.`,
        })
      } else {
        toast({
          title: "Matches Loaded",
          description: `Successfully loaded ${data.matches?.length || 0} matches.`,
        })
      }
    } catch (err) {
      console.error('Error loading matches:', err)
      setError(err.message || 'Failed to load matches')
      toast({
        title: "Error",
        description: err.message || 'Failed to load matches',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters.tournament, filters.season, filters.team, filters.opponentTeam, user?.token])

  // Load matches when filters change - only when both teams are selected
  useEffect(() => {
    if (filters.tournament && filters.season && filters.team && filters.opponentTeam && filters.opponentTeam !== 'all') {
      loadMatches()
    } else {
      // Clear matches when not both teams are selected
      setMatches([])
    }
  }, [loadMatches])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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

  const handleWatchVideo = (match) => {
    if (match.videoUrl) {
      setSelectedVideoData({
        video_url: cleanVideoUrl(match.videoUrl),
        player: 'Match Video',
        team: `${match.teamACode} vs ${match.teamBCode}`,
        raid_no: match.matchNumber,
        description: 'Match Video'
      })
      setVideoPlayerOpen(true)
    } else {
      toast({
        title: "No Video Available",
        description: "This match doesn't have a video available.",
        variant: "destructive"
      })
    }
  }

  const filteredAndSortedMatches = matches
    .filter(match => 
      searchTerm === "" || 
      match.matchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.date?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date) - new Date(a.date)
        case "matchNumber":
          return (a.matchNumber || 0) - (b.matchNumber || 0)
        case "venue":
          return (a.venue || "").localeCompare(b.venue || "")
        case "attendance":
          return (b.attendance || 0) - (a.attendance || 0)
        default:
          return 0
      }
    })

  const getMatchStatus = (match) => {
    if (match.status === 'completed') return { text: 'Completed', variant: 'default', color: 'bg-green-100 text-green-800 border-green-300' }
    if (match.status === 'live') return { text: 'Live', variant: 'default', color: 'bg-red-100 text-red-800 border-red-300' }
    if (match.status === 'scheduled') return { text: 'Scheduled', variant: 'outline', color: 'bg-blue-100 text-blue-800 border-blue-300' }
    return { text: 'Unknown', variant: 'outline', color: 'bg-gray-100 text-gray-800 border-gray-300' }
  }

  const getScoreDisplay = (match) => {
    if (match.teamAScore !== undefined && match.teamBScore !== undefined) {
      return `${match.teamAScore} - ${match.teamBScore}`
    }
    return 'TBD'
  }

  const getWinner = (match) => {
    if (match.teamAScore !== undefined && match.teamBScore !== undefined) {
      if (match.teamAScore > match.teamBScore) return match.teamACode
      if (match.teamBScore > match.teamAScore) return match.teamBCode
      return 'tie'
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">KabaddiGuru</h1>
                <p className="text-sm text-gray-600">Analytics Dashboard</p>
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
                <Button variant="ghost" className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 font-medium border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Matches
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300 hover:scale-105">Dashboard</Button>
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        logout={logout}
      />

      {/* Main Content */}
      <div className="space-y-6">
          {/* Filter Options */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Match Filter Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Tournament</Label>
                  <Select value={filters.tournament} onValueChange={(value) => handleFilterChange('tournament', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pk">Pro Kabaddi League</SelectItem>
                      <SelectItem value="ipl">IPL Kabaddi</SelectItem>
                      <SelectItem value="national">National Championship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Season</Label>
                  <Select value={filters.season} onValueChange={(value) => handleFilterChange('season', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11">Season 11</SelectItem>
                      <SelectItem value="10">Season 10</SelectItem>
                      <SelectItem value="9">Season 9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Team</Label>
                  <Select value={filters.team} onValueChange={(value) => handleFilterChange('team', value)}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2 w-full">
                        {filters.team && <TeamLogo teamCode={filters.team} size="sm" />}
                        <SelectValue placeholder="Select team" className="flex-1" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TEAM_NAMES).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center gap-2">
                            <TeamLogo teamCode={code} size="sm" />
                            {name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Opponent Team</Label>
                  <Select value={filters.opponentTeam} onValueChange={(value) => handleFilterChange('opponentTeam', value)}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2 w-full">
                        {filters.opponentTeam && filters.opponentTeam !== 'all' && <TeamLogo teamCode={filters.opponentTeam} size="sm" />}
                        <SelectValue placeholder="Select opponent team" className="flex-1" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teams</SelectItem>
                      {Object.entries(TEAM_NAMES).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center gap-2">
                            <TeamLogo teamCode={code} size="sm" />
                            {name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Apply Filters Button - Positioned next to Opponent Team */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 opacity-0">Apply</Label>
                  <Button
                    onClick={loadMatches}
                    disabled={isLoading || !filters.tournament || !filters.season || !filters.team}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Apply Filters
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matches Display Section */}
          {matches.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                  Matches Found ({matches.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAndSortedMatches.map((match) => {
                    const isCompleted = match.status === 'completed';
                    const teamAScore = match.teamAScore !== undefined ? match.teamAScore : null;
                    const teamBScore = match.teamBScore !== undefined ? match.teamBScore : null;
                    const teamAWon = isCompleted && teamAScore > teamBScore;
                    const teamBWon = isCompleted && teamBScore > teamAScore;
                    
                    return (
                      <div key={match.id} className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1">
                        {/* Match Header */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={`${isCompleted ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'} px-2 py-1 rounded-full text-xs font-medium`}>
                              {getMatchStatus(match).text}
                            </Badge>
                            <span className="text-xs text-slate-500 font-mono">#{match.matchNumber}</span>
                          </div>
                          
                          {/* Teams - Single Horizontal Line with Text Wrapping */}
                          <div className="flex items-center justify-between mb-3 p-3 bg-white rounded-lg border border-slate-100">
                            {/* Team A */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="relative flex-shrink-0">
                                <TeamLogo teamCode={match.teamACode} size="sm" />
                                {teamAWon && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold text-slate-800 leading-tight">
                                  {(() => {
                                    const teamName = TEAM_NAMES[match.teamACode] || match.teamACode;
                                    const words = teamName.split(' ');
                                    if (words.length > 1 && teamName.length > 12) {
                                      return (
                                        <>
                                          <div>{words[0]}</div>
                                          <div>{words.slice(1).join(' ')}</div>
                                        </>
                                      );
                                    }
                                    return <div>{teamName}</div>;
                                  })()}
                                </div>
                              </div>
                            </div>
                            
                            {/* VS Divider */}
                            <div className="flex items-center justify-center mx-2 flex-shrink-0">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">VS</span>
                              </div>
                            </div>
                            
                            {/* Team B */}
                            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                              <div className="min-w-0 flex-1 text-right">
                                <div className="text-xs font-semibold text-slate-800 leading-tight">
                                  {(() => {
                                    const teamName = TEAM_NAMES[match.teamBCode] || match.teamBCode;
                                    const words = teamName.split(' ');
                                    if (words.length > 1 && teamName.length > 12) {
                                      return (
                                        <>
                                          <div>{words[0]}</div>
                                          <div>{words.slice(1).join(' ')}</div>
                                        </>
                                      );
                                    }
                                    return <div>{teamName}</div>;
                                  })()}
                                </div>
                              </div>
                              <div className="relative flex-shrink-0">
                                <TeamLogo teamCode={match.teamBCode} size="sm" />
                                {teamBWon && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}
                              </div>
                            </div>
                          </div>
                          
                          {/* Final Winning Score */}
                          {isCompleted && (
                            <div className="mb-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-md text-center">
                              <div className="text-sm font-bold text-green-800">
                                {teamAScore !== null && teamAScore !== undefined ? teamAScore : 'TBD'} - {teamBScore !== null && teamBScore !== undefined ? teamBScore : 'TBD'}
                              </div>
                              {teamAWon && (
                                <div className="text-xs text-green-600 mt-1">
                                  {TEAM_NAMES[match.teamACode] || match.teamACode} won
                                </div>
                              )}
                              {teamBWon && (
                                <div className="text-xs text-green-600 mt-1">
                                  {TEAM_NAMES[match.teamBCode] || match.teamBCode} won
                                </div>
                              )}
                              {!teamAWon && !teamBWon && teamAScore === teamBScore && teamAScore !== null && teamBScore !== null && (
                                <div className="text-xs text-green-600 mt-1">
                                  Draw
                                </div>
                              )}
                              {teamAScore === null && teamBScore === null && (
                                <div className="text-xs text-green-600 mt-1">
                                  Score not available
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Venue - Compact */}
                          <div className="text-xs text-slate-600 mb-3 flex items-center gap-1">
                            <span>📍</span>
                            <span className="truncate">{match.venue}</span>
                          </div>
                          
                          {/* Actions - Compact */}
                          <div className="flex gap-2">
                            {match.hasVideo && (
                              <Button
                                onClick={() => handleWatchVideo(match)}
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex-1 shadow-md hover:shadow-lg transition-all duration-200 text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Watch
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Match Details",
                                  description: `Viewing details for Match #${match.matchNumber}`,
                                })
                              }}
                              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-xs"
                            >
                              <Target className="w-3 h-3 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Matches Found */}
          {matches.length === 0 && !isLoading && filters.tournament && filters.season && filters.team && filters.opponentTeam && filters.opponentTeam !== 'all' && (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Matches Found</h3>
                <p className="text-gray-500 mb-4">
                  No matches found between {TEAM_NAMES[filters.team]} and {TEAM_NAMES[filters.opponentTeam]}. Try selecting different teams.
                </p>
                <Button
                  onClick={() => {
                    setFilters({
                      tournament: 'pk',
                      season: '11',
                      team: '',
                      opponentTeam: 'all'
                    })
                    setMatches([])
                  }}
                  variant="outline"
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Select Both Teams Message */}
          {matches.length === 0 && !isLoading && filters.tournament && filters.season && filters.team && (!filters.opponentTeam || filters.opponentTeam === 'all') && (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Both Teams</h3>
                <p className="text-gray-500 mb-4">
                  Please select both teams to view matches between them. Currently showing: {TEAM_NAMES[filters.team]}
                </p>
                <p className="text-sm text-gray-400">
                  Choose an opponent team from the dropdown above to see head-to-head matches.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="border-0 shadow-lg border-red-200">
              <CardContent className="text-center py-8">
                <div className="text-red-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Matches</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  onClick={loadMatches}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}
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
                  Teams: {selectedVideoData.team}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setVideoPlayerOpen(false)
                  setSelectedVideoData(null)
                  setVideoUrl(null)
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              {isLoadingVideo ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">Loading video...</span>
                </div>
              ) : selectedVideoData.video_url ? (
                <iframe
                  src={selectedVideoData.video_url}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-lg"
                  title={`${selectedVideoData.player} - ${selectedVideoData.description}`}
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Video not available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
