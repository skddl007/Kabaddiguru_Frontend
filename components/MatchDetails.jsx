"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Search, Calendar, MapPin, Users, Trophy, ArrowLeft, Filter, Eye, Clock, Target } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import VideoPlayer from "@/components/VideoPlayer"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Team logo mapping - using uppercase codes consistently
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

// TeamLogo component
export const TeamLogo = ({ teamCode, size = 'md', className = '' }) => {
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
        className={`${sizeClasses[size]} object-cover rounded-full shadow-lg border-2 border-white/20 ${className}`}
      />
    )
  }
  
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white/20 ${className}`}>
      {teamCode}
    </div>
  )
}

export default function MatchDetails({ filters, onBack, isAuthenticated, token }) {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)

  // Load matches when filters change
  useEffect(() => {
    if (filters && filters.tournament && filters.season && filters.team) {
      loadMatches()
    }
  }, [filters])

  const loadMatches = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      queryParams.append('season', filters.season)
      queryParams.append('team', filters.team)
      if (filters.opponentTeam) {
        queryParams.append('opponent_team', filters.opponentTeam)
      }

      const response = await fetch(`/api/dashboard/matches?${queryParams.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.status}`)
      }

      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error('Error loading matches:', error)
      setError(error.message)
      toast({
        title: "Error",
        description: "Failed to load matches. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWatchVideo = (match) => {
    setSelectedMatch(match)
    setVideoPlayerOpen(true)
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

  if (!filters || !filters.tournament || !filters.season || !filters.team) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Filters Applied</h3>
          <p className="text-gray-500 text-sm mb-4">
            Please select tournament, season, and team to view matches.
          </p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Match Details</h1>
            <p className="text-gray-600">
              {filters.tournament} • Season {filters.season} • {TEAM_NAMES[filters.team]}
              {filters.opponentTeam && ` vs ${TEAM_NAMES[filters.opponentTeam]}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadMatches} variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search matches by number, venue, or date..."
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="matchNumber">Sort by Match #</SelectItem>
                <SelectItem value="venue">Sort by Venue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Matches</h3>
              <p className="text-gray-500 text-sm">
                Fetching match data for your selected criteria...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-0 shadow-lg border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Matches</h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <Button onClick={loadMatches} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matches Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedMatches.length > 0 ? (
            filteredAndSortedMatches.map((match, index) => {
              const status = getMatchStatus(match)
              const winner = getWinner(match)
              
              return (
                <Card key={match.id || index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Match #{match.matchNumber || 'N/A'}
                        </Badge>
                        <Badge 
                          variant={status.variant}
                          className={status.color}
                        >
                          {status.text}
                        </Badge>
                      </div>
                      {match.hasVideo && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Play className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Teams and Score */}
                    <div className="space-y-4">
                      {/* Team A */}
                      <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        winner === match.teamACode ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' :
                        winner === match.teamBCode ? 'bg-gray-50 border border-gray-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <TeamLogo teamCode={match.teamACode} size="md" />
                          <div>
                            <div className="font-semibold text-gray-900">{TEAM_NAMES[match.teamACode] || match.teamACode}</div>
                            <div className="text-sm text-gray-500">{match.teamACode}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{match.teamAScore || '-'}</div>
                          {winner === match.teamACode && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
                              Winner
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* VS Separator */}
                      <div className="flex items-center justify-center">
                        <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">VS</span>
                        </div>
                      </div>

                      {/* Team B */}
                      <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        winner === match.teamBCode ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' :
                        winner === match.teamACode ? 'bg-gray-50 border border-gray-200' :
                        'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <TeamLogo teamCode={match.teamBCode} size="md" />
                          <div>
                            <div className="font-semibold text-gray-900">{TEAM_NAMES[match.teamBCode] || match.teamBCode}</div>
                            <div className="text-sm text-gray-500">{match.teamBCode}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{match.teamBScore || '-'}</div>
                          {winner === match.teamBCode && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
                              Winner
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{match.date || 'Date TBD'}</span>
                      </div>
                      {match.venue && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{match.venue}</span>
                        </div>
                      )}
                      {match.attendance && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{match.attendance.toLocaleString()} attendees</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
                        onClick={() => handleWatchVideo(match)}
                        disabled={!match.hasVideo}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {match.hasVideo ? 'Watch Video' : 'No Video'}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        View Stats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Found</h3>
                <p className="text-gray-500 text-sm mb-4">
                  No matches found for the selected criteria. Try adjusting your filters.
                </p>
                <Button onClick={onBack} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={videoPlayerOpen}
        onClose={() => setVideoPlayerOpen(false)}
        raidId={selectedMatch?.id}
        raidData={selectedMatch}
      />
    </div>
  )
}
