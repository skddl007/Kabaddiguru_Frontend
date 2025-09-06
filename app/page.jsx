"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, Upload, BarChart3, MessageSquare, Zap, Shield, TrendingUp, Menu, X, User, LogOut, Target, Users, Swords, Mail } from 'lucide-react'
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
                      <span className="text-sm text-gray-600 truncate max-w-[160px] md:max-w-[220px]" title={`Welcome, ${displayName}`}>Welcome, ${displayName}</span>
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
          <div className="flex justify-center">
            {isAuthenticated ? (
              <Link href="/chat">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-6 sm:px-8">
                  Start Chatting
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-orange-50 px-6 sm:px-8"
                onClick={() => {
                  setAuthMode("signup")
                  setAuthModalOpen(true)
                }}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>

        </div>
      </section>

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
