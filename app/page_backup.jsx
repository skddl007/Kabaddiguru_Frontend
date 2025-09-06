"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, Upload, BarChart3, MessageSquare, Zap, Shield, TrendingUp, Menu, X, User, LogOut, Target, Users, Swords } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import MobileMenu from "@/components/MobileMenu"
import AuthModal from "@/components/AuthModal"
import SubscriptionModal from "@/components/SubscriptionModal"
import PlatformPreviewCarousel from "@/components/PlatformPreviewCarousel"
import { useUser } from "@/contexts/UserContext"

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState("signin")
  const { 
    user, 
    logout, 
    isAuthenticated, 
    showSubscriptionModal, 
    setShowSubscriptionModal 
  } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/KabaddiGuru Logo.jpeg" 
                  alt="KabaddiGuru Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  KabaddiGuru
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Home
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
                <Button variant="ghost">Dashboard</Button>
              </Link>
              {/* <Link href="/upload">
                <Button variant="ghost">Upload Data</Button>
              </Link> */}
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
                  <Button 
                    variant="outline"
                    className="font-medium"
                    onClick={() => {
                      setAuthMode("signin")
                      setAuthModalOpen(true)
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    onClick={() => {
                      setAuthMode("signup")
                      setAuthModalOpen(true)
                    }}
                  >
                    Sign Up
                  </Button>
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
              setAuthMode(mode)
              setAuthModalOpen(true)
            }}
          />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 text-sm">
                  🏆 KPL Analytics Powered
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    KabaddiGuru
                  </span>
                  <br />
                  <span className="text-gray-900">
                    Intelligent Sports Analytics
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Transform your Kabaddi data into actionable insights with our AI-powered analytics platform. 
                  Chat with your data in natural language and discover game-changing patterns.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <>
                    <Link href="/chat">
                      <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 sm:px-8 w-full sm:w-auto">
                        Start Chatting
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    {/* <Link href="/dashboard">
                      <Button size="lg" variant="outline" className="border-orange-200 hover:bg-orange-50 w-full sm:w-auto">
                        View Dashboard
                      </Button>
                    </Link> */}
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 sm:px-8 w-full sm:w-auto"
                      onClick={() => {
                        setAuthMode("signup")
                        setAuthModalOpen(true)
                      }}
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-orange-200 hover:bg-orange-50 w-full sm:w-auto font-medium"
                      onClick={() => {
                        setAuthMode("signin")
                        setAuthModalOpen(true)
                      }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">500+</div>
                  <div className="text-sm text-gray-600">Matches Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">50+</div>
                  <div className="text-sm text-gray-600">Teams Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">1000+</div>
                  <div className="text-sm text-gray-600">Player Stats</div>
                </div>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="relative z-10">
                <img 
                  src="/kabaddi-kpl-action.png" 
                  alt="Kabaddi Match Action" 
                  className="rounded-2xl shadow-2xl w-full h-auto max-w-md mx-auto lg:max-w-none"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Preview Carousel */}
      <PlatformPreviewCarousel />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Kabaddi Analytics?
          </h2>
          <p className="text-lg sm:text-xl text-orange-100 mb-8">
            Join teams already using KabaddiGuru to gain competitive advantages through data-driven insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link href="/chat">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-6 sm:px-8 w-full sm:w-auto">
                    Start Chatting
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-6 sm:px-8 w-full sm:w-auto">
                    Open Analytics Tool
                    </Button>
                </Link>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-orange-50 px-6 sm:px-8 w-full sm:w-auto"
                  onClick={() => {
                    setAuthMode("signup")
                    setAuthModalOpen(true)
                  }}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-orange-200 hover:bg-white hover:text-orange-600 px-6 sm:px-8 w-full sm:w-auto font-semibold"
                  onClick={() => {
                    setAuthMode("signin")
                    setAuthModalOpen(true)
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 text-center sm:text-left">
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src="/KabaddiGuru Logo.jpeg" 
                    alt="KabaddiGuru Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold">KabaddiGuru</span>
              </div>
              <p className="text-gray-400 text-sm">
                Intelligent sports analytics platform for Kabaddi teams and analysts.
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/chat" className="hover:text-white">Chat Interface</Link></li>
                <li><Link href="/analytics" className="hover:text-white">Analytics Tool</Link></li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>AI Analytics</li>
                <li>Performance Tracking</li>
                <li>Team Insights</li>
                <li>Match Analysis</li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Support</Link></li>
                <li>Documentation</li>
                <li>API Reference</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 KabaddiGuru. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  )
}
              <div className="relative">
                <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-6 shadow-xl">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Season Dashboard</h4>
                        <p className="text-sm text-gray-600">Season 11 Overview</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">132</div>
                        <div className="text-xs text-blue-600">Total Matches</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">2.4</div>
                        <div className="text-xs text-purple-600">Avg Raid Point</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">Telugu Titans</span>
                        <span className="text-sm text-gray-600">1st</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">Bengaluru Bulls</span>
                        <span className="text-sm text-gray-600">2nd</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>

          {/* Analytics Tools Showcase */}
          <div className="mb-16 scroll-mt-20" id="analytics-showcase">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-xl">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Analytics Tool</h4>
                        <p className="text-sm text-gray-600">Match & Player Analysis</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Match-wise analysis with team selection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Player performance summaries</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">AI-generated tactical insights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Video highlights integration</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="text-sm font-medium text-green-800">AI Analysis Ready</div>
                      <div className="text-xs text-green-600">Generate comprehensive match insights</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 blur-2xl"></div>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Advanced Analytics</h3>
                    <p className="text-gray-600">AI-powered match and player analysis</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Match-wise tactical analysis with AI insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">Player performance summaries with LLM analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Super tackle and bonus point video highlights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700">Top performers and match statistics</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href="/analytics">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      Try Analytics Tool
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Players Filtering Showcase */}
          <div className="mb-16 scroll-mt-20" id="players-showcase">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Players Analytics</h3>
                    <p className="text-gray-600">Advanced filtering and performance analysis</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700">Smart player search with autocomplete</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-gray-700">Role-based filtering (Raider/Defender)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-700">Advanced filters: opponents, skills, positions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Video integration for each raid</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href="/players">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                      Explore Players
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    View Features
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 shadow-xl">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Player Filters</h4>
                        <p className="text-sm text-gray-600">Advanced search & analysis</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                        <div className="text-sm font-medium text-emerald-800">Pardeep Narwal</div>
                        <div className="text-xs text-emerald-600">Selected Player</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-sm font-medium text-gray-700">Raider</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-sm font-medium text-gray-700">Successful</div>
                        </div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="text-xs text-blue-600">Advanced: Opponents, Skills, Positions</div>
                      </div>
                    </div>
                    <div className="mt-4 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded">
                      <div className="text-sm font-medium text-green-800">Filter Results</div>
                      <div className="text-xs text-green-600">Find specific raid performances</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>

          {/* Matches Filtering Showcase */}
          <div className="mb-16 scroll-mt-20" id="matches-showcase">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="bg-gradient-to-br from-gray-50 to-blue-100 rounded-2xl p-6 shadow-xl">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Swords className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Match Filters</h4>
                        <p className="text-sm text-gray-600">Comprehensive match analysis</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Team vs Team match filtering</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Season and venue selection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Match result and performance metrics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Detailed raid-by-raid analysis</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Match Analysis Ready</div>
                      <div className="text-xs text-blue-600">Filter and analyze specific matches</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-gray-400 to-blue-400 rounded-full opacity-20 blur-2xl"></div>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Swords className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Match Analytics</h3>
                    <p className="text-gray-600">Comprehensive match filtering and analysis</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-700">Team vs Team match selection and filtering</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Season-wise match analysis with venue details</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">Match results and performance statistics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Detailed raid analysis with video integration</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href="/matches">
                    <Button className="bg-gradient-to-r from-gray-600 to-blue-600 hover:from-gray-700 hover:to-blue-700 text-white">
                      Explore Matches
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                    View Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-orange-900 text-lg">Natural Language Chat</CardTitle>
                <CardDescription className="text-sm">
                  Ask questions about your Kabaddi data in plain English and get instant insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-red-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-red-900 text-lg">Easy Data Upload</CardTitle>
                <CardDescription className="text-sm">
                  Upload CSV, Excel files or connect databases with automatic schema mapping
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-yellow-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-yellow-900 text-lg">Interactive Dashboard</CardTitle>
                <CardDescription className="text-sm">
                  Visualize player performance, match statistics, and team analytics in real-time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-green-900 text-lg">Proactive Insights</CardTitle>
                <CardDescription className="text-sm">
                  AI automatically detects patterns, anomalies, and trends in your Kabaddi data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-blue-900 text-lg">Secure & Scalable</CardTitle>
                <CardDescription className="text-sm">
                  Enterprise-grade security with scalable architecture for teams of any size
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center sm:text-left">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-purple-900 text-lg">Performance Tracking</CardTitle>
                <CardDescription className="text-sm">
                  Track player performance over time with detailed analytics and comparisons
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Kabaddi Analytics?
          </h2>
          <p className="text-lg sm:text-xl text-orange-100 mb-8">
            Join teams already using KabaddiGuru to gain competitive advantages through data-driven insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link href="/chat">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-6 sm:px-8 w-full sm:w-auto">
                    Start Chatting
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-6 sm:px-8 w-full sm:w-auto">
                    Open Analytics Tool
                    </Button>
                </Link>
                {/* <Link href="/upload">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-6 sm:px-8 w-full sm:w-auto">
                    Upload Your Data
                  </Button>
                </Link> */}
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-orange-50 px-6 sm:px-8 w-full sm:w-auto"
                  onClick={() => {
                    setAuthMode("signup")
                    setAuthModalOpen(true)
                  }}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-orange-200 hover:bg-white hover:text-orange-600 px-6 sm:px-8 w-full sm:w-auto font-semibold"
                  onClick={() => {
                    setAuthMode("signin")
                    setAuthModalOpen(true)
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 text-center sm:text-left">
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src="/KabaddiGuru Logo.jpeg" 
                    alt="KabaddiGuru Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold">KabaddiGuru</span>
              </div>
              <p className="text-gray-400 text-sm">
                Intelligent sports analytics platform for Kabaddi teams and analysts.
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/chat" className="hover:text-white">Chat Interface</Link></li>
                {/* <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li> */}
                {/* <li><Link href="/upload" className="hover:text-white">Data Upload</Link></li> */}
                <li><Link href="/analytics" className="hover:text-white">Analytics Tool</Link></li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>AI Analytics</li>
                <li>Performance Tracking</li>
                <li>Team Insights</li>
                <li>Match Analysis</li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Support</Link></li>
                <li>Documentation</li>
                <li>API Reference</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 KabaddiGuru. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  )
}
