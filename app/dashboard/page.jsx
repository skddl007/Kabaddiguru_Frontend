"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, Search, Loader2, AlertCircle, CheckCircle, ArrowLeft, TrendingUp, Target, Award, Menu, X, LogOut, Filter, Play, Shield, Zap, ChevronDown, ChevronUp, X as XIcon } from 'lucide-react'
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

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [filterLimitInfo, setFilterLimitInfo] = useState(null)
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false)
  const [selectedRaid, setSelectedRaid] = useState(null)

  // Filter states
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [playerSearchTerm, setPlayerSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedSkill, setSelectedSkill] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Available options
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [skills, setSkills] = useState([])

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
      loadInitialData()
      checkFilterLimit()
    }
  }, [isAuthenticated, token])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      
      // Load only filter options data, not raids data
      const [playersResponse, teamsResponse, skillsResponse] = await Promise.all([
        fetch(`/api/dashboard/players`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch(`/api/dashboard/teams`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch(`/api/dashboard/normalized-skills`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ])

      if (playersResponse.ok) {
        const playersData = await playersResponse.json()
        setPlayers(playersData.players || [])
      }

      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json()
        setTeams(teamsData.teams || [])
      }

      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json()
        setSkills(skillsData.skills || [])
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  const applyFilters = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check filter limit before applying
      const limitCheck = await fetch(`/api/dashboard/filter-limit`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      if (limitCheck.ok) {
        const limitData = await limitCheck.json()
        if (!limitData.can_filter && !limitData.is_admin) {
          setShowUpgradeModal(true)
          return
        }
      }

      // Build query parameters
      const params = new URLSearchParams()
      if (selectedPlayers.length > 0) {
        selectedPlayers.forEach(player => params.append('player', player))
      }
      if (selectedRole !== 'all') params.append('role', selectedRole)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      if (selectedTeam !== 'all') params.append('team', selectedTeam)
      if (selectedSkill !== 'all') params.append('skill', selectedSkill)
      if (selectedPeriod !== 'all') params.append('period', selectedPeriod)

      const response = await fetch(`/api/dashboard/raids?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
        toast({
          title: "Success",
          description: "Filters applied successfully",
        })
        
        // Update filter limit info
        checkFilterLimit()
      } else if (response.status === 403) {
        const errorData = await response.json()
        setError(errorData.detail || "Filtering limit reached")
        setShowUpgradeModal(true)
      } else {
        throw new Error('Failed to apply filters')
      }
    } catch (error) {
      console.error('Error applying filters:', error)
      setError("Failed to apply filters")
      toast({
        title: "Error",
        description: "Failed to apply filters",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearFilters = () => {
    setSelectedPlayers([])
    setPlayerSearchTerm("")
    setSelectedRole("all")
    setSelectedStatus("all")
    setSelectedTeam("all")
    setSelectedSkill("all")
    setSelectedPeriod("all")
    setDashboardData(null)
  }

  const hasActiveFilters = () => {
    return selectedPlayers.length > 0 || selectedRole !== 'all' || selectedStatus !== 'all' || 
           selectedTeam !== 'all' || selectedSkill !== 'all' || selectedPeriod !== 'all'
  }

  // Filter players based on search term
  const filteredPlayers = players.filter(player =>
    player.toLowerCase().includes(playerSearchTerm.toLowerCase()) &&
    !selectedPlayers.includes(player)
  )

  const addPlayer = (player) => {
    if (!selectedPlayers.includes(player)) {
      setSelectedPlayers([...selectedPlayers, player])
      setPlayerSearchTerm("")
    }
  }

  const removePlayer = (playerToRemove) => {
    setSelectedPlayers(selectedPlayers.filter(player => player !== playerToRemove))
  }

  return (
    <AuthWrapper>
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
                  Dashboard
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/chat">
                <Button variant="ghost">Chat</Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost">Analytics Tool</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="bg-green-100 text-green-700 hover:bg-green-200 font-medium">
                  Dashboard
                </Button>
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
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium text-sm">Dashboard Filtering Limit Reached</span>
            </div>
            <p className="text-red-600 text-xs mt-1">
              You've used {filterLimitInfo.filter_count} of {filterLimitInfo.max_filters} filter attempts. 
              Upgrade to premium for unlimited dashboard filtering.
            </p>
            <Button 
              onClick={() => setShowUpgradeModal(true)}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white h-7 px-3 text-xs"
              size="sm"
            >
              Upgrade Now
            </Button>
          </div>
        )}

        {/* Filter Limit Info for Free Users */}
        {filterLimitInfo && filterLimitInfo.can_filter && !filterLimitInfo.is_admin && filterLimitInfo.max_filters !== "unlimited" && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <Filter className="h-4 w-4" />
                <span className="font-medium text-sm">Dashboard Filtering</span>
              </div>
              <Badge variant="outline" className="text-blue-600 text-xs">
                {filterLimitInfo.remaining_filters} filters remaining
              </Badge>
            </div>
            <p className="text-blue-600 text-xs mt-1">
              You have {filterLimitInfo.remaining_filters} of {filterLimitInfo.max_filters} filter attempts remaining.
            </p>
          </div>
        )}

        {/* Premium User Banner */}
        {filterLimitInfo && filterLimitInfo.is_admin && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <Shield className="h-4 w-4" />
                <span className="font-medium text-sm">Premium Dashboard Access</span>
              </div>
              <Badge variant="outline" className="text-green-600 text-xs">
                Unlimited Filters
              </Badge>
            </div>
            <p className="text-green-600 text-xs mt-1">
              You have unlimited dashboard filtering access with your premium subscription.
            </p>
          </div>
        )}

        {/* Horizontal Filters Section */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4 text-green-600" />
                Dashboard Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-1 h-8 px-2"
              >
                {showAdvancedFilters ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    <span className="text-xs">Hide Advanced</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    <span className="text-xs">Show Advanced</span>
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Basic Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Player Selection */}
                <div className="relative">
                  <Label htmlFor="player" className="text-xs font-medium">Player</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type player name..."
                      value={playerSearchTerm}
                      onChange={(e) => setPlayerSearchTerm(e.target.value)}
                      className="pr-8 h-8 text-sm"
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                  </div>
                  
                  {/* Player Search Results */}
                  {playerSearchTerm && filteredPlayers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-32 overflow-y-auto">
                      {filteredPlayers.slice(0, 5).map((player) => (
                        <div
                          key={player}
                          className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-xs"
                          onClick={() => addPlayer(player)}
                        >
                          {player}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Selected Players */}
                  {selectedPlayers.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedPlayers.map((player) => (
                        <Badge key={player} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-0.5">
                          {player}
                          <XIcon
                            className="h-2.5 w-2.5 cursor-pointer hover:text-red-600"
                            onClick={() => removePlayer(player)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Role Filter */}
                <div>
                  <Label htmlFor="role" className="text-xs font-medium">Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="raider">Raider</SelectItem>
                      <SelectItem value="defender">Defender</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <Label htmlFor="status" className="text-xs font-medium">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="successful">Successful</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-end space-x-2">
                  <Button 
                    onClick={applyFilters} 
                    disabled={isLoading || !hasActiveFilters()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-8 text-sm"
                  >
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply Filters"}
                  </Button>
                  
                  {hasActiveFilters() && (
                    <Button 
                      onClick={clearFilters} 
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Advanced Filters Row */}
              {showAdvancedFilters && (
                <div className="border-t pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Team Filter */}
                    <div>
                      <Label htmlFor="team" className="text-xs font-medium">Team</Label>
                      <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Teams</SelectItem>
                          {teams.map((team) => (
                            <SelectItem key={team.code} value={team.code}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Skill Filter */}
                    <div>
                      <Label htmlFor="skill" className="text-xs font-medium">Skill</Label>
                      <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Skills</SelectItem>
                          {skills.map((skill) => (
                            <SelectItem key={skill} value={skill}>
                              {skill}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Period Filter */}
                    <div>
                      <Label htmlFor="period" className="text-xs font-medium">Period</Label>
                      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Periods</SelectItem>
                          <SelectItem value="FirstHalf">First Half</SelectItem>
                          <SelectItem value="SecondHalf">Second Half</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {error && (
            <Card className="mb-4 border-red-200 bg-red-50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {dashboardData && hasActiveFilters() && (
            <div className="space-y-4">
              {/* Statistics Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Filtered Results Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">{dashboardData.statistics?.totalRaids || 0}</div>
                      <div className="text-xs text-gray-600">Total Raids</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">{dashboardData.statistics?.successfulRaids || 0}</div>
                      <div className="text-xs text-gray-600">Successful Raids</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="text-lg font-bold text-purple-600">{dashboardData.statistics?.totalPoints || 0}</div>
                      <div className="text-xs text-gray-600">Total Points</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="text-lg font-bold text-orange-600">{dashboardData.statistics?.uniquePlayers || 0}</div>
                      <div className="text-xs text-gray-600">Unique Players</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Raids Data - Compact Cards */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Play className="h-4 w-4 text-green-600" />
                    Raids Data ({dashboardData.raids?.length || 0} raids)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {dashboardData.raids && dashboardData.raids.length > 0 ? (
                      dashboardData.raids.map((raid, index) => (
                        <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="p-3">
                            {/* Header with Status and Period */}
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {raid.Game_Half_Period || 'Unknown Period'}
                              </Badge>
                              <Badge 
                                variant={raid.Attack_Result_Status === 'Successful' ? 'default' : 'secondary'}
                                className={`px-2 py-0.5 text-xs ${
                                  raid.Attack_Result_Status === 'Successful' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {raid.Attack_Result_Status || 'Unknown Status'}
                              </Badge>
                            </div>

                            {/* Players and Teams - Compact Layout */}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex-1 text-center">
                                  <div className="font-semibold text-gray-900 truncate" title={cleanPlayerName(raid.Attacking_Player_Name)}>
                                    {cleanPlayerName(raid.Attacking_Player_Name)}
                                  </div>
                                  <div className="text-gray-500 truncate">
                                    {TEAM_NAMES[raid.Attacking_Team_Code] || raid.Attacking_Team_Code || 'Unknown Team'}
                                  </div>
                                </div>
                                <div className="mx-2 text-gray-400 text-xs">VS</div>
                                <div className="flex-1 text-center">
                                  <div className="font-semibold text-gray-900 truncate" title={cleanPlayerName(raid.Primary_Defender_Name)}>
                                    {cleanPlayerName(raid.Primary_Defender_Name)}
                                  </div>
                                  <div className="text-gray-500 truncate">
                                    {TEAM_NAMES[raid.Defending_Team_Code] || raid.Defending_Team_Code || 'Unknown Team'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Points - Compact Display */}
                            <div className="bg-gray-50 rounded p-2 mb-3">
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
                                className="video-button bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white py-2 px-4 text-sm w-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 button-glow"
                                size="sm"
                                onClick={() => handleWatchVideo(raid)}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <div className="relative icon-bounce">
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

          {!dashboardData && !error && !isLoading && (
            <Card>
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <Filter className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-1">Apply Filters to View Data</h3>
                  <p className="text-gray-500 text-sm">
                    Select your desired filters above and click "Apply Filters" to view Kabaddi raid data and insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 text-gray-400 mx-auto mb-3 animate-spin" />
                  <h3 className="text-base font-medium text-gray-900 mb-1">Loading Dashboard</h3>
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
