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
