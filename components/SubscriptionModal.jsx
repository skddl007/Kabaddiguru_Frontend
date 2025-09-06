"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Check, Crown, Shield, X, Mail, MessageCircle } from "lucide-react"

export default function SubscriptionModal({ isOpen, onClose }) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-center flex-1">
              Upgrade Your Experience
            </DialogTitle>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogDescription className="text-center">
            You&apos;ve reached your free usage limit. Contact us to discuss upgrade options and continue enjoying unlimited access to KabaddiGuru.
          </DialogDescription>
        </DialogHeader>

        {/* Upgrade Information Card */}
        <div className="mt-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Upgrade?
              </h3>
              
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Unlock unlimited access to all KabaddiGuru features including unlimited chat requests, 
                unlimited filter attempts, advanced analytics, and premium support.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Premium Features
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Unlimited chat requests</li>
                    <li>• Unlimited filter attempts</li>
                    <li>• Advanced player analytics</li>
                    <li>• Match analysis tools</li>
                    <li>• Priority support</li>
                    <li>• Custom insights</li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Shield className="w-5 h-5 text-blue-500 mr-2" />
                    Enterprise Options
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Custom integrations</li>
                    <li>• Dedicated support</li>
                    <li>• API access</li>
                    <li>• White-label options</li>
                    <li>• Advanced security</li>
                    <li>• Custom dashboards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-900">Secure & Flexible</span>
          </div>
          <p className="text-sm text-gray-600">
            All plans include secure payment processing, 30-day money-back guarantee, 
            and the ability to cancel anytime. No long-term commitments required.
          </p>
        </div>

        {/* Subscription Discussion Contact */}
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-blue-900 mb-3">
              Ready to Upgrade? Let&apos;s Discuss!
            </h3>
            
            <p className="text-blue-800 mb-6 max-w-2xl mx-auto">
              Contact us to discuss your upgrade options and find the perfect plan for your needs. 
              We offer flexible pricing and custom solutions for individuals and teams.
            </p>

            <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
              <div className="flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-blue-900 font-medium">Contact us at:</span>
                <a 
                  href="mailto:srikanthv40@gmail.com?subject=KabaddiGuru Subscription Inquiry"
                  className="text-lg text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  srikanthv40@gmail.com
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>24-hour response</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Custom pricing</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Flexible plans</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
