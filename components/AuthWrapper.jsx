"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/contexts/UserContext"
import AuthModal from "@/components/AuthModal"

export default function AuthWrapper({ children, requireAuth = true }) {
  const { isAuthenticated, loading, isAdmin, isLimitReached, setShowSubscriptionModal } = useUser()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState("signin")

  useEffect(() => {
    // Only check authentication after loading is complete
    if (!loading && requireAuth && !isAuthenticated) {
      setShowAuthModal(true)
      setAuthMode("signin")
    }
  }, [isAuthenticated, loading, requireAuth])

  // If limit reached for non-admin users, block content and force upgrade modal
  useEffect(() => {
    if (!loading && !isAdmin && isLimitReached) {
      setShowSubscriptionModal(true)
    }
  }, [loading, isAdmin, isLimitReached, setShowSubscriptionModal])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If authentication is not required, render children normally
  if (!requireAuth) {
    return children
  }

  // If user is not authenticated, show auth modal and prevent access to content
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-6">
                Please sign in or create an account to access this feature.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setAuthMode("signin")
                  setShowAuthModal(true)
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode("signup")
                  setShowAuthModal(true)
                }}
                className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authMode}
        />
      </>
    )
  }

  // If user is authenticated but limit reached and not admin, block access
  if (!loading && isAuthenticated && !isAdmin && isLimitReached) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Required</h2>
            <p className="text-gray-600 mb-6">
              You&apos;ve reached your free trial limit. Upgrade to premium to continue using this feature.
            </p>
          </div>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    )
  }

  // If user is authenticated, render children normally
  return children
}
