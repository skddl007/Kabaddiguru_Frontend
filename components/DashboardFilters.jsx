"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Play, Trophy, Users, Calendar, Target, X } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Tournament data - you can expand this based on your needs
const TOURNAMENTS = [
  { id: 'pk', name: 'Pro Kabaddi League', code: 'PKL' },
  { id: 'national', name: 'National Championships', code: 'NC' },
  { id: 'international', name: 'International Events', code: 'IE' }
]

// Seasons data
const SEASONS = [
  { id: '11', name: 'Season 11', year: '2024' },
  { id: '10', name: 'Season 10', year: '2023' },
  { id: '9', name: 'Season 9', year: '2022' },
  { id: '8', name: 'Season 8', year: '2021' }
]

// Team data from your existing mapping
const TEAMS = [
  { code: 'TT', name: 'Telugu Titans' },
  { code: 'BB', name: 'Bengaluru Bulls' },
  { code: 'BW', name: 'Bengal Warriors' },
  { code: 'DD', name: 'Dabang Delhi' },
  { code: 'GG', name: 'Gujarat Giants' },
  { code: 'HS', name: 'Haryana Steelers' },
  { code: 'JP', name: 'Jaipur Pink Panthers' },
  { code: 'PP', name: 'Patna Pirates' },
  { code: 'PU', name: 'Puneri Paltan' },
  { code: 'TN', name: 'Tamil Thalaivas' },
  { code: 'UM', name: 'U Mumba' },
  { code: 'UP', name: 'U.P. Yoddhas' }
]

export default function DashboardFilters({ onFiltersChange, onViewMatches, isAuthenticated, token }) {
  const [filters, setFilters] = useState({
    tournament: '',
    season: '11',
    team: '',
    opponentTeam: 'all'
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filterHistory, setFilterHistory] = useState([])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Auto-update opponent team if it's the same as selected team
    if (key === 'team' && value === filters.opponentTeam) {
      newFilters.opponentTeam = ''
    }
    
    onFiltersChange?.(newFilters)
  }

  const handleViewMatches = async () => {
    if (!filters.tournament || !filters.season || !filters.team) {
      toast({
        title: "Missing Required Fields",
        description: "Please select Tournament, Season, and Team to view matches.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Add to filter history
      const filterEntry = {
        id: Date.now(),
        ...filters,
        timestamp: new Date().toISOString()
      }
      setFilterHistory(prev => [filterEntry, ...prev.slice(0, 4)])

      // Call the parent function to handle match viewing
      await onViewMatches?.(filters)
      
      toast({
        title: "Filters Applied",
        description: "Loading matches with selected criteria...",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load matches. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      tournament: '',
      season: '11',
      team: '',
      opponentTeam: ''
    })
    onFiltersChange?.({})
  }

  const hasActiveFilters = filters.tournament || filters.team || filters.opponentTeam

  const applyFilterFromHistory = (filterEntry) => {
    setFilters({
      tournament: filterEntry.tournament,
      season: filterEntry.season,
      team: filterEntry.team,
      opponentTeam: filterEntry.opponentTeam
    })
    onFiltersChange?.(filterEntry)
  }

  return (
    <div className="space-y-6">
      {/* Main Filter Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 transition-all duration-500 hover:shadow-2xl">
        <CardHeader className="pb-4 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Match Filters</CardTitle>
                <p className="text-sm text-gray-600">Select criteria to view specific matches</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-red-600 hover:border-red-300 transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all duration-300"
              >
                {showAdvancedFilters ? 'Hide' : 'Show'} Advanced
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tournament Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Tournament *
              </label>
              <Select value={filters.tournament} onValueChange={(value) => handleFilterChange('tournament', value)}>
                <SelectTrigger className="border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Select Tournament" />
                </SelectTrigger>
                <SelectContent>
                  {TOURNAMENTS.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{tournament.code}</Badge>
                        {tournament.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Season Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                Season *
              </label>
              <Select value={filters.season} onValueChange={(value) => handleFilterChange('season', value)}>
                <SelectTrigger className="border-gray-300 hover:border-green-400 focus:border-green-500 focus:ring-green-500 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{season.year}</Badge>
                        {season.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Team *
              </label>
              <Select value={filters.team} onValueChange={(value) => handleFilterChange('team', value)}>
                <SelectTrigger className="border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  {TEAMS.map((team) => (
                    <SelectItem key={team.code} value={team.code}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {team.code}
                        </div>
                        {team.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Opponent Team Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-red-500" />
                Opponent Team
              </label>
              <Select 
                value={filters.opponentTeam} 
                onValueChange={(value) => handleFilterChange('opponentTeam', value)}
                disabled={!filters.team}
              >
                <SelectTrigger className="border-gray-300 hover:border-red-400 focus:border-red-500 focus:ring-red-500 transition-all duration-300 disabled:opacity-50">
                  <SelectValue placeholder={filters.team ? "Select Opponent" : "Select Team First"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Opponents</SelectItem>
                  {TEAMS.filter(team => team.code !== filters.team).map((team) => (
                    <SelectItem key={team.code} value={team.code}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {team.code}
                        </div>
                        {team.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center mt-8">
            <Button
              onClick={handleViewMatches}
              disabled={isLoading || !filters.tournament || !filters.season || !filters.team}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  View Matches
                </div>
              )}
            </Button>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Active Filters:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.tournament && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    {TOURNAMENTS.find(t => t.id === filters.tournament)?.name}
                  </Badge>
                )}
                {filters.season && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    {SEASONS.find(s => s.id === filters.season)?.name}
                  </Badge>
                )}
                {filters.team && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    {TEAMS.find(t => t.code === filters.team)?.name}
                  </Badge>
                )}
                {filters.opponentTeam && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                    vs {TEAMS.find(t => t.code === filters.opponentTeam)?.name}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter History */}
      {filterHistory.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-800">Recent Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filterHistory.map((filterEntry) => (
                <Button
                  key={filterEntry.id}
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterFromHistory(filterEntry)}
                  className="text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
                >
                  {filterEntry.tournament && TOURNAMENTS.find(t => t.id === filterEntry.tournament)?.code} | 
                  {filterEntry.season && SEASONS.find(s => s.id === filterEntry.season)?.name} | 
                  {filterEntry.team && TEAMS.find(t => t.code === filterEntry.team)?.code}
                  {filterEntry.opponentTeam && ` vs ${TEAMS.find(t => t.code === filterEntry.opponentTeam)?.code}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
