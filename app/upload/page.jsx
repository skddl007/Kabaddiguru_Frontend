"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, File, CheckCircle, AlertCircle, ArrowLeft, Bot, Menu, X } from 'lucide-react'
import Link from "next/link"
import MobileMenu from "@/components/MobileMenu"
import AuthWrapper from "@/components/AuthWrapper"

export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    const allowedTypes = ['.csv', '.xlsx', '.xls']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Please select a valid CSV or Excel file (.csv, .xlsx, .xls)')
      return
    }

    setSelectedFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const event = { target: { files: [file] } }
      handleFileUpload(event)
    }
  }

  const resetUpload = () => {
    setUploadProgress(0)
    setIsUploading(false)
    setUploadComplete(false)
    setSelectedFile(null)
  }

  return (
    <AuthWrapper>
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
              <Link href="/chat">
                <Button 
                  variant="ghost" 
                  className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 font-medium"
                >
                  Chat
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
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Upload Data
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <Link href="/about">
                <Button 
                  variant="ghost"
                  className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 font-medium"
                >
                  About
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="ghost"
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
          />
        </div>
      </nav>

      {/* Main Content - Fully Responsive */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center space-x-2 mb-4 sm:mb-6">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm sm:text-base font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Data Upload
              </span>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Upload Your 
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent"> Kabaddi Data</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto px-4 leading-relaxed">
              Upload your Excel or CSV files containing Kabaddi match data, player statistics, or team information for AI-powered analysis
            </p>
          </div>

          {/* Upload Card - Enhanced */}
          <Card className="mb-8 sm:mb-12 lg:mb-16 w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center sm:text-left pb-6 sm:pb-8">
              <CardTitle className="flex items-center space-x-3 justify-center sm:justify-start text-xl sm:text-2xl lg:text-3xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span>Upload Data Files</span>
              </CardTitle>
              <CardDescription className="text-center sm:text-left text-sm sm:text-base lg:text-lg max-w-2xl">
                Support for CSV and Excel files (.csv, .xlsx, .xls) containing Kabaddi data. Our AI will analyze and provide insights from your data.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 sm:space-y-8">
              {!uploadComplete ? (
                <>
                  {/* Enhanced Upload Area */}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 lg:p-12 text-center hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-300 cursor-pointer min-h-[250px] sm:min-h-[300px] flex flex-col items-center justify-center group"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <Label htmlFor="file-upload" className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 cursor-pointer">
                        Choose files or drag and drop
                      </Label>
                      <p className="text-sm sm:text-base text-gray-500">
                        CSV, XLSX, XLS files up to 50MB
                      </p>
                      
                      {selectedFile && (
                        <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm sm:text-base text-green-800 font-medium">
                                Selected: {selectedFile.name}
                              </p>
                              <p className="text-xs sm:text-sm text-green-600">
                                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {isUploading && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between text-sm sm:text-base font-medium">
                        <span className="text-orange-600">Uploading...</span>
                        <span className="text-gray-600">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full h-2" />
                    </div>
                  )}

                  {selectedFile && !isUploading && !uploadComplete && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      <Button 
                        onClick={resetUpload}
                        variant="outline"
                        className="w-full sm:w-auto hover:bg-gray-50"
                      >
                        Choose Different File
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center space-y-6 sm:space-y-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Upload Complete!</h3>
                    <p className="text-base sm:text-lg text-gray-600">Your data has been processed and is ready for analysis</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link href="/chat" className="w-full sm:w-auto">
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
                        Start Analyzing
                      </Button>
                    </Link>
                    {/* <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full sm:w-auto hover:bg-gray-50">
                        View Dashboard
                      </Button>
                    </Link> */}
                    <Button 
                      onClick={resetUpload}
                      variant="outline"
                      className="w-full sm:w-auto hover:bg-gray-50"
                    >
                      Upload Another File
                    </Button>
                  </div>
                </div>
              )}

              {/* Enhanced File Type Examples */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <File className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">Player Stats</h4>
                  <p className="text-sm sm:text-base text-gray-600">Individual player performance data</p>
                </div>
                
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <File className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">Match Data</h4>
                  <p className="text-sm sm:text-base text-gray-600">Game results and statistics</p>
                </div>
                
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-md transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <File className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">Team Info</h4>
                  <p className="text-sm sm:text-base text-gray-600">Team rosters and strategies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Data Format Examples */}
          <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6 sm:pb-8">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <File className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span>Supported Data Formats</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base lg:text-lg">
                Examples of data structures our AI can analyze and provide insights from
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-semibold text-base sm:text-lg flex items-center space-x-3">
                    <Badge variant="secondary" className="text-xs sm:text-sm bg-orange-100 text-orange-700">CSV</Badge>
                    <span>Player Statistics</span>
                  </h4>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-5 rounded-lg border border-gray-200">
                    <div className="text-xs sm:text-sm font-mono text-gray-800 space-y-1">
                      <div className="text-orange-600 font-semibold">player_name,team,raids,points,tackles</div>
                      <div>Pardeep Narwal,Patna Pirates,45,89,12</div>
                      <div>Rahul Chaudhari,Telugu Titans,38,76,8</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-semibold text-base sm:text-lg flex items-center space-x-3">
                    <Badge variant="secondary" className="text-xs sm:text-sm bg-blue-100 text-blue-700">Excel</Badge>
                    <span>Match Results</span>
                  </h4>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-5 rounded-lg border border-gray-200">
                    <div className="text-xs sm:text-sm font-mono text-gray-800 space-y-1">
                      <div className="text-blue-600 font-semibold">match_id | team1 | team2 | score1 | score2 | date</div>
                      <div>KPL2024_001 | Patna Pirates | U Mumba | 34 | 28 | 2024-01-15</div>
                      <div>KPL2024_002 | Bengal Warriors | Gujarat Giants | 31 | 35 | 2024-01-16</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

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
    </AuthWrapper>
  )
}
