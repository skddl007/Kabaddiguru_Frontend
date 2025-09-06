"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthWrapper from "@/components/AuthWrapper"
import MatchFilters from "@/components/MatchFilters"
import { useUser } from "@/contexts/UserContext"
import ChatLimitBanner from "@/components/ChatLimitBanner"
import SubscriptionModal from "@/components/SubscriptionModal"
import MobileMenu from "@/components/MobileMenu"

export default function MatchesPage() {
  const router = useRouter()
  const { user, isAuthenticated, token, logout } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={handleCloseMobileMenu}
          onToggle={handleMobileMenuToggle}
        />

        {/* Main Content */}
        <div className="relative">
          {/* Chat Limit Banner */}
          <ChatLimitBanner />

          {/* Page Content */}
          <div className="container mx-auto px-4 py-6">
            <MatchFilters
              onBack={handleBackToDashboard}
              isAuthenticated={isAuthenticated}
              token={token}
              user={user}
              logout={logout}
            />
          </div>
        </div>

        {/* Subscription Modal */}
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />

      </div>
    </AuthWrapper>
  )
}
