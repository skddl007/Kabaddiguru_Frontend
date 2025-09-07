"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, X, AlertCircle, Play, BarChart3, Menu, X as XIcon, LogOut, Users, Shield, MessageSquare, Target, TrendingUp, Zap, User, Mail } from 'lucide-react'
import Link from "next/link"
import AuthWrapper from "@/components/AuthWrapper"
import { useUser } from "@/contexts/UserContext"
import { toast } from "@/hooks/use-toast"
import MobileMenu from "@/components/MobileMenu"
import PlayersSummaryCards from "@/components/PlayersSummaryCards"
import SubscriptionModal from "@/components/SubscriptionModal"


export default function PlayersPage() {
  const { user, logout, isAuthenticated, token } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [filterLimitInfo, setFilterLimitInfo] = useState(null)

  // Simple filters
  const [playerSearch, setPlayerSearch] = useState("")
  const [suggestedPlayers, setSuggestedPlayers] = useState([])
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [role, setRole] = useState("") // "raider" | "defender" | ""
  const [result, setResult] = useState("") // "successful" | "failure" | ""

  // Advanced
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [opponents, setOpponents] = useState([])
  const [allOpponents, setAllOpponents] = useState([])
  const [skills, setSkills] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [skillCategories, setSkillCategories] = useState({})
  const [positions, setPositions] = useState([])
  const POSITION_CODES = ["RIN","LIN","RLIN","LLIN","RCV","LCV","RCNR","LCNR"]
  
  const POSITION_NAMES = {
    'RIN': 'Right Raider',
    'LIN': 'Left Raider', 
    'RLIN': 'Right In',
    'LLIN': 'Left In',
    'RCV': 'Right Cover',
    'LCV': 'Left Cover',
    'RCNR': 'Right Corner',
    'LCNR': 'Left Corner'
  }

  // Results
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const [videoOpen, setVideoOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [videoMeta, setVideoMeta] = useState(null)
  const [filterItems, setFilterItems] = useState([])
  const [resultFilter, setResultFilter] = useState('all') // all | successful | unsuccessful | empty
  const [sortBy, setSortBy] = useState('points-desc') // points-desc | points-asc

  const TEAM_NAME_MAP = {
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

  const getFullTeamName = (team) => {
    if (!team) return team
    const raw = String(team).trim()
    if (raw.includes(' ')) return raw
    const code = raw.toUpperCase()
    return TEAM_NAME_MAP[code] || raw
  }

  // Check filter limit only when needed (on filter action)
  const checkFilterLimit = async () => {
    if (!token) return null
    try {
      const response = await fetch(`/api/dashboard/filter-limit`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (!response.ok) return null
      const data = await response.json()
      setFilterLimitInfo(data)
      return data
    } catch (error) {
      console.error('Error checking filter limit:', error)
      return null
    }
  }

  // Increment filter count after using filters
  const incrementFilterCount = async () => {
    if (!token) return
    
    try {
      const response = await fetch(`/api/dashboard/filter-limit/increment`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      if (response.ok) {
        // Refresh filter limit info after incrementing
        checkFilterLimit()
      }
    } catch (error) {
      console.error('Error incrementing filter count:', error)
    }
  }

  // Note: intentionally not checking filter limit on mount to avoid extra calls

  // Suggest players
  useEffect(() => {
    const controller = new AbortController()
    const term = playerSearch.trim()
    if (!term) {
      setSuggestedPlayers([])
      return
    }
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/analytics/players/search?search_term=${encodeURIComponent(term)}`, { signal: controller.signal })
        const data = await res.json()
        if (data?.success) setSuggestedPlayers(data.players || [])
      } catch {}
    }, 200)
    return () => { clearTimeout(id); controller.abort() }
  }, [playerSearch])

  // Load opponents whenever players change
  useEffect(() => {
    const loadOpp = async () => {
      if (selectedPlayers.length === 0) { setAllOpponents([]); return }
      try {
        const params = selectedPlayers.map(p => `players=${encodeURIComponent(p)}`).join('&')
        const res = await fetch(`/api/analytics/players/opponents?${params}`)
        const data = await res.json()
        if (data?.success) setAllOpponents(data.teams || [])
      } catch (e) {
        console.error(e)
      }
    }
    loadOpp()
  }, [selectedPlayers])

  // Load skills when role changes
  useEffect(() => {
    const loadSkills = async () => {
      if (!role) { 
        setAllSkills([])
        setSkillCategories({})
        return 
      }
      try {
        // Load categorized skills
        const res = await fetch(`/api/analytics/players/skills/categorized?role=${encodeURIComponent(role)}`)
        const data = await res.json()
        if (data?.success) {
          setSkillCategories(data.categories || {})
          // Flatten all skills for backward compatibility
          const allSkillsList = Object.values(data.categories || {}).flat()
          setAllSkills(allSkillsList)
        }
      } catch (e) {
        console.error(e)
        // Fallback to regular skills endpoint
        try {
          const res = await fetch(`/api/analytics/players/skills?role=${encodeURIComponent(role)}`)
          const data = await res.json()
          if (data?.success) setAllSkills(data.skills || [])
        } catch (fallbackError) {
          console.error('Fallback skills loading failed:', fallbackError)
        }
      }
    }
    loadSkills()
  }, [role])

  const addPlayer = (name) => {
    if (!name) return
    if (selectedPlayers.includes(name)) return
    setSelectedPlayers(prev => [...prev, name])
    setPlayerSearch("")
    setSuggestedPlayers([])
  }

  const removePlayer = (name) => {
    setSelectedPlayers(prev => prev.filter(p => p !== name))
  }

  const toggleArray = (value, list, setter) => {
    if (list.includes(value)) setter(list.filter(v => v !== value))
    else setter([...list, value])
  }

  const handleSearch = async () => {
    if (selectedPlayers.length === 0) {
      toast({ title: 'Select player(s)', description: 'Please select at least one player.' })
      return
    }

    // Check filter limit for free users (on demand)
    if (isAuthenticated && token) {
      const latestLimit = await checkFilterLimit()
      if (latestLimit && !latestLimit.can_filter && !latestLimit.is_admin) {
        toast({ 
          title: 'Filter Limit Reached', 
          description: `You've used ${latestLimit.filter_count} of ${latestLimit.max_filters} filter attempts. Upgrade to continue.`,
          variant: 'destructive' 
        })
        setShowUpgradeModal(true)
        return
      }
    }

    setIsLoading(true)
    setItems([])
    try {
      const res = await fetch(`/api/analytics/players/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          players: selectedPlayers,
          role: role || null,
          result: result || null,
          exclude_player_teams: true,
          opponents: opponents,
          skills: skills,
          positions: positions,
        })
      })
      const data = await res.json()
      if (data?.success) { 
        setItems(data.items || [])
        setFilterItems(data.items || [])
        // Increment filter count and refresh filter limit after successful search
        incrementFilterCount()
      }
      else toast({ title: 'Failed', description: data?.error || 'Could not fetch results', variant: 'destructive' })
    } catch (e) {
      console.error(e)
      toast({ title: 'Error', description: 'Request failed', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const openVideo = (item) => {
    if (!item?.video_url) {
      toast({ title: 'Video not available', description: 'No video for this raid' })
      return
    }
    setVideoMeta(item)
    setVideoUrl(item.video_url)
    setVideoOpen(true)
  }

  const getResultStyle = (res) => {
    const r = (res || '').toLowerCase()
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
    if (r === 'unsuccessful' || r === 'failed/unsuccessful' || r === 'failure') {
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

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 relative overflow-hidden">
        {/* Header same as Dashboard */}
        <nav className="border-b border-white/20 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-lg transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
                  <img 
                    src="/KabaddiGuru Logo.jpeg" 
                    alt="KabaddiGuru Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    KabaddiGuru
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Players
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
                {/* <Link href="/matches">
                  <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105">Matches</Button>
                </Link> */}
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 hover:scale-105">
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
                    <XIcon className="w-5 h-5" />
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
              onAuthModalOpen={() => {}}
              currentPage="players"
            />
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filter Limit Banner */}
          {filterLimitInfo && !filterLimitInfo.can_filter && !filterLimitInfo.is_admin && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium text-sm">Players Filter Limit Reached</span>
              </div>
              <p className="text-red-600 text-sm mt-2">
                You&apos;ve used {filterLimitInfo.filter_count} of {filterLimitInfo.max_filters} filter attempts. 
                Upgrade to premium for unlimited player filtering.
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
                  <Users className="h-5 w-5" />
                  <span className="font-medium text-sm">Premium Players Access</span>
                </div>
                <Badge variant="outline" className="text-green-600 text-xs border-green-300">
                  Unlimited Filters
                </Badge>
              </div>
              <p className="text-green-600 text-sm mt-2">
                You have unlimited player filtering access with your premium subscription.
              </p>
            </div>
          )}

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur min-h-[280px]">
            <CardHeader className="py-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Players Analytics Filters</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => { setSelectedPlayers([]); setPlayerSearch(''); setSuggestedPlayers([]); setRole(''); setResult(''); setOpponents([]); setSkills([]); setPositions([]); setItems([]) }} 
                  className="border-teal-300 text-teal-700 hover:bg-teal-50 h-8 px-3"
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {selectedPlayers.length > 0 && (
                <div className="mb-4">
                  <Label className="mb-2 block text-sm font-medium text-gray-700">Selected Players</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlayers.map(p => (
                      <Badge key={`sel-${p}`} variant="outline" className="px-2 py-1 text-xs flex items-center gap-1 bg-emerald-50 border-emerald-200 text-emerald-700">
                        {p}
                        <button className="ml-1 hover:bg-emerald-100 rounded-full p-0.5" onClick={() => removePlayer(p)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {/* Single Row Primary Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-end">
                {/* Enter player name with selected below */}
                <div className="relative lg:col-span-2">
                  <Label className="mb-2 block">Enter player name</Label>
                  <div className="relative">
                    <Input
                      placeholder="Type to search players"
                      value={playerSearch}
                      onChange={(e) => setPlayerSearch(e.target.value)}
                    />
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    {suggestedPlayers.length > 0 && (
                      <div className="absolute z-30 mt-1 w-full border rounded-md p-2 max-h-48 overflow-y-auto bg-white shadow-md">
                        {suggestedPlayers.map((p) => (
                          <div key={p} className="p-2 hover:bg-gray-100 cursor-pointer rounded" onClick={() => addPlayer(p)}>
                            {p}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <Label className="mb-2 block">While</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raider">Raider</SelectItem>
                      <SelectItem value="defender">Defender</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Result */}
                <div>
                  <Label className="mb-2 block">Result</Label>
                  <Select value={result} onValueChange={(v) => setResult(v === 'all' ? '' : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">--All</SelectItem>
                      <SelectItem value="successful">Successful</SelectItem>
                      <SelectItem value="failure">Failure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter + Advanced Buttons */}
                <div className="flex gap-2 whitespace-nowrap self-end">
                  <Button onClick={handleSearch} disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white shadow-md">
                    {isLoading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Filter</>) : (<>Filter</>)}
                  </Button>
                  {/* <Button variant="outline" size="default" onClick={() => setShowAdvanced(v => !v)} className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    {showAdvanced ? 'Hide Advanced' : 'Advanced'}
                  </Button> */}
                </div>
              </div>

              {false && (
                <div className="space-y-4">
                  {/* Advanced Filters Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Opponents */}
                    <div>
                      <Label className="mb-2 block">Select opponent team</Label>
                      <Select 
                        value={opponents.length > 0 ? opponents[0] : "all"} 
                        onValueChange={(value) => setOpponents(value === "all" ? [] : [value])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select opponent team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All opponents</SelectItem>
                          {allOpponents.map(t => (
                            <SelectItem key={t} value={t}>
                              {getFullTeamName(t)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {allOpponents.length === 0 && (
                        <span className="text-sm text-gray-500 mt-1 block">Add players to load opponent teams</span>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <Label className="mb-2 block">Skill {role ? `(${role})` : ''}</Label>
                      <Select 
                        value={skills.length > 0 ? skills[0] : "all"} 
                        onValueChange={(value) => setSkills(value === "all" ? [] : [value])}
                        disabled={!role}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={role ? "Select skill" : "Select role first"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <SelectItem value="all">All skills</SelectItem>
                          {Object.entries(skillCategories).map(([category, categorySkills]) => {
                            // Skip empty categories
                            if (!category || category === "" || categorySkills.length === 0) return null
                            
                            return (
                              <div key={category}>
                                <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                                  {category}
                                </div>
                                {categorySkills.map(skill => (
                                  <SelectItem key={skill} value={skill} className="pl-4">
                                    {skill}
                                  </SelectItem>
                                ))}
                              </div>
                            )
                          })}
                          {/* Fallback to flat list if categories are empty */}
                          {Object.keys(skillCategories).length === 0 && allSkills.map(s => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {allSkills.length === 0 && role && (
                        <span className="text-sm text-gray-500 mt-1 block">No skills available for this role</span>
                      )}
                    </div>

                    {/* Position */}
                    <div>
                      <Label className="mb-2 block">Position</Label>
                      <Select 
                        value={positions.length > 0 ? positions[0] : "all"} 
                        onValueChange={(value) => setPositions(value === "all" ? [] : [value])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All positions</SelectItem>
                          {POSITION_CODES.map(code => (
                            <SelectItem key={code} value={code}>
                              {POSITION_NAMES[code]} ({code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => { setOpponents([]); setSkills([]); setPositions([]) }} className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">Clear Advanced</Button>
                  </div>
                </div>
              )}

              
            </CardContent>
          </Card>

          {filterItems && filterItems.length > 0 && (
            <div className="mt-6">
              <PlayersSummaryCards items={filterItems} />
            </div>
          )}

          {/* Results */}
          <div className="mt-8">
            <Card className="border-0 shadow-xl">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">Results ({items.length})</CardTitle>
                  <div className="flex items-center gap-3">
                    {/* <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-600">Result</Label>
                      <select
                        value={resultFilter}
                        onChange={(e) => setResultFilter(e.target.value)}
                        className="h-8 text-sm border rounded-md px-2 bg-white text-gray-700"
                      >
                        <option value="all">All</option>
                        <option value="successful">Successful</option>
                        <option value="unsuccessful">Unsuccessful</option>
                        <option value="empty">Empty</option>
                      </select>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-600">Sort by</Label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-8 text-sm border rounded-md px-2 bg-white text-gray-700"
                      >
                        <option value="points-desc">Points (High to Low)</option>
                        <option value="points-asc">Points (Low to High)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {items.length === 0 ? (
                  <div className="text-center text-gray-600">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm">No results. Adjust filters and search.</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items
                      .filter((it) => {
                        const r = (it.result || '').toLowerCase()
                        if (resultFilter === 'all') return true
                        if (resultFilter === 'successful') return r === 'successful'
                        if (resultFilter === 'unsuccessful') return r === 'unsuccessful' || r === 'failed/unsuccessful' || r === 'failure'
                        if (resultFilter === 'empty') return r === 'empty'
                        return true
                      })
                      .sort((a, b) => {
                        const pa = Number(a.points || 0)
                        const pb = Number(b.points || 0)
                        if (sortBy === 'points-asc') return pa - pb
                        return pb - pa
                      })
                      .map((it, idx) => {
                      const styles = getResultStyle(it.result)
                      return (
                        <Card 
                          key={`${it.match_number}-${it.raid_no}-${idx}`} 
                          className={`group relative border ${styles.border} hover:shadow-md transition ${styles.bg} ${styles.ring} hover:ring-2 cursor-pointer`}
                          onClick={() => openVideo(it)}
                        >
                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200">Match {it.match_number}</Badge>
                              <Badge className={`${styles.badge} text-xs border`}>{it.result || '-'}</Badge>
                            </div>
                            <div className="text-sm">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-gray-900">{it.player}</div>
                                  <div className={`capitalize ${styles.header}`}>{it.role}</div>
                                </div>
                                <div className="shrink-0">
                                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/70 text-slate-900 border border-white/80">{it.points ?? 0} pts</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              <div>Team: <span className="font-medium text-slate-800">{getFullTeamName(it.team)}</span></div>
                              <div>Opponent: <span className="font-medium text-slate-800">{getFullTeamName(it.opponent_team)}</span></div>
                            </div>
                            <Button size="sm" className={`w-full ${styles.button}`} onClick={(e) => { e.stopPropagation(); openVideo(it) }}>
                              <Play className="w-4 h-4 mr-2" /> Watch
                            </Button>
                          </div>
                          <button
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${styles.overlayBg}`}
                            onClick={(e) => { e.stopPropagation(); openVideo(it) }}
                            aria-label="Play video"
                          >
                            <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </button>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Video Modal */}
          {videoOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{videoMeta?.player} - Raid {videoMeta?.raid_no}</h3>
                    <p className="text-sm text-gray-600">{videoMeta?.team} vs {videoMeta?.opponent_team}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setVideoOpen(false); setVideoMeta(null); setVideoUrl('') }} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  {videoUrl ? (
                    <iframe src={videoUrl} width="100%" height="400" frameBorder="0" allowFullScreen className="rounded-lg" />
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

        {/* Subscription Modal */}
        <SubscriptionModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />

        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Main Footer Content */}
            <div className="py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* Brand Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src="/KabaddiGuru Logo.jpeg" 
                        alt="KabaddiGuru Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">KabaddiGuru</span>
                      <p className="text-gray-400 text-sm">Intelligent Sports Analytics</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                    The ultimate analytics platform for Kabaddi teams and analysts. Transform your data into actionable insights with AI-powered analysis and real-time performance tracking.
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-300">
                      <span className="text-sm font-bold">f</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-300">
                      <span className="text-sm font-bold">t</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-300">
                      <span className="text-sm font-bold">in</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-300">
                      <span className="text-sm font-bold">yt</span>
                    </a>
                  </div>
                </div>
                
                {/* Platform Links */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    Platform
                  </h3>
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li>
                      <Link href="/chat" className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300">
                        <MessageSquare className="w-4 h-4" />
                        Chat Interface
                      </Link>
                    </li>
                    <li>
                      <Link href="/analytics" className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300">
                        <Target className="w-4 h-4" />
                        Analytics Tool
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300">
                        <TrendingUp className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/players" className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300">
                        <Users className="w-4 h-4" />
                        Players Analytics
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Features */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    Features
                  </h3>
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      AI-Powered Analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Real-time Performance Tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Team Insights & Reports
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Match Analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Video Integration
                    </li>
                  </ul>
                </div>
                
                {/* Support & Contact */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    Support
                  </h3>
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li>
                      <Link href="/about" className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300">
                        <User className="w-4 h-4" />
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300">
                        <MessageSquare className="w-4 h-4" />
                        Contact Support
                      </Link>
                    </li>
                    <li>
                      <a 
                        href="mailto:srikanthv40@gmail.com?subject=KabaddiGuru Support&body=Hi, I need support with KabaddiGuru. Please help me with:"
                        className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300"
                      >
                        <Mail className="w-4 h-4" />
                        Email Support
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>24/7 Available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            
            {/* Bottom Bar */}
            <div className="py-6 border-t border-gray-800">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-gray-400 text-sm">
                  <p>&copy; 2025 KabaddiGuru. All rights reserved.</p>
                </div>
                <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
                  <Link href="/privacy" className="hover:text-orange-400 transition-colors duration-300">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-orange-400 transition-colors duration-300">Terms of Service</Link>
                  <Link href="/cookies" className="hover:text-orange-400 transition-colors duration-300">Cookie Policy</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthWrapper>
  )
}


