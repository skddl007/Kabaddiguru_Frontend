"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Bot, Users, Target, Zap, Shield, Globe, TrendingUp, BarChart3, Brain, Database, Github, Linkedin, Twitter, Mail } from 'lucide-react'
import Link from "next/link"
import MobileMenu from "@/components/MobileMenu"
import AuthWrapper from "@/components/AuthWrapper"
import Footer from "@/components/Footer"
import { useState } from "react"

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const advantages = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms provide deep insights and predictions that traditional analytics can't match.",
      color: "from-orange-500 via-red-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Get instant results and live updates as matches progress, with data processing that keeps pace with the game.",
      color: "from-red-500 via-pink-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with encrypted data storage, secure access controls, and privacy protection for all users.",
      color: "from-blue-500 via-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      title: "Cloud-Based Access",
      description: "Access your analytics from anywhere, anytime, with our responsive cloud platform that works on all devices.",
      color: "from-green-500 via-emerald-500 to-teal-500"
    },
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "Data-driven insights help teams improve strategies, enhance player performance, and make winning decisions.",
      color: "from-purple-500 via-violet-500 to-indigo-500"
    },
    {
      icon: Target,
      title: "Specialized for Kabaddi",
      description: "Built specifically for Kabaddi with deep understanding of the sport's unique metrics and gameplay dynamics.",
      color: "from-indigo-500 via-blue-500 to-cyan-500"
    }
  ]

  const stats = [
    { number: "12", label: "PKL Teams Analyzed", icon: Users },
    { number: "500+", label: "Matches Processed", icon: Target },
    { number: "1000+", label: "Players Tracked", icon: TrendingUp },
    { number: "5+", label: "Core Features", icon: Zap }
  ]

  const teamMembers = [
    {
      name: "Srikanth Viswanathan",
      role: "Founder & CEO",
      image: "/team/rajesh.jpg",
      description: "Former Kabaddi player with 15+ years of experience in sports analytics and AI.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "rajesh@kabaddiguru.com"
      }
    },
    {
      name: "Sandeep Kumar",
      role: "CTO",
      image: "/team/priya.jpg", 
      description: "AI/ML expert with expertise in sports data analysis and machine learning algorithms.",
      social: {
        linkedin: "#",
        github: "#",
        email: "priya@kabaddiguru.com"
      }
    },
    {
      name: "Amit Singh",
      role: "Lead Data Scientist",
      image: "/team/amit.jpg",
      description: "Data science specialist focused on predictive modeling and performance analytics.",
      social: {
        linkedin: "#",
        github: "#",
        email: "amit@kabaddiguru.com"
      }
    }
  ]




  return (
    <AuthWrapper requireAuth={false}>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up-delay {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          50% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-fade-in-up-delay {
          animation: fade-in-up-delay 1.2s ease-out;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/80 to-yellow-50/60">
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
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src="/KabaddiGuru Logo.jpeg" 
                        alt="KabaddiGuru Logo" 
                        className="w-full h-full object-cover"
                      />
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
                <Link href="/">
                  <Button 
                    variant="ghost" 
                    className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 font-medium"
                  >
                    Home
                  </Button>
                </Link>
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
            {/* Enhanced Hero Section */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20 relative">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute top-40 right-20 w-16 h-16 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-200 rounded-full opacity-20 animate-ping"></div>
              </div>
              
              <div className="inline-flex items-center space-x-2 mb-4 sm:mb-6 relative z-10">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm sm:text-base font-medium text-orange-600 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-full border border-orange-200 shadow-sm">
                  About Us
                </span>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight relative z-10">
                <span className="inline-block animate-fade-in-up">Revolutionizing</span>
                <br />
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent animate-gradient-x">
                  Kabaddi Analytics
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto px-4 leading-relaxed relative z-10 animate-fade-in-up-delay">
                We&apos;re passionate about bringing cutting-edge AI technology to the world of Kabaddi. Our platform transforms raw data into actionable insights, helping teams, players, and fans understand the game like never before.
              </p>
              
              {/* Floating Action Button */}
              <div className="mt-8 animate-bounce">
                <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-orange-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Live Platform</span>
                </div>
              </div>
            </div>

            {/* Platform Overview Section */}
            <div className="mb-12 sm:mb-16 lg:mb-20">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Complete <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Kabaddi Analytics Platform</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto">
                  KabaddiGuru is a comprehensive AI-powered platform designed specifically for Kabaddi analytics, covering all aspects of the Pro Kabaddi League (PKL).
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Chat Interface */}
                <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-white via-orange-50/20 to-red-50/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                      AI Chat Assistant
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Ask questions in natural language about player performance, match statistics, and team strategies.
                    </p>
                    <Link href="/chat">
                      <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                        Try Chat
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Analytics Tool */}
                <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-white via-orange-50/20 to-red-50/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                      Analytics Tool
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Interactive analytics with match analysis, player metrics, and team performance insights.
                    </p>
                    <Link href="/analytics">
                      <Button size="sm" className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                        View Analytics
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Dashboard */}
                <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-white via-orange-50/20 to-red-50/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      Dashboard
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Comprehensive dashboard with points table, season stats, and team performance analysis.
                    </p>
                    <Link href="/dashboard">
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                        Open Dashboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Players */}
                <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-white via-orange-50/20 to-red-50/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      Player Analytics
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Detailed player profiles, raid analysis, and performance tracking for all PKL players.
                    </p>
                    <Link href="/players">
                      <Button size="sm" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                        View Players
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Matches */}
                <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-white via-orange-50/20 to-red-50/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      Match Analysis
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Complete match data, historical analysis, and team comparisons with detailed insights.
                    </p>
                    <Link href="/matches">
                      <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                        View Matches
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Data Upload */}
                <Card className="group relative border-0 shadow-lg bg-gradient-to-br from-white via-orange-50/20 to-red-50/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                      Data Management
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Upload CSV and Excel files, data validation, and secure storage with multiple format support.
                    </p>
                    <Link href="/upload">
                      <Button size="sm" className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white">
                        Upload Data
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Enhanced Stats Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-lg bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group hover:from-white hover:via-orange-100/50 hover:to-red-100/50">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors duration-300">
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Why Choose KabaddiGuru Section */}
            <div className="mb-12 sm:mb-16 lg:mb-20">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">KabaddiGuru?</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                  We provide the most advanced, secure, and specialized Kabaddi analytics platform with cutting-edge technology and deep sports expertise.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {advantages.map((advantage, index) => (
                  <Card key={index} className="group relative border-0 shadow-lg bg-gradient-to-br from-white via-orange-50/20 to-red-50/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden hover:from-white hover:via-orange-100/40 hover:to-red-100/40">
                    {/* Animated Border Line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-[1px] bg-white/95 rounded-lg"></div>
                    </div>
                    
                    {/* Moving Line Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    <CardContent className="relative z-10 p-6 sm:p-8">
                      {/* Enhanced Icon with Glow Effect */}
                      <div className="relative mb-4 sm:mb-6">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${advantage.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                          <advantage.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${advantage.color} rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300`}></div>
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors duration-300">
                        {advantage.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {advantage.description}
                      </p>
                      
                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                        <div className="w-full h-full border-2 border-orange-300 rounded-full animate-spin"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mission Section */}
            <Card className="mb-12 sm:mb-16 lg:mb-20 border-0 shadow-xl bg-gradient-to-br from-orange-50 via-red-50/80 to-yellow-50/60 hover:from-orange-100 hover:via-red-100/90 hover:to-yellow-100/70 transition-all duration-500">
              <CardContent className="p-8 sm:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                      Our Mission
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                      To revolutionize Kabaddi analytics by providing a comprehensive AI-powered platform that covers every aspect of the Pro Kabaddi League. From natural language chat to detailed player analysis, we make advanced sports analytics accessible to teams, coaches, analysts, and fans.
                    </p>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">AI-powered chat interface for natural language queries</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">Comprehensive analytics for all 12 PKL teams</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">Real-time dashboard with points table and season stats</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">Detailed player profiles and raid analysis</span>
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

            {/* Team Section */}
            <div className="mb-12 sm:mb-16 lg:mb-20">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Meet Our <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Amazing Team</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                  The passionate individuals behind KabaddiGuru, working tirelessly to revolutionize sports analytics.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden hover:from-white hover:via-orange-100/50 hover:to-red-100/50">
                    <CardContent className="p-0">
                      {/* Team Member Image */}
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Team Member Info */}
                      <div className="p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                          {member.name}
                        </h3>
                        {/* <p className="text-sm sm:text-base text-orange-600 font-medium mb-3">
                          {member.role}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          {member.description}
                        </p>
                        
                        <div className="flex justify-center space-x-3">
                          {member.social.linkedin && (
                            <a href={member.social.linkedin} className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {member.social.github && (
                            <a href={member.social.github} className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-900 transition-colors duration-200">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {member.social.twitter && (
                            <a href={member.social.twitter} className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors duration-200">
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                          {member.social.email && (
                            <a href={`mailto:${member.social.email}`} className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors duration-200">
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                        </div> */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>


            {/* Enhanced CTA Section */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 text-white relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
              </div>
              
              <CardContent className="p-8 sm:p-12 text-center relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                  Ready to Transform Your 
                  <span className="block bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    Kabaddi Analytics?
                  </span>
                </h2>
                <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of teams and players who are already using AI-powered insights to improve their game.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/analytics">
                    <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Try Analytics Tool
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
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

