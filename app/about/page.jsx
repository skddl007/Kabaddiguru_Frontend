"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Bot, Users, Target, Zap, Shield, Globe, TrendingUp, BarChart3, Brain, Database } from 'lucide-react'
import Link from "next/link"
import MobileMenu from "@/components/MobileMenu"
import AuthWrapper from "@/components/AuthWrapper"
import Footer from "@/components/Footer"
import { useState } from "react"

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze Kabaddi data to provide deep insights and predictions.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Get instant analytics and visualizations of player performance, team statistics, and match outcomes.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Secure and efficient data storage with support for multiple file formats including CSV and Excel.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Track player and team performance trends over time with detailed historical analysis.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security ensuring your data is protected with encryption and secure access controls.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your analytics from anywhere with our cloud-based platform and mobile-responsive design.",
      color: "from-indigo-500 to-blue-500"
    }
  ]

  const stats = [
    { number: "10K+", label: "Data Points Analyzed", icon: Database },
    { number: "500+", label: "Matches Processed", icon: Target },
    { number: "50+", label: "Teams Supported", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Zap }
  ]



  return (
    <AuthWrapper requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        {/* Enhanced Navigation Header */}
        <nav className="border-b border-orange-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
              {/* Left Section - Logo and Back Button */}
              <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
                <Link href="/">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:flex items-center space-x-2 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Back</span>
                  </Button>
                </Link>
                
                {/* Enhanced Logo */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                      KabaddiGuru
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">Data Analytics Platform</span>
                  </div>
                </div>
              </div>
              
              {/* Desktop Navigation - Enhanced */}
              <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                <Link href="/chat">
                  <Button 
                    variant="ghost" 
                    className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 font-medium"
                  >
                    Chat
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button 
                    variant="ghost" 
                    className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 font-medium"
                  >
                    Analytics Tool
                  </Button>
                </Link>
                {/* <Link href="/dashboard">
                  <Button 
                    variant="ghost" 
                    className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 font-medium"
                  >
                    Dashboard
                  </Button>
                </Link> */}
                {/* <Link href="/upload">
                  <Button 
                    variant="ghost" 
                    className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 font-medium"
                  >
                    Upload Data
                  </Button>
                </Link> */}
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <Link href="/about">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    About
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    variant="outline"
                    className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 font-medium"
                  >
                    Contact
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button - Enhanced */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <MobileMenu 
              isOpen={isMobileMenuOpen} 
              onClose={() => setIsMobileMenuOpen(false)} 
            />
          </div>
        </nav>

        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="inline-flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm sm:text-base font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  About Us
                </span>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Revolutionizing 
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent"> Kabaddi Analytics</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto px-4 leading-relaxed">
                We&apos;re passionate about bringing cutting-edge AI technology to the world of Kabaddi. Our platform transforms raw data into actionable insights, helping teams, players, and fans understand the game like never before.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features Section */}
            <div className="mb-12 sm:mb-16 lg:mb-20">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose KabaddiGuru?
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                  Our platform combines the power of artificial intelligence with deep sports analytics to deliver unparalleled insights.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 sm:p-8">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 sm:mb-6`}>
                        <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mission Section */}
            <Card className="mb-12 sm:mb-16 lg:mb-20 border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
              <CardContent className="p-8 sm:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                      Our Mission
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                      To democratize sports analytics by making advanced AI-powered insights accessible to everyone in the Kabaddi community. We believe that data-driven decisions can transform how the game is played, coached, and enjoyed.
                    </p>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">Empower teams with data-driven strategies</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">Enhance player performance through analytics</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">Foster innovation in sports technology</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <Target className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* CTA Section */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 text-white">
              <CardContent className="p-8 sm:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                  Ready to Transform Your Kabaddi Analytics?
                </h2>
                <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of teams and players who are already using AI-powered insights to improve their game.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* <Link href="/upload">
                    <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-medium shadow-lg">
                      Start Uploading Data
                    </Button>
                  </Link> */}
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-medium">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </CardContent>
                         </Card>
           </div>
         </div>
       </div>

       {/* Footer */}
       <Footer />
     </AuthWrapper>
   )
 }

