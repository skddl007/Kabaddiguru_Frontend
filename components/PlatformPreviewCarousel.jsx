"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  BarChart3, 
  Target, 
  Users, 
  Swords, 
  Play,
  Calendar,
  Trophy,
  TrendingUp,
  Zap,
  Search,
  Filter,
  Video,
  Award,
  MessageSquare,
  Mail,
  Star,
  Crown
} from 'lucide-react'
import Link from "next/link"

const PlatformPreviewCarousel = () => {

  const slides = [
    {
      id: 'dashboard',
      title: 'Analytics Dashboard',
      subtitle: 'Comprehensive Season Overview',
      description: 'Real-time season statistics, points table, and team performance analytics with interactive visualizations.',
      icon: BarChart3,
      color: 'from-violet-600 to-purple-600',
      bgColor: 'from-violet-50 to-purple-100',
      features: [
        'Season statistics and points table',
        'Team performance with progress bars',
        'Interactive team logos and filtering',
        'Video integration for raid analysis'
      ],
      preview: (
        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Season Dashboard</h3>
                <p className="text-violet-100 text-sm">Season 11 Overview</p>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">132</div>
                    <div className="text-xs text-blue-600">Total Matches</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">2.4</div>
                    <div className="text-xs text-purple-600">Avg Raid Point</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Points Table Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                Points Table
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <span className="text-sm font-medium">Telugu Titans</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">Champion</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <span className="text-sm font-medium">Bengaluru Bulls</span>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800 text-xs">Runner-up</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <span className="text-sm font-medium">Puneri Paltan</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">Semi-finalist</Badge>
                </div>
              </div>
            </div>

            {/* Team Performance Preview */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Team Performance
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Telugu Titans</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-full h-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">1,250</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bengaluru Bulls</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-4/5 h-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">980</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      subtitle: 'AI-Powered Match & Player Analysis',
      description: 'Generate comprehensive insights with AI-powered tactical analysis, player performance summaries, and video highlights.',
      icon: Target,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-100',
      features: [
        'Match-wise tactical analysis with AI insights',
        'Player performance summaries with LLM analysis',
        'Super tackle and bonus point video highlights',
        'Top performers and match statistics'
      ],
      preview: (
        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Analytics Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Analytics Tool</h3>
                <p className="text-blue-100 text-sm">Match & Player Analysis</p>
              </div>
            </div>
          </div>

          {/* Analytics Content */}
          <div className="p-6 space-y-6">
            {/* Analysis Options */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Analysis Options
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded border border-blue-200">
                  <div className="text-sm font-medium text-blue-800">Match Analysis</div>
                  <div className="text-xs text-blue-600 mt-1">Team vs Team</div>
                </div>
                <div className="bg-white p-3 rounded border border-indigo-200">
                  <div className="text-sm font-medium text-indigo-800">Player Analysis</div>
                  <div className="text-xs text-indigo-600 mt-1">Performance Summary</div>
                </div>
              </div>
            </div>

            {/* AI Analysis Preview */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-purple-600">🤖</span>
                AI Match Analysis
              </h4>
              <div className="bg-white p-3 rounded border">
                <div className="text-sm text-gray-700 leading-relaxed">
                  &quot;The match showcased exceptional defensive strategies from both teams. 
                  Telugu Titans&apos; raiding unit demonstrated superior agility in the second half, 
                  while Bengaluru Bulls maintained strong defensive formations throughout...&quot;
                </div>
              </div>
            </div>

            {/* Video Highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600">⚡</span>
                  <span className="text-sm font-medium text-red-800">Super Tackles</span>
                </div>
                <div className="text-xs text-red-600">3 videos available</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600">🎯</span>
                  <span className="text-sm font-medium text-green-800">Bonus Points</span>
                </div>
                <div className="text-xs text-green-600">5 videos available</div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-600" />
                Top Performers
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-sm font-medium">Pardeep Narwal</span>
                  <span className="text-sm font-bold text-blue-600">12 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-sm font-medium">Naveen Kumar</span>
                  <span className="text-sm font-bold text-red-600">8 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'players',
      title: 'Players Analytics',
      subtitle: 'Advanced Filtering & Performance Analysis',
      description: 'Smart player search with autocomplete, role-based filtering, and comprehensive performance analysis with video integration.',
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-100',
      features: [
        'Smart player search with autocomplete',
        'Role-based filtering (Raider/Defender)',
        'Advanced filters: opponents, skills, positions',
        'Video integration for each raid'
      ],
      preview: (
        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Players Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Players Analytics</h3>
                <p className="text-emerald-100 text-sm">Advanced Filtering & Analysis</p>
              </div>
            </div>
          </div>

          {/* Players Content */}
          <div className="p-6 space-y-6">
            {/* Player Search */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                Player Search
              </h4>
              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type to search players..."
                    className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
                <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                  <div className="text-sm font-medium text-emerald-800">Pardeep Narwal</div>
                  <div className="text-xs text-emerald-600">Selected Player</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-1">Role</div>
                <div className="text-xs text-gray-600">Raider</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-1">Result</div>
                <div className="text-xs text-gray-600">Successful</div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Advanced Filters
              </h4>
              <div className="space-y-2">
                <div className="text-xs text-blue-600">• Opponents: Bengaluru Bulls</div>
                <div className="text-xs text-blue-600">• Skills: Running Hand Touch</div>
                <div className="text-xs text-blue-600">• Position: Right Raider</div>
              </div>
            </div>

            {/* Results Preview */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Video className="w-4 h-4 text-green-600" />
                Filter Results (24 raids found)
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <div className="text-sm font-medium">Match 45 - Raid 12</div>
                    <div className="text-xs text-gray-600">vs Bengaluru Bulls</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">Successful</Badge>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-6 px-2 text-xs">
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <div className="text-sm font-medium">Match 38 - Raid 8</div>
                    <div className="text-xs text-gray-600">vs Bengaluru Bulls</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">Successful</Badge>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-6 px-2 text-xs">
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'matches',
      title: 'Match Analytics',
      subtitle: 'Comprehensive Match Filtering & Analysis',
      description: 'Team vs Team match selection, season-wise analysis, and detailed raid-by-raid performance with video integration.',
      icon: Swords,
      color: 'from-gray-600 to-blue-600',
      bgColor: 'from-gray-50 to-blue-100',
      features: [
        'Team vs Team match selection and filtering',
        'Season-wise match analysis with venue details',
        'Match results and performance statistics',
        'Detailed raid analysis with video integration'
      ],
      preview: (
        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Matches Header */}
          <div className="bg-gradient-to-r from-gray-600 to-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Match Analytics</h3>
                <p className="text-gray-100 text-sm">Comprehensive Match Analysis</p>
              </div>
            </div>
          </div>

          {/* Matches Content */}
          <div className="p-6 space-y-6">
            {/* Match Selection */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                Match Selection
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-1">Team A</div>
                  <div className="text-xs text-gray-600">Telugu Titans</div>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-1">Team B</div>
                  <div className="text-xs text-gray-600">Bengaluru Bulls</div>
                </div>
              </div>
            </div>

            {/* Match Details */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-600" />
                Match Overview
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Match ID</span>
                  <span className="text-sm font-medium">#TTvsBB-045</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Season</span>
                  <span className="text-sm font-medium">Season 11</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Venue</span>
                  <span className="text-sm font-medium">Gachibowli Stadium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Winner</span>
                  <span className="text-sm font-bold text-green-600">Telugu Titans</span>
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 text-center">Final Score</h4>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">Telugu Titans</div>
                  <div className="text-3xl font-bold text-gray-900">42</div>
                </div>
                <div className="text-gray-400 text-xl">vs</div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">Bengaluru Bulls</div>
                  <div className="text-3xl font-bold text-gray-900">38</div>
                </div>
              </div>
            </div>

            {/* Match Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">156</div>
                <div className="text-xs text-gray-600">Total Raids</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">68%</div>
                <div className="text-xs text-gray-600">Raid Success</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-lg font-bold text-red-600">12</div>
                <div className="text-xs text-gray-600">Super Tackles</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">72%</div>
                <div className="text-xs text-gray-600">Tackle Success</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'upgrade',
      title: 'Upgrade & Contact',
      subtitle: 'Get Premium Features & Support',
      description: 'Unlock advanced analytics, priority support, and exclusive features. Contact us to discuss your upgrade options and get personalized assistance.',
      icon: Crown,
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-100',
      features: [
        'Premium analytics with advanced insights',
        'Priority customer support and assistance',
        'Custom dashboard configurations',
        'Exclusive features and early access'
      ],
      preview: (
        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Upgrade Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Upgrade & Contact</h3>
                <p className="text-yellow-100 text-sm">Premium Support</p>
              </div>
            </div>
          </div>

          {/* Upgrade Content */}
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-600" />
                Contact for Upgrade
              </h4>
              <div className="space-y-3">
                <a 
                  href="mailto:srikanthv40@gmail.com?subject=KabaddiGuru Upgrade Inquiry&body=Hi, I'm interested in upgrading to premium features. Please provide more information about pricing and available features."
                  target="_self"
                  className="flex items-center gap-3 p-3 bg-white rounded border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-300 cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 hover:text-yellow-700">srikanthv40@gmail.com</div>
                    <div className="text-xs text-gray-600">Upgrade & Support Contact</div>
                  </div>
                </a>
                <div className="text-sm text-gray-700">
                  Reach out to discuss premium features, custom solutions, and get personalized support for your analytics needs.
                </div>
              </div>
            </div>

            {/* Premium Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Premium Analytics</span>
                </div>
                <div className="text-xs text-yellow-600">Advanced insights</div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Priority Support</span>
                </div>
                <div className="text-xs text-orange-600">24/7 assistance</div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gray-600" />
                Upgrade Benefits
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Unlimited data analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Custom dashboard creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">API access and integrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Advanced reporting tools</span>
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border border-yellow-300">
              <div className="text-center">
                <div className="text-sm font-medium text-yellow-800 mb-2">Ready to Upgrade?</div>
                <div className="text-xs text-yellow-600 mb-3">Contact us for personalized pricing and features</div>
                <a 
                  href="mailto:srikanthv40@gmail.com?subject=KabaddiGuru Upgrade Inquiry&body=Hi, I'm interested in upgrading to premium features. Please provide more information about pricing and available features."
                  target="_self"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-yellow-700 hover:to-orange-700 transition-all duration-300"
                >
                  <Mail className="w-4 h-4" />
                  Contact Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]


  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">KabaddiGuru</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our powerful analytics platform with interactive previews
            </p>
          </div>
        </div>
      </div>

      {/* All Slides Displayed Vertically with Unique Layouts */}
      <div className="relative z-10 space-y-24 pb-16">
        {slides.map((slide, index) => {
          // Different layouts for each slide
          const isEven = index % 2 === 0;
          const isFirst = index === 0;
          const isLast = index === slides.length - 1;
          
          return (
            <div key={slide.id} className="relative">
              {/* Special background for first slide */}
              {isFirst && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100/50 via-purple-100/30 to-indigo-100/50 rounded-3xl -mx-6 -my-12"></div>
              )}
              
              <div className="max-w-7xl mx-auto px-6 relative">
                {/* Dashboard - Hero Style */}
                {slide.id === 'dashboard' && (
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${slide.color} rounded-full flex items-center justify-center`}>
                        <slide.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-lg font-semibold text-gray-800">Analytics Dashboard</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                      Real-time <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Season Analytics</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                      {slide.description}
                    </p>
                  </div>
                )}

                {/* Analytics - Card Grid Style */}
                {slide.id === 'analytics' && (
                  <div className="mb-12">
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className={`w-20 h-20 bg-gradient-to-r ${slide.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                        <slide.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900">{slide.title}</h2>
                        <p className="text-lg text-gray-600">{slide.subtitle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Players - Sidebar Style */}
                {slide.id === 'players' && (
                  <div className="mb-12">
                    <div className="flex items-center gap-6 mb-8">
                      <div className={`w-24 h-24 bg-gradient-to-r ${slide.color} rounded-3xl flex items-center justify-center shadow-2xl`}>
                        <slide.icon className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">{slide.title}</h2>
                        <p className="text-lg text-gray-600">{slide.subtitle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Matches - Banner Style */}
                {slide.id === 'matches' && (
                  <div className="mb-12">
                    <div className="bg-gradient-to-r from-gray-800 to-blue-800 rounded-2xl p-8 text-white text-center">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                          <slide.icon className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold">{slide.title}</h2>
                      </div>
                      <p className="text-xl text-gray-200">{slide.subtitle}</p>
                    </div>
                  </div>
                )}

                {/* Upgrade - Premium Style */}
                {slide.id === 'upgrade' && (
                  <div className="mb-12">
                    <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-2xl p-8 text-white text-center relative overflow-hidden">
                      {/* Animated background elements */}
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shadow-2xl">
                            <slide.icon className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h2 className="text-4xl font-bold">{slide.title}</h2>
                            <p className="text-xl text-yellow-100">{slide.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-yellow-200">
                          <Star className="w-5 h-5 fill-current" />
                          <Star className="w-5 h-5 fill-current" />
                          <Star className="w-5 h-5 fill-current" />
                          <Star className="w-5 h-5 fill-current" />
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Content Grid */}
                <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  isEven ? '' : 'lg:grid-flow-col-dense'
                }`}>
                  {/* Content Side */}
                  <div className={`space-y-6 ${isEven ? '' : 'lg:col-start-2'}`}>
                    {/* Features with different styles */}
                    <div className="space-y-4">
                      {slide.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                          slide.id === 'dashboard' ? 'bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200' :
                          slide.id === 'analytics' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' :
                          slide.id === 'players' ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200' :
                          slide.id === 'upgrade' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' :
                          'bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            slide.id === 'dashboard' ? 'bg-violet-500' :
                            slide.id === 'analytics' ? 'bg-blue-500' :
                            slide.id === 'players' ? 'bg-emerald-500' :
                            slide.id === 'upgrade' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}>
                            <span className="text-white text-sm font-bold">{featureIndex + 1}</span>
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      {slide.id === 'upgrade' ? (
                        <a 
                          href="mailto:srikanthv40@gmail.com?subject=KabaddiGuru Upgrade Inquiry&body=Hi, I'm interested in upgrading to premium features. Please provide more information about pricing and available features."
                          target="_self"
                          className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-600 to-orange-600 hover:opacity-90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                        >
                          <Mail className="mr-2 w-5 h-5" />
                          Contact for Upgrade
                        </a>
                      ) : (
                        <Link href={`/${slide.id === 'dashboard' ? 'dashboard' : slide.id}`}>
                          <Button className={`bg-gradient-to-r ${slide.color} hover:opacity-90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}>
                            Explore {slide.title}
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                        </Link>
                      )}
                      <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
                        Learn More
                      </Button>
                    </div>
                  </div>

                  {/* Preview Side */}
                  <div className={`relative ${isEven ? '' : 'lg:col-start-1'}`}>
                    {/* Enhanced Preview Container */}
                    <div className={`bg-gradient-to-br ${slide.bgColor} rounded-3xl p-6 shadow-2xl transform transition-all duration-500 hover:scale-105`}>
                      <div className="h-96 overflow-hidden rounded-2xl">
                        {slide.preview}
                      </div>
                    </div>
                    
                    {/* Unique Decorative Elements for each slide */}
                    {slide.id === 'dashboard' && (
                      <>
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-30 blur-2xl animate-pulse"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                      </>
                    )}
                    
                    {slide.id === 'analytics' && (
                      <>
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-25 blur-2xl animate-bounce"></div>
                        <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 blur-3xl animate-bounce" style={{animationDelay: '0.5s'}}></div>
                      </>
                    )}
                    
                    {slide.id === 'players' && (
                      <>
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-30 blur-2xl animate-pulse"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
                      </>
                    )}
                    
                    {slide.id === 'matches' && (
                      <>
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-gray-400 to-blue-400 rounded-full opacity-25 blur-2xl animate-spin" style={{animationDuration: '8s'}}></div>
                        <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 blur-3xl animate-spin" style={{animationDuration: '12s', animationDelay: '2s'}}></div>
                      </>
                    )}
                    
                    {slide.id === 'upgrade' && (
                      <>
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-30 blur-2xl animate-pulse"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                        <div className="absolute top-1/2 right-0 w-16 h-16 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-25 blur-xl animate-bounce" style={{animationDelay: '2s'}}></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Spacer */}
                {!isLast && (
                  <div className="mt-16 flex justify-center">
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default PlatformPreviewCarousel
