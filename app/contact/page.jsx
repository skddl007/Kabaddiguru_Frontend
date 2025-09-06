"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot, Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, MessageSquare, User, Building, File, Star, Zap, Shield, Headphones } from 'lucide-react'
import Link from "next/link"
import MobileMenu from "@/components/MobileMenu"
import AuthWrapper from "@/components/AuthWrapper"
import Footer from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: ''
  })
  const { toast } = useToast()

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "srikanthv40@gmail.com",
      description: "Get in touch with our support team",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Upgrade Support",
      value: "srikanthv40@gmail.com",
      description: "Contact us for subscription upgrades and premium features",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "NRI Layout, Bangalore",
      description: "Our headquarters location",
      color: "from-green-500 to-emerald-500"
    },
  ]

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Subscription" },
    { value: "upgrade", label: "Upgrade & Premium Features" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "partnership", label: "Partnership" }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        })
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          category: ''
        })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                    variant="ghost"
                    className="hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 font-medium"
                  >
                    About
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
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
                  Get in Touch
                </span>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Contact 
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent"> Us</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto px-4 leading-relaxed">
                Have questions about our platform? Need technical support? Want to discuss partnerships? We&apos;re here to help you succeed with KabaddiGuru.
              </p>
            </div>

            {/* Upgrade Contact Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-12 sm:mb-16 lg:mb-20 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-4 text-center sm:text-left">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                        Upgrade to Premium
                      </h2>
                      <p className="text-white/90 text-sm sm:text-base">
                        Get in touch with our support team
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="text-center sm:text-right">
                      <p className="text-white/80 text-sm font-medium mb-1">Email Us</p>
                      <p className="text-white text-lg sm:text-xl font-bold">srikanthv40@gmail.com</p>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200"
                        onClick={() => window.open('mailto:srikanthv40@gmail.com?subject=Upgrade Inquiry', '_blank')}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16 lg:mb-20">
              {/* Contact Form */}
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden h-fit">
                <CardHeader className="pb-8 sm:pb-10 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                  <CardTitle className="flex items-center space-x-4 text-2xl sm:text-3xl lg:text-4xl font-bold">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Send us a Message
                      </span>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg lg:text-xl text-gray-600 mt-3 leading-relaxed">
                    Fill out the form below and we&apos;ll get back to you as soon as possible. 
                    <span className="block text-sm text-orange-600 font-medium mt-1">
                      * All fields are required
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-8 sm:p-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-base sm:text-lg font-semibold text-gray-700 flex items-center space-x-2">
                          <User className="w-4 h-4 text-orange-500" />
                          <span>Full Name *</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="h-12 sm:h-14 text-base border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition-all duration-200 hover:border-gray-300"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base sm:text-lg font-semibold text-gray-700 flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-orange-500" />
                          <span>Email Address *</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="h-12 sm:h-14 text-base border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition-all duration-200 hover:border-gray-300"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-3">
                      <Label htmlFor="category" className="text-base sm:text-lg font-semibold text-gray-700 flex items-center space-x-2">
                        <Building className="w-4 h-4 text-orange-500" />
                        <span>Category *</span>
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                        <SelectTrigger className="h-12 sm:h-14 text-base border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition-all duration-200 hover:border-gray-300">
                          <SelectValue placeholder="Select a category for your inquiry" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2 border-gray-200">
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value} className="text-base py-3">
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-3">
                      <Label htmlFor="subject" className="text-base sm:text-lg font-semibold text-gray-700 flex items-center space-x-2">
                        <File className="w-4 h-4 text-orange-500" />
                        <span>Subject *</span>
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="h-12 sm:h-14 text-base border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition-all duration-200 hover:border-gray-300"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-base sm:text-lg font-semibold text-gray-700 flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-orange-500" />
                        <span>Message *</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help you... Please provide as much detail as possible."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="min-h-[160px] sm:min-h-[180px] text-base border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition-all duration-200 hover:border-gray-300 resize-none p-4"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full h-14 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl border-0"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-lg">Sending Message...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <Send className="w-5 h-5" />
                            <span className="text-lg">Send Message</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Get in Touch
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    We&apos;re here to help you get the most out of KabaddiGuru. Reach out to us through any of the channels below.
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                            <info.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors duration-200">
                              {info.title}
                            </h3>
                            <p className="text-base font-medium text-orange-600 mb-1 hover:text-orange-700 transition-colors duration-200 cursor-pointer">
                              {info.value}
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* FAQ Section */}
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                    <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Headphones className="w-4 h-4 text-white" />
                      </div>
                      <span>Frequently Asked Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <Star className="w-4 h-4 text-orange-500" />
                        <span>How do I upload my data?</span>
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Navigate to the Upload page and drag & drop your CSV or Excel files. Our system will automatically process and analyze your data.</p>
                    </div>
                    <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>What file formats are supported?</span>
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">We support CSV (.csv), Excel (.xlsx, .xls) files up to 50MB in size.</p>
                    </div>
                    <div className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-green-500" />
                        <span>How long does analysis take?</span>
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Most analyses are completed within minutes. Larger datasets may take up to an hour.</p>
                    </div>
                    <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <span>How do I upgrade my subscription?</span>
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Contact us at srikanthv40@gmail.com for subscription upgrades and premium features. We'll help you choose the best plan for your needs.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Office Location */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 hover:shadow-3xl transition-shadow duration-500">
              <CardContent className="p-8 sm:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Visit Our Office
                      </h2>
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                      Located in the heart of Bangalore, our office is easily accessible and we welcome visitors during business hours.
                    </p>
                    <div className="space-y-4 sm:space-y-5">
                      <div className="flex items-center space-x-4 p-3 bg-white/60 rounded-xl border border-orange-100 hover:bg-white/80 transition-colors duration-200">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Company</p>
                          <p className="text-base font-semibold text-gray-900">KabaddiGuru Headquarters</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-3 bg-white/60 rounded-xl border border-red-100 hover:bg-white/80 transition-colors duration-200">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p className="text-base font-semibold text-gray-900">NRI Layout, Bangalore, Karnataka, India</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-64 bg-gradient-to-br from-orange-200 via-red-200 to-yellow-200 rounded-2xl flex items-center justify-center shadow-inner border border-orange-100">
                      <div className="text-center p-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <MapPin className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-xl font-bold text-gray-800 mb-2">NRI Layout, Bangalore</p>
                        <p className="text-sm text-gray-600 mb-3">Our headquarters</p>
                        <div className="inline-flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full border border-orange-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-gray-700">Open Now</span>
                        </div>
                      </div>
                    </div>
                  </div>
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

