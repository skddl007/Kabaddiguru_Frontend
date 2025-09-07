"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { X, User, LogOut } from 'lucide-react'
import Link from "next/link"
import { useUser } from "@/contexts/UserContext"

export default function MobileMenu({ isOpen, onClose, onAuthModalOpen, currentPage }) {
  const { user, logout, isAuthenticated } = useUser()
  const [mounted, setMounted] = useState(false)
  const portalEl = useMemo(() => {
    if (typeof document === 'undefined') return null
    const el = document.createElement('div')
    el.setAttribute('data-mobile-menu-portal', 'true')
    return el
  }, [])

  useEffect(() => {
    setMounted(true)
    if (!portalEl) return
    document.body.appendChild(portalEl)
    return () => {
      try { document.body.removeChild(portalEl) } catch {}
    }
  }, [portalEl])

  // Lock background scroll when menu is open
  useEffect(() => {
    if (!mounted) return
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen, mounted])
  
  if (!isOpen || !mounted || !portalEl) return null

  const content = (
    <div className="fixed inset-0 z-[9999] md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 z-[10000] bg-gradient-to-br from-orange-50/90 via-red-50/90 to-yellow-50/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="absolute top-0 right-0 z-[10001] w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Navigation Links */}
          <div className="flex-1 p-4 space-y-2">
            <Link href="/" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start text-left">
                Home
              </Button>
            </Link>
            <Link href="/chat" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start text-left">
                Chat
              </Button>
            </Link>
            <Link href="/analytics" onClick={onClose}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-left ${
                  currentPage === 'analytics' 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium' 
                    : ''
                }`}
              >
                Analytics Tool
              </Button>
            </Link>
            {/* <Link href="/matches" onClick={onClose}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-left ${
                  currentPage === 'matches' 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium' 
                    : ''
                }`}
              >
                Matches
              </Button>
            </Link> */}
            <Link href="/dashboard" onClick={onClose}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-left ${
                  currentPage === 'dashboard' 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 font-medium' 
                    : ''
                }`}
              >
                Dashboard
              </Button>
            </Link>
            {/* <Link href="/upload" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start text-left">
                Upload Data
              </Button>
            </Link> */}
            <div className="w-full h-px bg-gray-200 my-2"></div>
            <Link href="/about" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start text-left">
                About
              </Button>
            </Link>
            <Link href="/contact" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start text-left">
                Contact
              </Button>
            </Link>
          </div>
          
          {/* Authentication Section */}
          <div className="p-4 border-t space-y-2">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-600 mb-2 truncate" title={(user?.full_name || user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'User'))}>
                  {(() => {
                    const displayName = user?.full_name || user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'User')
                    return `Welcome, ${displayName}`
                  })()}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    logout()
                    onClose()
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    onAuthModalOpen("signin")
                    onClose()
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={() => {
                    onAuthModalOpen("signup")
                    onClose()
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(content, portalEl)
}
